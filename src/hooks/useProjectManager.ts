import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_PROJECTS_CONFIG } from '../data/projectsConfig';
import type {
  DevHubProject,
  ProjectConfigEntry,
  ProjectsConfigFile,
} from '../types/project';

const CONFIG_STORAGE_KEY = 'devhub_projects_config_override_v2';

function cloneDefaultConfig(): ProjectsConfigFile {
  return JSON.parse(JSON.stringify(DEFAULT_PROJECTS_CONFIG)) as ProjectsConfigFile;
}

function loadInitialConfig(): { config: ProjectsConfigFile; hasLocalEdits: boolean } {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ProjectsConfigFile;
      if (
        parsed &&
        Array.isArray(parsed.pinnedProjects) &&
        Array.isArray(parsed.hiddenRepoNames) &&
        Array.isArray(parsed.customProjects)
      ) {
        return { config: parsed, hasLocalEdits: true };
      }
    }
  } catch {
    // Fallback to default config
  }
  return { config: cloneDefaultConfig(), hasLocalEdits: false };
}

export function useProjectManager() {
  const [{ config, hasLocalEdits }, setState] = useState(loadInitialConfig);

  const persistConfig = useCallback((next: ProjectsConfigFile, edited = true) => {
    setState({ config: next, hasLocalEdits: edited });
    try {
      if (edited) {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(next));
      } else {
        localStorage.removeItem(CONFIG_STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === CONFIG_STORAGE_KEY) {
        setState(loadInitialConfig());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleVisibility = useCallback(
    (identifier: string) => {
      const lower = identifier.toLowerCase();
      const exists = config.hiddenRepoNames.some((n) => n.toLowerCase() === lower);
      const hiddenRepoNames = exists
        ? config.hiddenRepoNames.filter((n) => n.toLowerCase() !== lower)
        : [...config.hiddenRepoNames, identifier];

      persistConfig({ ...config, hiddenRepoNames });
    },
    [config, persistConfig]
  );

  const togglePin = useCallback(
    (project: DevHubProject) => {
      const key = (project.repoName || project.id).toLowerCase();

      // If it's a custom project in customProjects, toggle its pinned flag in place
      const customIdx = config.customProjects.findIndex(
        (c) => c.id.toLowerCase() === project.id.toLowerCase()
      );
      if (customIdx !== -1 && project.source === 'custom' && !project.repoName) {
        const updatedCustom = config.customProjects.map((item, idx) =>
          idx === customIdx ? { ...item, pinned: !project.pinned } : item
        );
        persistConfig({ ...config, customProjects: updatedCustom });
        return;
      }

      // If it already exists in pinnedProjects, toggle its pinned flag while keeping rich copy
      const pinnedIdx = config.pinnedProjects.findIndex(
        (p) => (p.repoName || p.id).toLowerCase() === key
      );
      if (pinnedIdx !== -1) {
        const updatedPinned = config.pinnedProjects.map((item, idx) =>
          idx === pinnedIdx ? { ...item, pinned: !project.pinned } : item
        );
        persistConfig({ ...config, pinnedProjects: updatedPinned });
        return;
      }

      // Otherwise promote this GitHub repo into pinnedProjects
      const newEntry: ProjectConfigEntry = {
        id: project.id,
        repoName: project.repoName,
        title: project.title,
        category: project.category,
        tagline: project.tagline,
        overview: project.overview,
        technicalHighlights: project.technicalHighlights,
        architectureSummary: project.architectureSummary,
        metrics: project.metrics,
        techStack: project.techStack,
        liveUrl: project.liveUrl,
        githubUrl: project.githubUrl,
        serverType: project.serverType,
        icon: project.icon,
        accentColor: project.accentColor,
        pinned: true,
      };

      persistConfig({
        ...config,
        pinnedProjects: [newEntry, ...config.pinnedProjects],
      });
    },
    [config, persistConfig]
  );

  const addOrUpdateProject = useCallback(
    (entry: ProjectConfigEntry, isEditingExisting: boolean) => {
      const key = (entry.repoName || entry.id).toLowerCase();

      if (isEditingExisting) {
        const inPinned = config.pinnedProjects.some(
          (p) => (p.repoName || p.id).toLowerCase() === key
        );
        const inCustom = config.customProjects.some(
          (c) => c.id.toLowerCase() === entry.id.toLowerCase()
        );

        if (inPinned) {
          persistConfig({
            ...config,
            pinnedProjects: config.pinnedProjects.map((p) =>
              (p.repoName || p.id).toLowerCase() === key ? entry : p
            ),
          });
          return;
        }
        if (inCustom) {
          persistConfig({
            ...config,
            customProjects: config.customProjects.map((c) =>
              c.id.toLowerCase() === entry.id.toLowerCase() ? entry : c
            ),
          });
          return;
        }
        // Editing a plain GitHub repo -> store override in pinnedProjects
        persistConfig({
          ...config,
          pinnedProjects: [entry, ...config.pinnedProjects],
        });
        return;
      }

      // Adding a brand new custom project
      persistConfig({
        ...config,
        customProjects: [entry, ...config.customProjects],
      });
    },
    [config, persistConfig]
  );

  const deleteCustomProject = useCallback(
    (id: string) => {
      const lower = id.toLowerCase();
      persistConfig({
        ...config,
        customProjects: config.customProjects.filter((c) => c.id.toLowerCase() !== lower),
        pinnedProjects: config.pinnedProjects.filter(
          (p) => !(p.id.toLowerCase() === lower && !p.repoName)
        ),
        hiddenRepoNames: config.hiddenRepoNames.filter((h) => h.toLowerCase() !== lower),
      });
    },
    [config, persistConfig]
  );

  const resetToDefault = useCallback(() => {
    persistConfig(cloneDefaultConfig(), false);
  }, [persistConfig]);

  return {
    config,
    hasLocalEdits,
    toggleVisibility,
    togglePin,
    addOrUpdateProject,
    deleteCustomProject,
    resetToDefault,
  };
}
