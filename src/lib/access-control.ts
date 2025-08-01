import { createTranslator, I18N } from "./i18n";

// Custom project configuration interface
export interface CustomProjectConfig {
  name: string; // Display name
  description: string; // Description
  code?: string; // Permission code (optional)
  module: string; // Module/group name
  selector: string; // CSS selector (user input complete CSS selector)
  enabled: boolean; // Whether enabled
  behavior: "hide" | "disable" | "blur" | "restrict"; // Control behavior
  urlPattern?: string; // URL pattern matching, supports wildcards, optional field
  order?: number; // Sort order, smaller numbers come first
}

// Access control configuration (only includes custom projects)
export interface AccessControlConfig {
  customProjects: { [name: string]: CustomProjectConfig };
  createdModules?: string[];
}

// Project configuration validation interface
export interface ProjectValidationResult {
  isValid: boolean;
  error?: string;
  duplicateWith?: string;
}

// CSS behavior style generator
export const CSS_BEHAVIORS = {
  hide: (selector: string) => `${selector} { display: none !important; }`,
  disable: (selector: string) =>
    `${selector} { pointer-events: none !important; opacity: 0.3 !important; cursor: not-allowed !important; }`,
  blur: (selector: string) =>
    `${selector} { filter: blur(5px) !important; user-select: none !important; }`,
  restrict: (selector: string) => `
    ${selector} { position: relative !important; overflow: hidden !important; pointer-events: none !important; }
    ${selector}::after { 
      content: "Access Restricted"; 
      position: absolute !important; 
      top: 0 !important; 
      left: 0 !important; 
      right: 0 !important; 
      bottom: 0 !important; 
      background: rgba(0,0,0,0.8) !important; 
      color: white !important; 
      display: flex !important; 
      align-items: center !important; 
      justify-content: center !important; 
      font-size: 16px !important; 
      z-index: 9999 !important; 
    }
  `,
};

/**
 * Parse multiple selector strings, supports comma separation
 * @param selectorString Selector string, can be a single selector or multiple selectors separated by commas
 * @returns Array of selectors
 */
export function parseMultipleSelectors(selectorString: string): string[] {
  if (!selectorString || !selectorString.trim()) {
    return [];
  }

  return selectorString
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Validate if a single selector is valid
 * @param selector Selector string
 * @returns Whether it's valid
 */
export function isValidSelector(selector: string): boolean {
  try {
    document.querySelector(selector);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate CSS selector string based on project configuration
 */
export function generateSelectorString(project: { selector: string }): string {
  const selectors = parseMultipleSelectors(project.selector);
  return selectors.join(", ");
}

/**
 * Validate regex pattern
 */
export function validateRegexPattern(pattern: string): {
  isValid: boolean;
  error?: string;
} {
  if (!pattern || pattern.trim() === "") {
    return { isValid: true }; // Empty pattern is valid, means match all pages
  }

  try {
    new RegExp(pattern.trim(), "i");
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: `Invalid regex pattern: ${error.message}`,
    };
  }
}

/**
 * Check if URL matches the given regex pattern
 * @param urlPattern Regex pattern, empty string or undefined means match all pages
 * @param currentUrl Current page URL
 * @returns Whether it matches
 */
export function matchesUrlPattern(
  urlPattern: string | undefined,
  currentUrl: string
): boolean {
  // If no URL pattern is set, match all pages
  if (!urlPattern || urlPattern.trim() === "") {
    return true;
  }

  // Normalize URL, remove protocol and domain, keep only path part
  const normalizeUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search + urlObj.hash;
    } catch {
      // If URL is invalid, return original string
      return url;
    }
  };

  const normalizedCurrentUrl = normalizeUrl(currentUrl);
  const pattern = urlPattern.trim();

  try {
    // Use regex matching directly
    const regex = new RegExp(pattern, "i");
    return regex.test(normalizedCurrentUrl);
  } catch (error) {
    console.warn("Invalid regex pattern:", pattern, error);
    return false;
  }
}

/**
 * Apply styles dynamically based on access control configuration
 * @param config Access control configuration
 * @param lang Language
 */
export function applyAccessControl(
  config: AccessControlConfig,
  lang: string
): void {
  // Remove previous access control styles
  const existingStyle = document.getElementById("access-control-style");
  if (existingStyle) {
    existingStyle.remove();
  }

  // Get current page URL
  const currentUrl = window.location.href;

  // Generate CSS rules
  const cssRules: string[] = [];

  // Process all custom projects
  Object.values(config.customProjects).forEach((project) => {
    if (project.enabled) {
      // Check if URL matches
      if (matchesUrlPattern(project.urlPattern, currentUrl)) {
        // enabled=true means enable control
        const selectors = parseMultipleSelectors(project.selector);

        // Generate style rules for each selector
        selectors.forEach((selector) => {
          if (selector.trim()) {
            if (project.behavior === "restrict") {
              cssRules.push(CSS_BEHAVIORS.restrict(selector));
            } else {
              cssRules.push(CSS_BEHAVIORS[project.behavior](selector));
            }
          }
        });
      }
    }
  });

  // Always create style element, even if empty, to ensure previous styles are cleared
  const styleElement = document.createElement("style");
  styleElement.id = "access-control-style";
  styleElement.textContent = cssRules.join("\n");
  document.head.appendChild(styleElement);
}

/**
 * Get default access control configuration (empty config)
 */
export function getDefaultAccessControlConfig(): AccessControlConfig {
  return {
    customProjects: {},
    createdModules: [],
  };
}

/**
 * Validate uniqueness of custom project configuration
 */
export function validateCustomProject(
  project: CustomProjectConfig,
  existingProjects: { [name: string]: CustomProjectConfig },
  excludeName?: string
): ProjectValidationResult {
  // Check if selector is empty
  if (!project.selector.trim()) {
    return { isValid: false, error: "CSS selector cannot be empty" };
  }

  // Parse multiple selectors
  const selectors = parseMultipleSelectors(project.selector);

  if (selectors.length === 0) {
    return { isValid: false, error: "CSS selector cannot be empty" };
  }

  // Validate each selector's validity
  for (const selector of selectors) {
    if (!selector.trim()) {
      continue;
    }

    // Check if selector syntax is valid
    try {
      document.querySelector(selector);
    } catch (error) {
      return {
        isValid: false,
        error: `Selector syntax error: "${selector}"`,
      };
    }
  }

  return { isValid: true };
}

/**
 * Export custom project configuration as JSON
 */
export function exportCustomProjects(customProjects: {
  [name: string]: CustomProjectConfig;
}): string {
  const exportData: { [name: string]: any } = {};

  Object.values(customProjects).forEach((project) => {
    // Don't include the name in the value since it's used as key
    const { name, ...projectData } = project;
    exportData[project.name] = {
      ...projectData,
      // Ensure consistent field order
      description: project.description || "",
      code: project.code || "",
      module: project.module || "Uncategorized",
      selector: project.selector,
      behavior: project.behavior,
      urlPattern: project.urlPattern || "",
      enabled: project.enabled,
      order: project.order ?? 0,
    };
  });

  // Add metadata
  const exportWithMetadata = {
    _metadata: {
      version: "1.0.0",
      exportDate: new Date().toISOString(),
      projectCount: Object.keys(exportData).length,
    },
    projects: exportData,
  };

  return JSON.stringify(exportWithMetadata, null, 2);
}

/**
 * Import custom project configuration from JSON
 */
export function importCustomProjects(jsonString: string): {
  [name: string]: CustomProjectConfig;
} {
  try {
    const importData = JSON.parse(jsonString);
    const customProjects: { [name: string]: CustomProjectConfig } = {};

    // Support both old format (direct projects) and new format (with metadata)
    let projectsData: any;

    if (importData._metadata && importData.projects) {
      // New format with metadata
      projectsData = importData.projects;
      console.log(
        `Importing ${importData._metadata.projectCount} projects from ${importData._metadata.exportDate}`
      );
    } else {
      // Old format (direct projects)
      projectsData = importData;
    }

    Object.entries(projectsData).forEach(([name, data]: [string, any]) => {
      customProjects[name] = {
        name,
        description: data.description || "",
        code: data.code || "",
        module: data.module || "Uncategorized",
        selector: data.selector || "",
        enabled: data.enabled !== undefined ? data.enabled : true,
        behavior: data.behavior || "hide",
        urlPattern: data.urlPattern || "",
        order: data.order ?? 0,
      };
    });

    return customProjects;
  } catch (error) {
    console.error("Import parsing error:", error);
    throw new Error("Invalid JSON format for import");
  }
}
