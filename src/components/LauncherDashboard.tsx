import {
  Activity,
  ArrowUpRight,
  Command,
  ExternalLink,
  Github,
  Layers,
  Loader2,
  RefreshCw,
  Settings2,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import { getCategoryLabel, localizeProject, UI_DICT } from '../data/i18n';
import { PROFILE_CONFIG } from '../data/profileConfig';
import { CATEGORY_MAP } from '../data/projectsConfig';
import type { DevHubProject, Language, ServerHealthRecord } from '../types/project';
import { ProjectIcon, ServerStatusPill } from './ProjectIcon';

interface LauncherDashboardProps {
  projects: DevHubProject[];
  lang: Language;
  healthMap: Record<string, ServerHealthRecord>;
  wakingAll: boolean;
  syncingGitHub: boolean;
  onPingServer: (project: DevHubProject) => void;
  onWakeAllServers: () => void;
  onRefreshGitHub: () => void;
  onOpenDetail: (project: DevHubProject) => void;
  onOpenCommandPalette: () => void;
  onOpenAdmin: () => void;
}

export function LauncherDashboard({
  projects,
  lang,
  healthMap,
  wakingAll,
  syncingGitHub,
  onPingServer,
  onWakeAllServers,
  onRefreshGitHub,
  onOpenDetail,
  onOpenCommandPalette,
  onOpenAdmin,
}: LauncherDashboardProps) {
  const t = UI_DICT[lang].launcher;
  const visibleProjects = projects
    .filter((p) => !p.hidden)
    .map((p) => localizeProject(p, lang));
  const liveProjects = visibleProjects.filter((p) => Boolean(p.liveUrl));

  return (
    <div className="space-y-8 py-8">
      {/* 1. Command Center Header & Operational Controls */}
      <div className="bento-card flex flex-col justify-between gap-5 p-6 sm:p-8 lg:flex-row lg:items-center">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/90 px-3 py-1 font-mono text-xs font-bold text-indigo-700 dark:border-indigo-400/25 dark:bg-indigo-500/15 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            {t.eyebrow}
          </span>
          <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            <span className="gemini-gradient-text">{t.title}</span>
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {t.desc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onWakeAllServers}
            disabled={wakingAll || liveProjects.length === 0}
            className="gemini-btn-primary inline-flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-bold disabled:opacity-60"
          >
            {wakingAll ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Zap className="h-3.5 w-3.5" />
            )}
            <span>{wakingAll ? t.wakingAllBtn : t.wakeAllBtn}</span>
          </button>

          <button
            type="button"
            onClick={onRefreshGitHub}
            disabled={syncingGitHub}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-60 dark:border-indigo-400/30 dark:bg-indigo-500/15 dark:text-indigo-200"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncingGitHub ? 'animate-spin' : ''}`} />
            <span>{t.syncGithubBtn}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
          >
            <Settings2 className="h-3.5 w-3.5 text-indigo-500" />
            <span>{t.manageHubBtn}</span>
          </button>

          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-indigo-100 bg-white px-3 font-mono text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-indigo-500/20 dark:bg-white/[0.04] dark:text-slate-300"
          >
            <Command className="h-3.5 w-3.5 text-indigo-500" />
            <span>Ctrl+K</span>
          </button>
        </div>
      </div>

      {/* 2. Real-Time Service Health & Endpoints Table */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-500" />
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
            {t.healthSectionTitle} ({liveProjects.length})
          </h2>
        </div>

        <div className="bento-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-indigo-100/80 bg-indigo-50/40 font-mono text-[11px] uppercase tracking-wider text-indigo-700 dark:border-indigo-500/15 dark:bg-indigo-500/10 dark:text-indigo-300">
                  <th className="px-4 py-3.5 font-bold">Service</th>
                  <th className="hidden px-4 py-3.5 font-bold sm:table-cell">Platform</th>
                  <th className="hidden px-4 py-3.5 font-bold md:table-cell">Endpoint URL</th>
                  <th className="px-4 py-3.5 font-bold">Status</th>
                  <th className="px-4 py-3.5 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100/60 text-xs dark:divide-indigo-500/10">
                {liveProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="transition hover:bg-indigo-50/40 dark:hover:bg-indigo-500/5"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <ProjectIcon
                          icon={project.icon}
                          accentColor={project.accentColor}
                          size="sm"
                        />
                        <span className="font-bold text-slate-900 dark:text-white">
                          {project.title}
                        </span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3.5 font-mono text-[11px] text-slate-500 dark:text-slate-400 sm:table-cell">
                      {project.serverType === 'render'
                        ? project.keepAlive
                          ? 'Render + Neon DB (24/7)'
                          : 'Render Cloud'
                        : 'Vercel / Cloud'}
                    </td>
                    <td className="hidden max-w-xs truncate px-4 py-3.5 font-mono text-[11px] text-indigo-600 dark:text-indigo-300 md:table-cell">
                      {project.liveUrl}
                    </td>
                    <td className="px-4 py-3.5">
                      <ServerStatusPill
                        project={project}
                        health={healthMap[project.id]}
                        onPing={onPingServer}
                        lang={lang}
                      />
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onPingServer(project)}
                          className="rounded-lg border border-indigo-100 bg-indigo-50/70 px-2.5 py-1 font-mono text-[11px] font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300"
                        >
                          {t.pingNow}
                        </button>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="gemini-btn-primary inline-flex items-center gap-1 rounded-lg px-3 py-1 text-[11px] font-bold"
                          >
                            <span>{t.openApp}</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. Cloud & Admin Consoles Dock */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-indigo-500" />
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
            {t.consolesTitle}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {PROFILE_CONFIG.devConsoles.map((consoleLink) => (
            <a
              key={consoleLink.id}
              href={consoleLink.url}
              target="_blank"
              rel="noreferrer"
              className="bento-card-hover group flex items-center gap-3 p-3.5"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-sm ${consoleLink.colorClass}`}
              >
                {consoleLink.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="truncate text-xs font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
                    {consoleLink.name}
                  </span>
                  <ExternalLink className="h-3 w-3 shrink-0 text-slate-400 transition group-hover:text-indigo-500" />
                </div>
                <div className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                  {consoleLink.subtitle}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 4. All Projects & GitHub Repositories Quick Launcher */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-indigo-500" />
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
            {t.reposTitle} ({visibleProjects.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project) => {
            const cat = CATEGORY_MAP[project.category];
            return (
              <div
                key={project.id}
                className="bento-card-hover flex flex-col justify-between p-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${cat.badgeClass}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${cat.dotClass}`} />
                      {getCategoryLabel(project.category, lang)}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-slate-400">
                      {project.year}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <ProjectIcon
                      icon={project.icon}
                      accentColor={project.accentColor}
                      size="sm"
                    />
                    <h3
                      onClick={() => onOpenDetail(project)}
                      className="cursor-pointer text-sm font-extrabold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-300"
                    >
                      {project.title}
                    </h3>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                    {project.tagline}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-indigo-100/70 pt-3.5 dark:border-indigo-500/15">
                  <div className="flex items-center gap-1.5">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="gemini-btn-primary inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-bold"
                      >
                        <span>{t.openApp}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-indigo-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
                    >
                      <Github className="h-3 w-3" />
                      <span>Repo</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenDetail(project)}
                    className="font-mono text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-300"
                  >
                    Chi tiết →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
