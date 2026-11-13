import { ArrowUpRight, BookOpen, Github, Pin } from 'lucide-react';
import { CATEGORY_MAP } from '../data/projectsConfig';
import type { DevHubProject, ServerHealthRecord } from '../types/project';
import { ProjectIcon, ServerStatusPill } from './ProjectIcon';

interface ProjectCardProps {
  project: DevHubProject;
  health?: ServerHealthRecord;
  onPingServer: (project: DevHubProject) => void;
  onOpenDetail: (project: DevHubProject) => void;
}

export function ProjectCard({
  project,
  health,
  onPingServer,
  onOpenDetail,
}: ProjectCardProps) {
  const category = CATEGORY_MAP[project.category];
  const visibleTechs = project.techStack.slice(0, 4);
  const extraTechCount = Math.max(0, project.techStack.length - 4);
  const topMetrics = project.metrics?.slice(0, 2) ?? [];

  return (
    <article className="bento-card-hover group flex h-full flex-col justify-between p-5">
      <div>
        {/* Clean Single-Row Card Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <ProjectIcon icon={project.icon} accentColor={project.accentColor} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${category.dotClass}`} />
                <span className="truncate text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                  {category.shortLabel}
                </span>
                {project.pinned && (
                  <Pin
                    className="h-3 w-3 shrink-0 text-amber-500"
                    aria-label="Dự án nổi bật"
                  />
                )}
              </div>
              <h3 className="mt-0.5 truncate text-[15px] font-bold tracking-tight text-zinc-900 transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
                {project.title}
              </h3>
            </div>
          </div>

          <div className="shrink-0">
            <ServerStatusPill
              project={project}
              health={health}
              onPing={onPingServer}
              compact
            />
          </div>
        </div>

        {/* Body: Tagline + Concise Overview */}
        <p className="mt-3.5 line-clamp-2 text-xs font-semibold leading-relaxed text-zinc-800 dark:text-zinc-200">
          {project.tagline}
        </p>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          {project.overview}
        </p>

        {/* Key Highlight Metrics Strip (when available) */}
        {topMetrics.length > 0 && (
          <div className="mt-3.5 grid grid-cols-2 gap-2 rounded-xl border border-zinc-200/70 bg-zinc-50/70 px-3 py-2 dark:border-white/[0.06] dark:bg-white/[0.025]">
            {topMetrics.map((m) => (
              <div key={m.label} className="min-w-0">
                <div className="truncate text-[10px] text-zinc-400">{m.label}</div>
                <div className="truncate font-mono text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tech Pills */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {visibleTechs.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-zinc-200/80 bg-zinc-50 px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-300"
            >
              {tech}
            </span>
          ))}
          {extraTechCount > 0 && (
            <span className="rounded-md border border-zinc-200/80 bg-zinc-50 px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-500 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-400">
              +{extraTechCount}
            </span>
          )}
        </div>
      </div>

      {/* Clean Action Footer */}
      <div className="mt-4 flex items-center gap-2 border-t border-zinc-200/70 pt-3.5 dark:border-white/[0.06]">
        {project.liveUrl ? (
          <>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600 dark:bg-white dark:text-zinc-950 dark:hover:bg-indigo-400 dark:hover:text-white"
            >
              Mở Web
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                title="Mở Repository trên GitHub"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
            )}
          </>
        ) : (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-200 dark:border-white/10 dark:bg-white/[0.07] dark:text-zinc-100 dark:hover:bg-white/[0.12]"
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
            <ArrowUpRight className="h-3 w-3 opacity-70" />
          </a>
        )}

        <button
          type="button"
          onClick={() => onOpenDetail(project)}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:text-indigo-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-200 dark:hover:border-indigo-400/40 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Chi tiết
        </button>
      </div>
    </article>
  );
}
