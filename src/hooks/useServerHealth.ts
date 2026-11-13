import { useCallback, useEffect, useState } from 'react';
import type { DevHubProject, ServerHealthRecord } from '../types/project';

function initialRecordForProject(project: DevHubProject): ServerHealthRecord {
  if (!project.liveUrl) {
    return {
      state: 'local',
      message: 'Local / GitHub Source',
    };
  }
  if (project.serverType === 'render') {
    if (project.keepAlive) {
      return {
        state: 'online',
        message: 'Online (Render + Monitor · Instant)',
      };
    }
    return {
      state: 'cold-start',
      message: 'Cold Start (Render - Click để đánh thức server)',
    };
  }
  if (project.serverType === 'vercel') {
    return {
      state: 'online',
      message: 'Online (Vercel / Fast)',
    };
  }
  return {
    state: 'idle',
    message: 'Sẵn sàng kiểm tra kết nối',
  };
}

export function useServerHealth(projects: DevHubProject[]) {
  const [healthMap, setHealthMap] = useState<Record<string, ServerHealthRecord>>({});
  const [wakingAll, setWakingAll] = useState(false);

  // Sync baseline entries whenever project list changes
  useEffect(() => {
    setHealthMap((prev) => {
      const next: Record<string, ServerHealthRecord> = {};
      for (const p of projects) {
        next[p.id] = prev[p.id] ?? initialRecordForProject(p);
      }
      return next;
    });
  }, [projects]);

  const pingProjectServer = useCallback(async (project: DevHubProject) => {
    if (!project.liveUrl) {
      return { ok: false, state: 'local' as const };
    }

    const isRender = project.serverType === 'render';
    setHealthMap((prev) => ({
      ...prev,
      [project.id]: {
        state: isRender ? 'waking' : 'checking',
        message: isRender
          ? 'Đang gửi tín hiệu đánh thức Render...'
          : 'Đang kiểm tra phản hồi Edge...',
      },
    }));

    const start = performance.now();
    const controller = new AbortController();
    const timeoutMs = isRender ? 25000 : 8000;
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      // mode: 'no-cors' avoids CORS blocks while genuinely hitting the origin server & triggering Render spin-up
      await fetch(project.liveUrl, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timer);
      const latencyMs = Math.round(performance.now() - start);

      const record: ServerHealthRecord = {
        state: 'online',
        latencyMs,
        lastCheckedAt: Date.now(),
        message: isRender
          ? `Server đã thức dậy (${latencyMs}ms)`
          : `Online (Vercel / Fast · ${latencyMs}ms)`,
      };
      setHealthMap((prev) => ({ ...prev, [project.id]: record }));
      return { ok: true, latencyMs, state: 'online' as const };
    } catch {
      clearTimeout(timer);
      const latencyMs = Math.round(performance.now() - start);
      const record: ServerHealthRecord = isRender
        ? {
            state: 'waking',
            latencyMs,
            lastCheckedAt: Date.now(),
            message: 'Render đang khởi động container (~20-40s)...',
          }
        : {
            state: 'unreachable',
            latencyMs,
            lastCheckedAt: Date.now(),
            message: 'Không phản hồi hoặc bị chặn mạng',
          };

      setHealthMap((prev) => ({ ...prev, [project.id]: record }));
      return { ok: false, latencyMs, state: record.state };
    }
  }, []);

  const wakeUpAllServers = useCallback(async () => {
    const liveProjects = projects.filter((p) => Boolean(p.liveUrl) && !p.hidden);
    if (liveProjects.length === 0) return { total: 0, online: 0 };

    setWakingAll(true);
    const results = await Promise.all(liveProjects.map((p) => pingProjectServer(p)));
    setWakingAll(false);

    const online = results.filter((r) => r.ok).length;
    return { total: liveProjects.length, online };
  }, [projects, pingProjectServer]);

  return {
    healthMap,
    wakingAll,
    pingProjectServer,
    wakeUpAllServers,
  };
}
