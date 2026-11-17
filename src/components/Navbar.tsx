import { Command, Moon, Sparkles, Sun } from 'lucide-react';
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
    <header className="sticky top-0 z-40 h-16 border-b border-indigo-100/80 bg-white/85 backdrop-blur-xl dark:border-indigo-500/15 dark:bg-[#0E1322]/85">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Left: Gemini Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2.5 text-left"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-transform duration-200 group-hover:scale-105">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white sm:text-base">
                  Phạm Ngọc Huân
                </span>
                <span className="hidden rounded-full border border-indigo-200/80 bg-indigo-50/90 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700 dark:border-indigo-400/25 dark:bg-indigo-500/15 dark:text-indigo-300 sm:inline-block">
                  {t.badge}
                </span>
              </div>
              <div className="hidden text-[11px] font-medium text-slate-500 dark:text-slate-400 md:block">
                AI/NLP Researcher &amp; Full-Stack Engineer
              </div>
            </div>
          </button>
        </div>

        {/* Center: Smooth Scroll Navigation Pills */}
        {viewMode === 'portfolio' && (
          <nav className="hidden items-center gap-1 rounded-2xl border border-indigo-100/80 bg-slate-50/80 p-1 dark:border-indigo-500/15 dark:bg-[#131B2E]/80 lg:flex">
            <button
              type="button"
              onClick={() => scrollToSection('projects')}
              className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-indigo-600 hover:shadow-sm dark:text-slate-300 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300"
            >
              {t.projects}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('research')}
              className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-indigo-600 hover:shadow-sm dark:text-slate-300 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300"
            >
              {t.research}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('skills')}
              className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-indigo-600 hover:shadow-sm dark:text-slate-300 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300"
            >
              {t.skills}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-indigo-600 hover:shadow-sm dark:text-slate-300 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300"
            >
              {t.contact}
            </button>
          </nav>
        )}

        {/* Right: Segmented Mode Control + ⌘K + VI|EN + Theme */}
        <div className="flex items-center gap-2">
          {/* 1. Segmented Control: [ Portfolio | Dev Launcher ] */}
          <div className="inline-flex items-center rounded-xl border border-indigo-100 bg-slate-100/90 p-1 dark:border-indigo-500/20 dark:bg-[#131B2E]">
            <button
              type="button"
              onClick={() => onChangeViewMode('portfolio')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                viewMode === 'portfolio'
                  ? 'gemini-btn-primary'
                  : 'text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300'
              }`}
            >
              {t.portfolioMode}
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode('launcher')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                viewMode === 'launcher'
                  ? 'gemini-btn-primary'
                  : 'text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300'
              }`}
            >
              {t.launcherMode}
            </button>
          </div>

          {/* 2. Quick Search Button: Ctrl+K */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            title={t.searchTitle}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-indigo-100 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-indigo-500/20 dark:bg-[#131B2E] dark:text-slate-300 dark:hover:border-indigo-400/40 dark:hover:text-indigo-300"
          >
            <Command className="h-3.5 w-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Ctrl+K</span>
          </button>

          {/* 3. Language Toggle: VI | EN */}
          <div
            className="inline-flex h-9 items-center rounded-xl border border-indigo-100 bg-white p-1 text-xs font-bold shadow-sm dark:border-indigo-500/20 dark:bg-[#131B2E]"
            role="group"
            aria-label="Language Switcher"
          >
            <button
              type="button"
              onClick={() => onChangeLang('vi')}
              className={`rounded-lg px-2 py-0.5 transition ${
                lang === 'vi'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300'
              }`}
            >
              VI
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('en')}
              className={`rounded-lg px-2 py-0.5 transition ${
                lang === 'en'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300'
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-100 bg-white text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-indigo-500/20 dark:bg-[#131B2E] dark:text-slate-300 dark:hover:border-indigo-400/40"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
