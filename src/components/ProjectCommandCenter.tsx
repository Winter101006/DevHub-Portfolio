import {
  ArrowUpRight,
  FolderKanban,
  Github,
  Globe,
  Layers,
  LayoutGrid,
  List,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getCategoryLabel, localizeProject, UI_DICT } from '../data/i18n';
import { CATEGORY_LIST, CATEGORY_MAP } from '../data/projectsConfig';
import type {
  DevHubProject,
  FilterTab,
  Language,
  ServerHealthRecord,
} from '../types/project';
import { matchesSearchQuery } from '../utils/text';
import { ProjectCard } from './ProjectCard';
import { ProjectIcon, ServerStatusPill } from './ProjectIcon';

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
  const [layoutMode, setLayoutMode] = useState<'grid' | 'table'>('grid');
  const [groupByCategory, setGroupByCategory] = useState<boolean>(false);
  const [onlyLive, setOnlyLive] = useState<boolean>(false);
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
      if (onlyLive && !p.liveUrl) return false;
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
  }, [localizedProjects, activeTab, searchQuery, onlyLive]);

  const groupedSections = useMemo(() => {
    return CATEGORY_LIST.map((cat, idx) => ({
      indexLabel: String(idx + 1).padStart(2, '0'),
      category: cat,
      items: filteredProjects.filter((p) => p.category === cat.id),
    })).filter((sec) => sec.items.length > 0);
  }, [filteredProjects]);

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

  const liveEndpointsCount = localizedProjects.filter((p) => Boolean(p.liveUrl)).length;

  const handleSelectTech = (tech: string) => {
    onSelectTab('all');
    onSearchChange(tech);
  };

  return (
    <section id="projects" className="scroll-mt-20 py-10 sm:py-12">
      {/* Section Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/90 px-3 py-1 font-mono text-xs font-bold text-indigo-700 dark:border-indigo-400/25 dark:bg-indigo-500/15 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            {lang === 'vi' ? '01 · DỰ ÁN & HỆ THỐNG TIÊU BIỂU' : '01 · SELECTED ENGINEERING WORKS'}
          </span>
          <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            <span className="gemini-gradient-text">{t.title}</span>
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {t.subtitle}
          </p>
        </div>

        {/* View Controls: Live Filter + Group Toggle + Grid/Table */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOnlyLive((v) => !v)}
            className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition ${
              onlyLive
                ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                : 'border-indigo-100 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-indigo-500/20 dark:bg-[#131B2E] dark:text-slate-300'
            }`}
          >
            <Globe className="h-3.5 w-3.5 text-emerald-500" />
            <span>Web Live ({liveEndpointsCount})</span>
          </button>

          {activeTab === 'all' && layoutMode === 'grid' && (
            <button
              type="button"
              onClick={() => setGroupByCategory((v) => !v)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition ${
                groupByCategory
                  ? 'border-indigo-400/50 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300'
                  : 'border-indigo-100 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-indigo-500/20 dark:bg-[#131B2E] dark:text-slate-300'
              }`}
            >
              <FolderKanban className="h-3.5 w-3.5 text-indigo-500" />
              <span>{lang === 'vi' ? 'Nhóm theo lĩnh vực' : 'Group by Domain'}</span>
            </button>
          )}

          <div className="inline-flex h-9 items-center rounded-xl border border-indigo-100 bg-white p-1 dark:border-indigo-500/20 dark:bg-[#131B2E]">
            <button
              type="button"
              onClick={() => setLayoutMode('grid')}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                layoutMode === 'grid'
                  ? 'gemini-btn-primary'
                  : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('table')}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                layoutMode === 'table'
                  ? 'gemini-btn-primary'
                  : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>{lang === 'vi' ? 'Bảng' : 'Table'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar Card: Category Pills + Search Input */}
      <div className="bento-card mt-6 flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {filterButtons.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`inline-flex h-9 items-center gap-2 rounded-xl px-3.5 text-xs font-bold transition-all ${
                  active
                    ? 'gemini-btn-primary'
                    : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] tabular-nums ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300'
                  }`}
                >
                  {counts[tab.id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-indigo-400" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="h-9 w-full rounded-xl border border-indigo-100 bg-slate-50/80 pl-9 pr-8 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:bg-white dark:border-indigo-500/20 dark:bg-[#0B0F19]/60 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Active Tech / Keyword Filter Indicator */}
      {searchQuery.trim() !== '' && (
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span>{lang === 'vi' ? 'Đang lọc theo công nghệ / từ khóa:' : 'Filtered by:'}</span>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1 font-mono text-xs font-bold text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-500/15 dark:text-indigo-300">
            {searchQuery}
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="text-indigo-400 hover:text-indigo-700 dark:hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        </div>
      )}

      {/* Content View */}
      {filteredProjects.length === 0 ? (
        <div className="bento-card mt-6 px-6 py-14 text-center">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {t.emptyTitle}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t.emptyDesc}
          </p>
          <button
            type="button"
            onClick={() => {
              onSelectTab('all');
              onSearchChange('');
              setOnlyLive(false);
            }}
            className="gemini-btn-primary mt-4 rounded-xl px-4 py-2 text-xs font-bold"
          >
            {t.resetBtn}
          </button>
        </div>
      ) : layoutMode === 'table' ? (
        <div className="bento-card mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-indigo-100/80 bg-indigo-50/40 font-mono text-[11px] uppercase tracking-wider text-indigo-700 dark:border-indigo-500/15 dark:bg-indigo-500/10 dark:text-indigo-300">
                  <th className="px-4 py-3.5 font-bold">Dự án &amp; Định vị</th>
                  <th className="px-4 py-3.5 font-bold">Lĩnh vực</th>
                  <th className="hidden px-4 py-3.5 font-bold md:table-cell">Tech Stack</th>
                  <th className="px-4 py-3.5 font-bold">Trạng thái</th>
                  <th className="px-4 py-3.5 text-right font-bold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100/60 dark:divide-indigo-500/10">
                {filteredProjects.map((project) => {
                  const cat = CATEGORY_MAP[project.category];
                  return (
                    <tr
                      key={project.id}
                      className="transition hover:bg-indigo-50/40 dark:hover:bg-indigo-500/5"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <ProjectIcon
                            icon={project.icon}
                            accentColor={project.accentColor}
                            size="sm"
                          />
                          <div className="min-w-0 max-w-md">
                            <div
                              onClick={() => onOpenDetail(project)}
                              className="cursor-pointer truncate text-sm font-bold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-300"
                            >
                              {project.title}
                            </div>
                            <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                              {project.tagline}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cat.badgeClass}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${cat.dotClass}`} />
                          {getCategoryLabel(project.category, lang)}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3.5 md:table-cell">
                        <div className="flex max-w-xs flex-wrap gap-1">
                          {project.techStack.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="rounded-md border border-indigo-100 bg-white px-2 py-0.5 font-mono text-[10px] text-slate-600 dark:border-indigo-500/20 dark:bg-white/[0.04] dark:text-slate-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <ServerStatusPill
                          project={project}
                          health={healthMap[project.id]}
                          onPing={onPingServer}
                          lang={lang}
                          compact
                        />
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="gemini-btn-primary inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold"
                            >
                              <span>Live</span>
                              <ArrowUpRight className="h-3 w-3" />
                            </a>
                          )}
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-indigo-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
                          >
                            <Github className="h-3.5 w-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => onOpenDetail(project)}
                            className="inline-flex items-center gap-1 rounded-lg border border-indigo-100 bg-indigo-50/70 px-2.5 py-1.5 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300"
                          >
                            <Layers className="h-3 w-3" />
                            <span>Chi tiết</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : groupByCategory && activeTab === 'all' && searchQuery.trim() === '' ? (
        <div className="mt-6 space-y-8">
          {groupedSections.map((section) => (
            <div key={section.category.id} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-indigo-100 pb-2.5 dark:border-indigo-500/20">
                <span className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-2.5 py-0.5 font-mono text-xs font-bold text-white">
                  {section.indexLabel}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {section.category.label}
                </h3>
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 font-mono text-xs font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                  {section.items.length}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {section.items.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    lang={lang}
                    health={healthMap[project.id]}
                    onPingServer={onPingServer}
                    onOpenDetail={onOpenDetail}
                    onSelectTech={handleSelectTech}
                  />
                ))}
              </div>
            </div>
          ))}
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
              onSelectTech={handleSelectTech}
            />
          ))}
        </div>
      )}
    </section>
  );
}
