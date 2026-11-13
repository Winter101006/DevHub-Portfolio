import { Loader2, Pin, Search, X, Zap } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { CATEGORY_LIST } from '../data/projectsConfig';
import type {
  DevHubProject,
  FilterTab,
  ServerHealthRecord,
} from '../types/project';
import { matchesSearchQuery } from '../utils/text';
import { ProjectCard } from './ProjectCard';

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
  }, [visibleProjects, activeTab, searchQuery]);

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
            Project Command Center
          </span>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
            Trạm Phóng &amp; Hồ Sơ Kỹ Thuật Dự Án
          </h2>
        </div>

        {/* Wake Up All Servers Button */}
        <button
          type="button"
          onClick={onWakeAllServers}
          disabled={wakingAll || liveEndpointsCount === 0}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-500/20 disabled:opacity-60 dark:border-amber-400/25 dark:bg-amber-500/15 dark:text-amber-300 sm:self-auto"
          title="Gửi tín hiệu ping ngầm tới tất cả các web đang chạy trên Vercel & Render để khởi động sẵn trước khi demo"
        >
          {wakingAll ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Zap className="h-3.5 w-3.5" />
          )}
          {wakingAll
            ? `Đang đánh thức ${liveEndpointsCount} servers...`
            : `Wake Up All Servers (${liveEndpointsCount})`}
        </button>
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
            placeholder="Tìm dự án, tech stack... (phím /)"
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

      {/* Cards Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bento-card flex flex-col items-center justify-center px-6 py-14 text-center">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            Không tìm thấy dự án nào phù hợp
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Thử đổi danh mục lọc, xóa từ khóa tìm kiếm hoặc mở Manage Hub (Ctrl+Shift+E) để kiểm tra các repo đang ẩn.
          </p>
          <button
            type="button"
            onClick={() => {
              onSelectTab('all');
              onSearchChange('');
            }}
            className="mt-4 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-200"
          >
            Xem tất cả dự án
          </button>
        </div>
      ) : (
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
