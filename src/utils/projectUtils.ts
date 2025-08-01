import type { PageInfo } from "../types/project";
import type { CustomProjectConfig } from "../lib/access-control";

// URL matching judgment function
export function isUrlMatch(urlPattern: string, url: string): boolean {
  if (!urlPattern || !urlPattern.trim()) {
    return true; // No pattern means match all
  }
  try {
    const regex = new RegExp(urlPattern);
    return regex.test(url);
  } catch {
    return false; // Invalid regex
  }
}

// Get element count from pageInfo
export function getElementCountFromPageInfo(
  projectName: string,
  pageInfo: PageInfo | null
): number {
  if (!pageInfo) return 0;
  const projectInfo = pageInfo.projects.find((p) => p.name === projectName);
  return projectInfo?.elementCount || 0;
}

// Count projects not effective due to URL mismatch
export function getUnmatchedUrlCount(
  customProjects: { [id: string]: CustomProjectConfig },
  pageInfo: PageInfo | null
): number {
  if (!pageInfo) return 0;
  const customProjectsList = Object.values(customProjects);
  return customProjectsList.filter((project) => {
    if (!project.urlPattern) return false;
    return !isUrlMatch(project.urlPattern, pageInfo.url);
  }).length;
}

// Create behavior options for select dropdown
export function createBehaviorOptions(t: (key: string) => string) {
  return [
    { label: t("behaviorHide"), value: "hide" },
    { label: t("behaviorDisable"), value: "disable" },
    { label: t("behaviorBlur"), value: "blur" },
    { label: t("behaviorRestrict"), value: "restrict" },
  ];
}

// Normalize project order values to ensure proper sorting
export function normalizeProjectOrders(customProjects: {
  [id: string]: CustomProjectConfig;
}): { [id: string]: CustomProjectConfig } {
  const normalized = { ...customProjects };

  // Group projects by module
  const projectsByModule: { [module: string]: CustomProjectConfig[] } = {};

  Object.values(normalized).forEach((project) => {
    const module = project.module || "Uncategorized";
    if (!projectsByModule[module]) {
      projectsByModule[module] = [];
    }
    projectsByModule[module].push(project);
  });

  // Sort each module's projects and reassign order values
  Object.keys(projectsByModule).forEach((module) => {
    const projects = projectsByModule[module];

    // Sort by current order, then by name as fallback
    projects.sort((a, b) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // Fallback to name comparison if orders are equal
      return a.name.localeCompare(b.name);
    });

    // Reassign sequential order values
    projects.forEach((project, index) => {
      normalized[project.name] = {
        ...normalized[project.name],
        order: index,
      };
    });
  });

  return normalized;
}

// Reorder projects within a module after drag and drop
export function reorderProjectsInModule(
  customProjects: { [id: string]: CustomProjectConfig },
  moduleName: string,
  sourceIndex: number,
  targetIndex: number
): { [id: string]: CustomProjectConfig } {
  const updated = { ...customProjects };

  // Get projects in the module, sorted by order
  const moduleProjects = Object.values(updated)
    .filter((p) => p.module === moduleName)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Perform the reorder
  const [movedProject] = moduleProjects.splice(sourceIndex, 1);
  moduleProjects.splice(targetIndex, 0, movedProject);

  // Reassign order values
  moduleProjects.forEach((project, index) => {
    updated[project.name] = {
      ...updated[project.name],
      order: index,
    };
  });

  return updated;
}

// Move project to a different module
export function moveProjectToModule(
  customProjects: { [id: string]: CustomProjectConfig },
  projectName: string,
  targetModule: string,
  targetIndex?: number
): { [id: string]: CustomProjectConfig } {
  const updated = { ...customProjects };
  const project = updated[projectName];

  if (!project) return updated;

  const sourceModule = project.module;

  // Update project's module
  updated[projectName] = {
    ...project,
    module: targetModule,
  };

  // Reorder source module (remove gaps)
  const sourceProjects = Object.values(updated)
    .filter((p) => p.module === sourceModule && p.name !== projectName)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  sourceProjects.forEach((proj, index) => {
    updated[proj.name] = {
      ...updated[proj.name],
      order: index,
    };
  });

  // Reorder target module
  const targetProjects = Object.values(updated)
    .filter((p) => p.module === targetModule)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Insert at specific position or at the end
  const insertIndex = targetIndex ?? targetProjects.length - 1;

  targetProjects.forEach((proj, index) => {
    const newOrder = index < insertIndex ? index : index + 1;
    updated[proj.name] = {
      ...updated[proj.name],
      order: newOrder,
    };
  });

  // Set order for the moved project
  updated[projectName] = {
    ...updated[projectName],
    order: insertIndex,
  };

  return updated;
}
