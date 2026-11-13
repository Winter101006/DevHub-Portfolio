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

  return (
    <article className="bento-card-hover group flex h-full flex-col justify-between p-5">
      <div>
        {/* Card Header: Icon + Category + Server Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <ProjectIcon icon={project.icon} accentColor={project.accentColor} />
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${category.badgeClass}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${category.dotClass}`} />
                {category.shortLabel}
              </span>
              {project.pinned && (
                <span
                  className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-300"
                  title="Dự án được ghim nổi bật"
                >
                  <Pin className="h-2.5 w-2.5" />
                  Pinned
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Live Status Dot Row */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <ServerStatusPill
            project={project}
            health={health}
            onPing={onPingServer}
          />
          {project.language && (
            <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
              {project.language}
            </span>
          )}
        </div>

        {/* Body: Title + 1-line Tagline + 2-3 line Overview */}
        <div className="mt-3.5">
          <h3 className="text-base font-bold tracking-tight text-zinc-900 transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
            {project.title}
          </h3>
          <p className="mt-1.5 text-xs font-medium leading-relaxed text-indigo-700 dark:text-indigo-300/90">
            {project.tagline}
          </p>
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            {project.overview}
          </p>
        </div>

        {/* Tech Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {visibleTechs.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-zinc-200/80 bg-zinc-50 px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-300"
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

      {/* Footer: 2 clear action buttons */}
      <div className="mt-5 flex items-center gap-2 border-t border-zinc-200/70 pt-4 dark:border-white/[0.06]">
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600 dark:bg-white dark:text-zinc-950 dark:hover:bg-indigo-400 dark:hover:text-white"
          >
            Mở Web
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        ) : (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-200 dark:border-white/10 dark:bg-white/[0.07] dark:text-zinc-100 dark:hover:bg-white/[0.12]"
          >
            <Github className="h-3.5 w-3.5" />
            Xem Source
            <ArrowUpRight className="h-3 w-3 opacity-70" />
          </a>
        )}

        <button
          type="button"
          onClick={() => onOpenDetail(project)}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:text-indigo-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-200 dark:hover:border-indigo-400/40 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Chi tiết &amp; Kiến trúc
        </button>
      </div>
    </article>
  );
}
