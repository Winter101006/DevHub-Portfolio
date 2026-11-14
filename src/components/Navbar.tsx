import { Command, Moon, Sun } from 'lucide-react';
import { UI_DICT } from '../data/i18n';
import type { Language, ViewMode } from '../types/project';

interface NavbarProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  lang: Language;
  onChangeLang: (lang: Language) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenCommandPalette: () => void;
}

export function Navbar({
  viewMode,
  onChangeViewMode,
  lang,
  onChangeLang,
  theme,
  onToggleTheme,
  onOpenCommandPalette,
}: NavbarProps) {
  const t = UI_DICT[lang].nav;

  const scrollToSection = (id: string) => {
    if (viewMode !== 'portfolio') {
      onChangeViewMode('portfolio');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-zinc-200/70 bg-zinc-50/80 backdrop-blur-md dark:border-white/[0.06] dark:bg-[#09090B]/80">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Left: Minimalist Brand */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-mono text-sm font-bold tracking-tight text-zinc-900 transition hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 sm:text-[15px]"
          >
            Huân.dev
          </button>
          <span className="hidden rounded-full border border-zinc-200/90 bg-zinc-100/80 px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400 sm:inline-block">
            {t.badge}
          </span>
        </div>

        {/* Center: Smooth Scroll Navigation Links (Desktop) */}
        {viewMode === 'portfolio' && (
          <nav className="hidden items-center gap-6 md:flex">
            <button
              type="button"
              onClick={() => scrollToSection('projects')}
              className="text-xs font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              {t.projects}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('research')}
              className="text-xs font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              {t.research}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('skills')}
              className="text-xs font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              {t.skills}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="text-xs font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              {t.contact}
            </button>
          </nav>
        )}

        {/* Right: Segmented Mode Control + ⌘K + VI|EN + Theme */}
        <div className="flex items-center gap-2">
          {/* 1. Segmented Control: [ Portfolio | Dev Launcher ] */}
          <div className="inline-flex items-center rounded-lg border border-zinc-200/90 bg-zinc-100/90 p-0.5 dark:border-white/10 dark:bg-white/[0.04]">
            <button
              type="button"
              onClick={() => onChangeViewMode('portfolio')}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                viewMode === 'portfolio'
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {t.portfolioMode}
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode('launcher')}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                viewMode === 'launcher'
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {t.launcherMode}
            </button>
          </div>

          {/* 2. Quick Search Button: ⌘K / Ctrl+K */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            title={t.searchTitle}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200/90 bg-white px-2.5 font-mono text-[11px] font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white"
          >
            <Command className="h-3 w-3 text-zinc-400" />
            <span className="hidden sm:inline">Ctrl+K</span>
          </button>

          {/* 3. Language Toggle: VI | EN */}
          <div
            className="inline-flex h-8 items-center rounded-lg border border-zinc-200/90 bg-white p-0.5 font-mono text-[11px] font-semibold dark:border-white/10 dark:bg-white/[0.03]"
            role="group"
            aria-label="Language Switcher"
          >
            <button
              type="button"
              onClick={() => onChangeLang('vi')}
              className={`rounded px-1.5 py-0.5 transition ${
                lang === 'vi'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              VI
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('en')}
              className={`rounded px-1.5 py-0.5 transition ${
                lang === 'en'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* 4. Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={t.themeToggle}
            title={t.themeToggle}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200/90 bg-white text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white"
          >
            {theme === 'dark' ? (
              <Sun className="h-3.5 w-3.5 text-amber-400" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-zinc-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
