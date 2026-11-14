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
}

export function ProjectCard({
  project,
  lang,
  health,
  onPingServer,
  onOpenDetail,
}: ProjectCardProps) {
  const t = UI_DICT[lang].projects;
  const categoryLabel = getCategoryLabel(project.category, lang);
  const visibleTechs = project.techStack.slice(0, 5);

  return (
    <article className="group flex h-full flex-col justify-between rounded-xl border border-zinc-200/80 bg-white/60 p-6 transition-colors duration-200 hover:border-zinc-300 dark:border-white/[0.07] dark:bg-white/[0.015] dark:hover:border-white/[0.15]">
      <div>
        {/* 1. Header Card: Project Name + Category Badge + Live Status Dot + Year */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-zinc-200/90 bg-zinc-100/80 px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-300">
              {categoryLabel}
            </span>
            <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
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

        <h3
          onClick={() => onOpenDetail(project)}
          className="mt-3 cursor-pointer text-lg font-bold tracking-tight text-zinc-900 transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400"
        >
          {project.title}
        </h3>

        {/* 2. 2-Line Description: Problem solved & Core Architecture/Result */}
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {project.overview}
        </p>

        {/* 3. Tech Stack Pills: Max 4-5 core technologies */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {visibleTechs.map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[11px] text-zinc-600 dark:bg-white/[0.05] dark:text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Footer Card: 3 clear action buttons: Live Demo ↗, Source Code, Chi tiết kiến trúc */}
      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-zinc-200/70 pt-4 dark:border-white/[0.06]">
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            <span>{t.liveDemo}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        ) : (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200/90 bg-zinc-100/70 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-200/70 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-200 dark:hover:bg-white/[0.1]"
          >
            <span>{t.liveDemo}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}

        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200/90 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white"
        >
          <Code2 className="h-3.5 w-3.5" />
          <span>{t.sourceCode}</span>
        </a>

        <button
          type="button"
          onClick={() => onOpenDetail(project)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
        >
          <Layers className="h-3.5 w-3.5" />
          <span>{t.archDetails}</span>
        </button>
      </div>
    </article>
  );
}
