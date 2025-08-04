import { useCallback } from "react";
import type { AccessControlConfig } from "../lib/access-control";
import {
  exportCustomProjects,
  importCustomProjects,
} from "../lib/access-control";
import { createTranslator } from "../lib/i18n";

export function useImportExport(
  config: AccessControlConfig,
  onConfigChange: (config: AccessControlConfig) => void,
  messageApi: any,
  lang: string,
  // UI state management
  onGroupExpand?: (groups: string[]) => void
) {
  const t = createTranslator(lang);

  const handleExport = useCallback(() => {
    try {
      const projectCount = Object.keys(config.customProjects).length;

      if (projectCount === 0) {
        messageApi.warning(t("noCustomProjects"));
        return;
      }

      const jsonString = exportCustomProjects(config.customProjects);

      // Create blob and download
      const blob = new Blob([jsonString], {
        type: "application/json;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);

      // Create timestamp for filename
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .split("T")[0];

      // Create download link
      const link = document.createElement("a");
      link.href = url;
      link.download = `access-control-config-${timestamp}.json`;
      link.style.display = "none";

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Clean up with delay to ensure download starts
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

      messageApi.success(
        t("exportSuccess") + ` (${projectCount} ${t("projects")})`
      );
    } catch (error) {
      console.error("Export failed:", error);
      messageApi.error(t("exportError"));
    }
  }, [config.customProjects, messageApi, t]);

  const handleImport = useCallback(
    (file: File) => {
      return new Promise<boolean>((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const result = e.target?.result as string;
            const importedProjects = importCustomProjects(result);

            if (importedProjects) {
              const newConfig = {
                ...config,
                customProjects: {
                  ...config.customProjects,
                  ...importedProjects,
                },
              };

              onConfigChange(newConfig);
              messageApi.success(t("importSuccess"));
              resolve(true);
            } else {
              messageApi.error(t("importError"));
              resolve(false);
            }
          } catch (error) {
            console.error("Import failed:", error);
            messageApi.error(t("importError"));
            resolve(false);
          }
        };

        reader.onerror = () => {
          messageApi.error(t("importError"));
          resolve(false);
        };

        reader.readAsText(file);
      });
    },
    [config, onConfigChange, messageApi, t]
  );

  const clearAllProjects = useCallback(() => {
    // Clear all expanded groups when clearing all projects
    if (onGroupExpand) {
      onGroupExpand([]);
    }

    const newConfig = {
      ...config,
      customProjects: {},
      createdModules: [],
    };

    onConfigChange(newConfig);
    messageApi.success(t("clearAllSuccess"));
  }, [config, onConfigChange, messageApi, t, onGroupExpand]);

  return {
    handleExport,
    handleImport,
    clearAllProjects,
  };
}
