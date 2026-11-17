import { ArrowUpRight, Code2, Layers } from 'lucide-react';
import { getCategoryLabel, UI_DICT } from '../data/i18n';
import type { DevHubProject, Language, ServerHealthRecord } from '../types/project';
import { ServerStatusPill } from './ProjectIcon';

interface ProjectCardProps {
  project: DevHubProject;
  lang: Language;
  health?: ServerHealthRecord;
  onPingServer: (project: DevHubProject) => void;
  onOpenDetail: (project: DevHubProject) => void;
  onSelectTech?: (tech: string) => void;
}

export function ProjectCard({
  project,
  lang,
  health,
  onPingServer,
  onOpenDetail,
  onSelectTech,
}: ProjectCardProps) {
  const t = UI_DICT[lang].projects;
  const categoryLabel = getCategoryLabel(project.category, lang);
  const visibleTechs = project.techStack.slice(0, 5);
  const topMetrics = project.metrics ? project.metrics.slice(0, 3) : [];

  return (
    <article className="group flex h-full flex-col justify-between rounded-xl border border-zinc-200/85 bg-white p-6 transition-colors duration-150 hover:border-zinc-300 dark:border-white/[0.08] dark:bg-[#111113] dark:hover:border-white/[0.16]">
      <div className="flex flex-1 flex-col justify-between">
        <div>
          {/* 1. Header Row: Category + Year (left) & Live Status (right) */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-zinc-200/90 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] text-zinc-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-300">
                {categoryLabel}
              </span>
              <span className="font-mono text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
                {project.year}
              </span>
            </div>

            <ServerStatusPill
              project={project}
              health={health}
              onPing={onPingServer}
              lang={lang}
            />
          </div>

          {/* 2. Title & 2-Line Overview */}
          <h3
            onClick={() => onOpenDetail(project)}
            className="mt-3.5 cursor-pointer text-lg font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-white"
          >
            {project.title}
          </h3>

          <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-zinc-600 dark:text-zinc-400">
            {project.overview}
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {/* 3a. Symmetrical 3-Column Quantitative Metrics Strip */}
          {topMetrics.length > 0 && (
            <div className="grid grid-cols-3 gap-2 rounded-lg border border-zinc-200/70 bg-zinc-50/70 px-3 py-2 dark:border-white/[0.06] dark:bg-white/[0.02]">
              {topMetrics.map((m) => (
                <div key={m.label} className="min-w-0">
                  <div className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                    {m.label}
                  </div>
                  <div className="mt-0.5 truncate font-mono text-xs font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3b. Interactive Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5">
            {visibleTechs.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => onSelectTech?.(tech)}
                title={
                  lang === 'vi'
                    ? `Lọc dự án dùng ${tech}`
                    : `Filter projects by ${tech}`
                }
                className="rounded-md border border-zinc-200/70 bg-zinc-100/70 px-2 py-0.5 font-mono text-[11px] text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-200/60 hover:text-zinc-900 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-white/15 dark:hover:text-white"
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Symmetrical Footer Actions */}
      <div className="mt-5 flex items-center justify-between gap-2 border-t border-zinc-200/70 pt-4 dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <a
            href={project.liveUrl || project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1 rounded-lg bg-zinc-900 px-3 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            <span>{t.liveDemo}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200/90 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            <Code2 className="h-3.5 w-3.5 text-zinc-400" />
            <span>{t.sourceCode}</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => onOpenDetail(project)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-zinc-200"
        >
          <Layers className="h-3.5 w-3.5 text-zinc-400" />
          <span>{t.archDetails}</span>
        </button>
      </div>
    </article>
  );
}
