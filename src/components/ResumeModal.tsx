import {
  Award,
  BookOpen,
  ExternalLink,
  Github,
  Mail,
  MapPin,
  Printer,
  X,
} from 'lucide-react';
import { useEffect } from 'react';
import { localizeProject, UI_DICT } from '../data/i18n';
import { PROFILE_CONFIG } from '../data/profileConfig';
import type { DevHubProject, Language } from '../types/project';

interface ResumeModalProps {
  open: boolean;
  lang: Language;
  onClose: () => void;
  featuredProjects: DevHubProject[];
}

export function ResumeModal({
  open,
  lang,
  onClose,
  featuredProjects,
}: ResumeModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const localizedProjects = featuredProjects.map((p) => localizeProject(p, lang));
  const tHero = UI_DICT[lang].hero;
  const tSkills = UI_DICT[lang].skills;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="animate-scale-in flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-white/15 dark:bg-[#09090B]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="no-print flex items-center justify-between border-b border-zinc-200/80 px-6 py-4 dark:border-white/[0.08]">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-bold text-zinc-900 dark:text-white">
              Curriculum Vitae — {PROFILE_CONFIG.fullName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950"
            >
              <Printer className="h-3.5 w-3.5" />
              {lang === 'vi' ? 'In / Lưu PDF' : 'Print / Save PDF'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6 sm:p-8">
          {/* Header with Portrait */}
          <div className="flex flex-col gap-5 border-b border-zinc-200 pb-6 dark:border-white/10 sm:flex-row sm:items-center">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl ring-1 ring-zinc-900/10 dark:ring-white/15">
              <img
                src={PROFILE_CONFIG.avatarUrl}
                alt={PROFILE_CONFIG.fullName}
                className="h-full w-full object-cover object-top"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {PROFILE_CONFIG.fullName}
              </h1>
              <p className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {tHero.roleSubtitle}
              </p>

              <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-zinc-400" />
                  {PROFILE_CONFIG.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-zinc-400" />
                  {PROFILE_CONFIG.academicEmail}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                  {tHero.location}
                </span>
                <a
                  href={PROFILE_CONFIG.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  <Github className="h-3.5 w-3.5" />
                  Winter101006
                </a>
              </div>
            </div>
          </div>

          {/* Education & Research */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/[0.08] dark:bg-white/[0.02]">
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {lang === 'vi' ? 'Học vấn' : 'Education'}
              </h3>
              <p className="mt-1.5 text-sm font-bold text-zinc-900 dark:text-white">
                {lang === 'vi'
                  ? 'Cử nhân Khoa học Máy tính & Thông tin (K69)'
                  : 'B.Sc. in Computer & Information Science (K69)'}
              </p>
              <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-300">
                {lang === 'vi'
                  ? PROFILE_CONFIG.university
                  : 'VNU University of Science (VNU-HUS), Hanoi'}
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {lang === 'vi'
                  ? `MSV: ${PROFILE_CONFIG.studentId} · CLB Toán Tin (HAMIC)`
                  : `ID: ${PROFILE_CONFIG.studentId} · HAMIC Club Member`}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/[0.08] dark:bg-white/[0.02]">
              <h3 className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <Award className="h-3.5 w-3.5 text-amber-500" />
                {lang === 'vi' ? 'Nghiên cứu Khoa học' : 'Scientific Research'}
              </h3>
              <p className="mt-1.5 text-sm font-bold text-zinc-900 dark:text-white">
                SemEval-2027 Task 3 (NLP)
              </p>
              <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-300">
                {lang === 'vi'
                  ? 'Lexical Semantic Change Detection sử dụng BGE-M3 Embeddings & Graph Label Propagation (Task 1a đạt 0.87+ F1-score).'
                  : 'Diachronic Lexical Semantic Change Detection using BGE-M3 Embeddings & Graph Label Propagation (0.87+ F1-score on Task 1a).'}
              </p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {tSkills.title}
            </h3>
            <div className="mt-2.5 space-y-2 text-xs">
              {tSkills.groups.map((group) => (
                <div key={group.title} className="flex flex-wrap gap-1.5">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {group.title}:
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {group.items.join(' · ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlighted Projects */}
          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {lang === 'vi'
                ? `Dự án Kỹ thuật Tiêu biểu (${localizedProjects.length})`
                : `Selected Engineering Projects (${localizedProjects.length})`}
            </h3>
            <div className="mt-3 space-y-3">
              {localizedProjects.slice(0, 7).map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-zinc-200/80 p-3.5 dark:border-white/[0.08]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      {p.title}
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-0.5 text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          Live <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-0.5 text-zinc-500 hover:underline"
                      >
                        GitHub <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                    {p.overview}
                  </p>
                  <p className="mt-1.5 font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                    Stack: {p.techStack.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
