import {
  Activity,
  Check,
  Copy,
  FileText,
  FlaskConical,
  Github,
  Layers,
  Mail,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { PROFILE_CONFIG } from '../data/profileConfig';

interface BentoHeroProps {
  visibleProjectsCount: number;
  githubRepoCount: number;
  liveServersCount: number;
  uniqueTechCount: number;
  onCopyEmail: () => void;
  onOpenResume: () => void;
}

export function BentoHero({
  visibleProjectsCount,
  githubRepoCount,
  liveServersCount,
  uniqueTechCount,
  onCopyEmail,
  onOpenResume,
}: BentoHeroProps) {
  const [copied, setCopied] = useState(false);

  const handleEmailClick = () => {
    onCopyEmail();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="animate-fade-up grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* Ô 1: Profile Card (7 cols) */}
      <div className="bento-card-hover relative overflow-hidden p-6 sm:p-7 lg:col-span-7">
        {/* Subtle Linear/Vercel radial highlight */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/15" />
        <div className="pointer-events-none absolute -bottom-24 left-12 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                {PROFILE_CONFIG.availability}
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <MapPin className="h-3.5 w-3.5" />
                {PROFILE_CONFIG.location}
              </span>
            </div>

            <div className="mt-5 flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 text-lg font-extrabold text-white shadow-md sm:h-16 sm:w-16 sm:text-xl">
                PH
              </div>
              <div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                    {PROFILE_CONFIG.fullName}
                  </h1>
                  <span className="font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400 sm:text-sm">
                    {PROFILE_CONFIG.handle}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-zinc-700 dark:text-zinc-200 sm:text-base">
                  {PROFILE_CONFIG.role}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {PROFILE_CONFIG.major} · {PROFILE_CONFIG.university}
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-[15px]">
              {PROFILE_CONFIG.bio}
            </p>
          </div>

          {/* Quick Contact Actions */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <a
              href={PROFILE_CONFIG.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>

            <button
              type="button"
              onClick={handleEmailClick}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:border-white/20 dark:hover:bg-white/[0.08]"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Đã copy Email
                </>
              ) : (
                <>
                  <Mail className="h-3.5 w-3.5 text-indigo-500" />
                  Copy Email
                  <Copy className="h-3 w-3 opacity-60" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenResume}
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-500/20 dark:border-indigo-400/25 dark:bg-indigo-500/15 dark:text-indigo-300"
            >
              <FileText className="h-3.5 w-3.5" />
              CV / Resume
            </button>
          </div>
        </div>
      </div>

      {/* Ô 2: Tech Arsenal (5 cols) */}
      <div className="bento-card-hover p-6 lg:col-span-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-500" />
            <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
              Tech Arsenal
            </h2>
          </div>
          <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
            Full-Stack · AI/ML
          </span>
        </div>

        <div className="mt-4 space-y-3.5">
          {PROFILE_CONFIG.techArsenal.map((group) => (
            <div key={group.id}>
              <div className={`mb-1.5 text-[11px] font-semibold uppercase tracking-wider ${group.accent}`}>
                {group.label}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-zinc-200/80 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] font-medium text-zinc-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ô 3: Nghiên cứu & Hoạt động nổi bật (8 cols) */}
      <div className="bento-card-hover p-6 lg:col-span-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
              Current Focus — Nghiên cứu &amp; Hoạt động nổi bật
            </h2>
          </div>
          <span className="hidden font-mono text-[11px] text-zinc-500 dark:text-zinc-400 sm:inline">
            2026 – 2027 Roadmap
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PROFILE_CONFIG.currentFocus.map((item, idx) => (
            <div
              key={item.title}
              className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-white/[0.06] dark:bg-white/[0.025]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-300">
                  {idx === 0 ? (
                    <FlaskConical className="h-3 w-3" />
                  ) : (
                    <Users className="h-3 w-3" />
                  )}
                  {item.badge}
                </span>
                <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                  {item.status}
                </span>
              </div>
              <h3 className="mt-2.5 text-sm font-bold text-zinc-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ô 4: Live Stats (4 cols) */}
      <div className="bento-card-hover flex flex-col justify-between p-6 lg:col-span-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500" />
            <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
              Live Telemetry
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            REALTIME
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-3 dark:border-white/[0.06] dark:bg-white/[0.03]">
            <div className="font-mono text-2xl font-bold text-zinc-900 dark:text-white">
              {visibleProjectsCount}
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              Dự án đang hiển thị
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-3 dark:border-white/[0.06] dark:bg-white/[0.03]">
            <div className="font-mono text-2xl font-bold text-zinc-900 dark:text-white">
              {githubRepoCount}
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              GitHub Repos (@Winter101006)
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-3 dark:border-white/[0.06] dark:bg-white/[0.03]">
            <div className="font-mono text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {uniqueTechCount}+
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              Công nghệ sử dụng
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-3 dark:border-white/[0.06] dark:bg-white/[0.03]">
            <div className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {liveServersCount}
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              Web Live Endpoints
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
