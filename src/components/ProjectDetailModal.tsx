import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  Edit3,
  Github,
  Layers,
  RefreshCw,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCategoryLabel, localizeProject, UI_DICT } from '../data/i18n';
import { CATEGORY_MAP } from '../data/projectsConfig';
import type { DevHubProject, Language, ServerHealthRecord } from '../types/project';
import { ProjectIcon, ServerStatusPill } from './ProjectIcon';

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
  const category = CATEGORY_MAP[localized.category];
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
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Slide-over Drawer Panel */}
      <div
        className="flex h-full w-full max-w-2xl flex-col border-l border-indigo-100 bg-white shadow-2xl dark:border-indigo-500/20 dark:bg-[#0E1322]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-start justify-between gap-4 border-b border-indigo-100/80 px-6 py-5 dark:border-indigo-500/15">
          <div className="flex items-start gap-4">
            <ProjectIcon
              icon={localized.icon}
              accentColor={localized.accentColor}
              size="lg"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${category.badgeClass}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${category.dotClass}`} />
                  {categoryLabel}
                </span>
                <span className="font-mono text-xs font-semibold tabular-nums text-slate-400">
                  {localized.year}
                </span>
                <ServerStatusPill
                  project={localized}
                  health={health}
                  onPing={onPingServer}
                  lang={lang}
                />
              </div>

              <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                {localized.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-500/25 dark:bg-indigo-500/15 dark:text-indigo-300"
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
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
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
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 dark:border-indigo-500/20 dark:bg-indigo-500/10">
              <a
                href={localized.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="truncate font-mono text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-300"
              >
                {localized.liveUrl}
              </a>
              <button
                type="button"
                onClick={() => onPingServer(project)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white px-3 py-1 text-xs font-bold text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-400/30 dark:bg-[#131B2E] dark:text-indigo-200"
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
                  className="rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-indigo-50/60 to-blue-50/30 p-3.5 dark:border-indigo-500/20 dark:from-indigo-500/10 dark:to-blue-500/5"
                >
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {metric.label}
                  </div>
                  <div className="mt-1 font-mono text-sm font-extrabold tabular-nums text-indigo-700 dark:text-indigo-300">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 01 · Tagline */}
          <div className="rounded-2xl border border-indigo-200/70 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/60 p-4 dark:border-indigo-500/20 dark:from-blue-500/10 dark:via-indigo-500/10 dark:to-purple-500/10">
            <div className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-300">
              {lang === 'vi' ? '01 · Tóm tắt định vị' : '01 · Executive summary'}
            </div>
            <p className="mt-1.5 text-sm font-bold leading-relaxed text-slate-900 dark:text-white sm:text-base">
              {localized.tagline}
            </p>
          </div>

          {/* 02 · Overview */}
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-300">
              <Layers className="h-4 w-4 text-emerald-500" />
              <span>
                {lang === 'vi'
                  ? '02 · Bài toán & giải pháp thực tế'
                  : '02 · Problem & real-world solution'}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {localized.overview}
            </p>
          </div>

          {/* 03 · Architecture Flow */}
          {localized.architectureSummary && (
            <div>
              <div className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-300">
                {lang === 'vi'
                  ? '03 · Luồng kiến trúc hệ thống (Data & System Pipeline)'
                  : '03 · System architecture & data pipeline'}
              </div>
              <div className="mt-2 rounded-2xl border border-indigo-100 bg-slate-50 p-4 font-mono text-xs font-semibold leading-relaxed text-indigo-700 dark:border-indigo-500/20 dark:bg-[#131B2E] dark:text-indigo-300">
                {localized.architectureSummary}
              </div>
            </div>
          )}

          {/* 04 · Technical Highlights */}
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-300">
              <Cpu className="h-4 w-4 text-violet-500" />
              <span>
                {lang === 'vi'
                  ? '04 · Điểm nhấn kỹ thuật & thuật toán'
                  : '04 · Technical highlights & algorithms'}
              </span>
            </div>
            <ul className="mt-3 space-y-2.5">
              {localized.technicalHighlights.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 rounded-2xl border border-indigo-100/70 bg-slate-50/70 p-3.5 text-sm leading-relaxed text-slate-700 dark:border-indigo-500/15 dark:bg-[#131B2E]/60 dark:text-slate-200"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 05 · Tech Stack */}
          <div>
            <div className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-300">
              {lang === 'vi' ? '05 · Công nghệ sử dụng' : '05 · Technology stack'}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {localized.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-1 font-mono text-xs font-semibold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/15 dark:text-indigo-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-indigo-100/80 bg-slate-50/80 px-6 py-4 dark:border-indigo-500/15 dark:bg-[#0B0F19]">
          <button
            type="button"
            onClick={() => onEditProject(project)}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
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
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-800 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-white/15 dark:bg-white/[0.05] dark:text-white"
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
                className="gemini-btn-primary inline-flex h-9 items-center gap-1.5 rounded-xl px-4 text-xs font-bold"
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
