import type { PlasmoCSConfig } from "plasmo";
import {
  applyAccessControl,
  matchesUrlPattern,
  parseMultipleSelectors,
} from "../lib/access-control";
import { InflowwEvent, ThemeMode } from "../types/InflowwEvent";
import type {
  SetLanguagePayload,
  SetThemeModePayload,
  CallEventResponse,
} from "../types/InflowwEvent";
import logger from "../utils/console";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_start",
  all_frames: true,
};

// Debounce and caching
let lastAppliedConfigHash = "";
let isProcessingMessage = false;
let thirdPartyIntegration_themeMode: boolean = false;
let thirdPartyIntegration_language: boolean = false;

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // For iframes, only handle necessary messages
  if (window !== window.top) {
    if (request.type === "APPLY_ACCESS_CONTROL") {
      // Apply config silently in iframe without logging
      try {
        currentConfig = request.config;
        currentLang = request.lang || "en";
        applyAccessControl(request.config, request.lang);
        sendResponse({ success: true });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
      return true;
    }
    // Ignore other message types in iframe
    return false;
  }

  // Only execute in main frame
  logger.log("📨 Content script received message:", request);

  if (request.type === "APPLY_ACCESS_CONTROL") {
    // Prevent duplicate processing
    if (isProcessingMessage) {
      logger.log("🔄 Already processing message, skipping...");
      sendResponse({ success: true, skipped: true });
      return true;
    }

    // Generate config hash for deduplication
    const configHash = JSON.stringify({
      projects: request.config?.customProjects || {},
      lang: request.lang,
    });

    if (lastAppliedConfigHash === configHash) {
      logger.log("🔄 Same config already applied, skipping...");
      sendResponse({ success: true, cached: true });
      return true;
    }

    isProcessingMessage = true;
    logger.log("🎯 Applying access control with config:", request.config);
    logger.log("🌐 Language:", request.lang);

    try {
      // Update current configuration
      currentConfig = request.config;
      currentLang = request.lang || "en";
      lastAppliedConfigHash = configHash;

      // Apply access control
      applyAccessControl(request.config, request.lang);
      logger.log("✅ Access control applied successfully");
      sendResponse({ success: true });
    } catch (error) {
      logger.error("❌ Failed to apply access control:", error);
      sendResponse({ success: false, error: error.message });
    } finally {
      isProcessingMessage = false;
    }

    return true;
  }

  if (request.type === "FORWARD_INFLOWW_EVENT") {
    try {
      const { eventName, eventData } = request;
      window.postMessage(
        {
          type: "Infloww:v1:call-event",
          eventName,
          eventData,
        },
        "*"
      );
      sendResponse({ success: true });
    } catch (error) {
      sendResponse({ success: false, error: (error as any)?.message });
    }
    return true;
  }

  if (request.type === "GET_PAGE_INFO") {
    logger.log("📊 Getting page info...");
    logger.log("📦 Config received:", request.config);
    logger.log("🌐 Current frame URL:", window.location.href);

    // Only handle GET_PAGE_INFO requests in main frame
    if (window !== window.top) {
      logger.log("⏭️ Ignoring GET_PAGE_INFO in iframe");
      return false; // No response
    }

    // Async processing
    (async () => {
      try {
        let config: any;

        // If no config in request, use current saved config
        if (request.config) {
          config = request.config;
          logger.log("📦 Using config from request");
        } else {
          logger.log("📦 No config in request, using current config");
          config = currentConfig;
        }

        const projectInfo = [];
        let totalElementCount = 0;
        let totalMatchingElementCount = 0; // Total elements considering URL matching

        // Get current page URL
        const currentUrl = window.location.href;

        // Iterate through all custom projects
        Object.values(config.customProjects).forEach((project: any) => {
          try {
            // Parse multiple selectors
            const selectors = parseMultipleSelectors(project.selector || "");

            let totalElementCountForProject = 0;
            const validSelectors = [];

            // Iterate through each selector and count matching elements
            selectors.forEach((selector) => {
              try {
                const elements = document.querySelectorAll(selector);
                totalElementCountForProject += elements.length;
                if (elements.length > 0) {
                  validSelectors.push(selector);
                }
              } catch (error) {
                logger.warn(
                  `❌ Invalid selector "${selector}" for project ${project.name}:`,
                  error
                );
              }
            });

            // Check if URL matches
            const urlMatches = matchesUrlPattern(
              project.urlPattern,
              currentUrl
            );

            if (totalElementCountForProject > 0) {
              projectInfo.push({
                id: project.id,
                name: project.name,
                selector: project.selector, // Keep original selector string
                elementCount: totalElementCountForProject,
                enabled: project.enabled,
                behavior: project.behavior,
                module: project.module,
                description: project.description,
                urlMatches: urlMatches, // Add URL match status
                urlPattern: project.urlPattern, // Add URL pattern
              });
            }

            // Total element count (without considering URL matching)
            totalElementCount += totalElementCountForProject;

            // Element count considering URL matching
            if (urlMatches) {
              totalMatchingElementCount += totalElementCountForProject;
            }
          } catch (error) {
            logger.warn(
              `❌ Error processing project ${project.name}: ${project.selector}`,
              error
            );
          }
        });

        const pageInfo = {
          url: window.location.href,
          title: document.title,
          projects: projectInfo,
          totalElementCount: totalElementCount,
          totalMatchingElementCount: totalMatchingElementCount, // Total elements considering URL matching
          configuredProjectCount: Object.keys(config.customProjects).length,
          enabledProjectCount: Object.values(config.customProjects).filter(
            (p: any) => p.enabled
          ).length,
          enabledMatchingProjectCount: Object.values(
            config.customProjects
          ).filter(
            (p: any) => p.enabled && matchesUrlPattern(p.urlPattern, currentUrl)
          ).length, // Number of enabled projects that match URL
          thirdPartyIntegration_themeMode: thirdPartyIntegration_themeMode,
          thirdPartyIntegration_language: thirdPartyIntegration_language,
        };

        logger.log("📄 Page info collected:", pageInfo);
        sendResponse({ success: true, pageInfo: pageInfo });
      } catch (error) {
        logger.error("❌ Failed to collect page info:", error);
        sendResponse({ success: false, error: error.message });
      }
    })();

    return true; // Keep message channel open, wait for async response
  }

  return false;
});

// Store the latest configuration for use when DOM changes
let currentConfig: any = { customProjects: {} };
let currentLang = "en";
let currentUrl = window.location.href;

// Initialize URL listener
function initializeUrlObserver() {
  // Listen to pushState and replaceState, commonly used for SPA routing
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(history, args);
    handleUrlChange();
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(history, args);
    handleUrlChange();
  };

  // Listen to popstate event (back/forward buttons)
  window.addEventListener("popstate", handleUrlChange);

  // Listen to hashchange event
  window.addEventListener("hashchange", handleUrlChange);

  logger.log("📡 URL observer initialized");
}

// Handle URL changes
function handleUrlChange() {
  const newUrl = window.location.href;
  if (newUrl !== currentUrl) {
    logger.log("🔄 URL changed from", currentUrl, "to", newUrl);
    currentUrl = newUrl;

    // Re-apply configuration
    if (Object.keys(currentConfig.customProjects || {}).length > 0) {
      logger.log("🎯 Reapplying config due to URL change");
      applyAccessControl(currentConfig, currentLang);
    }
  }
}

// Initialize URL listener
initializeUrlObserver();

// load config form local storage
const loadConfig = () => {
  chrome.storage.local.get("access-control-config", (result) => {
    logger.log("🔍 Config loaded from local storage:", result);
    const config = result["access-control-config"];
    applyAccessControl(config, "en");
  });

  // listen to theme mode / language responses from main world
  window.addEventListener(
    "Infloww:v1:call-event-response",
    (event: CustomEvent<CallEventResponse<InflowwEvent>>) => {
      const { success = false, eventName } = event.detail;
      if (eventName === InflowwEvent.SET_THEME_MODE) {
        logger.log("🎨 Received theme mode response:", success);
        thirdPartyIntegration_themeMode = success;
      } else if (eventName === InflowwEvent.SET_LANGUAGE) {
        logger.log("🎨 Received language response:", success);
        thirdPartyIntegration_language = success;
      }
    }
  );
};

const testThirdPartyIntegration = () => {
  window.postMessage(
    {
      type: "Infloww:v1:call-event",
      eventName: InflowwEvent.SET_THEME_MODE,
      eventData: {
        mode: ThemeMode.DARK,
      } as SetThemeModePayload,
    },
    "*"
  );

  window.postMessage(
    {
      type: "Infloww:v1:call-event",
      eventName: InflowwEvent.SET_LANGUAGE,
      eventData: {
        language: "en",
      } as SetLanguagePayload,
    },
    "*"
  );
};

document.addEventListener("DOMContentLoaded", () => {
  testThirdPartyIntegration();
});

loadConfig();

logger.log("✅ Content script loaded");
