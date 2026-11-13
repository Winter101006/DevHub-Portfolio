import {
  Activity,
  Calendar,
  Check,
  Compass,
  Copy,
  FileText,
  FlaskConical,
  Github,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Send,
  Server,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { PROFILE_CONFIG } from '../data/profileConfig';

interface BentoHeroProps {
  visibleProjectsCount: number;
  githubRepoCount: number;
  liveServersCount: number;
  uniqueTechCount: number;
  onCopyText: (label: string, value: string) => void;
  onOpenResume: () => void;
}

export function BentoHero({
  visibleProjectsCount,
  githubRepoCount,
  liveServersCount,
  uniqueTechCount,
  onCopyText,
  onOpenResume,
}: BentoHeroProps) {
  const [copiedKey, setCopiedKey] = useState<'personal' | 'academic' | null>(null);

  const handleCopyEmail = (key: 'personal' | 'academic', value: string, label: string) => {
    onCopyText(label, value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <section className="animate-fade-up grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* Main Executive Profile Card (8 cols) */}
      <div className="bento-card relative overflow-hidden p-6 sm:p-8 lg:col-span-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/[0.08] blur-3xl dark:bg-indigo-500/[0.14]" />
        <div className="pointer-events-none absolute -bottom-24 left-16 h-56 w-56 rounded-full bg-cyan-500/[0.06] blur-3xl" />

        <div className="relative flex h-full flex-col justify-between gap-6">
          <div>
            {/* Eyebrow & Availability */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-zinc-200/70 pb-4 dark:border-white/[0.07]">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Engineering Portfolio &amp; Project Hub
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                {PROFILE_CONFIG.availability}
              </span>
            </div>

            {/* Identity Row with Real Portrait */}
            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28">
                <div className="h-full w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-md ring-1 ring-black/5 dark:border-white/15 dark:bg-zinc-800 dark:ring-white/10">
                  <img
                    src={PROFILE_CONFIG.avatarUrl}
                    alt={PROFILE_CONFIG.fullName}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <span
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-lg border-2 border-white bg-emerald-500 text-[10px] font-bold text-white shadow-sm dark:border-obsidian-900"
                  title="Verified Profile"
                >
                  ✓
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                    {PROFILE_CONFIG.fullName}
                  </h1>
                  <span className="rounded-md border border-zinc-200 bg-zinc-100/80 px-2 py-0.5 font-mono text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-300">
                    {PROFILE_CONFIG.handle}
                  </span>
                </div>

                <p className="mt-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 sm:text-base">
                  {PROFILE_CONFIG.role}
                </p>

                <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 sm:text-[13px]">
                  <GraduationCap className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                  <span>{PROFILE_CONFIG.headline}</span>
                </p>
              </div>
            </div>

            {/* Executive Summary */}
            <p className="mt-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {PROFILE_CONFIG.bio}
            </p>

            {/* Structured Info Metadata Grid */}
            <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  handleCopyEmail('personal', PROFILE_CONFIG.email, 'Email cá nhân')
                }
                className="group flex items-center justify-between gap-2 rounded-xl border border-zinc-200/80 bg-zinc-50/70 px-3.5 py-2.5 text-left transition hover:border-indigo-500/35 hover:bg-white dark:border-white/[0.07] dark:bg-white/[0.025] dark:hover:border-indigo-400/35 dark:hover:bg-white/[0.05]"
                title="Bấm để sao chép Email cá nhân"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                  <div className="min-w-0">
                    <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                      Email cá nhân
                    </div>
                    <div className="truncate font-mono text-xs font-medium text-zinc-800 dark:text-zinc-200">
                      {PROFILE_CONFIG.email}
                    </div>
                  </div>
                </div>
                {copiedKey === 'personal' ? (
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 shrink-0 text-zinc-400 opacity-60 transition group-hover:text-indigo-500 group-hover:opacity-100" />
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  handleCopyEmail(
                    'academic',
                    PROFILE_CONFIG.academicEmail,
                    'Email ĐHQGHN (HUS)'
                  )
                }
                className="group flex items-center justify-between gap-2 rounded-xl border border-zinc-200/80 bg-zinc-50/70 px-3.5 py-2.5 text-left transition hover:border-indigo-500/35 hover:bg-white dark:border-white/[0.07] dark:bg-white/[0.025] dark:hover:border-indigo-400/35 dark:hover:bg-white/[0.05]"
                title="Bấm để sao chép Email sinh viên VNU-HUS"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <GraduationCap className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  <div className="min-w-0">
                    <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                      Email ĐHQGHN
                    </div>
                    <div className="truncate font-mono text-xs font-medium text-zinc-800 dark:text-zinc-200">
                      {PROFILE_CONFIG.academicEmail}
                    </div>
                  </div>
                </div>
                {copiedKey === 'academic' ? (
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 shrink-0 text-zinc-400 opacity-60 transition group-hover:text-indigo-500 group-hover:opacity-100" />
                )}
              </button>

              <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200/80 bg-zinc-50/70 px-3.5 py-2.5 dark:border-white/[0.07] dark:bg-white/[0.025]">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                <div>
                  <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                    Khu vực
                  </div>
                  <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                    {PROFILE_CONFIG.location}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200/80 bg-zinc-50/70 px-3.5 py-2.5 dark:border-white/[0.07] dark:bg-white/[0.025]">
                <Calendar className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                <div>
                  <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                    Ngày sinh · Khóa học
                  </div>
                  <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                    {PROFILE_CONFIG.birthDate} · K69 KHMT &amp; TT (VNU-HUS)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Primary CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={onOpenResume}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-600 dark:bg-white dark:text-zinc-950 dark:hover:bg-indigo-400 dark:hover:text-white"
            >
              <FileText className="h-3.5 w-3.5" />
              Xem CV / Hồ sơ năng lực
            </button>

            <a
              href={PROFILE_CONFIG.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:border-white/20 dark:hover:bg-white/[0.08]"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub Profile
            </a>

            <a
              href={`mailto:${PROFILE_CONFIG.email}`}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 transition hover:border-indigo-500/35 hover:text-indigo-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-indigo-400/35 dark:hover:text-indigo-300"
            >
              <Send className="h-3.5 w-3.5" />
              Gửi Email ngay
            </a>
          </div>
        </div>
      </div>

      {/* Right Column: Engineering Highlights & Research (4 cols) */}
      <div className="bento-card flex flex-col justify-between p-6 lg:col-span-4">
        <div>
          <div className="flex items-center justify-between border-b border-zinc-200/70 pb-3.5 dark:border-white/[0.07]">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-indigo-500" />
              <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
                Trọng tâm &amp; Nghiên cứu
              </h2>
            </div>
            <span className="font-mono text-[10px] text-zinc-400">2026–2027</span>
          </div>

          <div className="mt-4 space-y-3">
            {PROFILE_CONFIG.currentFocus.map((item, idx) => (
              <div
                key={item.title}
                className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 dark:border-white/[0.06] dark:bg-white/[0.025]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-300">
                    {idx === 0 ? (
                      <FlaskConical className="h-3 w-3" />
                    ) : idx === 1 ? (
                      <Server className="h-3 w-3" />
                    ) : (
                      <Users className="h-3 w-3" />
                    )}
                    {item.badge}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                    {item.status}
                  </span>
                </div>
                <h3 className="mt-2 text-xs font-bold text-zinc-900 dark:text-white sm:text-sm">
                  {item.title}
                </h3>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Left: Tech Arsenal Matrix (8 cols) */}
      <div className="bento-card p-6 lg:col-span-8">
        <div className="flex items-center justify-between border-b border-zinc-200/70 pb-3.5 dark:border-white/[0.07]">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-500" />
            <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
              Tech Arsenal — Công nghệ sử dụng
            </h2>
          </div>
          <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
            End-to-End Stack
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PROFILE_CONFIG.techArsenal.map((group) => (
            <div
              key={group.id}
              className="rounded-xl border border-zinc-200/70 bg-zinc-50/50 p-3.5 dark:border-white/[0.06] dark:bg-white/[0.02]"
            >
              <div
                className={`mb-2.5 text-[11px] font-bold uppercase tracking-wider ${group.accent}`}
              >
                {group.label}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-zinc-200/90 bg-white px-2 py-0.5 font-mono text-[11px] font-medium text-zinc-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Right: Live Telemetry (4 cols) */}
      <div className="bento-card flex flex-col justify-between p-6 lg:col-span-4">
        <div className="flex items-center justify-between border-b border-zinc-200/70 pb-3.5 dark:border-white/[0.07]">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500" />
            <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
              Tổng quan Hệ thống
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            LIVE
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 dark:border-white/[0.06] dark:bg-white/[0.025]">
            <div className="font-mono text-2xl font-bold text-zinc-900 dark:text-white">
              {visibleProjectsCount}
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              Dự án trên Hub
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 dark:border-white/[0.06] dark:bg-white/[0.025]">
            <div className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {liveServersCount}
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              Web Live chạy thật
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 dark:border-white/[0.06] dark:bg-white/[0.025]">
            <div className="font-mono text-2xl font-bold text-zinc-900 dark:text-white">
              {githubRepoCount}
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              GitHub Repos
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 dark:border-white/[0.06] dark:bg-white/[0.025]">
            <div className="font-mono text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {uniqueTechCount}+
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              Công nghệ lõi
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
