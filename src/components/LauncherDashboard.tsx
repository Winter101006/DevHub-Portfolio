import {
  ArrowUpRight,
  Command,
  ExternalLink,
  Info,
  Loader2,
  Pin,
  Terminal,
  Zap,
} from 'lucide-react';
import { PROFILE_CONFIG } from '../data/profileConfig';
import { CATEGORY_MAP } from '../data/projectsConfig';
import type { DevHubProject, ServerHealthRecord } from '../types/project';
import { ProjectIcon, ServerStatusPill } from './ProjectIcon';

interface LauncherDashboardProps {
  projects: DevHubProject[];
  healthMap: Record<string, ServerHealthRecord>;
  wakingAll: boolean;
  onPingServer: (project: DevHubProject) => void;
  onWakeAllServers: () => void;
  onOpenDetail: (project: DevHubProject) => void;
  onOpenCommandPalette: () => void;
}

export function LauncherDashboard({
  projects,
  healthMap,
  wakingAll,
  onPingServer,
  onWakeAllServers,
  onOpenDetail,
  onOpenCommandPalette,
}: LauncherDashboardProps) {
  const visibleProjects = projects.filter((p) => !p.hidden);
  const liveCount = visibleProjects.filter((p) => Boolean(p.liveUrl)).length;

  return (
    <div className="animate-fade-up space-y-6">
      {/* Compact Top Launch Bar */}
      <div className="bento-card flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-sm font-bold text-white">
            PH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-zinc-900 dark:text-white">
                Launcher Mode — Tốc độ cao
              </h1>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                {visibleProjects.length} Apps
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Bấm trực tiếp vào biểu tượng để mở app, hoặc nhấn{' '}
              <kbd className="rounded border border-zinc-300 px-1 font-mono text-[10px] dark:border-white/15">
                Ctrl + K
              </kbd>{' '}
              để phóng nhanh trong 1 giây.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-200"
          >
            <Command className="h-3.5 w-3.5 text-indigo-500" />
            Quick Launch
          </button>

          <button
            type="button"
            onClick={onWakeAllServers}
            disabled={wakingAll || liveCount === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-500/20 disabled:opacity-60 dark:text-amber-300"
          >
            {wakingAll ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Zap className="h-3.5 w-3.5" />
            )}
            Wake Up All ({liveCount})
          </button>
        </div>
      </div>

      {/* App Bookmark Grid (macOS / iPadOS Style) */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Project Bookmarks ({visibleProjects.length})
          </span>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Click icon để mở · Click dấu ⓘ để xem kiến trúc
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {visibleProjects.map((project) => {
            const targetUrl = project.liveUrl || project.githubUrl;
            const category = CATEGORY_MAP[project.category];

            return (
              <div
                key={project.id}
                className="bento-card-hover group relative flex flex-col justify-between p-4"
              >
                {/* Top mini controls */}
                <div className="flex items-center justify-between gap-1">
                  <ServerStatusPill
                    project={project}
                    health={healthMap[project.id]}
                    onPing={onPingServer}
                    compact
                  />
                  <button
                    type="button"
                    onClick={() => onOpenDetail(project)}
                    className="rounded-lg p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-indigo-600 dark:hover:bg-white/10 dark:hover:text-indigo-300"
                    title="Xem mô tả chi tiết & kiến trúc"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Main Launch Target */}
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="my-3 flex flex-col items-center text-center"
                >
                  <div className="relative transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-105">
                    <ProjectIcon
                      icon={project.icon}
                      accentColor={project.accentColor}
                      size="lg"
                    />
                    {project.pinned && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500 text-white shadow-sm">
                        <Pin className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 line-clamp-2 text-xs font-bold text-zinc-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
                    {project.title}
                  </h3>
                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                    {project.liveUrl ? 'Open Live Web' : 'Open GitHub'}
                    <ArrowUpRight className="h-2.5 w-2.5" />
                  </span>
                </a>

                <div className="flex items-center justify-center">
                  <span className="truncate font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                    {category.shortLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dev Consoles & Cloud Dock */}
      <div className="bento-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Terminal className="h-4 w-4 text-indigo-500" />
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
            Cloud &amp; Admin Consoles Dock
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {PROFILE_CONFIG.devConsoles.map((consoleLink) => (
            <a
              key={consoleLink.id}
              href={consoleLink.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2.5 rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-2.5 transition hover:border-indigo-500/40 hover:bg-white dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-indigo-400/30 dark:hover:bg-white/[0.06]"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold shadow-sm ${consoleLink.colorClass}`}
              >
                {consoleLink.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 truncate text-xs font-semibold text-zinc-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
                  <span className="truncate">{consoleLink.name}</span>
                  <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-0 transition group-hover:opacity-100" />
                </div>
                <div className="truncate text-[10px] text-zinc-500 dark:text-zinc-400">
                  {consoleLink.subtitle}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
