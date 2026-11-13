import {
  Check,
  Copy,
  Download,
  Edit3,
  Eye,
  EyeOff,
  FileJson,
  Pin,
  PlusCircle,
  RotateCcw,
  Search,
  Settings2,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CATEGORY_LIST, CATEGORY_MAP } from '../data/projectsConfig';
import type {
  CategoryId,
  DevHubProject,
  ProjectConfigEntry,
  ProjectsConfigFile,
  ServerPlatform,
} from '../types/project';
import { detectServerPlatform, matchesSearchQuery } from '../utils/text';
import { ProjectIcon } from './ProjectIcon';

type AdminTab = 'visibility' | 'form' | 'export';

interface AdminManagerModalProps {
  open: boolean;
  onClose: () => void;
  projects: DevHubProject[];
  config: ProjectsConfigFile;
  hasLocalEdits: boolean;
  initialEditProject?: DevHubProject | null;
  onToggleVisibility: (identifier: string) => void;
  onTogglePin: (project: DevHubProject) => void;
  onSaveProject: (entry: ProjectConfigEntry, isEditingExisting: boolean) => void;
  onDeleteCustomProject: (id: string) => void;
  onResetDefault: () => void;
  onNotify: (title: string, description?: string) => void;
}

const ICON_OPTIONS = [
  { value: 'brain', label: 'AI / Brain' },
  { value: 'graduation', label: 'Học tập / HUS' },
  { value: 'wallet', label: 'Tài chính' },
  { value: 'gamepad', label: 'Game 3D' },
  { value: 'map', label: 'Bản đồ / Chatbot' },
  { value: 'flask', label: 'Nghiên cứu NLP' },
  { value: 'heart', label: 'Sức khỏe / Dinh dưỡng' },
  { value: 'server', label: 'Backend / API' },
  { value: 'globe', label: 'Web App' },
  { value: 'code', label: 'Thuật toán / Code' },
];

interface FormState {
  id: string;
  repoName?: string;
  title: string;
  category: CategoryId;
  liveUrl: string;
  githubUrl: string;
  tagline: string;
  overview: string;
  technicalHighlightsText: string;
  techStackText: string;
  serverType: ServerPlatform;
  icon: string;
  pinned: boolean;
}

function emptyFormState(): FormState {
  return {
    id: '',
    title: '',
    category: 'ai-ds',
    liveUrl: '',
    githubUrl: 'https://github.com/Winter101006',
    tagline: '',
    overview: '',
    technicalHighlightsText: '',
    techStackText: 'React, TypeScript, Tailwind CSS',
    serverType: 'vercel',
    icon: 'globe',
    pinned: true,
  };
}

function projectToFormState(p: DevHubProject): FormState {
  return {
    id: p.id,
    repoName: p.repoName,
    title: p.title,
    category: p.category,
    liveUrl: p.liveUrl,
    githubUrl: p.githubUrl,
    tagline: p.tagline,
    overview: p.overview,
    technicalHighlightsText: p.technicalHighlights.join('\n'),
    techStackText: p.techStack.join(', '),
    serverType: p.serverType,
    icon: p.icon,
    pinned: p.pinned,
  };
}

export function AdminManagerModal({
  open,
  onClose,
  projects,
  config,
  hasLocalEdits,
  initialEditProject,
  onToggleVisibility,
  onTogglePin,
  onSaveProject,
  onDeleteCustomProject,
  onResetDefault,
  onNotify,
}: AdminManagerModalProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('visibility');
  const [filterText, setFilterText] = useState('');
  const [editingExisting, setEditingExisting] = useState(false);
  const [form, setForm] = useState<FormState>(emptyFormState);
  const [copiedJson, setCopiedJson] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initialEditProject) {
      setForm(projectToFormState(initialEditProject));
      setEditingExisting(true);
      setActiveTab('form');
    } else {
      setActiveTab('visibility');
    }
  }, [open, initialEditProject]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const filteredManagerList = useMemo(
    () =>
      projects.filter((p) =>
        matchesSearchQuery(filterText, [
          p.title,
          p.repoName,
          p.category,
          ...p.techStack,
        ])
      ),
    [projects, filterText]
  );

  const jsonConfigString = useMemo(
    () => JSON.stringify(config, null, 2),
    [config]
  );

  if (!open) return null;

  const handleStartAddNew = () => {
    setForm(emptyFormState());
    setEditingExisting(false);
    setActiveTab('form');
  };

  const handleEditExisting = (project: DevHubProject) => {
    setForm(projectToFormState(project));
    setEditingExisting(true);
    setActiveTab('form');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.tagline.trim()) {
      onNotify('Thiếu thông tin bắt buộc', 'Vui lòng nhập Tên dự án và Tagline.');
      return;
    }

    const generatedId =
      form.id.trim() ||
      `custom-${form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}-${Date.now().toString().slice(-4)}`;

    const techStack = form.techStackText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const technicalHighlights = form.technicalHighlightsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const liveUrl = form.liveUrl.trim();
    const resolvedServer =
      form.serverType === 'none' && liveUrl
        ? detectServerPlatform(liveUrl)
        : form.serverType;

    const entry: ProjectConfigEntry = {
      id: generatedId,
      repoName: form.repoName,
      title: form.title.trim(),
      category: form.category,
      tagline: form.tagline.trim(),
      overview:
        form.overview.trim() ||
        form.tagline.trim(),
      technicalHighlights:
        technicalHighlights.length > 0
          ? technicalHighlights
          : ['Cấu hình và triển khai trực tiếp từ Huân DevHub Manager.'],
      techStack: techStack.length > 0 ? techStack : ['Web App'],
      liveUrl,
      githubUrl: form.githubUrl.trim() || 'https://github.com/Winter101006',
      serverType: resolvedServer,
      icon: form.icon,
      pinned: form.pinned,
    };

    onSaveProject(entry, editingExisting);
    onNotify(
      editingExisting ? 'Đã cập nhật dự án' : 'Đã thêm dự án mới',
      `${entry.title} đã được lưu ngay vào localStorage.`
    );
    setEditingExisting(false);
    setForm(emptyFormState());
    setActiveTab('visibility');
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonConfigString);
      setCopiedJson(true);
      onNotify(
        'Đã copy projectsConfig.json',
        'Dán đè vào src/data/projectsConfig.json để cập nhật vĩnh viễn.'
      );
      setTimeout(() => setCopiedJson(false), 2000);
    } catch {
      onNotify('Không thể truy cập clipboard', 'Hãy dùng nút Download projectsConfig.json.');
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonConfigString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projectsConfig.json';
    a.click();
    URL.revokeObjectURL(url);
    onNotify(
      'Đã tải xuống projectsConfig.json',
      'Thay file này vào src/data/projectsConfig.json và push lên GitHub.'
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="animate-scale-in flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-white/15 dark:bg-obsidian-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/80 px-6 py-4 dark:border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/25 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
              <Settings2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-900 dark:text-white sm:text-lg">
                  Quản Lý Dự Án — Hybrid Admin Mode
                </h2>
                <kbd className="hidden rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400 sm:inline">
                  Ctrl+Shift+E
                </kbd>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Ẩn/Hiện repo tức thì, ghim dự án nổi bật, thêm dự án ngoài GitHub và xuất JSON config.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-200/80 bg-zinc-50/70 px-6 py-2.5 dark:border-white/[0.08] dark:bg-obsidian-950/40">
          <button
            type="button"
            onClick={() => setActiveTab('visibility')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'visibility'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                : 'text-zinc-600 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-white/[0.06]'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Tab 1: Ẩn / Hiện &amp; Ghim ({projects.length})
          </button>

          <button
            type="button"
            onClick={handleStartAddNew}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'form'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                : 'text-zinc-600 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-white/[0.06]'
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Tab 2: {editingExisting ? 'Đang sửa dự án' : 'Thêm dự án mới'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'export'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                : 'text-zinc-600 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-white/[0.06]'
            }`}
          >
            <FileJson className="h-3.5 w-3.5" />
            Tab 3: Lưu &amp; Xuất JSON Config
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: Visibility & Pinning */}
          {activeTab === 'visibility' && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder="Lọc nhanh tên repo GitHub hoặc dự án..."
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-xs text-zinc-900 outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-obsidian-950/60 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>
                    Hiển thị:{' '}
                    <strong className="text-zinc-900 dark:text-white">
                      {projects.filter((p) => !p.hidden).length}
                    </strong>{' '}
                    / {projects.length}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-zinc-200/80 rounded-2xl border border-zinc-200/80 dark:divide-white/[0.06] dark:border-white/[0.08]">
                {filteredManagerList.map((project) => {
                  const identifier = project.repoName || project.id;
                  const cat = CATEGORY_MAP[project.category];

                  return (
                    <div
                      key={project.id}
                      className={`flex flex-col justify-between gap-3 p-3.5 transition sm:flex-row sm:items-center ${
                        project.hidden ? 'opacity-55' : ''
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <ProjectIcon
                          icon={project.icon}
                          accentColor={project.accentColor}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="truncate text-xs font-bold text-zinc-900 dark:text-white">
                              {project.title}
                            </span>
                            <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:bg-white/[0.06] dark:text-zinc-400">
                              {project.source === 'github'
                                ? 'GitHub'
                                : project.source === 'hybrid'
                                  ? 'GitHub + Pin'
                                  : 'Custom'}
                            </span>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${cat.badgeClass}`}
                            >
                              {cat.shortLabel}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                            {project.repoName ? `Repo: ${project.repoName} · ` : ''}
                            {project.liveUrl || 'Chưa gắn Live URL'}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleEditExisting(project)}
                          className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-200"
                          title="Chỉnh sửa mô tả / link"
                        >
                          <Edit3 className="h-3 w-3" />
                          Sửa
                        </button>

                        {/* Pin Button */}
                        <button
                          type="button"
                          onClick={() => onTogglePin(project)}
                          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition ${
                            project.pinned
                              ? 'border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-300'
                              : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-300'
                          }`}
                          title="Ghim lên đầu danh sách"
                        >
                          <Pin className="h-3 w-3" />
                          {project.pinned ? 'Đã ghim' : 'Ghim'}
                        </button>

                        {/* Delete (only custom standalone projects) */}
                        {project.source === 'custom' && !project.repoName && (
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteCustomProject(project.id);
                              onNotify('Đã xóa dự án tùy chỉnh', project.title);
                            }}
                            className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-1.5 text-rose-600 transition hover:bg-rose-500/20 dark:text-rose-300"
                            title="Xóa dự án này"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}

                        {/* Switch On/Off Visibility */}
                        <button
                          type="button"
                          onClick={() => onToggleVisibility(identifier)}
                          role="switch"
                          aria-checked={!project.hidden}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                            !project.hidden
                              ? 'bg-emerald-500'
                              : 'bg-zinc-300 dark:bg-zinc-700'
                          }`}
                          title={
                            project.hidden
                              ? 'Đang ẩn — Bấm để hiện lên Portfolio'
                              : 'Đang hiện — Bấm để ẩn khỏi Portfolio'
                          }
                        >
                          <span
                            className={`inline-flex h-4 w-4 transform items-center justify-center rounded-full bg-white shadow transition-transform ${
                              !project.hidden ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          >
                            {!project.hidden ? (
                              <Eye className="h-2.5 w-2.5 text-emerald-600" />
                            ) : (
                              <EyeOff className="h-2.5 w-2.5 text-zinc-500" />
                            )}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Add / Edit Project Form */}
          {activeTab === 'form' && (
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                    Tên dự án *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="VD: Hanoi Explorer Chatbot (RAG AI)"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-obsidian-950/60 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                    Danh mục
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as CategoryId })
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-obsidian-950/60 dark:text-white"
                  >
                    {CATEGORY_LIST.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                    Link Web chạy thật (Live Demo URL)
                  </label>
                  <input
                    type="url"
                    value={form.liveUrl}
                    onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                    placeholder="https://my-app.vercel.app hoặc onrender.com"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-900 outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-obsidian-950/60 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                    Link GitHub / Colab / CodaBench
                  </label>
                  <input
                    type="url"
                    value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                    placeholder="https://github.com/Winter101006/..."
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-900 outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-obsidian-950/60 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                    Nền tảng Hosting (Health Check)
                  </label>
                  <select
                    value={form.serverType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        serverType: e.target.value as ServerPlatform,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-obsidian-950/60 dark:text-white"
                  >
                    <option value="vercel">Vercel (Edge / Fast)</option>
                    <option value="render">Render (Hỗ trợ Wake-up Cold Start)</option>
                    <option value="streamlit">Streamlit Cloud</option>
                    <option value="static">Static / Khác</option>
                    <option value="none">Không có Web Live (Local / Research)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                    Biểu tượng đại diện
                  </label>
                  <select
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-obsidian-950/60 dark:text-white"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                  Tagline (1 câu tóm tắt sắc bén) *
                </label>
                <input
                  type="text"
                  required
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="Giúp người xem hiểu dự án trong 3 giây..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-obsidian-950/60 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                  Overview (Mô tả dễ hiểu cho người ngoài ngành)
                </label>
                <textarea
                  rows={3}
                  value={form.overview}
                  onChange={(e) => setForm({ ...form, overview: e.target.value })}
                  placeholder="Dự án này giải quyết vấn đề gì trong thực tế và dùng như thế nào?"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-obsidian-950/60 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                  Technical Highlights (Mỗi dòng là 1 điểm nhấn kỹ thuật)
                </label>
                <textarea
                  rows={3}
                  value={form.technicalHighlightsText}
                  onChange={(e) =>
                    setForm({ ...form, technicalHighlightsText: e.target.value })
                  }
                  placeholder="Kiến trúc RAG dùng ChromaDB...&#10;Tối ưu hiệu năng 60 FPS..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-obsidian-950/60 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                  Tech Stack (phân cách bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={form.techStackText}
                  onChange={(e) => setForm({ ...form, techStackText: e.target.value })}
                  placeholder="Python, FastAPI, ChromaDB, React, Vercel"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-900 outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-obsidian-950/60 dark:text-white"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={form.pinned}
                    onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Ghim dự án này lên đầu (Pinned)
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingExisting(false);
                      setForm(emptyFormState());
                      setActiveTab('visibility');
                    }}
                    className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                  >
                    {editingExisting ? 'Lưu cập nhật' : 'Thêm dự án ngay'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: Save & Export JSON */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="flex flex-col justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-zinc-50 p-4 dark:border-white/[0.08] dark:bg-white/[0.03] sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">
                      Trạng thái lưu trữ:
                    </span>
                    {hasLocalEdits ? (
                      <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                        Đang có chỉnh sửa trong localStorage trình duyệt
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                        Đồng bộ chuẩn file src/data/projectsConfig.json
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Để xuất bản thay đổi vĩnh viễn cho mọi người xem, hãy tải file{' '}
                    <code className="font-mono text-indigo-600 dark:text-indigo-300">
                      projectsConfig.json
                    </code>{' '}
                    và dán đè vào{' '}
                    <code className="font-mono text-indigo-600 dark:text-indigo-300">
                      src/data/projectsConfig.json
                    </code>
                    .
                  </p>
                </div>

                {hasLocalEdits && (
                  <button
                    type="button"
                    onClick={() => {
                      onResetDefault();
                      onNotify('Đã khôi phục cấu hình gốc', 'Xóa bộ nhớ tạm localStorage thành công.');
                    }}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-500/20 dark:text-rose-300"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Khôi phục mặc định
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950"
                >
                  {copiedJson ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      Đã Copy JSON!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy JSON Config
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download projectsConfig.json
                </button>
              </div>

              <pre className="max-h-80 overflow-auto rounded-2xl border border-zinc-200 bg-zinc-950 p-4 font-mono text-[11px] leading-relaxed text-emerald-300 dark:border-white/10">
                {jsonConfigString}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
