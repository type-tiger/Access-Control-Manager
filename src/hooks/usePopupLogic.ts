import { useEffect, useState, useRef, useCallback } from "react";
import { message } from "antd";
import type { AccessControlConfig } from "../lib/access-control";
import {
  LANG_KEY,
  loadAccessControlConfig,
  saveAccessControlConfig,
} from "../lib/storage";
import { createTranslator, ensureLanguagesLoaded } from "../lib/i18n";
import { InflowwEvent } from "~types/InflowwEvent";
import logger from "../utils/console";

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
        setLanguagesLoading(false);

        // Then load configuration
        await loadConfiguration();
      } catch (error) {
        logger.error("❌ Error during popup initialization:", error);
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
        logger.log("🔄 Skipping duplicate config application");
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
          logger.log("📤 Applying config to tab:", tab.id);
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
            logger.log("📊 Getting page info after config applied");
            getPageInfo(configToApply);
          }, 300);
        }
      } catch (error) {
        logger.error("❌ Error applying config:", error);
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
    logger.log("🌐 Language changed to:", lang);
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
    logger.log("📥 Starting to load configuration...");
    setLoading(true);
    try {
      const savedConfig = await loadAccessControlConfig();
      logger.log("📋 Loaded config:", savedConfig);
      setConfig(savedConfig);
      // Note: Don't call getPageInfo here, let useEffect handle it uniformly
    } catch (error) {
      logger.error("❌ Error loading configuration:", error);
    } finally {
      setLoading(false);
      logger.log("✅ Configuration loading completed");
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
          logger.log("📤 Sending GET_PAGE_INFO with config");
          const response = await chrome.tabs.sendMessage(tab.id, {
            type: "GET_PAGE_INFO",
            config: currentConfig,
            lang: lang,
          });
          if (response && response.success) {
            setPageInfo(response.pageInfo);
            logger.log("📄 Page info received and set");
          } else {
            logger.error("❌ Failed to get page info:", response?.error);
          }
        }
      } catch (error) {
        logger.error("❌ Error getting page info:", error);
      }
    },
    [config, lang]
  );

  // Dispatch theme change event to the page via MAIN world forwarder
  const sendThemeEvent = useCallback(
    async (mode: "light" | "dark") => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (tab.id) {
          await chrome.tabs.sendMessage(tab.id, {
            type: "FORWARD_INFLOWW_EVENT",
            eventName: InflowwEvent.SET_THEME_MODE,
            eventData: { mode },
          });
          setTimeout(() => getPageInfo(), 200);
        }
      } catch (error) {
        logger.error("❌ Error sending theme event:", error);
      }
    },
    [getPageInfo]
  );

  // Dispatch language change event to the page via MAIN world forwarder
  const sendLanguageEvent = useCallback(
    async (languageTag: string) => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (tab.id) {
          await chrome.tabs.sendMessage(tab.id, {
            type: "FORWARD_INFLOWW_EVENT",
            eventName: InflowwEvent.SET_LANGUAGE,
            eventData: { language: languageTag },
          });
          setTimeout(() => getPageInfo(), 200);
        }
      } catch (error) {
        logger.error("❌ Error sending language event:", error);
      }
    },
    [getPageInfo]
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
      logger.log("🎯 Current tab:", tab);
      if (tab.id) {
        logger.log(
          "📤 Sending APPLY_ACCESS_CONTROL message with config:",
          configToApply
        );
        logger.log("🌐 Language:", lang);
        const response = await chrome.tabs.sendMessage(tab.id, {
          type: "APPLY_ACCESS_CONTROL",
          config: configToApply,
          lang,
        });
        logger.log("📡 Response from content script:", response);
        logger.log("✅ Config applied to current tab");
      } else {
        logger.warn("⚠️ No tab ID found");
      }
    } catch (error) {
      logger.error("❌ Error applying config to current tab:", error);
    }
  };

  // Enable all control
  const enableAll = async () => {
    logger.log("🔴 Enabling control for all projects...");
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
    logger.log("🟢 Disabling control for all projects...");
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
    getPageInfo,
    sendThemeEvent,
    sendLanguageEvent,
  };
}
