import { ArrowUpRight, Code2, Layers, Pin } from 'lucide-react';
import { getCategoryLabel, UI_DICT } from '../data/i18n';
import { CATEGORY_MAP } from '../data/projectsConfig';
import type { DevHubProject, Language, ServerHealthRecord } from '../types/project';
import { ProjectIcon, ServerStatusPill } from './ProjectIcon';

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
  const category = CATEGORY_MAP[project.category];
  const categoryLabel = getCategoryLabel(project.category, lang);
  const visibleTechs = project.techStack.slice(0, 5);
  const topMetrics = project.metrics ? project.metrics.slice(0, 3) : [];

  return (
    <article className="bento-card-hover group flex h-full flex-col justify-between p-6">
      <div className="flex flex-1 flex-col justify-between">
        <div>
          {/* 1. Header Row: Colorful ProjectIcon + Category Badge + Live Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <ProjectIcon
                icon={project.icon}
                accentColor={project.accentColor}
                size="md"
              />
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${category.badgeClass}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${category.dotClass}`} />
                    {categoryLabel}
                  </span>
                  {project.pinned && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-300">
                      <Pin className="h-2.5 w-2.5" />
                      {lang === 'vi' ? 'Tiêu biểu' : 'Featured'}
                    </span>
                  )}
                </div>
                <h3
                  onClick={() => onOpenDetail(project)}
                  className="mt-1.5 cursor-pointer text-lg font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300"
                >
                  {project.title}
                </h3>
              </div>
            </div>

            <ServerStatusPill
              project={project}
              health={health}
              onPing={onPingServer}
              lang={lang}
              compact
            />
          </div>

          {/* 2. Tagline Highlight + 2-Line Overview */}
          <div className="mt-4 rounded-2xl border border-indigo-100/80 bg-gradient-to-r from-indigo-50/70 via-blue-50/50 to-purple-50/50 px-3.5 py-2.5 dark:border-indigo-500/15 dark:from-indigo-500/10 dark:via-blue-500/5 dark:to-purple-500/10">
            <p className="line-clamp-2 text-xs font-semibold leading-relaxed text-indigo-950 dark:text-indigo-200">
              {project.tagline}
            </p>
          </div>

          <p className="mt-3 line-clamp-2 min-h-[40px] text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
            {project.overview}
          </p>
        </div>

        <div className="mt-4 space-y-3.5">
          {/* 3a. Symmetrical 3-Column Quantitative Metrics Strip */}
          {topMetrics.length > 0 && (
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-3 py-2.5 dark:border-white/[0.07] dark:bg-white/[0.03]">
              {topMetrics.map((m) => (
                <div key={m.label} className="min-w-0">
                  <div className="truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    {m.label}
                  </div>
                  <div className="mt-0.5 truncate font-mono text-xs font-bold tabular-nums text-indigo-700 dark:text-indigo-300">
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
                className="rounded-lg border border-indigo-100 bg-white px-2.5 py-1 font-mono text-[11px] font-medium text-slate-600 shadow-2xs transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-indigo-500/20 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-indigo-400/40 dark:hover:text-indigo-200"
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Symmetrical Footer Actions */}
      <div className="mt-5 flex items-center justify-between gap-2 border-t border-indigo-100/80 pt-4 dark:border-indigo-500/15">
        <div className="flex items-center gap-2">
          <a
            href={project.liveUrl || project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="gemini-btn-primary inline-flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-xs font-bold"
          >
            <span>{t.liveDemo}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-indigo-400/40"
          >
            <Code2 className="h-3.5 w-3.5 text-indigo-500" />
            <span>{t.sourceCode}</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => onOpenDetail(project)}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
        >
          <Layers className="h-3.5 w-3.5" />
          <span>{t.archDetails}</span>
        </button>
      </div>
    </article>
  );
}
