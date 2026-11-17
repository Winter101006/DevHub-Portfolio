import { ArrowDown, Check, Copy, FileText, Github, MapPin } from 'lucide-react';
import { useState } from 'react';
import { UI_DICT } from '../data/i18n';
import { PROFILE_CONFIG } from '../data/profileConfig';
import type { Language } from '../types/project';

interface BentoHeroProps {
  lang: Language;
  onCopyEmail: () => void;
  onOpenResume: () => void;
}

export function BentoHero({ lang, onCopyEmail, onOpenResume }: BentoHeroProps) {
  const [copied, setCopied] = useState(false);
  const t = UI_DICT[lang].hero;

  const handleCopy = () => {
    onCopyEmail();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const highlightFigures =
    lang === 'vi'
      ? [
          {
            index: '01 · Nghiên cứu NLP',
            figure: '0.87+ F1',
            title: 'SemEval-2027 Task 3',
            desc: 'Phát hiện biến đổi ngữ nghĩa từ vựng tiếng Thụy Điển với BGE-M3 & Graph Label Propagation',
          },
          {
            index: '02 · Hệ thống thực tế',
            figure: '7 dự án',
            title: 'Full-Stack, AI & 3D Web',
            desc: 'Vận hành thực tế trên Vercel, Render Cloud và cơ sở dữ liệu Neon PostgreSQL',
          },
          {
            index: '03 · Nền tảng học thuật',
            figure: '3.48 CPA',
            title: 'VNU-HUS K69 & CLB HAMIC',
            desc: 'Khoa học Máy tính & Thông tin (QĐ 3568) · Thành viên CLB Toán Tin (HAMIC)',
          },
        ]
      : [
          {
            index: '01 · NLP Research',
            figure: '0.87+ F1',
            title: 'SemEval-2027 Task 3',
            desc: 'Diachronic Lexical Semantic Change Detection with BGE-M3 & Graph Label Propagation',
          },
          {
            index: '02 · Production Systems',
            figure: '7 projects',
            title: 'Full-Stack, AI & 3D Web',
            desc: 'Deployed across Vercel, Render Cloud, and Neon Serverless PostgreSQL',
          },
          {
            index: '03 · Academic Foundation',
            figure: '3.48 CPA',
            title: 'VNU-HUS K69 & HAMIC Club',
            desc: 'B.Sc. in Computer & Information Science (Decision 3568) · HAMIC Member',
          },
        ];

  return (
    <section className="pt-12 pb-12 sm:pt-16 sm:pb-16">
      {/* Main Hero Row */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        {/* Portrait: Clean 88px/96px rounded-2xl, subtle neutral hairline */}
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-zinc-200/90 bg-zinc-100 dark:border-white/10 dark:bg-zinc-900 sm:h-24 sm:w-24">
          <img
            src={PROFILE_CONFIG.avatarUrl}
            alt={PROFILE_CONFIG.fullName}
            className="h-full w-full object-cover object-top"
          />
        </div>

        <div className="min-w-0 flex-1">
          {/* Status Indicator + Location */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-zinc-200/90 bg-white px-3 py-1 text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {t.statusBadge}
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <MapPin className="h-3.5 w-3.5 text-zinc-400" />
              {t.location}
            </span>
          </div>

          {/* Name & Handle */}
          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
              {PROFILE_CONFIG.fullName}
            </h1>
            <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
              {PROFILE_CONFIG.handle}
            </span>
          </div>

          {/* Role Subtitle */}
          <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300 sm:text-base">
            {t.roleSubtitle}
          </p>

          {/* Positioning Summary */}
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-[15px]">
            {t.positioning}
          </p>

          {/* Action Row: Calm, deliberate hierarchy */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={scrollToProjects}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              <span>{t.ctaPrimary}</span>
              <ArrowDown className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={onOpenResume}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200/90 bg-white px-4 text-xs font-medium text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-200 dark:hover:bg-white/[0.07]"
            >
              <FileText className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
              <span>{t.ctaResume}</span>
            </button>

            <a
              href={PROFILE_CONFIG.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-transparent px-3 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-zinc-200"
            >
              <Github className="h-3.5 w-3.5" />
              <span>{t.ctaGithub}</span>
              <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
                /Winter101006
              </span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-transparent px-3 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-zinc-200"
              title={PROFILE_CONFIG.email}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {t.copiedEmail}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>{t.ctaCopyEmail}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Symmetrical 3-Column Key Highlights Specification Bar */}
      <div className="mt-12 grid grid-cols-1 gap-6 rounded-xl border border-zinc-200/80 bg-white p-6 dark:border-white/[0.07] dark:bg-[#111113] sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-zinc-200/80 sm:p-0 dark:sm:divide-white/[0.07]">
        {highlightFigures.map((item) => (
          <div key={item.index} className="flex flex-col justify-between sm:p-6">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {item.index}
                </span>
                <span className="font-mono text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                  {item.figure}
                </span>
              </div>
              <div className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {item.title}
              </div>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
