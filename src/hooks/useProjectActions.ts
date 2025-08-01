import { useCallback } from "react";
import type {
  AccessControlConfig,
  CustomProjectConfig,
} from "../lib/access-control";
import {
  validateCustomProject,
  exportCustomProjects,
  importCustomProjects,
} from "../lib/access-control";
import { createNewId } from "../utils/common";
import { createTranslator } from "../lib/i18n";

export function useProjectActions(
  config: AccessControlConfig,
  onConfigChange: (config: AccessControlConfig) => void,
  messageApi: any,
  lang: string
) {
  const t = createTranslator(lang);

  const addProject = useCallback(
    (projectData: Omit<CustomProjectConfig, "name"> & { name: string }) => {
      // Calculate next order value for the target module
      const targetModule = projectData.module;
      const existingProjectsInModule = Object.values(config.customProjects)
        .filter((p) => p.module === targetModule)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      const nextOrder =
        existingProjectsInModule.length > 0
          ? Math.max(...existingProjectsInModule.map((p) => p.order ?? 0)) + 1
          : 0;

      const newProject: CustomProjectConfig = {
        ...projectData,
        enabled: true,
        order: nextOrder,
      };

      const validation = validateCustomProject(
        newProject,
        config.customProjects
      );

      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      const newConfig = {
        ...config,
        customProjects: {
          ...config.customProjects,
          [newProject.name]: newProject,
        },
      };

      onConfigChange(newConfig);
      return { success: true };
    },
    [config, onConfigChange]
  );

  const updateProject = useCallback(
    (
      originalName: string,
      projectData: Omit<CustomProjectConfig, "name"> & { name: string }
    ) => {
      const originalProject = config.customProjects[originalName];

      if (!originalProject) {
        return { success: false, error: "Original project not found" };
      }

      const moduleChanged = originalProject.module !== projectData.module;

      let updatedProject: CustomProjectConfig;

      if (moduleChanged) {
        // If module changed, calculate new order for the target module
        const targetModuleProjects = Object.values(config.customProjects)
          .filter(
            (p) => p.module === projectData.module && p.name !== originalName
          )
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        const newOrder =
          targetModuleProjects.length > 0
            ? Math.max(...targetModuleProjects.map((p) => p.order ?? 0)) + 1
            : 0;

        updatedProject = {
          ...projectData,
          order: newOrder,
        };
      } else {
        // Same module, preserve original order
        updatedProject = {
          ...projectData,
          order: originalProject.order ?? 0,
        };
      }

      // Validate the updated project
      const otherProjects = { ...config.customProjects };
      delete otherProjects[originalName]; // Exclude the current project from validation

      const validation = validateCustomProject(updatedProject, otherProjects);

      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      let newCustomProjects = { ...config.customProjects };

      // If name changed, remove old entry
      if (originalName !== updatedProject.name) {
        delete newCustomProjects[originalName];
      }

      // Update the project
      newCustomProjects[updatedProject.name] = updatedProject;

      // If module changed, reorder the source module to close gaps
      if (moduleChanged) {
        const sourceModuleProjects = Object.values(newCustomProjects)
          .filter(
            (p) =>
              p.module === originalProject.module &&
              p.name !== updatedProject.name
          )
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        sourceModuleProjects.forEach((project, index) => {
          newCustomProjects[project.name] = {
            ...newCustomProjects[project.name],
            order: index,
          };
        });
      }

      const newConfig = {
        ...config,
        customProjects: newCustomProjects,
      };

      onConfigChange(newConfig);
      return { success: true };
    },
    [config, onConfigChange]
  );

  const copyProject = useCallback(
    (project: CustomProjectConfig) => {
      const newName = `${project.name} Copy`;
      const newProject: CustomProjectConfig = {
        ...project,
        name: newName,
        enabled: false,
      };

      const validation = validateCustomProject(
        newProject,
        config.customProjects
      );

      if (!validation.isValid) {
        let counter = 1;
        let attemptName = `${project.name} Copy ${counter}`;

        while (config.customProjects[attemptName]) {
          counter++;
          attemptName = `${project.name} Copy ${counter}`;
        }

        newProject.name = attemptName;
      }

      const newConfig = {
        ...config,
        customProjects: {
          ...config.customProjects,
          [newProject.name]: newProject,
        },
      };

      onConfigChange(newConfig);
      messageApi.success(t("projectSaved"));
    },
    [config, onConfigChange, messageApi, t]
  );

  const deleteProject = useCallback(
    (projectName: string) => {
      const newCustomProjects = { ...config.customProjects };
      delete newCustomProjects[projectName];

      const newConfig = {
        ...config,
        customProjects: newCustomProjects,
      };

      onConfigChange(newConfig);
      messageApi.success(t("projectDeleted"));
    },
    [config, onConfigChange, messageApi, t]
  );

  const toggleProject = useCallback(
    (projectName: string, enabled: boolean) => {
      const newConfig = {
        ...config,
        customProjects: {
          ...config.customProjects,
          [projectName]: {
            ...config.customProjects[projectName],
            enabled,
          },
        },
      };

      onConfigChange(newConfig);
    },
    [config, onConfigChange]
  );

  const batchToggleProjects = useCallback(
    (projectNames: string[], enabled: boolean) => {
      const newCustomProjects = { ...config.customProjects };

      projectNames.forEach((name) => {
        if (newCustomProjects[name]) {
          newCustomProjects[name] = {
            ...newCustomProjects[name],
            enabled,
          };
        }
      });

      const newConfig = {
        ...config,
        customProjects: newCustomProjects,
      };

      onConfigChange(newConfig);
    },
    [config, onConfigChange]
  );

  const updateProjectBehavior = useCallback(
    (
      projectName: string,
      behavior: "hide" | "disable" | "blur" | "restrict"
    ) => {
      const newConfig = {
        ...config,
        customProjects: {
          ...config.customProjects,
          [projectName]: {
            ...config.customProjects[projectName],
            behavior,
          },
        },
      };

      onConfigChange(newConfig);
    },
    [config, onConfigChange]
  );

  return {
    addProject,
    updateProject,
    copyProject,
    deleteProject,
    toggleProject,
    batchToggleProjects,
    updateProjectBehavior,
  };
}
