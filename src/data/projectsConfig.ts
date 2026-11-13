import rawConfig from './projectsConfig.json';
import type { CategoryId, CategoryMeta, ProjectsConfigFile } from '../types/project';

export const DEFAULT_PROJECTS_CONFIG = rawConfig as ProjectsConfigFile;

export const CATEGORY_LIST: CategoryMeta[] = [
  {
    id: 'ai-ds',
    label: 'AI, NLP & Data Science',
    shortLabel: 'AI & Data Science',
    description: 'Machine Learning, RAG Chatbot, phân tích dữ liệu & nghiên cứu khoa học NLP.',
    badgeClass:
      'bg-violet-500/10 text-violet-700 border-violet-500/20 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-400/20',
    dotClass: 'bg-violet-500',
  },
  {
    id: 'study-life',
    label: 'Học tập & Quản lý Đời sống',
    shortLabel: 'Học tập & Đời sống',
    description: 'Quản lý GPA & lộ trình học tập HUS, tài chính cá nhân, theo dõi dinh dưỡng.',
    badgeClass:
      'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-400/20',
    dotClass: 'bg-emerald-500',
  },
  {
    id: 'game-creative',
    label: 'Web Game & Sáng tạo',
    shortLabel: 'Game & Sáng tạo',
    description: 'Thế giới 3D Voxel Co-op, HTML5 Canvas mini-games & trải nghiệm tương tác.',
    badgeClass:
      'bg-pink-500/10 text-pink-700 border-pink-500/20 dark:bg-pink-500/15 dark:text-pink-300 dark:border-pink-400/20',
    dotClass: 'bg-pink-500',
  },
  {
    id: 'others',
    label: 'Thư viện, Thuật toán & Khác',
    shortLabel: 'Thư viện & Khác',
    description: 'Thử nghiệm kiến trúc API, bài tập cấu trúc dữ liệu và tiện ích nhỏ.',
    badgeClass:
      'bg-zinc-500/10 text-zinc-700 border-zinc-500/20 dark:bg-zinc-500/15 dark:text-zinc-300 dark:border-zinc-400/20',
    dotClass: 'bg-zinc-400',
  },
];

export const CATEGORY_MAP: Record<CategoryId, CategoryMeta> = CATEGORY_LIST.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<CategoryId, CategoryMeta>
);

/**
 * Tự động phân loại repo GitHub dựa trên tên repo, mô tả, ngôn ngữ và topics.
 */
export function classifyRepoCategory(input: {
  name: string;
  description?: string | null;
  language?: string | null;
  topics?: string[];
}): CategoryId {
  const haystack = [
    input.name,
    input.description ?? '',
    input.language ?? '',
    ...(input.topics ?? []),
  ]
    .join(' ')
    .toLowerCase();

  if (
    /(\bml\b|\bai\b|\bnlp\b|\brag\b|machine.?learning|data.?science|jupyter|pytorch|sklearn|scikit|chromadb|embedding|semeval|clustering|pca|streamlit|chatbot)/i.test(
      haystack
    )
  ) {
    return 'ai-ds';
  }

  if (
    /(gpa|curriculum|hus|study|finance|tracker|calorie|nutrition|health|budget|consumption)/i.test(
      haystack
    ) &&
    !/(frontend|backend$)/i.test(input.name)
  ) {
    return 'study-life';
  }

  if (/(game|craft|micute|voxel|3d|canvas|quiz|time|num)/i.test(haystack)) {
    return 'game-creative';
  }

  return 'others';
}
