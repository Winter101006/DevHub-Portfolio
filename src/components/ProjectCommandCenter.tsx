import {
  ArrowUpRight,
  BookOpen,
  FolderKanban,
  Github,
  Globe,
  LayoutGrid,
  List,
  Loader2,
  Pin,
  Search,
  X,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORY_LIST, CATEGORY_MAP } from '../data/projectsConfig';
import type {
  DevHubProject,
  FilterTab,
  ServerHealthRecord,
} from '../types/project';
import { matchesSearchQuery } from '../utils/text';
import { ProjectCard } from './ProjectCard';
import { ProjectIcon, ServerStatusPill } from './ProjectIcon';

interface ProjectCommandCenterProps {
  projects: DevHubProject[];
  activeTab: FilterTab;
  onSelectTab: (tab: FilterTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  healthMap: Record<string, ServerHealthRecord>;
  wakingAll: boolean;
  onPingServer: (project: DevHubProject) => void;
  onWakeAllServers: () => void;
  onOpenDetail: (project: DevHubProject) => void;
}

export function ProjectCommandCenter({
  projects,
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  healthMap,
  wakingAll,
  onPingServer,
  onWakeAllServers,
  onOpenDetail,
}: ProjectCommandCenterProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'table'>('grid');
  const [groupByCategory, setGroupByCategory] = useState<boolean>(true);
  const [onlyLive, setOnlyLive] = useState<boolean>(false);

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

  const visibleProjects = useMemo(
    () => projects.filter((p) => !p.hidden),
    [projects]
  );

  const counts = useMemo(() => {
    const map: Record<FilterTab, number> = {
      all: visibleProjects.length,
      'ai-ds': 0,
      'study-life': 0,
      'game-creative': 0,
      others: 0,
      pinned: 0,
    };
    for (const p of visibleProjects) {
      map[p.category] += 1;
      if (p.pinned) map.pinned += 1;
    }
    return map;
  }, [visibleProjects]);

  const filteredProjects = useMemo(() => {
    return visibleProjects.filter((p) => {
      if (onlyLive && !p.liveUrl) return false;
      if (activeTab === 'pinned' && !p.pinned) return false;
      if (activeTab !== 'all' && activeTab !== 'pinned' && p.category !== activeTab) {
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
  }, [visibleProjects, activeTab, searchQuery, onlyLive]);

  // Grouped sections when viewing "Tất cả" in Grid mode without active search query
  const groupedSections = useMemo(() => {
    return CATEGORY_LIST.map((cat, idx) => ({
      indexLabel: String(idx + 1).padStart(2, '0'),
      category: cat,
      items: filteredProjects.filter((p) => p.category === cat.id),
    })).filter((sec) => sec.items.length > 0);
  }, [filteredProjects]);

  const shouldRenderGrouped =
    layoutMode === 'grid' &&
    groupByCategory &&
    activeTab === 'all' &&
    searchQuery.trim() === '';

  const filterButtons: Array<{ id: FilterTab; label: string; isPinned?: boolean }> = [
    { id: 'all', label: 'Tất cả' },
    { id: 'ai-ds', label: CATEGORY_LIST[0].shortLabel },
    { id: 'study-life', label: CATEGORY_LIST[1].shortLabel },
    { id: 'game-creative', label: CATEGORY_LIST[2].shortLabel },
    { id: 'others', label: CATEGORY_LIST[3].shortLabel },
    { id: 'pinned', label: 'Đã ghim', isPinned: true },
  ];

  const liveEndpointsCount = visibleProjects.filter((p) => Boolean(p.liveUrl)).length;

  return (
    <section className="mt-8 space-y-5">
      {/* Section Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Project Directory &amp; Command Center
          </span>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
            Danh mục Dự án &amp; Trạm Khởi Chạy
          </h2>
        </div>

        {/* Right Controls: Live Filter + Layout Mode + Wake Up */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOnlyLive((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              onlyLive
                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300'
            }`}
            title="Chỉ hiện các dự án có link Web chạy thật"
          >
            <Globe className="h-3.5 w-3.5" />
            Chỉ Web Live ({liveEndpointsCount})
          </button>

          {activeTab === 'all' && layoutMode === 'grid' && (
            <button
              type="button"
              onClick={() => setGroupByCategory((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                groupByCategory
                  ? 'border-indigo-500/35 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300'
              }`}
              title="Sắp xếp gom nhóm theo từng lĩnh vực"
            >
              <FolderKanban className="h-3.5 w-3.5" />
              Nhóm theo lĩnh vực
            </button>
          )}

          {/* Grid / Table Switcher */}
          <div className="inline-flex rounded-xl border border-zinc-200 bg-zinc-100/80 p-0.5 dark:border-white/10 dark:bg-white/[0.04]">
            <button
              type="button"
              onClick={() => setLayoutMode('grid')}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                layoutMode === 'grid'
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
              title="Xem dạng thẻ (Grid)"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Thẻ
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('table')}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                layoutMode === 'table'
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
              title="Xem dạng bảng chỉ mục tra cứu nhanh"
            >
              <List className="h-3.5 w-3.5" />
              Bảng tra cứu
            </button>
          </div>

          <button
            type="button"
            onClick={onWakeAllServers}
            disabled={wakingAll || liveEndpointsCount === 0}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-500/20 disabled:opacity-60 dark:border-amber-400/25 dark:bg-amber-500/15 dark:text-amber-300"
            title="Kiểm tra phản hồi tất cả các web đang chạy"
          >
            {wakingAll ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Zap className="h-3.5 w-3.5" />
            )}
            {wakingAll ? 'Đang ping...' : 'Ping All Servers'}
          </button>
        </div>
      </div>

      {/* Smart Toolbar: Filter Tabs + Real-time Search */}
      <div className="bento-card flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {filterButtons.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? 'bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-950'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-200'
                }`}
              >
                {tab.isPinned && <Pin className="h-3 w-3" />}
                <span>{tab.label}</span>
                <span
                  className={`rounded-md px-1.5 py-0.2 font-mono text-[10px] ${
                    active
                      ? 'bg-white/20 text-white dark:bg-zinc-900/15 dark:text-zinc-900'
                      : 'bg-zinc-200/70 text-zinc-600 dark:bg-white/[0.08] dark:text-zinc-400'
                  }`}
                >
                  {counts[tab.id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Real-time Search */}
        <div className="relative w-full lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tra cứu nhanh dự án, tech... (/)"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-8 text-xs text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-white/10 dark:bg-obsidian-950/60 dark:text-white dark:placeholder-zinc-500 dark:focus:border-indigo-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
              aria-label="Xóa từ khóa tìm kiếm"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="bento-card flex flex-col items-center justify-center px-6 py-14 text-center">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            Không tìm thấy dự án nào phù hợp
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Thử đổi danh mục lọc, bỏ bộ lọc Chỉ Web Live hoặc xóa từ khóa tìm kiếm.
          </p>
          <button
            type="button"
            onClick={() => {
              onSelectTab('all');
              onSearchChange('');
              setOnlyLive(false);
            }}
            className="mt-4 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-200"
          >
            Hiển thị tất cả dự án
          </button>
        </div>
      ) : layoutMode === 'table' ? (
        /* INDEX TABLE VIEW — Ultra-fast Lookup */
        <div className="bento-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-zinc-200/80 bg-zinc-50/80 font-mono text-[11px] uppercase tracking-wider text-zinc-500 dark:border-white/[0.08] dark:bg-white/[0.02] dark:text-zinc-400">
                  <th className="px-4 py-3 font-semibold">Dự án &amp; Mô tả ngắn</th>
                  <th className="px-4 py-3 font-semibold">Lĩnh vực</th>
                  <th className="hidden px-4 py-3 font-semibold md:table-cell">Tech Stack</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/70 dark:divide-white/[0.06]">
                {filteredProjects.map((project) => {
                  const cat = CATEGORY_MAP[project.category];
                  return (
                    <tr
                      key={project.id}
                      className="transition hover:bg-zinc-50/90 dark:hover:bg-white/[0.025]"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <ProjectIcon
                            icon={project.icon}
                            accentColor={project.accentColor}
                            size="sm"
                          />
                          <div className="min-w-0 max-w-md">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate text-xs font-bold text-zinc-900 dark:text-white sm:text-sm">
                                {project.title}
                              </span>
                              {project.pinned && (
                                <Pin className="h-3 w-3 shrink-0 text-amber-500" />
                              )}
                            </div>
                            <p className="mt-0.5 line-clamp-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                              {project.tagline}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cat.badgeClass}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${cat.dotClass}`} />
                          {cat.shortLabel}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3.5 md:table-cell">
                        <div className="flex max-w-xs flex-wrap gap-1">
                          {project.techStack.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="rounded border border-zinc-200/80 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <ServerStatusPill
                          project={project}
                          health={healthMap[project.id]}
                          onPing={onPingServer}
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
                              className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-indigo-600 dark:bg-white dark:text-zinc-950 dark:hover:bg-indigo-400 dark:hover:text-white"
                            >
                              Live
                              <ArrowUpRight className="h-3 w-3" />
                            </a>
                          )}
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200"
                            title="Mở GitHub Repo"
                          >
                            <Github className="h-3 w-3" />
                          </a>
                          <button
                            type="button"
                            onClick={() => onOpenDetail(project)}
                            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-zinc-700 hover:border-indigo-500/40 hover:text-indigo-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200"
                          >
                            <BookOpen className="h-3 w-3" />
                            Chi tiết
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
      ) : shouldRenderGrouped ? (
        /* GROUPED DOMAIN SECTIONS */
        <div className="space-y-8">
          {groupedSections.map((section) => (
            <div key={section.category.id} className="space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/80 pb-2.5 dark:border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-lg border border-zinc-200 bg-white px-2 py-0.5 font-mono text-[11px] font-bold text-indigo-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-indigo-400">
                    {section.indexLabel}
                  </span>
                  <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white sm:text-base">
                    {section.category.label}
                  </h3>
                  <span className="rounded-full bg-zinc-200/70 px-2 py-0.5 font-mono text-[11px] font-semibold text-zinc-600 dark:bg-white/[0.08] dark:text-zinc-300">
                    {section.items.length}
                  </span>
                </div>
                <p className="hidden text-xs text-zinc-500 dark:text-zinc-400 md:block">
                  {section.category.description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {section.items.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    health={healthMap[project.id]}
                    onPingServer={onPingServer}
                    onOpenDetail={onOpenDetail}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* FLAT FILTERED GRID */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
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
