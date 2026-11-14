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

  return (
    <section className="animate-fade-up pt-10 pb-14 sm:pt-16 sm:pb-16">
      {/* Main Minimalist Hero (Single Open Column) */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        {/* Clean Avatar: Soft rounded-2xl, subtle ring, no badge overlay */}
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-1 ring-zinc-900/10 dark:ring-white/15 sm:h-24 sm:w-24">
          <img
            src={PROFILE_CONFIG.avatarUrl}
            alt={PROFILE_CONFIG.fullName}
            className="h-full w-full object-cover object-top"
          />
        </div>

        <div className="min-w-0 flex-1">
          {/* Status Badge + Compact Location */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {t.statusBadge}
            </span>

            <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <MapPin className="h-3.5 w-3.5 text-zinc-400" />
              {t.location}
            </span>
          </div>

          {/* Primary Name & Handle */}
          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              {PROFILE_CONFIG.fullName}
            </h1>
            <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
              ({PROFILE_CONFIG.handle})
            </span>
          </div>

          {/* Academic & Engineering Subtitle */}
          <p className="mt-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 sm:text-base">
            {t.roleSubtitle}
          </p>

          {/* 2-3 Line Positioning Summary */}
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-[15px]">
            {t.positioning}
          </p>

          {/* Clear CTA Hierarchy */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {/* Primary Button: Solid high contrast */}
            <button
              type="button"
              onClick={scrollToProjects}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              <span>{t.ctaPrimary}</span>
              <ArrowDown className="h-3.5 w-3.5" />
            </button>

            {/* Secondary Button 1: Thin border Resume PDF */}
            <button
              type="button"
              onClick={onOpenResume}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300/90 bg-transparent px-4 py-2.5 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/[0.06]"
            >
              <FileText className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
              <span>{t.ctaResume}</span>
            </button>

            {/* Secondary Button 2: GitHub */}
            <a
              href={PROFILE_CONFIG.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
            >
              <Github className="h-3.5 w-3.5" />
              <span>{t.ctaGithub}</span>
              <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
                (Winter101006)
              </span>
            </a>

            {/* Secondary Button 2b: 1-Click Copy Email */}
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
              title={PROFILE_CONFIG.email}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
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

      {/* Horizontal 3 Key Highlights Bar immediately below Hero */}
      <div className="mt-12 grid grid-cols-1 gap-6 border-y border-zinc-200/80 py-7 dark:border-white/[0.06] sm:grid-cols-3 sm:gap-8">
        {t.highlights.map((item) => (
          <div key={item.index} className="space-y-1.5">
            <div className="font-mono text-[11px] font-medium tracking-wider text-zinc-400 dark:text-zinc-500">
              {item.index}
            </div>
            <div className="text-sm font-semibold text-zinc-900 dark:text-white">
              {item.title}
            </div>
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
