// Language loading system
let availableLanguages: { [key: string]: string } = {};
let currentTranslations: any = {};
let isLanguagesLoaded = false;
let loadingPromise: Promise<void> | null = null;

const loadLanguages = async (): Promise<void> => {
  if (isLanguagesLoaded) {
    return;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    try {
      console.log("🌐 Loading language files...");
      // Load English (always available)
      const enModule = await import("./locales/en");
      availableLanguages["en"] = "English";
      currentTranslations["en"] = enModule.en;
      isLanguagesLoaded = true;
      console.log("✅ Language files loaded successfully");
    } catch (error) {
      console.error("❌ Failed to load language files:", error);
      // Fallback: create minimal English translations
      availableLanguages["en"] = "English";
      currentTranslations["en"] = {
        loading: "Loading...",
        noCustomProjects: "No custom projects yet",
        addProject: "Add Project",
        // Add other essential keys as fallback
      };
      isLanguagesLoaded = true;
    }
  })();

  return loadingPromise;
};

// Initialize languages immediately
loadLanguages();

// Default language
export const DEFAULT_LANGUAGE = "en";

// Ensure languages are loaded before using translations
export const ensureLanguagesLoaded = async (): Promise<void> => {
  if (!isLanguagesLoaded) {
    await loadLanguages();
  }
};

// Check if languages are loaded
export const areLanguagesLoaded = (): boolean => {
  return isLanguagesLoaded;
};

// Get available languages
export const getAvailableLanguages = () => {
  return availableLanguages;
};

// Check if language selector should be shown
export const shouldShowLanguageSelector = () => {
  return Object.keys(availableLanguages).length > 1;
};

// Get translation for a key with parameter support
export const t = (
  key: string,
  lang: string = DEFAULT_LANGUAGE,
  params?: Record<string, any>
) => {
  // If languages not loaded yet, show loading indicator for certain keys
  if (!isLanguagesLoaded) {
    console.warn(
      "⚠️ Translations not loaded yet, showing fallback for key:",
      key
    );
    // Return user-friendly fallback instead of raw key
    const loadingFallbacks: { [key: string]: string } = {
      loading: "Loading...",
      waitingForPageInfo: "Waiting for page info...",
      noCustomProjects: "No custom projects",
      noCustomProjectsYet: "No custom projects yet",
      addProject: "Add Project",
      export: "Export",
      import: "Import",
      clearAll: "Clear All",
      enableAllControl: "Enable All Control",
      disableAllControl: "Disable All Control",
      groupView: "Group View",
      listView: "List View",
      title: "Access Control Manager",
      customProjects: "Custom Projects",
      viewMode: "View Mode",
      addModule: "Add Module",
    };
    return loadingFallbacks[key] || key;
  }

  if (!currentTranslations[lang]) {
    // Fallback to default language
    lang = DEFAULT_LANGUAGE;
  }

  const translation = currentTranslations[lang]?.[key];
  if (translation === undefined) {
    // Fallback to English if key not found
    const fallbackTranslation =
      currentTranslations[DEFAULT_LANGUAGE]?.[key] || key;
    return params
      ? replaceParams(fallbackTranslation, params)
      : fallbackTranslation;
  }

  return params ? replaceParams(translation, params) : translation;
};

// Helper function to replace parameters in translation strings
const replaceParams = (text: string, params: Record<string, any>): string => {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match;
  });
};

// Translation helper functions
export const I18N = {
  get: (key: string, lang: string = DEFAULT_LANGUAGE) => t(key, lang),
};

// Helper function to create a translation getter for a specific language
export const createTranslator = (lang: string) => {
  return (key: string, params?: Record<string, any>) => t(key, lang, params);
};
