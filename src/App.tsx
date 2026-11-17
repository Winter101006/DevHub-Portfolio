import { ArrowUpRight, Copy, FileText, Github, Mail, Settings2 } from 'lucide-react';
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
import { UI_DICT } from './data/i18n';
import { PROFILE_CONFIG } from './data/profileConfig';
import { useGitHubRepos } from './hooks/useGitHubRepos';
import { useProjectManager } from './hooks/useProjectManager';
import { useServerHealth } from './hooks/useServerHealth';
import type {
  DevHubProject,
  FilterTab,
  Language,
  ToastMessage,
  ViewMode,
} from './types/project';
import { mergeProjectsData } from './utils/projectMerge';

const THEME_KEY = 'devhub_theme';
const MODE_KEY = 'devhub_view_mode';
const LANG_KEY = 'devhub_lang';

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

  const [lang, setLang] = useState<Language>(() => {
    try {
      return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'vi';
    } catch {
      return 'vi';
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
      }, 3200);
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

  // Persist language
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      // Ignore
    }
  }, [lang]);

  // Global keyboard shortcuts: Ctrl+K (Command Palette), Ctrl+Shift+E (Admin Manager), 1-4 (Sections)
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
        return;
      }

      const tag = document.activeElement?.tagName;
      if (
        !mod &&
        !e.altKey &&
        tag !== 'INPUT' &&
        tag !== 'TEXTAREA' &&
        tag !== 'SELECT' &&
        viewMode === 'portfolio'
      ) {
        const sectionMap: Record<string, string> = {
          '1': 'projects',
          '2': 'research',
          '3': 'skills',
          '4': 'contact',
        };
        const targetId = sectionMap[e.key];
        if (targetId) {
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [viewMode]);

  const handleCopyText = useCallback(
    async (label: string, value: string) => {
      try {
        await navigator.clipboard.writeText(value);
        notify(
          lang === 'vi' ? `Đã sao chép ${label}` : `Copied ${label}`,
          value,
          'success'
        );
      } catch {
        notify(label, value, 'info');
      }
    },
    [notify, lang]
  );

  const handleRefreshGitHub = useCallback(async () => {
    const result = await syncFromGitHub(true);
    if (result.ok) {
      notify(
        lang === 'vi' ? 'Đồng bộ GitHub thành công' : 'GitHub Synced',
        lang === 'vi'
          ? `Quét được ${result.count} repositories từ @${PROFILE_CONFIG.githubUsername}`
          : `Fetched ${result.count} repositories from @${PROFILE_CONFIG.githubUsername}`
      );
    } else {
      notify(
        lang === 'vi' ? 'Đang dùng dữ liệu dự phòng' : 'Using cached repository data',
        `${result.count} repositories loaded`,
        'warning'
      );
    }
  }, [syncFromGitHub, notify, lang]);

  const handlePingSingle = useCallback(
    async (project: DevHubProject) => {
      const result = await pingProjectServer(project);
      if (result.ok) {
        notify(
          lang === 'vi'
            ? `${project.title} đang hoạt động`
            : `${project.title} is online`,
          `${result.latencyMs}ms`,
          'success'
        );
      } else if (project.serverType === 'render') {
        notify(
          lang === 'vi'
            ? `Đã gửi tín hiệu đánh thức ${project.title}`
            : `Sent wake-up signal to ${project.title}`,
          lang === 'vi'
            ? 'Container Render đang khởi động (~20–40 giây)'
            : 'Render container is spinning up (~20–40s)',
          'info'
        );
      }
    },
    [pingProjectServer, notify, lang]
  );

  const handleWakeAll = useCallback(async () => {
    notify(
      lang === 'vi'
        ? 'Đang kiểm tra toàn bộ Servers'
        : 'Pinging all live endpoints',
      undefined,
      'info'
    );
    const res = await wakeUpAllServers();
    notify(
      lang === 'vi' ? 'Hoàn tất kiểm tra Server' : 'Health check complete',
      lang === 'vi'
        ? `${res.online}/${res.total} endpoints phản hồi sẵn sàng`
        : `${res.online}/${res.total} endpoints responded online`
    );
  }, [wakeUpAllServers, notify, lang]);

  const handleFilterBySkill = useCallback((skill: string) => {
    const keyword = skill.split('/')[0].split('(')[0].trim();
    setActiveTab('all');
    setSearchQuery(keyword);
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const visibleProjects = useMemo(
    () => projects.filter((p) => !p.hidden),
    [projects]
  );

  const tResearch = UI_DICT[lang].research;
  const tSkills = UI_DICT[lang].skills;
  const tContact = UI_DICT[lang].contact;
  const tFooter = UI_DICT[lang].footer;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 transition-colors dark:bg-[#09090B] dark:text-zinc-100">
      {/* 1. Clean Sticky Navbar (64px) */}
      <Navbar
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        lang={lang}
        onChangeLang={setLang}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        onOpenCommandPalette={() => setCommandOpen(true)}
      />

      {/* Main Content Container (max-w-5xl mx-auto) */}
      <main className="relative mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        {viewMode === 'portfolio' ? (
          <>
            {/* HERO SECTION */}
            <BentoHero
              lang={lang}
              onCopyEmail={() => handleCopyText('Email', PROFILE_CONFIG.email)}
              onOpenResume={() => setResumeOpen(true)}
            />

            {/* 01 · SELECTED WORKS (#projects) */}
            <ProjectCommandCenter
              projects={projects}
              lang={lang}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              healthMap={healthMap}
              onPingServer={handlePingSingle}
              onOpenDetail={(p) => setSelectedProjectId(p.id)}
            />

            {/* 02 · RESEARCH & EXPERIENCE (#research) */}
            <section
              id="research"
              className="scroll-mt-20 border-t border-zinc-200/80 py-14 dark:border-white/[0.06] sm:py-16"
            >
              <div className="max-w-2xl">
                <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {lang === 'vi'
                    ? '02 · Nghiên cứu & Đào tạo'
                    : '02 · Research & Academic background'}
                </div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                  {tResearch.title}
                </h2>
              </div>

              <div className="mt-8 divide-y divide-zinc-200/70 dark:divide-white/[0.06]">
                {tResearch.items.map((item) => (
                  <div
                    key={item.role}
                    className="grid grid-cols-1 gap-4 py-7 first:pt-0 last:pb-0 md:grid-cols-12 md:gap-8"
                  >
                    <div className="font-mono text-xs tabular-nums text-zinc-500 dark:text-zinc-400 md:col-span-3 md:pt-1">
                      {item.period}
                    </div>
                    <div className="space-y-2.5 md:col-span-9">
                      <div>
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                          {item.role}
                        </h3>
                        <p className="mt-0.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          {item.org}
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                        {item.summary}
                      </p>
                      <ul className="space-y-1.5 pt-1">
                        {item.bullets.map((bullet, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-sm"
                          >
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 03 · TECH ARSENAL (#skills) */}
            <section
              id="skills"
              className="scroll-mt-20 border-t border-zinc-200/80 py-14 dark:border-white/[0.06] sm:py-16"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div className="max-w-2xl">
                  <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    {lang === 'vi' ? '03 · Năng lực công nghệ' : '03 · Tech stack'}
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                    {tSkills.title}
                  </h2>
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {lang === 'vi'
                    ? 'Bấm vào từng công nghệ để lọc dự án tương ứng'
                    : 'Click any technology to filter matching projects'}
                </span>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {tSkills.groups.map((group) => (
                  <div
                    key={group.title}
                    className="flex h-full flex-col justify-between rounded-xl border border-zinc-200/85 bg-white p-6 dark:border-white/[0.08] dark:bg-[#111113]"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {group.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {group.subtitle}
                      </p>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {group.items.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleFilterBySkill(skill)}
                          className="rounded-md border border-zinc-200/80 bg-zinc-50 px-2.5 py-1 font-mono text-xs text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white"
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 04 · CONTACT (#contact) */}
            <section
              id="contact"
              className="scroll-mt-20 border-t border-zinc-200/80 py-14 dark:border-white/[0.06] sm:py-16"
            >
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7">
                  <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    {lang === 'vi' ? '04 · Liên hệ & Kết nối' : '04 · Contact'}
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                    {tContact.title}
                  </h2>
                  <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {tContact.desc}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-2.5">
                    <a
                      href={`mailto:${PROFILE_CONFIG.email}`}
                      className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>{tContact.sendMailBtn}</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setResumeOpen(true)}
                      className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200/90 bg-white px-4 text-xs font-medium text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-white/10 dark:bg-[#111113] dark:text-zinc-200 dark:hover:bg-white/[0.06]"
                    >
                      <FileText className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
                      <span>{tContact.openResumeBtn}</span>
                    </button>

                    <a
                      href={PROFILE_CONFIG.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-zinc-200/90 bg-white px-3.5 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-[#111113] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>GitHub</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {/* Symmetrical Email Copy Rows */}
                <div className="space-y-3 lg:col-span-5">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200/85 bg-white px-4 py-3.5 dark:border-white/[0.08] dark:bg-[#111113]">
                    <div className="min-w-0">
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {tContact.primaryEmailLabel}
                      </div>
                      <div className="mt-0.5 truncate font-mono text-xs font-medium text-zinc-900 dark:text-zinc-100">
                        {PROFILE_CONFIG.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(tContact.primaryEmailLabel, PROFILE_CONFIG.email)
                      }
                      className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-zinc-200/90 bg-zinc-50 px-2.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:text-white"
                    >
                      <Copy className="h-3 w-3" />
                      <span>{tContact.copyBtn}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200/85 bg-white px-4 py-3.5 dark:border-white/[0.08] dark:bg-[#111113]">
                    <div className="min-w-0">
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {tContact.academicEmailLabel}
                      </div>
                      <div className="mt-0.5 truncate font-mono text-xs font-medium text-zinc-900 dark:text-zinc-100">
                        {PROFILE_CONFIG.academicEmail}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(
                          tContact.academicEmailLabel,
                          PROFILE_CONFIG.academicEmail
                        )
                      }
                      className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-zinc-200/90 bg-zinc-50 px-2.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:text-white"
                    >
                      <Copy className="h-3 w-3" />
                      <span>{tContact.copyBtn}</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <LauncherDashboard
            projects={projects}
            lang={lang}
            healthMap={healthMap}
            wakingAll={wakingAll}
            syncingGitHub={syncingGitHub}
            onPingServer={handlePingSingle}
            onWakeAllServers={handleWakeAll}
            onRefreshGitHub={handleRefreshGitHub}
            onOpenDetail={(p) => setSelectedProjectId(p.id)}
            onOpenCommandPalette={() => setCommandOpen(true)}
            onOpenAdmin={() => {
              setEditTarget(null);
              setAdminOpen(true);
            }}
          />
        )}

        {/* Minimalist Footer */}
        <footer className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-zinc-200/80 pt-8 text-xs text-zinc-500 dark:border-white/[0.06] dark:text-zinc-500 sm:flex-row">
          <div>
            © {new Date().getFullYear()}{' '}
            <span className="font-medium text-zinc-800 dark:text-zinc-300">
              {PROFILE_CONFIG.fullName}
            </span>{' '}
            · VNU-HUS K69 · {tFooter.rights}
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>1–4 Sections</span>
            <span>·</span>
            <span>Ctrl+K</span>
            <button
              type="button"
              onClick={() => {
                setEditTarget(null);
                setAdminOpen(true);
              }}
              title={tFooter.manageTooltip}
              aria-label={tFooter.manageTooltip}
              className="rounded p-1 text-zinc-400 opacity-60 transition-colors hover:bg-zinc-200/60 hover:text-zinc-700 hover:opacity-100 dark:hover:bg-white/[0.06] dark:hover:text-zinc-300"
            >
              <Settings2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </footer>
      </main>

      {/* Modals & Drawers */}
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        projects={projects}
        lang={lang}
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
        lang={lang}
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
        lang={lang}
        onClose={() => setResumeOpen(false)}
        featuredProjects={visibleProjects}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
