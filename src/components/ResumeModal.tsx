import {
  Award,
  BookOpen,
  Calendar,
  ExternalLink,
  Github,
  Mail,
  MapPin,
  Printer,
  X,
} from 'lucide-react';
import { useEffect } from 'react';
import { PROFILE_CONFIG } from '../data/profileConfig';
import type { DevHubProject } from '../types/project';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
  featuredProjects: DevHubProject[];
}

export function ResumeModal({ open, onClose, featuredProjects }: ResumeModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="animate-scale-in flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-white/15 dark:bg-obsidian-900"
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
            >
              <Printer className="h-3.5 w-3.5" />
              In / Lưu PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6 sm:p-8">
          {/* Header with Portrait */}
          <div className="flex flex-col gap-5 border-b border-zinc-200 pb-6 dark:border-white/10 sm:flex-row sm:items-center">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm dark:border-white/15 dark:bg-zinc-800">
              <img
                src={PROFILE_CONFIG.avatarUrl}
                alt={PROFILE_CONFIG.fullName}
                className="h-full w-full object-cover object-top"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                {PROFILE_CONFIG.fullName}
              </h1>
              <p className="mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {PROFILE_CONFIG.role}
              </p>

              <div className="mt-2.5 grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 sm:grid-cols-2">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-indigo-500" />
                  {PROFILE_CONFIG.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-emerald-500" />
                  {PROFILE_CONFIG.academicEmail}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                  {PROFILE_CONFIG.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-500" />
                  {PROFILE_CONFIG.birthDate} ·{' '}
                  <a
                    href={PROFILE_CONFIG.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline dark:text-indigo-300"
                  >
                    <Github className="h-3 w-3" />
                    Winter101006
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* Education & Research */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Học vấn
              </h3>
              <p className="mt-1.5 text-sm font-bold text-zinc-900 dark:text-white">
                Cử nhân Khoa học Máy tính &amp; Thông tin (K69)
              </p>
              <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-300">
                {PROFILE_CONFIG.university}
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                MSV: {PROFILE_CONFIG.studentId} · Thành viên CLB Toán Tin (HAMIC)
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <Award className="h-3.5 w-3.5 text-amber-500" />
                Nghiên cứu Khoa học (NCKH)
              </h3>
              <p className="mt-1.5 text-sm font-bold text-zinc-900 dark:text-white">
                SemEval-2027 Task 3 (NLP)
              </p>
              <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-300">
                Lexical Semantic Change Detection sử dụng BGE-M3 Embeddings &amp; Graph Label Propagation (Task 1a đạt 0.87).
              </p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Kỹ năng Kỹ thuật
            </h3>
            <div className="mt-2.5 space-y-2 text-xs">
              {PROFILE_CONFIG.techArsenal.map((group) => (
                <div key={group.id} className="flex flex-wrap gap-1.5">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {group.label}:
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Dự án Kỹ thuật Tiêu biểu ({featuredProjects.length})
            </h3>
            <div className="mt-3 space-y-3">
              {featuredProjects.slice(0, 6).map((p) => (
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
                    {p.tagline}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
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
