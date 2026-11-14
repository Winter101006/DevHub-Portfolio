import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { localizeProject, UI_DICT } from '../data/i18n';
import type {
  DevHubProject,
  FilterTab,
  Language,
  ServerHealthRecord,
} from '../types/project';
import { matchesSearchQuery } from '../utils/text';
import { ProjectCard } from './ProjectCard';

interface ProjectCommandCenterProps {
  projects: DevHubProject[];
  lang: Language;
  activeTab: FilterTab;
  onSelectTab: (tab: FilterTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  healthMap: Record<string, ServerHealthRecord>;
  onPingServer: (project: DevHubProject) => void;
  onOpenDetail: (project: DevHubProject) => void;
}

export function ProjectCommandCenter({
  projects,
  lang,
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  healthMap,
  onPingServer,
  onOpenDetail,
}: ProjectCommandCenterProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const t = UI_DICT[lang].projects;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const localizedProjects = useMemo(
    () =>
      projects
        .filter((p) => !p.hidden)
        .map((p) => localizeProject(p, lang)),
    [projects, lang]
  );

  const counts = useMemo(() => {
    const map: Record<FilterTab, number> = {
      all: localizedProjects.length,
      'ai-ds': 0,
      'study-life': 0,
      'game-creative': 0,
      others: 0,
    };
    for (const p of localizedProjects) {
      map[p.category] += 1;
    }
    return map;
  }, [localizedProjects]);

  const filteredProjects = useMemo(() => {
    return localizedProjects.filter((p) => {
      if (activeTab !== 'all' && p.category !== activeTab) {
        return false;
      }
      return matchesSearchQuery(searchQuery, [
        p.title,
        p.repoName,
        p.tagline,
        p.overview,
        p.category,
        ...p.techStack,
      ]);
    });
  }, [localizedProjects, activeTab, searchQuery]);

  const filterButtons = useMemo(() => {
    const base: Array<{ id: FilterTab; label: string }> = [
      { id: 'all', label: t.filters.all },
      { id: 'ai-ds', label: t.filters['ai-ds'] },
      { id: 'study-life', label: t.filters['study-life'] },
      { id: 'game-creative', label: t.filters['game-creative'] },
    ];
    if (counts.others > 0) {
      base.push({ id: 'others', label: t.filters.others });
    }
    return base;
  }, [t.filters, counts.others]);

  return (
    <section id="projects" className="scroll-mt-20 py-14 sm:py-16">
      {/* Section Header */}
      <div className="max-w-2xl">
        <div className="font-mono text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          {t.eyebrow}
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          {t.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {t.subtitle}
        </p>
      </div>

      {/* Filter Bar: Category Pills + Search Input */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {filterButtons.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                    : 'border border-zinc-200/80 bg-white/60 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-white/[0.08] dark:bg-white/[0.02] dark:text-zinc-400 dark:hover:border-white/15 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`font-mono text-[10px] ${
                    active
                      ? 'text-zinc-300 dark:text-zinc-600'
                      : 'text-zinc-400 dark:text-zinc-500'
                  }`}
                >
                  {counts[tab.id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Minimal Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-lg border border-zinc-200/90 bg-white/70 py-1.5 pl-8 pr-7 text-xs text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-400 dark:border-white/[0.08] dark:bg-white/[0.02] dark:text-white dark:placeholder-zinc-500 dark:focus:border-white/25"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2-Column Case Study Cards Grid */}
      {filteredProjects.length === 0 ? (
        <div className="mt-8 rounded-xl border border-zinc-200/80 bg-white/40 px-6 py-14 text-center dark:border-white/[0.07] dark:bg-white/[0.01]">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            {t.emptyTitle}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {t.emptyDesc}
          </p>
          <button
            type="button"
            onClick={() => {
              onSelectTab('all');
              onSearchChange('');
            }}
            className="mt-4 rounded-lg border border-zinc-300 px-3.5 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/15 dark:text-zinc-300 dark:hover:bg-white/[0.05]"
          >
            {t.resetBtn}
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              lang={lang}
              health={healthMap[project.id]}
              onPingServer={onPingServer}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      )}
    </section>
  );
}
