import { classifyRepoCategory } from '../data/projectsConfig';
import type {
  DevHubProject,
  GitHubRepoRaw,
  ProjectConfigEntry,
  ProjectsConfigFile,
} from '../types/project';
import { detectServerPlatform } from './text';

interface RepoPresetCopy {
  title?: string;
  tagline: string;
  overview: string;
  technicalHighlights: string[];
  techStack?: string[];
  icon?: string;
  accentColor?: string;
  liveUrl?: string;
}

const KNOWN_GITHUB_SUMMARIES: Record<string, RepoPresetCopy> = {
  'HappyBirthday-Uyen': {
    title: 'Happy Birthday Interactive Web',
    tagline: 'Thiệp sinh nhật tương tác trên nền web kết hợp hiệu ứng hoạt ảnh và album kỷ niệm.',
    overview:
      'Trang web cá nhân được thiết kế riêng làm quà tặng sinh nhật với hiệu ứng chuyển động mượt mà và trình chiếu hình ảnh kỷ niệm.',
    technicalHighlights: [
      'Tổ chức hoạt ảnh CSS/JS nhiều lớp kết hợp bộ sưu tập ảnh tĩnh tối ưu hiển thị trên cả di động lẫn máy tính.',
    ],
    techStack: ['HTML5', 'CSS3', 'Animations', 'JavaScript'],
    icon: 'sparkles',
    accentColor: 'pink',
  },
  '20-10-Uyen': {
    title: '20/10 Heart Canvas Gift',
    tagline: 'Trang web kỷ niệm ngày 20/10 với hiệu ứng đồ họa trái tim tương tác trên trình duyệt.',
    overview: 'Sản phẩm sáng tạo cá nhân dùng đồ họa web để gửi gắm thông điệp chúc mừng ngày 20/10.',
    technicalHighlights: ['Hiệu ứng render hạt và đường cong toán học nhẹ bằng HTML5/JS.'],
    techStack: ['HTML5', 'Canvas', 'JavaScript'],
    icon: 'heart',
    accentColor: 'rose',
  },
  Love: {
    title: 'Heart-in-Heart Math Canvas',
    tagline: 'Thử nghiệm đồ họa toán học vẽ trái tim lồng trái tim bằng HTML5 Canvas.',
    overview: 'Thử nghiệm nhỏ về phương trình tham số đường cong trái tim kết hợp hiệu ứng chuyển động trên Canvas.',
    technicalHighlights: ['Áp dụng phương trình đường cong tham số trên Canvas 2D với vòng lặp requestAnimationFrame.'],
    techStack: ['HTML5 Canvas', 'Math Curves', 'JavaScript'],
    icon: 'heart',
    accentColor: 'rose',
  },
};

function defaultIconForCategory(category: DevHubProject['category']): string {
  switch (category) {
    case 'ai-ds':
      return 'brain';
    case 'study-life':
      return 'graduation';
    case 'game-creative':
      return 'gamepad';
    default:
      return 'code';
  }
}

function defaultAccentForCategory(category: DevHubProject['category']): string {
  switch (category) {
    case 'ai-ds':
      return 'violet';
    case 'study-life':
      return 'emerald';
    case 'game-creative':
      return 'pink';
    default:
      return 'zinc';
  }
}

function extractYear(isoDate?: string, fallback = '2026'): string {
  if (!isoDate) return fallback;
  const year = new Date(isoDate).getFullYear();
  return Number.isNaN(year) ? fallback : String(year);
}

export function mergeProjectsData(
  githubRepos: GitHubRepoRaw[],
  config: ProjectsConfigFile
): DevHubProject[] {
  const hiddenSet = new Set(config.hiddenRepoNames.map((n) => n.toLowerCase()));
  const pinnedMap = new Map<string, ProjectConfigEntry>();

  for (const entry of config.pinnedProjects) {
    const key = (entry.repoName || entry.id).toLowerCase();
    pinnedMap.set(key, entry);
  }

  const resolved: DevHubProject[] = [];
  const consumedConfigIds = new Set<string>();

  for (const repo of githubRepos) {
    const key = repo.name.toLowerCase();
    const override = pinnedMap.get(key);
    const preset = KNOWN_GITHUB_SUMMARIES[repo.name];
    const isHidden = hiddenSet.has(key);

    if (override) {
      consumedConfigIds.add(key);
      const liveUrl = override.liveUrl ?? repo.homepage ?? '';
      resolved.push({
        id: override.id || repo.name,
        repoName: repo.name,
        title: override.title,
        category: override.category,
        year: override.year || extractYear(repo.pushed_at || repo.updated_at),
        order: override.order ?? 50,
        tagline: override.tagline,
        overview: override.overview,
        technicalHighlights: override.technicalHighlights,
        architectureSummary: override.architectureSummary,
        metrics: override.metrics,
        techStack: override.techStack,
        liveUrl,
        githubUrl: override.githubUrl || repo.html_url,
        serverType: override.serverType ?? detectServerPlatform(liveUrl),
        keepAlive: override.keepAlive ?? false,
        icon: override.icon || defaultIconForCategory(override.category),
        accentColor: override.accentColor || defaultAccentForCategory(override.category),
        pinned: override.pinned ?? true,
        hidden: isHidden,
        source: 'hybrid',
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.pushed_at || repo.updated_at,
      });
    } else {
      const category = classifyRepoCategory({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        topics: repo.topics,
      });
      const liveUrl = preset?.liveUrl || repo.homepage || '';
      const techStack =
        preset?.techStack ||
        Array.from(
          new Set(
            [repo.language, ...(repo.topics || [])]
              .filter((x): x is string => Boolean(x && x.trim()))
              .slice(0, 5)
          )
        );

      resolved.push({
        id: repo.name,
        repoName: repo.name,
        title: preset?.title || repo.name,
        category,
        year: extractYear(repo.pushed_at || repo.updated_at),
        order: 100,
        tagline:
          preset?.tagline ||
          repo.description ||
          `Repository mã nguồn mở viết bằng ${repo.language || 'Web'} trên GitHub @Winter101006.`,
        overview:
          preset?.overview ||
          repo.description ||
          `Dự án lưu trữ trên GitHub (${repo.full_name}), được tự động đồng bộ và phân loại.`,
        technicalHighlights: preset?.technicalHighlights || [
          `Ngôn ngữ chính: ${repo.language || 'Web'}, nhánh mặc định: ${repo.default_branch}.`,
          'Tự động đồng bộ metadata từ GitHub REST API.',
        ],
        techStack: techStack.length > 0 ? techStack : ['GitHub', 'Source Code'],
        liveUrl,
        githubUrl: repo.html_url,
        serverType: detectServerPlatform(liveUrl),
        keepAlive: false,
        icon: preset?.icon || defaultIconForCategory(category),
        accentColor: preset?.accentColor || defaultAccentForCategory(category),
        pinned: false,
        hidden: isHidden,
        source: 'github',
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.pushed_at || repo.updated_at,
      });
    }
  }

  // Include any pinnedProjects that don't correspond to a fetched GitHub repo
  for (const entry of config.pinnedProjects) {
    const key = (entry.repoName || entry.id).toLowerCase();
    if (consumedConfigIds.has(key)) continue;
    const liveUrl = entry.liveUrl ?? '';
    resolved.push({
      id: entry.id,
      repoName: entry.repoName,
      title: entry.title,
      category: entry.category,
      year: entry.year || '2026',
      order: entry.order ?? 50,
      tagline: entry.tagline,
      overview: entry.overview,
      technicalHighlights: entry.technicalHighlights,
      architectureSummary: entry.architectureSummary,
      metrics: entry.metrics,
      techStack: entry.techStack,
      liveUrl,
      githubUrl: entry.githubUrl || 'https://github.com/Winter101006',
      serverType: entry.serverType ?? detectServerPlatform(liveUrl),
      keepAlive: entry.keepAlive ?? false,
      icon: entry.icon || defaultIconForCategory(entry.category),
      accentColor: entry.accentColor || defaultAccentForCategory(entry.category),
      pinned: entry.pinned ?? true,
      hidden: hiddenSet.has(entry.id.toLowerCase()),
      source: 'custom',
      stars: 0,
      forks: 0,
    });
  }

  // Include customProjects (non-GitHub projects, research, Colab, Streamlit, etc.)
  for (const entry of config.customProjects) {
    const liveUrl = entry.liveUrl ?? '';
    const isHidden = hiddenSet.has(entry.id.toLowerCase());
    resolved.push({
      id: entry.id,
      title: entry.title,
      category: entry.category,
      year: entry.year || '2026',
      order: entry.order ?? 60,
      tagline: entry.tagline,
      overview: entry.overview,
      technicalHighlights: entry.technicalHighlights,
      architectureSummary: entry.architectureSummary,
      metrics: entry.metrics,
      techStack: entry.techStack,
      liveUrl,
      githubUrl: entry.githubUrl || 'https://github.com/Winter101006',
      serverType: entry.serverType ?? detectServerPlatform(liveUrl),
      keepAlive: entry.keepAlive ?? false,
      icon: entry.icon || defaultIconForCategory(entry.category),
      accentColor: entry.accentColor || defaultAccentForCategory(entry.category),
      pinned: entry.pinned ?? false,
      hidden: isHidden,
      source: 'custom',
      stars: 0,
      forks: 0,
    });
  }

  // Sort by pinned first, then explicit curated order, then most recently updated
  return resolved.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (a.order !== b.order) return a.order - b.order;
    const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return bTime - aTime;
  });
}
