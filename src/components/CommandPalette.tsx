import {
  ArrowUpRight,
  BookOpen,
  Command,
  CornerDownLeft,
  Moon,
  Rocket,
  Search,
  Settings2,
  Sun,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getCategoryLabel, localizeProject } from '../data/i18n';
import type { DevHubProject, Language, ViewMode } from '../types/project';
import { matchesSearchQuery } from '../utils/text';
import { ProjectIcon } from './ProjectIcon';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  projects: DevHubProject[];
  lang: Language;
  viewMode: ViewMode;
  theme: 'dark' | 'light';
  onOpenDetail: (project: DevHubProject) => void;
  onToggleViewMode: () => void;
  onToggleTheme: () => void;
  onWakeAllServers: () => void;
  onOpenAdmin: () => void;
}

type PaletteItem =
  | { kind: 'project'; project: DevHubProject }
  | {
      kind: 'action';
      id: string;
      title: string;
      subtitle: string;
      shortcut?: string;
      run: () => void;
    };

export function CommandPalette({
  open,
  onClose,
  projects,
  lang,
  viewMode,
  theme,
  onOpenDetail,
  onToggleViewMode,
  onToggleTheme,
  onWakeAllServers,
  onOpenAdmin,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const items: PaletteItem[] = useMemo(() => {
    const visible = projects
      .filter((p) => !p.hidden)
      .map((p) => localizeProject(p, lang));

    const matchedProjects = visible
      .filter((p) =>
        matchesSearchQuery(query, [
          p.title,
          p.repoName,
          p.tagline,
          p.overview,
          p.category,
          p.id.includes('finance') ? 'tien tai chinh chi tieu ngan sach finance' : '',
          p.id.includes('GPA') ? 'diem mon hoc hus roadmap gpa' : '',
          p.id.includes('Game') ? 'game choi 3d minecraft kawaiicraft' : '',
          ...p.techStack,
        ])
      )
      .map((project): PaletteItem => ({ kind: 'project', project }));

    const allQuickActions: PaletteItem[] = [
      {
        kind: 'action',
        id: 'act-mode',
        title:
          lang === 'vi'
            ? viewMode === 'portfolio'
              ? 'Chuyển sang chế độ Dev Launcher'
              : 'Chuyển sang chế độ Portfolio'
            : viewMode === 'portfolio'
              ? 'Switch to Dev Launcher Mode'
              : 'Switch to Portfolio Mode',
        subtitle:
          lang === 'vi'
            ? 'Thay đổi chế độ hiển thị chính'
            : 'Toggle between Portfolio and Operations Console',
        run: () => {
          onToggleViewMode();
          onClose();
        },
      },
      {
        kind: 'action',
        id: 'act-wake',
        title:
          lang === 'vi'
            ? 'Ping & Đánh thức tất cả Servers'
            : 'Ping & Wake All Servers',
        subtitle:
          lang === 'vi'
            ? 'Kiểm tra kết nối các endpoint Vercel & Render'
            : 'Check health and wake up Vercel & Render endpoints',
        run: () => {
          onWakeAllServers();
          onClose();
        },
      },
      {
        kind: 'action',
        id: 'act-admin',
        title:
          lang === 'vi'
            ? 'Mở Quản Trị Dự Án (Manage Hub)'
            : 'Open Project Manager (Manage Hub)',
        subtitle:
          lang === 'vi'
            ? 'Ẩn/Hiện repo, Ghim dự án, Thêm mới & Xuất JSON Config'
            : 'Show/hide repos, pin projects, add custom entries & export JSON',
        shortcut: 'Ctrl+Shift+E',
        run: () => {
          onClose();
          onOpenAdmin();
        },
      },
      {
        kind: 'action',
        id: 'act-theme',
        title:
          lang === 'vi'
            ? theme === 'dark'
              ? 'Chuyển sang Giao diện Sáng (Light Mode)'
              : 'Chuyển sang Giao diện Tối (Dark Mode)'
            : theme === 'dark'
              ? 'Switch to Light Mode'
              : 'Switch to Dark Mode',
        subtitle:
          lang === 'vi' ? 'Đổi màu nền giao diện' : 'Toggle color appearance',
        run: () => {
          onToggleTheme();
          onClose();
        },
      },
    ];

    const quickActions = allQuickActions.filter(
      (act) =>
        act.kind === 'action' && matchesSearchQuery(query, [act.title, act.subtitle])
    );

    return [...matchedProjects, ...quickActions];
  }, [
    projects,
    lang,
    query,
    viewMode,
    theme,
    onToggleViewMode,
    onWakeAllServers,
    onOpenAdmin,
    onToggleTheme,
    onClose,
  ]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          items.length === 0 ? 0 : (prev + 1) % items.length
        );
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          items.length === 0 ? 0 : (prev - 1 + items.length) % items.length
        );
        return;
      }
      if (e.key === 'Enter' && items[selectedIndex]) {
        e.preventDefault();
        const item = items[selectedIndex];
        if (item.kind === 'action') {
          item.run();
        } else if (e.shiftKey || !item.project.liveUrl) {
          onClose();
          onOpenDetail(item.project);
        } else {
          window.open(item.project.liveUrl, '_blank', 'noopener,noreferrer');
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, items, selectedIndex, onClose, onOpenDetail]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-16 backdrop-blur-sm sm:pt-24"
      onClick={onClose}
    >
      <div
        className="animate-scale-in w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-white/15 dark:bg-[#09090B]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-zinc-200/80 px-4 py-3.5 dark:border-white/[0.08]">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === 'vi'
                ? 'Tìm nhanh dự án (vd: "semeval", "gpa", "finance", "game") hoặc lệnh...'
                : 'Search projects ("semeval", "gpa", "finance", "game") or commands...'
            }
            className="w-full bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none dark:text-white dark:placeholder-zinc-500"
          />
          <kbd className="rounded-md border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {items.length === 0 ? (
            <div className="py-10 text-center text-xs text-zinc-500 dark:text-zinc-400">
              {lang === 'vi'
                ? `Không có kết quả nào khớp với "${query}"`
                : `No matching results for "${query}"`}
            </div>
          ) : (
            <div className="space-y-1">
              {items.map((item, index) => {
                const isSelected = index === selectedIndex;

                if (item.kind === 'project') {
                  const p = item.project;
                  return (
                    <div
                      key={p.id}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition ${
                        isSelected
                          ? 'bg-zinc-100 dark:bg-white/[0.07]'
                          : 'hover:bg-zinc-100/70 dark:hover:bg-white/[0.04]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (p.liveUrl) {
                            window.open(p.liveUrl, '_blank', 'noopener,noreferrer');
                            onClose();
                          } else {
                            onClose();
                            onOpenDetail(p);
                          }
                        }}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                      >
                        <ProjectIcon
                          icon={p.icon}
                          accentColor={p.accentColor}
                          size="sm"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-xs font-bold text-zinc-900 dark:text-white">
                              {p.title}
                            </span>
                            <span className="hidden rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:bg-white/[0.06] dark:text-zinc-400 sm:inline">
                              {getCategoryLabel(p.category, lang)}
                            </span>
                          </div>
                          <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                            {p.tagline}
                          </p>
                        </div>
                      </button>

                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenDetail(p);
                          }}
                          className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[10px] font-medium text-zinc-600 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300"
                        >
                          <BookOpen className="h-3 w-3" />
                        </button>
                        {p.liveUrl ? (
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={onClose}
                            className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-2.5 py-1 text-[10px] font-semibold text-white dark:bg-white dark:text-zinc-950"
                          >
                            <span>{lang === 'vi' ? 'Mở Live' : 'Open'}</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="rounded-lg border border-zinc-200 px-2 py-1 font-mono text-[10px] text-zinc-400 dark:border-white/10">
                            {lang === 'vi' ? 'Chi tiết' : 'Details'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={item.run}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                      isSelected
                        ? 'bg-zinc-100 dark:bg-white/[0.07]'
                        : 'hover:bg-zinc-100/70 dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-300">
                        {item.id === 'act-mode' ? (
                          <Rocket className="h-4 w-4 text-indigo-500" />
                        ) : item.id === 'act-wake' ? (
                          <Zap className="h-4 w-4 text-amber-500" />
                        ) : item.id === 'act-admin' ? (
                          <Settings2 className="h-4 w-4 text-emerald-500" />
                        ) : theme === 'dark' ? (
                          <Sun className="h-4 w-4 text-amber-400" />
                        ) : (
                          <Moon className="h-4 w-4 text-indigo-500" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                    {item.shortcut && (
                      <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400">
                        {item.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Hints */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200/80 bg-zinc-50/70 px-4 py-2.5 text-[11px] text-zinc-500 dark:border-white/[0.08] dark:bg-[#09090B] dark:text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft className="h-3 w-3" />
              {lang === 'vi' ? 'Enter: Mở ứng dụng' : 'Enter: Open App'}
            </span>
            <span>
              {lang === 'vi' ? 'Shift+Enter: Xem kiến trúc' : 'Shift+Enter: Architecture'}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 font-mono text-[10px]">
            <Command className="h-3 w-3" />
            Command Palette
          </span>
        </div>
      </div>
    </div>
  );
}
