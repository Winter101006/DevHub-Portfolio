import {
  Command,
  LayoutGrid,
  Moon,
  RefreshCw,
  Rocket,
  Settings2,
  Sun,
  Terminal,
} from 'lucide-react';
import type { SyncSource } from '../hooks/useGitHubRepos';
import type { ViewMode } from '../types/project';

interface NavbarProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenCommandPalette: () => void;
  onOpenAdmin: () => void;
  syncingGitHub: boolean;
  syncSource: SyncSource;
  onRefreshGitHub: () => void;
  hasLocalEdits: boolean;
}

export function Navbar({
  viewMode,
  onChangeViewMode,
  theme,
  onToggleTheme,
  onOpenCommandPalette,
  onOpenAdmin,
  syncingGitHub,
  syncSource,
  onRefreshGitHub,
  hasLocalEdits,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl dark:border-white/[0.08] dark:bg-obsidian-950/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/20 via-violet-500/15 to-cyan-500/20 text-indigo-600 shadow-sm dark:text-indigo-300">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white sm:text-base">
                Huân&apos;s DevHub
              </span>
              <span className="hidden rounded-md border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-300 sm:inline-block">
                VNU-HUS K69
              </span>
            </div>
            <p className="hidden text-[11px] text-zinc-500 dark:text-zinc-400 sm:block">
              Personal Project Launcher &amp; Engineering Portfolio
            </p>
          </div>
        </div>

        {/* Center Mode Switcher */}
        <div className="order-3 flex w-full items-center justify-center sm:order-2 sm:w-auto">
          <div className="inline-flex w-full rounded-xl border border-zinc-200/90 bg-zinc-100/90 p-1 dark:border-white/10 dark:bg-white/[0.04] sm:w-auto">
            <button
              type="button"
              onClick={() => onChangeViewMode('portfolio')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition sm:flex-initial ${
                viewMode === 'portfolio'
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Portfolio Mode
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode('launcher')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition sm:flex-initial ${
                viewMode === 'launcher'
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <Rocket className="h-3.5 w-3.5" />
              Launcher Mode
            </button>
          </div>
        </div>

        {/* Right Utility Controls */}
        <div className="order-2 flex items-center gap-2 sm:order-3">
          {/* Command Palette Trigger */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:bg-white/[0.08]"
            title="Mở Command Palette (Ctrl + K)"
          >
            <Command className="h-3.5 w-3.5 text-indigo-500" />
            <span className="hidden md:inline">Tìm nhanh</span>
            <kbd className="rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:border-white/15 dark:bg-obsidian-950 dark:text-zinc-400">
              Ctrl K
            </kbd>
          </button>

          {/* GitHub Sync Button */}
          <button
            type="button"
            onClick={onRefreshGitHub}
            disabled={syncingGitHub}
            className="hidden items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-white/20 lg:inline-flex"
            title={`Nguồn GitHub hiện tại: ${
              syncSource === 'live-api'
                ? 'Live API'
                : syncSource === 'cached'
                  ? 'Local Cache'
                  : 'Local Snapshot Fallback'
            } — Bấm để đồng bộ lại`}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${syncingGitHub ? 'animate-spin text-indigo-500' : ''}`}
            />
            <span>
              {syncSource === 'live-api'
                ? 'GitHub Live'
                : syncSource === 'cached'
                  ? 'GitHub Cached'
                  : 'Local Fallback'}
            </span>
          </button>

          {/* Manage Hub Button */}
          <button
            type="button"
            onClick={onOpenAdmin}
            className="relative inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-500/20 dark:border-indigo-400/25 dark:bg-indigo-500/15 dark:text-indigo-300"
            title="Quản lý Ẩn/Hiện & Thêm dự án (Ctrl + Shift + E)"
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Manage Hub</span>
            {hasLocalEdits && (
              <span
                className="h-1.5 w-1.5 rounded-full bg-amber-500"
                title="Có tùy chỉnh cục bộ trong localStorage"
              />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Chuyển đổi Dark / Light Mode"
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:bg-white/[0.08]"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}
