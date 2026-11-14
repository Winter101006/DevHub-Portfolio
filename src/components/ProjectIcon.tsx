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
import { UI_DICT } from '../data/i18n';
import type { DevHubProject, Language, ServerHealthRecord } from '../types/project';

const ACCENT_MAP: Record<string, string> = {
  pink: 'bg-pink-500/10 text-pink-600 border-pink-500/20 dark:bg-pink-500/10 dark:text-pink-300 dark:border-pink-400/20',
  indigo:
    'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-400/20',
  emerald:
    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-400/20',
  violet:
    'bg-violet-500/10 text-violet-600 border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-400/20',
  cyan: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-400/20',
  amber:
    'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-400/20',
  rose: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-400/20',
  sky: 'bg-sky-500/10 text-sky-600 border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-400/20',
  teal: 'bg-teal-500/10 text-teal-600 border-teal-500/20 dark:bg-teal-500/10 dark:text-teal-300 dark:border-teal-400/20',
  zinc: 'bg-zinc-500/10 text-zinc-700 border-zinc-500/20 dark:bg-zinc-500/10 dark:text-zinc-300 dark:border-zinc-400/20',
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
        ? 'h-12 w-12 rounded-xl'
        : 'h-9 w-9 rounded-lg';
  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
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
    <div className={`flex shrink-0 items-center justify-center border ${boxSize} ${tone}`}>
      {renderGlyph()}
    </div>
  );
}

export function ServerStatusPill({
  project,
  health,
  onPing,
  lang = 'vi',
  compact = false,
}: {
  project: DevHubProject;
  health?: ServerHealthRecord;
  onPing?: (project: DevHubProject) => void;
  lang?: Language;
  compact?: boolean;
}) {
  const t = UI_DICT[lang].projects;

  if (!project.liveUrl) {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
        {compact ? 'Repo' : t.statusResearch}
      </span>
    );
  }

  const state =
    health?.state ??
    (project.serverType === 'render' && !project.keepAlive ? 'cold-start' : 'online');

  if (state === 'checking' || state === 'waking') {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-sky-600 dark:text-sky-400">
        <Loader2 className="h-3 w-3 animate-spin" />
        {t.statusWaking}
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
        className="inline-flex items-center gap-1.5 font-mono text-[11px] text-amber-600 transition hover:text-amber-500 dark:text-amber-400"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        {compact ? 'Cold Start' : t.statusCold}
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
        className="inline-flex items-center gap-1.5 font-mono text-[11px] text-rose-600 dark:text-rose-400"
      >
        <Activity className="h-3 w-3" />
        Retry
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
      className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-emerald-600 transition hover:opacity-80 dark:text-emerald-400"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {health?.latencyMs ? `${t.statusLive} · ${health.latencyMs}ms` : t.statusLive}
    </button>
  );
}
