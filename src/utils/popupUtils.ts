import type {
  CustomProjectConfig,
  AccessControlConfig,
} from "../lib/access-control";

// Group custom projects by module
export const getProjectModuleGroups = (
  customProjects: { [id: string]: CustomProjectConfig },
  createdModules?: string[]
) => {
  const groups: Record<string, Array<[string, CustomProjectConfig]>> = {};

  // First initialize empty arrays for all created groups
  if (createdModules) {
    createdModules.forEach((module) => {
      groups[module] = [];
    });
  }

  // Then add projects to corresponding groups
  Object.entries(customProjects).forEach(([id, project]) => {
    const module = project.module || "Other";
    if (!groups[module]) groups[module] = [];
    groups[module].push([id, project]);
  });

  // Sort projects within each group by order field
  Object.keys(groups).forEach((module) => {
    groups[module].sort((a, b) => {
      const orderA = a[1].order ?? 0;
      const orderB = b[1].order ?? 0;
      return orderA - orderB;
    });
  });

  return groups;
};

// Calculate statistics
export const getProjectStats = (customProjects: {
  [id: string]: CustomProjectConfig;
}) => {
  const enabledProjectCount = Object.values(customProjects).filter(
    (item) => item.enabled
  ).length;
  const totalProjectCount = Object.keys(customProjects).length;

  return {
    enabledProjectCount,
    totalProjectCount,
  };
};
