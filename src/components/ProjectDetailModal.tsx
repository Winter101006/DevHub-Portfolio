import {
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Edit3,
  Github,
  Layers,
  Pin,
  RefreshCw,
  X,
} from 'lucide-react';
import { useEffect } from 'react';
import { CATEGORY_MAP } from '../data/projectsConfig';
import type { DevHubProject, ServerHealthRecord } from '../types/project';
import { formatRelativeDate } from '../utils/text';
import { ProjectIcon, ServerStatusPill } from './ProjectIcon';

interface ProjectDetailModalProps {
  project: DevHubProject | null;
  health?: ServerHealthRecord;
  onClose: () => void;
  onPingServer: (project: DevHubProject) => void;
  onEditProject: (project: DevHubProject) => void;
}

export function ProjectDetailModal({
  project,
  health,
  onClose,
  onPingServer,
  onEditProject,
}: ProjectDetailModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const category = CATEGORY_MAP[project.category];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="animate-scale-in relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-white/15 dark:bg-obsidian-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200/80 px-6 py-5 dark:border-white/[0.08]">
          <div className="flex items-start gap-4">
            <ProjectIcon
              icon={project.icon}
              accentColor={project.accentColor}
              size="lg"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${category.badgeClass}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${category.dotClass}`} />
                  {category.label}
                </span>
                {project.pinned && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-300">
                    <Pin className="h-2.5 w-2.5" />
                    Nổi bật
                  </span>
                )}
                {project.updatedAt && (
                  <span className="font-mono text-[11px] text-zinc-400">
                    Cập nhật: {formatRelativeDate(project.updatedAt)}
                  </span>
                )}
              </div>
              <h2 className="mt-2 text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
                {project.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Đóng chi tiết dự án"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {/* Live Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-3.5 dark:border-white/[0.08] dark:bg-white/[0.03]">
            <div className="flex flex-wrap items-center gap-2.5">
              <ServerStatusPill
                project={project}
                health={health}
                onPing={onPingServer}
              />
              {project.liveUrl && (
                <span className="truncate font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                  {project.liveUrl}
                </span>
              )}
            </div>
            {project.liveUrl && (
              <button
                type="button"
                onClick={() => onPingServer(project)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-200"
              >
                <RefreshCw className="h-3 w-3" />
                Ping / Đánh thức
              </button>
            )}
          </div>

          {/* Tầng 1: Tagline */}
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 dark:border-indigo-400/20 dark:bg-indigo-500/10">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-300">
              1 · Tagline (Tóm tắt 3 giây)
            </div>
            <p className="mt-1.5 text-sm font-semibold leading-relaxed text-zinc-900 dark:text-white sm:text-base">
              {project.tagline}
            </p>
          </div>

          {/* Metrics Grid (if available) */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {project.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-zinc-200/80 bg-zinc-50 p-3 dark:border-white/[0.08] dark:bg-white/[0.03]"
                >
                  <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {metric.label}
                  </div>
                  <div className="mt-1 font-mono text-sm font-bold text-zinc-900 dark:text-white">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tầng 2: Overview */}
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              <Layers className="h-3.5 w-3.5 text-emerald-500" />
              2 · Overview — Bài toán thực tế &amp; Giá trị sử dụng
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {project.overview}
            </p>
          </div>

          {/* Architecture Flow (if available) */}
          {project.architectureSummary && (
            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-950/[0.03] p-4 dark:border-white/[0.08] dark:bg-black/40">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                System Architecture Pipeline
              </div>
              <p className="mt-1.5 font-mono text-xs leading-relaxed text-indigo-700 dark:text-indigo-300">
                {project.architectureSummary}
              </p>
            </div>
          )}

          {/* Tầng 3: Technical Highlights */}
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              <Cpu className="h-3.5 w-3.5 text-violet-500" />
              3 · Technical Highlights — Kiến trúc &amp; Thuật toán nổi bật
            </div>
            <ul className="mt-3 space-y-2.5">
              {project.technicalHighlights.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 rounded-xl border border-zinc-200/70 bg-zinc-50/70 p-3 text-xs leading-relaxed text-zinc-700 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-zinc-300 sm:text-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Công nghệ sử dụng
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-mono text-xs font-medium text-zinc-800 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/80 bg-zinc-50/70 px-6 py-4 dark:border-white/[0.08] dark:bg-obsidian-950/60">
          <button
            type="button"
            onClick={() => onEditProject(project)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-200"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Sửa thông tin
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-100 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.1]"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub Repo
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500"
              >
                Mở Web Live
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
