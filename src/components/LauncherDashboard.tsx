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
  Terminal,
  Zap,
} from 'lucide-react';
import { getCategoryLabel, localizeProject, UI_DICT } from '../data/i18n';
import { PROFILE_CONFIG } from '../data/profileConfig';
import type { DevHubProject, Language, ServerHealthRecord } from '../types/project';
import { ServerStatusPill } from './ProjectIcon';

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
    <div className="animate-fade-up space-y-12 py-10 sm:py-12">
      {/* 1. Command Center Header & Operational Controls */}
      <div className="flex flex-col justify-between gap-6 border-b border-zinc-200/80 pb-8 dark:border-white/[0.07] lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <div className="font-mono text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            {t.eyebrow}
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            {t.title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t.desc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onWakeAllServers}
            disabled={wakingAll || liveProjects.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300/90 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60 dark:border-white/15 dark:bg-white/[0.03] dark:text-zinc-200 dark:hover:bg-white/[0.07]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncingGitHub ? 'animate-spin' : ''}`} />
            <span>{t.syncGithubBtn}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300/90 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/15 dark:bg-white/[0.03] dark:text-zinc-200 dark:hover:bg-white/[0.07]"
          >
            <Settings2 className="h-3.5 w-3.5 text-indigo-500" />
            <span>{t.manageHubBtn}</span>
          </button>

          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200/90 bg-zinc-100/80 px-3 py-2 font-mono text-xs text-zinc-600 transition hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:text-white"
          >
            <Command className="h-3.5 w-3.5" />
            <span>Ctrl+K</span>
          </button>
        </div>
      </div>

      {/* 2. Real-Time Service Health & Endpoints Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              {t.healthSectionTitle} ({liveProjects.length})
            </h2>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white/60 dark:border-white/[0.07] dark:bg-white/[0.015]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-zinc-200/80 font-mono text-[11px] uppercase tracking-wider text-zinc-400 dark:border-white/[0.07] dark:text-zinc-500">
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Platform</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">Endpoint URL</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/60 text-xs dark:divide-white/[0.05]">
                {liveProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="transition hover:bg-zinc-100/60 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3.5 font-semibold text-zinc-900 dark:text-white">
                      {project.title}
                    </td>
                    <td className="hidden px-4 py-3.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400 sm:table-cell">
                      {project.serverType === 'render'
                        ? project.keepAlive
                          ? 'Render + Neon DB (24/7)'
                          : 'Render Cloud'
                        : 'Vercel / Cloud'}
                    </td>
                    <td className="hidden max-w-xs truncate px-4 py-3.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400 md:table-cell">
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
                          className="rounded-md border border-zinc-200/90 px-2.5 py-1 font-mono text-[11px] text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white"
                        >
                          {t.pingNow}
                        </button>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
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
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
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
              className="group flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-white/60 p-3.5 transition hover:border-zinc-300 dark:border-white/[0.07] dark:bg-white/[0.015] dark:hover:border-white/20"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white">
                  {consoleLink.name}
                </span>
                <ExternalLink className="h-3 w-3 text-zinc-400 transition group-hover:text-zinc-900 dark:group-hover:text-white" />
              </div>
              <span className="mt-2 truncate font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                {consoleLink.subtitle}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* 4. All Projects & GitHub Repositories Quick Launcher */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-zinc-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
            {t.reposTitle} ({visibleProjects.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-white/60 p-4 transition hover:border-zinc-300 dark:border-white/[0.07] dark:bg-white/[0.015] dark:hover:border-white/15"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                    {getCategoryLabel(project.category, lang)}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                    {project.year}
                  </span>
                </div>
                <h3
                  onClick={() => onOpenDetail(project)}
                  className="mt-1.5 cursor-pointer text-sm font-bold text-zinc-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
                >
                  {project.title}
                </h3>
                <p className="mt-1 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {project.tagline}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-zinc-200/60 pt-3 dark:border-white/[0.05]">
                <div className="flex items-center gap-1.5">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-white dark:bg-white dark:text-zinc-950"
                    >
                      <span>{t.openApp}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  )}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[11px] font-medium text-zinc-600 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-300 dark:hover:text-white"
                  >
                    <Github className="h-3 w-3" />
                    <span>Repo</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenDetail(project)}
                  className="font-mono text-[11px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                >
                  Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
