import { getDefaultAccessControlConfig } from "./access-control";
import type { AccessControlConfig } from "./access-control";

const STORAGE_KEY = "access-control-config";
export const LANG_KEY = "access-control-lang";
const UI_STATE_KEY = "access-control-ui-state";

// UI state interface
export interface UIState {
  viewMode: "list" | "group";
  expandedGroups: string[];
  scrollPosition: number;
}

// Default UI state
export const getDefaultUIState = (): UIState => ({
  viewMode: "group",
  expandedGroups: [],
  scrollPosition: 0,
});

// Get chrome API, compatible with different environments
const getChromeApi = () => {
  if (typeof chrome !== "undefined" && chrome.storage) {
    return chrome;
  }
  if (
    typeof globalThis !== "undefined" &&
    globalThis.chrome &&
    globalThis.chrome.storage
  ) {
    return globalThis.chrome;
  }
  if (typeof window !== "undefined" && window.chrome && window.chrome.storage) {
    return (window as any).chrome;
  }
  throw new Error("Chrome API not available");
};

/**
 * Save access control config to local storage
 */
export async function saveAccessControlConfig(
  config: AccessControlConfig
): Promise<void> {
  try {
    const chromeApi = getChromeApi();
    await chromeApi.storage.local.set({ [STORAGE_KEY]: config });
  } catch (error) {
    console.error("❌ Failed to save config:", error);
    // If chrome.storage is not available, try to use localStorage as fallback
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (fallbackError) {
      console.error("❌ Fallback localStorage also failed:", fallbackError);
      throw error;
    }
  }
}

/**
 * Load access control config from local storage
 */
export async function loadAccessControlConfig(): Promise<AccessControlConfig> {
  try {
    const chromeApi = getChromeApi();
    const result = await chromeApi.storage.local.get(STORAGE_KEY);
    const savedConfig = result[STORAGE_KEY];

    console.log("🔍 Loading config from chrome.storage:", {
      result,
      savedConfig,
    });

    if (
      savedConfig &&
      savedConfig.customProjects &&
      Object.keys(savedConfig.customProjects).length > 0
    ) {
      return savedConfig;
    }
  } catch (error) {
    console.error("❌ Failed to load from chrome.storage:", error);

    // Try to load from localStorage as fallback
    try {
      const localStorageData = localStorage.getItem(STORAGE_KEY);
      if (localStorageData) {
        const savedConfig = JSON.parse(localStorageData);
        console.log(
          "🔍 Loading config from localStorage fallback:",
          savedConfig
        );

        if (
          savedConfig &&
          savedConfig.customProjects &&
          Object.keys(savedConfig.customProjects).length > 0
        ) {
          return savedConfig;
        }
      }
    } catch (fallbackError) {
      console.error("❌ Fallback localStorage also failed:", fallbackError);
    }
  }

  // If all failed, return default config
  const defaultConfig = getDefaultAccessControlConfig();
  console.log("⚠️ No saved config found, using default:", defaultConfig);
  return defaultConfig;
}

/**
 * Clear access control config from local storage
 */
export async function clearAccessControlConfig(): Promise<void> {
  try {
    const chromeApi = getChromeApi();
    await chromeApi.storage.local.remove(STORAGE_KEY);
  } catch (error) {
    console.error("❌ Failed to clear chrome.storage:", error);

    // Fallback: clear localStorage
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (fallbackError) {
      console.error("❌ Failed to clear localStorage:", fallbackError);
    }
  }
}

/**
 * Listen to local storage changes
 */
export function onAccessControlConfigChange(
  callback: (newConfig: AccessControlConfig) => void
): void {
  try {
    const chromeApi = getChromeApi();
    chromeApi.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "local" && changes[STORAGE_KEY]) {
        const newConfig = changes[STORAGE_KEY].newValue;
        if (newConfig) {
          callback(newConfig);
        }
      }
    });
  } catch (error) {
    console.error("❌ Failed to setup storage change listener:", error);
  }
}

/**
 * Save UI state to local storage
 */
export async function saveUIState(uiState: UIState): Promise<void> {
  try {
    const chromeApi = getChromeApi();
    await chromeApi.storage.local.set({ [UI_STATE_KEY]: uiState });
  } catch (error) {
    console.error("❌ Failed to save UI state:", error);
    // If chrome.storage is not available, try to use localStorage as fallback
    try {
      localStorage.setItem(UI_STATE_KEY, JSON.stringify(uiState));
    } catch (fallbackError) {
      console.error("❌ Fallback localStorage also failed:", fallbackError);
      throw error;
    }
  }
}

/**
 * Load UI state from local storage
 */
export async function loadUIState(): Promise<UIState> {
  try {
    const chromeApi = getChromeApi();
    const result = await chromeApi.storage.local.get(UI_STATE_KEY);
    const savedState = result[UI_STATE_KEY];

    console.log("🔍 Loading UI state from chrome.storage:", {
      result,
      savedState,
    });

    if (savedState) {
      return { ...getDefaultUIState(), ...savedState };
    }
  } catch (error) {
    console.error("❌ Failed to load UI state from chrome.storage:", error);

    // Try to load from localStorage as fallback
    try {
      const localStorageData = localStorage.getItem(UI_STATE_KEY);
      if (localStorageData) {
        const savedState = JSON.parse(localStorageData);
        console.log("✅ UI state loaded from localStorage:", savedState);
        return { ...getDefaultUIState(), ...savedState };
      }
    } catch (fallbackError) {
      console.error("❌ Fallback localStorage also failed:", fallbackError);
    }
  }

  // If all failed, return default state
  const defaultState = getDefaultUIState();
  console.log("⚠️ No saved UI state found, using default:", defaultState);
  return defaultState;
}

/**
 * Clear UI state
 */
export async function clearUIState(): Promise<void> {
  try {
    const chromeApi = getChromeApi();
    await chromeApi.storage.local.remove(UI_STATE_KEY);
  } catch (error) {
    console.error("❌ Failed to clear UI state from chrome.storage:", error);

    // Fallback: clear localStorage
    try {
      localStorage.removeItem(UI_STATE_KEY);
    } catch (fallbackError) {
      console.error(
        "❌ Failed to clear UI state from localStorage:",
        fallbackError
      );
    }
  }
}
