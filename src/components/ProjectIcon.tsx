import {
  Activity,
  Brain,
  Code2,
  FlaskConical,
  Gamepad2,
  Globe,
  GraduationCap,
  Hash,
  HeartPulse,
  Loader2,
  MapPin,
  Server,
  Sparkles,
  Timer,
  Wallet,
} from 'lucide-react';
import type { DevHubProject, ServerHealthRecord } from '../types/project';

const ACCENT_MAP: Record<string, string> = {
  pink: 'bg-pink-500/10 text-pink-600 border-pink-500/20 dark:bg-pink-500/15 dark:text-pink-300 dark:border-pink-400/25',
  indigo:
    'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-400/25',
  emerald:
    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-400/25',
  violet:
    'bg-violet-500/10 text-violet-600 border-violet-500/20 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-400/25',
  cyan: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-400/25',
  amber:
    'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-400/25',
  rose: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-400/25',
  sky: 'bg-sky-500/10 text-sky-600 border-sky-500/20 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-400/25',
  teal: 'bg-teal-500/10 text-teal-600 border-teal-500/20 dark:bg-teal-500/15 dark:text-teal-300 dark:border-teal-400/25',
  zinc: 'bg-zinc-500/10 text-zinc-700 border-zinc-500/20 dark:bg-zinc-500/15 dark:text-zinc-300 dark:border-zinc-400/25',
};

export function ProjectIcon({
  icon,
  accentColor = 'indigo',
  size = 'md',
}: {
  icon: string;
  accentColor?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const boxSize =
    size === 'sm'
      ? 'h-8 w-8 rounded-lg'
      : size === 'lg'
        ? 'h-14 w-14 rounded-2xl'
        : 'h-10 w-10 rounded-xl';
  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';
  const tone = ACCENT_MAP[accentColor] || ACCENT_MAP.indigo;

  const renderGlyph = () => {
    switch (icon) {
      case 'gamepad':
        return <Gamepad2 className={iconSize} />;
      case 'graduation':
        return <GraduationCap className={iconSize} />;
      case 'wallet':
        return <Wallet className={iconSize} />;
      case 'brain':
        return <Brain className={iconSize} />;
      case 'map':
        return <MapPin className={iconSize} />;
      case 'flask':
        return <FlaskConical className={iconSize} />;
      case 'heart':
        return <HeartPulse className={iconSize} />;
      case 'timer':
        return <Timer className={iconSize} />;
      case 'hash':
        return <Hash className={iconSize} />;
      case 'server':
        return <Server className={iconSize} />;
      case 'globe':
        return <Globe className={iconSize} />;
      case 'sparkles':
        return <Sparkles className={iconSize} />;
      default:
        return <Code2 className={iconSize} />;
    }
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center border ${boxSize} ${tone}`}
    >
      {renderGlyph()}
    </div>
  );
}

export function ServerStatusPill({
  project,
  health,
  onPing,
  compact = false,
}: {
  project: DevHubProject;
  health?: ServerHealthRecord;
  onPing?: (project: DevHubProject) => void;
  compact?: boolean;
}) {
  if (!project.liveUrl) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-100/80 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400"
        title="Dự án chạy cục bộ / Notebook / Nghiên cứu"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
        {compact ? 'Local' : project.serverType === 'streamlit' ? 'Streamlit / Notebook' : 'Repo / Research'}
      </span>
    );
  }

  const state =
    health?.state ??
    (project.serverType === 'render' && !project.keepAlive ? 'cold-start' : 'online');

  if (state === 'checking' || state === 'waking') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/25 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-medium text-sky-600 dark:text-sky-300">
        <Loader2 className="h-3 w-3 animate-spin" />
        {compact ? 'Đang đánh thức...' : health?.message || 'Đang đánh thức server...'}
      </span>
    );
  }

  if (state === 'cold-start') {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPing?.(project);
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-700 transition hover:bg-amber-500/20 dark:text-amber-300"
        title="Server Render có thể đang sleep sau 15 phút không dùng — Bấm để gửi tín hiệu đánh thức"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
        </span>
        {compact ? 'Cold Start · Wake' : 'Cold Start (Render - Click để đánh thức)'}
      </button>
    );
  }

  if (state === 'unreachable') {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPing?.(project);
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-medium text-rose-600 transition hover:bg-rose-500/20 dark:text-rose-300"
        title="Bấm để kiểm tra lại kết nối"
      >
        <Activity className="h-3 w-3" />
        {compact ? 'Retry Ping' : 'Chưa phản hồi (Thử lại)'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onPing?.(project);
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 transition hover:bg-emerald-500/15 dark:text-emerald-300"
      title="Bấm để đo lại độ trễ phản hồi thực tế"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      {compact
        ? health?.latencyMs
          ? `Online · ${health.latencyMs}ms`
          : 'Online'
        : health?.message || 'Online (Vercel / Fast)'}
    </button>
  );
}
