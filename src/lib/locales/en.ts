export const en = {
  // Core UI
  title: "Access Control Manager",
  enabled: "Enabled",
  disabled: "Disabled",
  pageElements: "Page Elements",
  currentPage: "Current Page",
  detectedTypes: "Detected Types",
  elementCount: "{{count}} Elements",
  enableAll: "Enable All",
  disableAll: "Disable All",
  loading: "Loading...",
  confirmDelete: "Are you sure you want to delete {{name}}?",
  successEnable: "Enabled",
  successDisable: "Disabled",
  successBehavior: "Behavior Updated",
  tipGreen: "Tip: Green background indicates elements found on this page",
  tipBehavior:
    "Behavior: Hide=hidden, Disable=disabled, Blur=blurred, Restrict=overlay",
  behaviorHide: "Hide",
  behaviorDisable: "Disable",
  behaviorBlur: "Blur",
  behaviorRestrict: "Restrict",
  onPage: "On Page",
  moduleEnabled: "Enabled",
  moduleDisabled: "Disabled",
  language: "Language",

  // Custom Project Management
  customProjects: "Custom Projects",
  viewMode: "View Mode",
  builtInProjects: "Built-in Projects",
  addCustomProject: "Add Custom Project",
  editCustomProject: "Edit Custom Project",
  deleteCustomProject: "Delete Custom Project",
  projectName: "Project Name",
  projectDescription: "Project Description",
  projectModule: "Module",
  selector: "Selector",
  selectorPlaceholder: "e.g.: .class-name, #element-id, data-type",
  multiSelectorHint:
    "Multiple selectors supported: separate with commas, e.g.: .btn, #header, [data-role]",
  multiSelectorPlaceholder:
    "Enter CSS selectors, multiple selectors separated by commas:\n.container, #main, div.active, [data-role='admin']",
  selectorValue: "Selector Value",
  valuePlaceholder: "Enter attribute value",
  urlPattern: "URL Pattern (Regex)",
  urlPatternPlaceholder:
    "e.g.: ^/settings$, .*admin.*, settings|account (empty for all pages)",
  urlPatternHint:
    "Regex only. Common: ^/settings$ exact match, ^/settings prefix match, .*admin.* contains match",
  selectorType: "Selector Type",
  selectorTypeClass: "CSS Class (.class)",
  selectorTypeId: "Element ID (#id)",
  selectorTypeAttribute: "Element Attribute [attr]",
  save: "Save",
  cancel: "Cancel",
  delete: "Delete",
  // Import/Export
  importExport: "Import/Export",
  exportConfig: "Export Config",
  importConfig: "Import Config",
  exportCustomProjects: "Export Custom Projects",
  importCustomProjects: "Import Custom Projects",
  exportSuccess: "Config exported successfully",
  exportError: "Export failed, please try again",
  importSuccess: "Config imported successfully",
  importError: "Import failed, please check file format",
  noCustomProjects: "No custom projects",
  projects: "projects",

  // Validation
  nameRequired: "Project name is required",
  selectorRequired: "Selector is required",
  valueRequired: "Selector value is required",
  duplicateSelector: "Duplicate selector",
  duplicateWith: "Duplicates with",

  // Success Messages
  projectSaved: "Project saved successfully",
  projectDeleted: "Project deleted successfully",

  // Confirmation Messages
  confirmDeleteProject: "Are you sure you want to delete this project?",

  // Demo Page
  demoTitle: "Access Control Demo Page",
  currentConfig: "Current Config",
  builtInConfigTitle: "Built-in Projects Config",
  customConfigTitle: "Custom Projects Config",
  selectorInfo: "Selector Info",
  effectiveSelector: "Effective Selector",
  refreshConfig: "Refresh Config",

  // Form Validation Tips
  classSelectorTip: "Class selector starts with ., e.g. .my-class",
  idSelectorTip: "ID selector starts with #, e.g. #my-id",
  attributeSelectorTip: "Attribute selector without [], e.g. data-type",

  // Advanced Features
  advancedMode: "Advanced Mode",
  bulkOperations: "Bulk Operations",
  selectAll: "Select All",
  unselectAll: "Unselect All",
  batchEnable: "Batch Enable",
  batchDisable: "Batch Disable",
  batchDelete: "Batch Delete",
  clearAll: "Clear All",
  confirmClearAllTitle: "Confirm Clear All",
  confirmClearAllDesc:
    "This will delete all custom projects and cannot be undone. Are you sure to clear all?",
  clearAllSuccess: "All custom projects cleared",

  // Quick Actions
  enableAllControl: "Enable All Control",
  disableAllControl: "Disable All Control",

  // Statistics
  controlling: "Controlling",
  normalDisplay: "Normal Display",

  // Toolbar
  groupView: "Group",
  listView: "List",
  addProject: "Add Project",
  addModule: "Add Module",
  export: "Export",
  import: "Import",

  // Project Details
  selectorLabel: "Selector: ",
  selectorCount: " selectors",
  controlBehavior: "Control Behavior:",
  uncategorized: "Uncategorized",
  urlMatch: "URL Match",
  urlNoMatch: "URL No Match",
  urlMismatchWarning: " projects not effective due to URL mismatch",

  // Page Info
  matchingElements: "Matching Elements: ",
  actuallyEffective: "Actually Effective: ",
  enabledControls: "Enabled Controls: ",
  configuredProjects: "Configured Projects: ",
  waitingForPageInfo: "Waiting for page info...",
  noPageInfo: "No page info",
  noMatchingElements: "No matching elements",
  projectCount: "{{count}} projects",
  enableGroupControl: "Enable group control",
  disableGroupControl: "Disable group control",
  confirmDeleteProjectWithName:
    'Are you sure you want to delete project "{{name}}"?',
  confirmDeleteModuleDesc:
    'Are you sure you want to delete module "{{name}}" and all its {{count}} projects? This action cannot be undone.',

  // Form Labels and Messages
  editProject: "Edit Project",
  projectNameLabel: "Project Name",
  projectNamePlaceholder: "Enter project name",
  projectNameMaxLength: "Project name cannot exceed 50 characters",
  projectDescriptionLabel: "Project Description",
  projectDescriptionPlaceholder: "Enter project description",
  projectDescriptionMaxLength:
    "Project description cannot exceed 200 characters",
  belongingGroupLabel: "Belonging Group",
  belongingGroupPlaceholder: "Select existing group or enter new group name",
  groupRequired: "Please select or enter group name",
  cssSelector: "CSS Selector",
  cssSelectorRequired: "Please enter CSS selector",
  cssSelectorHint:
    'All CSS selectors supported: .class, #id, tag, [attribute], [attribute="value"], .class1.class2, .parent .child, etc.',
  cssSelectorMultiHint:
    "Multiple selectors supported: separate with commas, e.g.: .btn, #header, [data-role]",
  cssSelectorPlaceholder:
    "Enter CSS selectors, multiple selectors separated by commas:\n.container, #main, div.active, [data-role='admin']",
  urlPatternLabel: "URL Pattern (Regex)",

  // Messages
  enabledAllProjects: "Enabled control for all projects",
  disabledAllProjects: "Disabled control for all projects",
  noCustomProjectsYet:
    "No custom projects yet, click the button above to add your first project",

  // Parameterized messages
  projectsControlling: "{{count}} projects controlling",
  projectsNotEffectiveDueToUrl:
    "{{count}} projects not effective due to URL mismatch",
  selectorsCount: "{{count}} selectors",

  // Module management
  enterModuleName: "Enter module name",
  editModuleAction: "Edit",
  copyProject: "Copy",
  deleteProjectAction: "Delete",
  confirmDeleteButtonText: "Confirm delete",
  renameModule: "Rename module",
  deleteModule: "Delete entire module",
  confirmDeleteModule: "Confirm delete module",

  // Form labels
  moduleName: "Module Name",
};
