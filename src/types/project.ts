export type CategoryId = 'ai-ds' | 'study-life' | 'game-creative' | 'others';

export type FilterTab = 'all' | CategoryId | 'pinned';

export type ViewMode = 'portfolio' | 'launcher';

export type ServerPlatform = 'vercel' | 'render' | 'streamlit' | 'static' | 'none';

export type HealthState =
  | 'idle'
  | 'checking'
  | 'online'
  | 'cold-start'
  | 'waking'
  | 'unreachable'
  | 'local';

export interface ServerHealthRecord {
  state: HealthState;
  latencyMs?: number;
  lastCheckedAt?: number;
  message: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface GitHubRepoRaw {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  updated_at: string;
  pushed_at: string;
  html_url: string;
  default_branch: string;
}

export interface ProjectConfigEntry {
  /** Unique identifier (matches GitHub repo `name` when overriding/pinning a GitHub repo) */
  id: string;
  /** Optional GitHub repository name to link/override */
  repoName?: string;
  title: string;
  category: CategoryId;
  tagline: string;
  overview: string;
  technicalHighlights: string[];
  architectureSummary?: string;
  metrics?: ProjectMetric[];
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  serverType?: ServerPlatform;
  keepAlive?: boolean;
  icon?: string;
  accentColor?: string;
  pinned?: boolean;
}

export interface ProjectsConfigFile {
  pinnedProjects: ProjectConfigEntry[];
  hiddenRepoNames: string[];
  customProjects: ProjectConfigEntry[];
}

export interface DevHubProject {
  id: string;
  repoName?: string;
  title: string;
  category: CategoryId;
  tagline: string;
  overview: string;
  technicalHighlights: string[];
  architectureSummary?: string;
  metrics?: ProjectMetric[];
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  serverType: ServerPlatform;
  keepAlive?: boolean;
  icon: string;
  accentColor: string;
  pinned: boolean;
  hidden: boolean;
  source: 'github' | 'custom' | 'hybrid';
  language?: string | null;
  stars: number;
  forks: number;
  updatedAt?: string;
}

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  shortLabel: string;
  description: string;
  badgeClass: string;
  dotClass: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: 'success' | 'info' | 'warning';
}
