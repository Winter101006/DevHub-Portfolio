import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Edit3,
  Github,
  RefreshCw,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCategoryLabel, localizeProject, UI_DICT } from '../data/i18n';
import type { DevHubProject, Language, ServerHealthRecord } from '../types/project';
import { ServerStatusPill } from './ProjectIcon';

interface ProjectDetailModalProps {
  project: DevHubProject | null;
  lang: Language;
  health?: ServerHealthRecord;
  onClose: () => void;
  onPingServer: (project: DevHubProject) => void;
  onEditProject: (project: DevHubProject) => void;
}

export function ProjectDetailModal({
  project,
  lang,
  health,
  onClose,
  onPingServer,
  onEditProject,
}: ProjectDetailModalProps) {
  const [copiedSummary, setCopiedSummary] = useState(false);

  useEffect(() => {
    if (!project) return;
    setCopiedSummary(false);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const localized = localizeProject(project, lang);
  const t = UI_DICT[lang].drawer;
  const categoryLabel = getCategoryLabel(localized.category, lang);

  const handleCopySummary = async () => {
    const lines = [
      `${localized.title} (${localized.year})`,
      localized.tagline,
      localized.liveUrl ? `Live: ${localized.liveUrl}` : '',
      localized.githubUrl ? `GitHub: ${localized.githubUrl}` : '',
      localized.architectureSummary ? `Architecture: ${localized.architectureSummary}` : '',
      `Stack: ${localized.techStack.join(', ')}`,
    ].filter(Boolean);

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Slide-over Drawer Panel */}
      <div
        className="flex h-full w-full max-w-2xl flex-col border-l border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#09090B]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200/80 px-6 py-5 dark:border-white/[0.07]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] text-zinc-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                {categoryLabel}
              </span>
              <span className="font-mono text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
                {localized.year}
              </span>
              <ServerStatusPill
                project={localized}
                health={health}
                onPing={onPingServer}
                lang={lang}
              />
            </div>

            <h2 className="mt-2.5 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              {localized.title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200/90 bg-white px-2.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:bg-white/[0.07]"
              title={
                lang === 'vi'
                  ? 'Sao chép thông tin tóm tắt dự án'
                  : 'Copy project technical summary'
              }
            >
              {copiedSummary ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{lang === 'vi' ? 'Đã chép' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>{lang === 'vi' ? 'Chép tóm tắt' : 'Copy specs'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label={t.close}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {/* Live Endpoint Banner */}
          {localized.liveUrl && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50 px-4 py-3 dark:border-white/[0.07] dark:bg-white/[0.02]">
              <a
                href={localized.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="truncate font-mono text-xs text-zinc-700 hover:underline dark:text-zinc-300"
              >
                {localized.liveUrl}
              </a>
              <button
                type="button"
                onClick={() => onPingServer(project)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300"
              >
                <RefreshCw className="h-3 w-3" />
                {t.pingBtn}
              </button>
            </div>
          )}

          {/* Symmetrical 4-Column Metrics Row */}
          {localized.metrics && localized.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {localized.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-3 dark:border-white/[0.07] dark:bg-white/[0.02]"
                >
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {metric.label}
                  </div>
                  <div className="mt-1 font-mono text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 01 · Tagline */}
          <div>
            <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {lang === 'vi' ? '01 · Tóm tắt định vị' : '01 · Executive summary'}
            </div>
            <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-900 dark:text-zinc-100 sm:text-base">
              {localized.tagline}
            </p>
          </div>

          {/* 02 · Overview */}
          <div>
            <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {lang === 'vi'
                ? '02 · Bài toán & giải pháp thực tế'
                : '02 · Problem & real-world solution'}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {localized.overview}
            </p>
          </div>

          {/* 03 · Architecture Flow */}
          {localized.architectureSummary && (
            <div>
              <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {lang === 'vi'
                  ? '03 · Luồng kiến trúc hệ thống (Data & System Pipeline)'
                  : '03 · System architecture & data pipeline'}
              </div>
              <div className="mt-2 rounded-xl border border-zinc-200/80 bg-zinc-50 p-4 font-mono text-xs leading-relaxed text-zinc-800 dark:border-white/[0.07] dark:bg-white/[0.02] dark:text-zinc-200">
                {localized.architectureSummary}
              </div>
            </div>
          )}

          {/* 04 · Technical Highlights */}
          <div>
            <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {lang === 'vi'
                ? '04 · Điểm nhấn kỹ thuật & thuật toán'
                : '04 · Technical highlights & algorithms'}
            </div>
            <ul className="mt-3 space-y-2.5">
              {localized.technicalHighlights.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 05 · Tech Stack */}
          <div>
            <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {lang === 'vi' ? '05 · Công nghệ sử dụng' : '05 · Technology stack'}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {localized.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-zinc-200/80 bg-zinc-100/80 px-2.5 py-1 font-mono text-xs text-zinc-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/80 bg-zinc-50/80 px-6 py-4 dark:border-white/[0.07] dark:bg-[#09090B]">
          <button
            type="button"
            onClick={() => onEditProject(project)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>{t.editBtn}</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            {localized.githubUrl && (
              <a
                href={localized.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 text-xs font-medium text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
              >
                <Github className="h-3.5 w-3.5" />
                <span>{t.githubBtn}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
            {localized.liveUrl && (
              <a
                href={localized.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              >
                <span>{t.liveBtn}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
