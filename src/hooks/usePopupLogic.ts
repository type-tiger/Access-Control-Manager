import { useEffect, useState, useRef, useCallback } from "react";
import { message } from "antd";
import type { AccessControlConfig } from "../lib/access-control";
import {
  LANG_KEY,
  loadAccessControlConfig,
  saveAccessControlConfig,
} from "../lib/storage";
import { createTranslator, ensureLanguagesLoaded } from "../lib/i18n";

interface PageInfo {
  url: string;
  title: string;
  projects: Array<{
    id: string;
    name: string;
    selector: string;
    elementCount: number;
    enabled: boolean;
    behavior: string;
    module: string;
    description: string;
    urlMatches?: boolean; // Whether URL matches
    urlPattern?: string; // URL match pattern
  }>;
  totalElementCount: number;
  totalMatchingElementCount?: number; // Total element count considering URL matching
  configuredProjectCount: number;
  enabledProjectCount: number;
  enabledMatchingProjectCount?: number; // Number of enabled and URL-matched projects
}

export function usePopupLogic() {
  const [config, setConfig] = useState<AccessControlConfig>({
    customProjects: {},
  });
  const [loading, setLoading] = useState(true);
  const [languagesLoading, setLanguagesLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [lang, setLang] = useState<string>(
    () => localStorage.getItem(LANG_KEY) || "en"
  );
  const [messageApi, contextHolder] = message.useMessage();

  // Refs for debounce and deduplication
  const lastConfigAppliedRef = useRef<string>("");
  const pageInfoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isApplyingConfigRef = useRef(false);

  // Load saved configuration and ensure languages are loaded
  useEffect(() => {
    const initializePopup = async () => {
      try {
        // Ensure languages are loaded first
        await ensureLanguagesLoaded();
        console.log("🌐 Languages loaded, proceeding with configuration load");
        setLanguagesLoading(false);

        // Then load configuration
        await loadConfiguration();
      } catch (error) {
        console.error("❌ Error during popup initialization:", error);
        // Still try to load configuration even if languages fail
        setLanguagesLoading(false);
        await loadConfiguration();
      }
    };

    initializePopup();
  }, []);

  // Debounced config application function
  const debouncedApplyConfig = useCallback(
    async (configToApply: AccessControlConfig) => {
      // Generate unique config identifier
      const configHash = JSON.stringify({
        projects: Object.keys(configToApply.customProjects),
        lang,
        timestamp: Math.floor(Date.now() / 1000), // Deduplication by second
      });

      // Avoid applying same config repeatedly
      if (
        lastConfigAppliedRef.current === configHash ||
        isApplyingConfigRef.current
      ) {
        console.log("🔄 Skipping duplicate config application");
        return;
      }

      isApplyingConfigRef.current = true;
      lastConfigAppliedRef.current = configHash;

      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (tab.id) {
          console.log("📤 Applying config to tab:", tab.id);
          await chrome.tabs.sendMessage(tab.id, {
            type: "APPLY_ACCESS_CONTROL",
            config: configToApply,
            lang,
          });

          // Clear previous timer
          if (pageInfoTimeoutRef.current) {
            clearTimeout(pageInfoTimeoutRef.current);
          }

          // Debounced page info retrieval
          pageInfoTimeoutRef.current = setTimeout(() => {
            console.log("📊 Getting page info after config applied");
            getPageInfo(configToApply);
          }, 300);
        }
      } catch (error) {
        console.error("❌ Error applying config:", error);
      } finally {
        isApplyingConfigRef.current = false;
      }
    },
    [lang]
  );

  // Listen for config changes and auto-apply to current page
  useEffect(() => {
    if (!loading && config && Object.keys(config.customProjects).length > 0) {
      debouncedApplyConfig(config);
    }
  }, [loading, config, debouncedApplyConfig]);

  // Save when switching language
  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    console.log("🌐 Language changed to:", lang);
  }, [lang]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (pageInfoTimeoutRef.current) {
        clearTimeout(pageInfoTimeoutRef.current);
      }
    };
  }, []);

  const loadConfiguration = async () => {
    console.log("📥 Starting to load configuration...");
    setLoading(true);
    try {
      const savedConfig = await loadAccessControlConfig();
      console.log("📋 Loaded config:", savedConfig);
      setConfig(savedConfig);
      // Note: Don't call getPageInfo here, let useEffect handle it uniformly
    } catch (error) {
      console.error("❌ Error loading configuration:", error);
    } finally {
      setLoading(false);
      console.log("✅ Configuration loading completed");
    }
  };

  // Debounced page info retrieval function
  const getPageInfo = useCallback(
    async (configToUse?: AccessControlConfig) => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (tab.id) {
          const currentConfig = configToUse || config;
          console.log("📤 Sending GET_PAGE_INFO with config");
          const response = await chrome.tabs.sendMessage(tab.id, {
            type: "GET_PAGE_INFO",
            config: currentConfig,
            lang: lang,
          });
          if (response && response.success) {
            setPageInfo(response.pageInfo);
            console.log("📄 Page info received and set");
          } else {
            console.error("❌ Failed to get page info:", response?.error);
          }
        }
      } catch (error) {
        console.error("❌ Error getting page info:", error);
      }
    },
    [config, lang]
  );

  // Apply configuration to current tab
  const applyConfigToCurrentTab = async (
    configToApply: AccessControlConfig
  ) => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      console.log("🎯 Current tab:", tab);
      if (tab.id) {
        console.log(
          "📤 Sending APPLY_ACCESS_CONTROL message with config:",
          configToApply
        );
        console.log("🌐 Language:", lang);
        const response = await chrome.tabs.sendMessage(tab.id, {
          type: "APPLY_ACCESS_CONTROL",
          config: configToApply,
          lang,
        });
        console.log("📡 Response from content script:", response);
        console.log("✅ Config applied to current tab");
      } else {
        console.warn("⚠️ No tab ID found");
      }
    } catch (error) {
      console.error("❌ Error applying config to current tab:", error);
    }
  };

  // Enable all control
  const enableAll = async () => {
    console.log("🔴 Enabling control for all projects...");
    const t = createTranslator(lang);
    const newConfig = {
      ...config,
      customProjects: { ...config.customProjects },
    };
    Object.keys(newConfig.customProjects).forEach((projectId) => {
      newConfig.customProjects[projectId].enabled = true;
    });

    setConfig(newConfig);
    await saveAccessControlConfig(newConfig);
    await applyConfigToCurrentTab(newConfig);
    setTimeout(getPageInfo, 100);
    messageApi.success(t("enabledAllProjects"));
  };

  // Disable all control
  const disableAll = async () => {
    console.log("🟢 Disabling control for all projects...");
    const t = createTranslator(lang);
    const newConfig = {
      ...config,
      customProjects: { ...config.customProjects },
    };
    Object.keys(newConfig.customProjects).forEach((projectId) => {
      newConfig.customProjects[projectId].enabled = false;
    });

    setConfig(newConfig);
    await saveAccessControlConfig(newConfig);
    await applyConfigToCurrentTab(newConfig);
    setTimeout(getPageInfo, 100);
    messageApi.success(t("disabledAllProjects"));
  };

  // Handle project configuration changes
  const handleConfigChange = async (newConfig: AccessControlConfig) => {
    setConfig(newConfig);
    await saveAccessControlConfig(newConfig);
    await applyConfigToCurrentTab(newConfig);
    // Re-fetch page info after configuration changes
    setTimeout(getPageInfo, 100);
  };

  return {
    config,
    loading: loading || languagesLoading, // Combined loading state
    pageInfo,
    lang,
    setLang,
    messageApi,
    contextHolder,
    enableAll,
    disableAll,
    handleConfigChange,
    languagesLoading, // Separate flag for language loading
  };
}
