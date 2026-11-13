import { Settings2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminManagerModal } from './components/AdminManagerModal';
import { BentoHero } from './components/BentoHero';
import { CommandPalette } from './components/CommandPalette';
import { LauncherDashboard } from './components/LauncherDashboard';
import { Navbar } from './components/Navbar';
import { ProjectCommandCenter } from './components/ProjectCommandCenter';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ResumeModal } from './components/ResumeModal';
import { ToastStack } from './components/ToastStack';
import { PROFILE_CONFIG } from './data/profileConfig';
import { useGitHubRepos } from './hooks/useGitHubRepos';
import { useProjectManager } from './hooks/useProjectManager';
import { useServerHealth } from './hooks/useServerHealth';
import type {
  DevHubProject,
  FilterTab,
  ToastMessage,
  ViewMode,
} from './types/project';
import { mergeProjectsData } from './utils/projectMerge';
import { formatRelativeDate } from './utils/text';

const THEME_KEY = 'devhub_theme';
const MODE_KEY = 'devhub_view_mode';

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      return localStorage.getItem(MODE_KEY) === 'launcher'
        ? 'launcher'
        : 'portfolio';
    } catch {
      return 'portfolio';
    }
  });

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [commandOpen, setCommandOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<DevHubProject | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const {
    repos,
    loading: syncingGitHub,
    syncSource,
    lastSyncedAt,
    syncFromGitHub,
  } = useGitHubRepos();

  const {
    config,
    hasLocalEdits,
    toggleVisibility,
    togglePin,
    addOrUpdateProject,
    deleteCustomProject,
    resetToDefault,
  } = useProjectManager();

  const projects = useMemo(
    () => mergeProjectsData(repos, config),
    [repos, config]
  );

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  const { healthMap, wakingAll, pingProjectServer, wakeUpAllServers } =
    useServerHealth(projects);

  const notify = useCallback(
    (
      title: string,
      description?: string,
      variant: ToastMessage['variant'] = 'success'
    ) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3600);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync theme class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Ignore
    }
  }, [theme]);

  // Persist viewMode
  useEffect(() => {
    try {
      localStorage.setItem(MODE_KEY, viewMode);
    } catch {
      // Ignore
    }
  }, [viewMode]);

  // Global keyboard shortcuts: Ctrl+K (Command Palette) & Ctrl+Shift+E (Admin Manager)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
        return;
      }
      if (mod && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setEditTarget(null);
        setAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PROFILE_CONFIG.email);
      notify('Đã sao chép Email', PROFILE_CONFIG.email, 'success');
    } catch {
      notify('Email liên hệ', PROFILE_CONFIG.email, 'info');
    }
  }, [notify]);

  const handleRefreshGitHub = useCallback(async () => {
    const result = await syncFromGitHub(true);
    if (result.ok) {
      notify(
        'Đã đồng bộ GitHub thành công',
        `Quét được ${result.count} repositories từ @${PROFILE_CONFIG.githubUsername}.`
      );
    } else {
      notify(
        'Đang dùng dữ liệu dự phòng an toàn',
        `GitHub API tạm giới hạn hoặc offline (${result.error}). Đã tự động fallback về ${result.count} repos local.`,
        'warning'
      );
    }
  }, [syncFromGitHub, notify]);

  const handlePingSingle = useCallback(
    async (project: DevHubProject) => {
      const result = await pingProjectServer(project);
      if (result.ok) {
        notify(
          `${project.title} đã sẵn sàng`,
          `Phản hồi thành công sau ${result.latencyMs}ms.`,
          'success'
        );
      } else if (project.serverType === 'render') {
        notify(
          `Đã gửi tín hiệu đánh thức ${project.title}`,
          'Container Render đang khởi động ngầm (~20–40 giây).',
          'info'
        );
      }
    },
    [pingProjectServer, notify]
  );

  const handleWakeAll = useCallback(async () => {
    notify(
      'Đang đánh thức tất cả Servers...',
      'Gửi ping song song tới các endpoint Vercel & Render.',
      'info'
    );
    const res = await wakeUpAllServers();
    notify(
      'Hoàn tất kiểm tra & đánh thức Server',
      `${res.online}/${res.total} web endpoints phản hồi sẵn sàng.`
    );
  }, [wakeUpAllServers, notify]);

  const visibleProjects = useMemo(
    () => projects.filter((p) => !p.hidden),
    [projects]
  );

  const stats = useMemo(() => {
    const techSet = new Set<string>();
    for (const grp of PROFILE_CONFIG.techArsenal) {
      grp.items.forEach((t) => techSet.add(t.toLowerCase()));
    }
    for (const p of visibleProjects) {
      p.techStack.forEach((t) => techSet.add(t.toLowerCase()));
    }
    return {
      visibleCount: visibleProjects.length,
      githubRepoCount: repos.length,
      liveServersCount: visibleProjects.filter((p) => Boolean(p.liveUrl)).length,
      uniqueTechCount: techSet.size,
    };
  }, [visibleProjects, repos.length]);

  return (
    <div className="linear-grid-bg relative min-h-screen bg-zinc-50 text-zinc-900 transition-colors dark:bg-obsidian-950 dark:text-zinc-100">
      {/* Ambient Radial Gradient Top Glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-gradient-to-b from-indigo-500/[0.07] via-violet-500/[0.03] to-transparent dark:from-indigo-500/[0.12] dark:via-violet-500/[0.04]" />

      <Navbar
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        onOpenCommandPalette={() => setCommandOpen(true)}
        onOpenAdmin={() => {
          setEditTarget(null);
          setAdminOpen(true);
        }}
        syncingGitHub={syncingGitHub}
        syncSource={syncSource}
        onRefreshGitHub={handleRefreshGitHub}
        hasLocalEdits={hasLocalEdits}
      />

      <main className="relative mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8">
        {viewMode === 'portfolio' ? (
          <>
            <BentoHero
              visibleProjectsCount={stats.visibleCount}
              githubRepoCount={stats.githubRepoCount}
              liveServersCount={stats.liveServersCount}
              uniqueTechCount={stats.uniqueTechCount}
              onCopyEmail={handleCopyEmail}
              onOpenResume={() => setResumeOpen(true)}
            />

            <ProjectCommandCenter
              projects={projects}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              healthMap={healthMap}
              wakingAll={wakingAll}
              onPingServer={handlePingSingle}
              onWakeAllServers={handleWakeAll}
              onOpenDetail={(p) => setSelectedProjectId(p.id)}
            />
          </>
        ) : (
          <LauncherDashboard
            projects={projects}
            healthMap={healthMap}
            wakingAll={wakingAll}
            onPingServer={handlePingSingle}
            onWakeAllServers={handleWakeAll}
            onOpenDetail={(p) => setSelectedProjectId(p.id)}
            onOpenCommandPalette={() => setCommandOpen(true)}
          />
        )}

        {/* Footer */}
        <footer className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-zinc-200/80 pt-6 text-xs text-zinc-500 dark:border-white/[0.08] dark:text-zinc-400 sm:flex-row">
          <div>
            © {new Date().getFullYear()} <strong className="text-zinc-800 dark:text-zinc-200">Phạm Ngọc Huân</strong> · VNU-HUS K69 Computer Science.
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
            <span>
              <kbd className="rounded border border-zinc-300 px-1.5 py-0.5 dark:border-white/15">
                Ctrl+K
              </kbd>{' '}
              Launcher
            </span>
            <span>
              <kbd className="rounded border border-zinc-300 px-1.5 py-0.5 dark:border-white/15">
                Ctrl+Shift+E
              </kbd>{' '}
              Manage Hub
            </span>
            {lastSyncedAt && (
              <span>Sync: {formatRelativeDate(new Date(lastSyncedAt).toISOString())}</span>
            )}
          </div>
        </footer>
      </main>

      {/* Bottom-left Floating Quick Manage Hub Button */}
      <button
        type="button"
        onClick={() => {
          setEditTarget(null);
          setAdminOpen(true);
        }}
        className="no-print fixed bottom-4 left-4 z-30 inline-flex items-center gap-2 rounded-full border border-zinc-200/90 bg-white/90 px-3.5 py-2 text-xs font-semibold text-zinc-700 shadow-lg backdrop-blur-md transition hover:border-indigo-500/40 hover:text-indigo-600 dark:border-white/15 dark:bg-obsidian-900/90 dark:text-zinc-200 dark:hover:border-indigo-400/40 dark:hover:text-indigo-300"
        title="Mở Admin Manager Mode (Ctrl + Shift + E)"
      >
        <Settings2 className="h-3.5 w-3.5 text-indigo-500" />
        <span>Manage Hub</span>
        <kbd className="hidden rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:bg-white/[0.08] dark:text-zinc-400 sm:inline">
          Ctrl+Shift+E
        </kbd>
      </button>

      {/* Modals */}
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        projects={projects}
        viewMode={viewMode}
        theme={theme}
        onOpenDetail={(p) => setSelectedProjectId(p.id)}
        onToggleViewMode={() =>
          setViewMode((m) => (m === 'portfolio' ? 'launcher' : 'portfolio'))
        }
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        onWakeAllServers={handleWakeAll}
        onOpenAdmin={() => {
          setEditTarget(null);
          setAdminOpen(true);
        }}
      />

      <ProjectDetailModal
        project={selectedProject}
        health={selectedProject ? healthMap[selectedProject.id] : undefined}
        onClose={() => setSelectedProjectId(null)}
        onPingServer={handlePingSingle}
        onEditProject={(p) => {
          setSelectedProjectId(null);
          setEditTarget(p);
          setAdminOpen(true);
        }}
      />

      <AdminManagerModal
        open={adminOpen}
        onClose={() => {
          setAdminOpen(false);
          setEditTarget(null);
        }}
        projects={projects}
        config={config}
        hasLocalEdits={hasLocalEdits}
        initialEditProject={editTarget}
        onToggleVisibility={toggleVisibility}
        onTogglePin={togglePin}
        onSaveProject={addOrUpdateProject}
        onDeleteCustomProject={deleteCustomProject}
        onResetDefault={resetToDefault}
        onNotify={(title, desc) => notify(title, desc, 'success')}
      />

      <ResumeModal
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
        featuredProjects={visibleProjects}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
