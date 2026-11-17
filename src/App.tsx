import {
  ArrowUpRight,
  Award,
  BrainCircuit,
  Cloud,
  Code2,
  Copy,
  FileText,
  Github,
  GraduationCap,
  Mail,
  Settings2,
  Sparkles,
} from 'lucide-react';
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

  const researchCardStyles = [
    {
      icon: BrainCircuit,
      badge: 'border-violet-300/70 bg-violet-500/10 text-violet-700 dark:border-violet-400/30 dark:bg-violet-500/20 dark:text-violet-300',
      iconBox: 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/25',
    },
    {
      icon: Award,
      badge: 'border-blue-300/70 bg-blue-500/10 text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/20 dark:text-blue-300',
      iconBox: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25',
    },
    {
      icon: GraduationCap,
      badge: 'border-emerald-300/70 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/20 dark:text-emerald-300',
      iconBox: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25',
    },
  ];

  const skillCardStyles = [
    {
      icon: Code2,
      iconBox: 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/20',
      pillHover: 'hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:border-blue-400/40 dark:hover:bg-blue-500/15 dark:hover:text-blue-200',
    },
    {
      icon: BrainCircuit,
      iconBox: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20',
      pillHover: 'hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 dark:hover:border-purple-400/40 dark:hover:bg-purple-500/15 dark:hover:text-purple-200',
    },
    {
      icon: Cloud,
      iconBox: 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20',
      pillHover: 'hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:border-emerald-400/40 dark:hover:bg-emerald-500/15 dark:hover:text-emerald-200',
    },
  ];

  return (
    <div className="gemini-mesh-bg min-h-screen bg-[#F4F7FB] text-slate-900 transition-colors dark:bg-[#0B0F19] dark:text-slate-100">
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

      {/* Main Content Container (max-w-7xl mx-auto) */}
      <main className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        {viewMode === 'portfolio' ? (
          <>
            {/* BENTO HERO SECTION */}
            <BentoHero
              lang={lang}
              onCopyEmail={handleCopyText}
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
            <section id="research" className="scroll-mt-20 py-10 sm:py-12">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/90 px-3 py-1 font-mono text-xs font-bold text-indigo-700 dark:border-indigo-400/25 dark:bg-indigo-500/15 dark:text-indigo-300">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                  {tResearch.eyebrow}
                </span>
                <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                  <span className="gemini-gradient-text">{tResearch.title}</span>
                </h2>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
                {tResearch.items.map((item, idx) => {
                  const style = researchCardStyles[idx % researchCardStyles.length];
                  const Icon = style.icon;
                  return (
                    <div
                      key={item.role}
                      className="bento-card-hover flex h-full flex-col justify-between p-6"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${style.iconBox}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className={`rounded-full border px-3 py-0.5 font-mono text-xs font-bold tabular-nums ${style.badge}`}>
                            {item.period}
                          </span>
                        </div>

                        <h3 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">
                          {item.role}
                        </h3>
                        <p className="mt-1 text-xs font-bold text-indigo-600 dark:text-indigo-300">
                          {item.org}
                        </p>
                        <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
                          {item.summary}
                        </p>
                      </div>

                      <ul className="mt-4 space-y-2 border-t border-indigo-100/80 pt-4 dark:border-indigo-500/15">
                        {item.bullets.map((bullet, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 03 · TECH ARSENAL (#skills) */}
            <section id="skills" className="scroll-mt-20 py-10 sm:py-12">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/90 px-3 py-1 font-mono text-xs font-bold text-indigo-700 dark:border-indigo-400/25 dark:bg-indigo-500/15 dark:text-indigo-300">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                    {tSkills.eyebrow}
                  </span>
                  <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    <span className="gemini-gradient-text">{tSkills.title}</span>
                  </h2>
                </div>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                  {lang === 'vi'
                    ? 'Bấm vào bất kỳ công nghệ nào để lọc dự án tương ứng'
                    : 'Click any technology pill to filter matching projects'}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
                {tSkills.groups.map((group, idx) => {
                  const style = skillCardStyles[idx % skillCardStyles.length];
                  const Icon = style.icon;
                  return (
                    <div
                      key={group.title}
                      className="bento-card-hover flex h-full flex-col justify-between p-6"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${style.iconBox}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                              {group.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {group.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2 border-t border-indigo-100/80 pt-4 dark:border-indigo-500/15">
                        {group.items.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => handleFilterBySkill(skill)}
                            className={`rounded-xl border border-indigo-100 bg-slate-50/90 px-3 py-1.5 font-mono text-xs font-semibold text-slate-700 transition dark:border-indigo-500/20 dark:bg-white/[0.04] dark:text-slate-200 ${style.pillHover}`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 04 · CONTACT (#contact) */}
            <section id="contact" className="scroll-mt-20 py-10 sm:py-12">
              <div className="bento-card relative overflow-hidden p-6 sm:p-8">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-blue-500/15 via-indigo-500/15 to-purple-500/15 blur-3xl" />

                <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-7">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/90 px-3 py-1 font-mono text-xs font-bold text-indigo-700 dark:border-indigo-400/25 dark:bg-indigo-500/15 dark:text-indigo-300">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                      {tContact.eyebrow}
                    </span>
                    <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                      <span className="gemini-gradient-text">{tContact.title}</span>
                    </h2>
                    <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {tContact.desc}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <a
                        href={`mailto:${PROFILE_CONFIG.email}`}
                        className="gemini-btn-primary inline-flex h-10 items-center gap-2 rounded-xl px-5 text-xs font-bold"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span>{tContact.sendMailBtn}</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => setResumeOpen(true)}
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/80 px-4 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-400/30 dark:bg-indigo-500/15 dark:text-indigo-200"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>{tContact.openResumeBtn}</span>
                      </button>

                      <a
                        href={PROFILE_CONFIG.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
                      >
                        <Github className="h-3.5 w-3.5" />
                        <span>GitHub</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  {/* Symmetrical Email Copy Cards */}
                  <div className="space-y-3 lg:col-span-5">
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-r from-blue-50/60 to-indigo-50/40 px-4 py-3.5 dark:border-indigo-500/20 dark:from-blue-500/10 dark:to-indigo-500/5">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                          {tContact.primaryEmailLabel}
                        </div>
                        <div className="mt-0.5 truncate font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {PROFILE_CONFIG.email}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(tContact.primaryEmailLabel, PROFILE_CONFIG.email)
                        }
                        className="gemini-btn-primary inline-flex h-8 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-bold"
                      >
                        <Copy className="h-3 w-3" />
                        <span>{tContact.copyBtn}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-r from-purple-50/60 to-pink-50/40 px-4 py-3.5 dark:border-indigo-500/20 dark:from-purple-500/10 dark:to-pink-500/5">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-purple-600 dark:text-purple-300">
                          {tContact.academicEmailLabel}
                        </div>
                        <div className="mt-0.5 truncate font-mono text-xs font-bold text-slate-900 dark:text-white">
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
                        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-indigo-200 bg-white px-3 text-xs font-bold text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-400/30 dark:bg-white/[0.06] dark:text-indigo-200"
                      >
                        <Copy className="h-3 w-3" />
                        <span>{tContact.copyBtn}</span>
                      </button>
                    </div>
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

        {/* Footer */}
        <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-indigo-100 pt-6 text-xs text-slate-500 dark:border-indigo-500/15 dark:text-slate-400 sm:flex-row">
          <div>
            © {new Date().getFullYear()}{' '}
            <span className="font-bold text-indigo-600 dark:text-indigo-300">
              {PROFILE_CONFIG.fullName}
            </span>{' '}
            · VNU-HUS K69 Computer &amp; Information Science
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>Phím 1–4</span>
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
              className="rounded-lg p-1.5 text-indigo-500 transition hover:bg-indigo-50 dark:hover:bg-indigo-500/15"
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
