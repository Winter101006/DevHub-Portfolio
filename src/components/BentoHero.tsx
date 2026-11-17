import {
  ArrowDown,
  Award,
  BrainCircuit,
  Check,
  Cloud,
  Code2,
  Copy,
  FileText,
  Github,
  GraduationCap,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { UI_DICT } from '../data/i18n';
import { PROFILE_CONFIG } from '../data/profileConfig';
import type { Language } from '../types/project';

interface BentoHeroProps {
  lang: Language;
  onCopyEmail: (label: string, value: string) => void;
  onOpenResume: () => void;
}

export function BentoHero({ lang, onCopyEmail, onOpenResume }: BentoHeroProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const t = UI_DICT[lang].hero;

  const handleCopy = (key: string, label: string, value: string) => {
    onCopyEmail(label, value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-6 pb-10 sm:pt-8 sm:pb-12">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-stretch">
        {/* LEFT COLUMN (7 COLS): MAIN PROFILE BENTO CARD */}
        <div className="bento-card relative overflow-hidden p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between">
          {/* Soft Gemini Aurora Ambient Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-blue-500/15 via-indigo-500/15 to-purple-500/15 blur-3xl dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-gradient-to-tr from-sky-400/10 via-cyan-400/10 to-indigo-400/10 blur-3xl" />

          <div className="relative z-10">
            {/* Top Status Pill */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {t.statusBadge}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3 py-1 font-mono text-[11px] font-semibold text-indigo-700 dark:border-indigo-400/25 dark:bg-indigo-500/15 dark:text-indigo-300">
                <Sparkles className="h-3 w-3 text-indigo-500" />
                VNU-HUS · K69
              </span>
            </div>

            {/* Avatar + Name + Subtitle */}
            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl p-0.5 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20 sm:h-28 sm:w-28">
                <img
                  src={PROFILE_CONFIG.avatarUrl}
                  alt={PROFILE_CONFIG.fullName}
                  className="h-full w-full rounded-[22px] object-cover object-top bg-white"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    <span className="gemini-gradient-text">{PROFILE_CONFIG.fullName}</span>
                  </h1>
                  <span className="rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
                    {PROFILE_CONFIG.handle}
                  </span>
                </div>

                <p className="mt-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-300 sm:text-base">
                  {t.roleSubtitle}
                </p>

                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
                  {t.positioning}
                </p>
              </div>
            </div>

            {/* Symmetrical 2x2 Detailed Profile Cards */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Card 1: Education & Student ID */}
              <div className="flex items-start gap-3 rounded-2xl border border-blue-200/70 bg-gradient-to-br from-blue-50/80 to-indigo-50/40 p-3.5 dark:border-blue-500/20 dark:from-blue-500/10 dark:to-indigo-500/5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-300">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                    {lang === 'vi' ? 'Đào tạo Đại học (QĐ 3568)' : 'University & Major'}
                  </div>
                  <div className="mt-0.5 truncate text-xs font-bold text-slate-900 dark:text-white">
                    ĐH Khoa học Tự nhiên – ĐHQGHN
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    MSV: {PROFILE_CONFIG.studentId} · KHMT &amp; TT (K69)
                  </div>
                </div>
              </div>

              {/* Card 2: Club & Scientific Research */}
              <div className="flex items-start gap-3 rounded-2xl border border-purple-200/70 bg-gradient-to-br from-purple-50/80 to-pink-50/40 p-3.5 dark:border-purple-500/20 dark:from-purple-500/10 dark:to-pink-500/5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600/10 text-purple-600 dark:bg-purple-400/15 dark:text-purple-300">
                  <Award className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-purple-700 dark:text-purple-300">
                    {lang === 'vi' ? 'Học thuật & Nghiên cứu' : 'Research & Community'}
                  </div>
                  <div className="mt-0.5 truncate text-xs font-bold text-slate-900 dark:text-white">
                    CLB Toán Tin (HAMIC) · NCKH NLP
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    SemEval-2027 Task 3 (0.87+ F1)
                  </div>
                </div>
              </div>

              {/* Card 3: Emails (1-click Copy) */}
              <button
                type="button"
                onClick={() => handleCopy('email', 'Email', PROFILE_CONFIG.email)}
                className="group flex items-start gap-3 rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 p-3.5 text-left transition hover:border-emerald-300 dark:border-emerald-500/20 dark:from-emerald-500/10 dark:to-teal-500/5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300">
                  {copiedKey === 'email' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                    <span>{lang === 'vi' ? 'Liên hệ trực tiếp (Chạm để chép)' : 'Direct Email (Click to copy)'}</span>
                    <Copy className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                  </div>
                  <div className="mt-0.5 truncate font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {PROFILE_CONFIG.email}
                  </div>
                  <div className="mt-0.5 truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {PROFILE_CONFIG.academicEmail}
                  </div>
                </div>
              </button>

              {/* Card 4: Location & Focus */}
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/80 to-orange-50/40 p-3.5 dark:border-amber-500/20 dark:from-amber-500/10 dark:to-orange-500/5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-600/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                    {lang === 'vi' ? 'Địa chỉ & Định hướng' : 'Location & Focus'}
                  </div>
                  <div className="mt-0.5 truncate text-xs font-bold text-slate-900 dark:text-white">
                    {PROFILE_CONFIG.location}
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    Ngày sinh: {PROFILE_CONFIG.birthDate}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA Hierarchy */}
          <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3 border-t border-indigo-100/80 pt-5 dark:border-indigo-500/15">
            <button
              type="button"
              onClick={scrollToProjects}
              className="gemini-btn-primary inline-flex h-10 items-center gap-2 rounded-xl px-5 text-xs font-bold"
            >
              <span>{t.ctaPrimary}</span>
              <ArrowDown className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={onOpenResume}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-400/30 dark:bg-indigo-500/15 dark:text-indigo-200 dark:hover:bg-indigo-500/25"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>{t.ctaResume}</span>
            </button>

            <a
              href={PROFILE_CONFIG.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-indigo-400/40"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub</span>
              <span className="font-mono text-[11px] text-slate-400">@Winter101006</span>
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN (5 COLS): RESEARCH SPOTLIGHT + 2x2 COLORFUL STATS BENTO */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-5">
          {/* Top Right Card: SemEval-2027 NLP Research Spotlight */}
          <div className="bento-card relative overflow-hidden p-6">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/15 blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/60 bg-violet-500/10 px-3 py-0.5 text-[11px] font-bold text-violet-700 dark:border-violet-400/30 dark:bg-violet-500/20 dark:text-violet-300">
                  <BrainCircuit className="h-3.5 w-3.5" />
                  {lang === 'vi' ? 'Điểm nhấn Nghiên cứu Khoa học' : 'Featured NLP Research'}
                </span>
                <span className="rounded-lg bg-emerald-500/15 px-2.5 py-0.5 font-mono text-xs font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
                  0.87+ F1
                </span>
              </div>

              <h2 className="mt-3 text-base font-extrabold text-slate-900 dark:text-white sm:text-lg">
                SemEval-2027 Task 3 · Lexical Semantic Change
              </h2>

              <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {lang === 'vi'
                  ? 'Phát hiện sự biến đổi ngữ nghĩa của từ vựng qua các giai đoạn lịch sử tiếng Thụy Điển bằng biểu diễn ngữ cảnh đa tầng BGE-M3 và thuật toán truyền nhãn đồ thị (Graph Label Propagation).'
                  : 'Detecting diachronic lexical semantic shift across historical Swedish corpora using multi-layer BGE-M3 embeddings and Graph Label Propagation.'}
              </p>

              {/* Pipeline Steps */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                {[
                  'Swedish Corpora',
                  'BGE-M3 Layer Fusion',
                  'Similarity Graph',
                  'Label Propagation',
                  'LOLO Cross-Val',
                ].map((step) => (
                  <span
                    key={step}
                    className="rounded-lg border border-indigo-200/70 bg-indigo-50/70 px-2.5 py-1 font-mono text-[10px] font-semibold text-indigo-700 dark:border-indigo-400/25 dark:bg-indigo-500/15 dark:text-indigo-200"
                  >
                    {step}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-indigo-100/70 pt-3 text-[11px] text-slate-500 dark:border-indigo-500/15 dark:text-slate-400">
                <span>GVHD: Cô Hà Mỹ Linh · Mentor: Anh Cao Hải An</span>
                <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                  VNU-HUS
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Right Card: Symmetrical 2x2 Gemini Metric Cards */}
          <div className="grid flex-1 grid-cols-2 gap-4">
            <div className="bento-card flex flex-col justify-between p-5 border-blue-200/80 dark:border-blue-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {lang === 'vi' ? 'Dự án Trọng điểm' : 'Core Systems'}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-300">
                  <Code2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 font-mono text-2xl font-extrabold tabular-nums text-blue-600 dark:text-blue-400">
                7 Hệ thống
              </div>
              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                AI/NLP · Full-Stack · 3D Web
              </div>
            </div>

            <div className="bento-card flex flex-col justify-between p-5 border-emerald-200/80 dark:border-emerald-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {lang === 'vi' ? 'Web Chạy Thật' : 'Live Production'}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300">
                  <Cloud className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 font-mono text-2xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400">
                6 Cloud Apps
              </div>
              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Vercel · Render · Neon DB
              </div>
            </div>

            <div className="bento-card flex flex-col justify-between p-5 border-purple-200/80 dark:border-purple-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {lang === 'vi' ? 'Điểm Học kỳ 4' : 'Semester 4 GPA'}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-400/15 dark:text-purple-300">
                  <GraduationCap className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 font-mono text-2xl font-extrabold tabular-nums text-purple-600 dark:text-purple-400">
                3.48 / 4.0
              </div>
              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                71 / 129 tín chỉ tích lũy
              </div>
            </div>

            <div className="bento-card flex flex-col justify-between p-5 border-amber-200/80 dark:border-amber-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {lang === 'vi' ? 'Công nghệ' : 'Tech Stack'}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 font-mono text-2xl font-extrabold tabular-nums text-amber-600 dark:text-amber-400">
                18+ Tools
              </div>
              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                PyTorch · Spring · FastAPI
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
