import { useCallback, useEffect, useState } from 'react';
import { GITHUB_FALLBACK_REPOS } from '../data/githubFallback';
import type { GitHubRepoRaw } from '../types/project';

const CACHE_KEY = 'devhub_github_repos_cache_v1';
const CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes to stay well within 60 req/hr limit
const GITHUB_API_URL =
  'https://api.github.com/users/Winter101006/repos?per_page=100&sort=updated';

export type SyncSource = 'live-api' | 'cached' | 'fallback';

interface CachedPayload {
  fetchedAt: number;
  repos: GitHubRepoRaw[];
}

export function useGitHubRepos() {
  const [repos, setRepos] = useState<GitHubRepoRaw[]>(GITHUB_FALLBACK_REPOS);
  const [loading, setLoading] = useState<boolean>(false);
  const [syncSource, setSyncSource] = useState<SyncSource>('fallback');
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const syncFromGitHub = useCallback(async (forceRefresh = false) => {
    // Check fresh cache first unless forceRefresh is requested
    if (!forceRefresh) {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CachedPayload;
          if (
            Array.isArray(parsed.repos) &&
            parsed.repos.length > 0 &&
            Date.now() - parsed.fetchedAt < CACHE_TTL_MS
          ) {
            setRepos(parsed.repos);
            setLastSyncedAt(parsed.fetchedAt);
            setSyncSource('cached');
            return { ok: true, source: 'cached' as const, count: parsed.repos.length };
          }
        }
      } catch {
        // Ignore corrupted cache
      }
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 7000);
      const response = await fetch(GITHUB_API_URL, {
        headers: {
          Accept: 'application/vnd.github+json',
        },
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`GitHub API HTTP ${response.status}`);
      }

      const data = (await response.json()) as GitHubRepoRaw[];
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Empty repository list returned');
      }

      const fetchedAt = Date.now();
      setRepos(data);
      setLastSyncedAt(fetchedAt);
      setSyncSource('live-api');

      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ fetchedAt, repos: data } satisfies CachedPayload)
        );
      } catch {
        // Ignore storage quota issues
      }

      return { ok: true, source: 'live-api' as const, count: data.length };
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Không thể kết nối GitHub API';
      setErrorMsg(msg);
      // Fallback safely to cached if available, otherwise local snapshot
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CachedPayload;
          if (Array.isArray(parsed.repos) && parsed.repos.length > 0) {
            setRepos(parsed.repos);
            setLastSyncedAt(parsed.fetchedAt);
            setSyncSource('cached');
            return { ok: false, source: 'cached' as const, count: parsed.repos.length, error: msg };
          }
        }
      } catch {
        // Ignore
      }
      setRepos(GITHUB_FALLBACK_REPOS);
      setSyncSource('fallback');
      return { ok: false, source: 'fallback' as const, count: GITHUB_FALLBACK_REPOS.length, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void syncFromGitHub(false);
  }, [syncFromGitHub]);

  return {
    repos,
    loading,
    syncSource,
    lastSyncedAt,
    errorMsg,
    syncFromGitHub,
  };
}
