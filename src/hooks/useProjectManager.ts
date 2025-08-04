import { useState, useEffect, useCallback } from "react";
import { Form } from "antd";
import type {
  AccessControlConfig,
  CustomProjectConfig,
  ProjectValidationResult,
} from "../lib/access-control";
import {
  validateCustomProject,
  validateRegexPattern,
} from "../lib/access-control";
import {
  saveUIState,
  loadUIState,
  getDefaultUIState,
  type UIState,
} from "../lib/storage";
import { useProjectActions } from "./useProjectActions";
import { useImportExport } from "./useImportExport";
import { normalizeProjectOrders } from "../utils/projectUtils";

interface ProjectFormData {
  name: string;
  description: string;
  code?: string;
  module: string;
  selector: string;
  enabled: boolean;
  behavior: "hide" | "disable" | "blur" | "restrict";
  urlPattern: string;
}

export function useProjectManager(
  config: AccessControlConfig,
  onConfigChange: (config: AccessControlConfig) => void,
  messageApi: any,
  lang: string
) {
  // Form state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] =
    useState<CustomProjectConfig | null>(null);
  const [form] = Form.useForm<ProjectFormData>();
  const [validationResult, setValidationResult] =
    useState<ProjectValidationResult>({ isValid: true });

  // UI state management
  const [uiState, setUIState] = useState<UIState>({
    viewMode: "group",
    expandedGroups: [],
    scrollPosition: 0,
  });

  // Module management state
  const [isModuleModalVisible, setIsModuleModalVisible] = useState(false);
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [moduleForm] = Form.useForm<{ moduleName: string }>();

  // Use specialized hooks
  const projectActions = useProjectActions(
    config,
    onConfigChange,
    messageApi,
    lang
  );

  // Get module options from existing configuration
  const moduleOptions = (() => {
    const usedModules = [
      ...new Set(Object.values(config.customProjects).map((p) => p.module)),
    ].filter(Boolean);

    return usedModules.map((module) => ({
      label: module,
      value: module,
    }));
  })();

  // Get module list
  const getModuleList = useCallback(() => {
    return [
      ...new Set(Object.values(config.customProjects).map((p) => p.module)),
    ].filter(Boolean);
  }, [config.customProjects]);

  // Normalize project orders on load and when projects change
  useEffect(() => {
    const normalizedProjects = normalizeProjectOrders(config.customProjects);

    // Only update if normalization changed something
    const hasChanges = Object.keys(normalizedProjects).some((name) => {
      const original = config.customProjects[name];
      const normalized = normalizedProjects[name];
      return original?.order !== normalized?.order;
    });

    if (hasChanges) {
      const newConfig = {
        ...config,
        customProjects: normalizedProjects,
      };
      onConfigChange(newConfig);
    }
  }, [JSON.stringify(Object.keys(config.customProjects))]);

  // Load UI state
  useEffect(() => {
    const loadState = async () => {
      try {
        const loadedState = await loadUIState();

        // Clean up expandedGroups - remove groups that no longer exist
        const existingModules = new Set(
          Object.values(config.customProjects).map(
            (p) => p.module || "Uncategorized"
          )
        );
        const validExpandedGroups = loadedState.expandedGroups.filter((group) =>
          existingModules.has(group)
        );

        const cleanedState = {
          ...loadedState,
          expandedGroups: validExpandedGroups,
        };

        setUIState(cleanedState);

        // Save cleaned state if it changed
        if (validExpandedGroups.length !== loadedState.expandedGroups.length) {
          saveUIState(cleanedState).catch((error) => {
            console.error("Failed to save cleaned UI state:", error);
          });
        }
      } catch (error) {
        console.error("Failed to load UI state:", error);
        setUIState(getDefaultUIState());
      }
    };

    loadState();
  }, [config.customProjects]);

  // Save UI state when it changes
  const saveUIStateDebounced = useCallback((newState: UIState) => {
    saveUIState(newState).catch((error) => {
      console.error("Failed to save UI state:", error);
    });
  }, []);

  // Form validation
  const validateFormFields = useCallback(
    (values: ProjectFormData) => {
      const tempProject: CustomProjectConfig = {
        name: values.name,
        description: values.description || "",
        code: values.code,
        module: values.module,
        selector: values.selector,
        behavior: values.behavior,
        urlPattern: values.urlPattern,
        enabled: true,
      };

      // Exclude current project if editing
      const otherProjects = { ...config.customProjects };
      if (editingProject) {
        delete otherProjects[editingProject.name];
      }

      const validation = validateCustomProject(tempProject, otherProjects);

      // Validate URL pattern
      if (values.urlPattern) {
        const urlValidation = validateRegexPattern(values.urlPattern);
        if (!urlValidation.isValid) {
          validation.isValid = false;
          validation.error = urlValidation.error;
        }
      }

      setValidationResult(validation);
      return validation;
    },
    [config.customProjects, editingProject]
  );

  // UI state management functions
  const onGroupExpand = useCallback(
    (expandedKeys: string[]) => {
      const newState = { ...uiState, expandedGroups: expandedKeys };
      setUIState(newState);
      saveUIStateDebounced(newState);
    },
    [uiState, saveUIStateDebounced]
  );

  // Import/Export hook (needs onGroupExpand)
  const importExport = useImportExport(
    config,
    onConfigChange,
    messageApi,
    lang,
    onGroupExpand
  );

  const onScrollPositionChange = useCallback(
    (position: number) => {
      const newState = { ...uiState, scrollPosition: position };
      setUIState(newState);
      saveUIStateDebounced(newState);
    },
    [uiState, saveUIStateDebounced]
  );

  const setViewMode = useCallback(
    (viewMode: "list" | "group") => {
      const newState = { ...uiState, viewMode };
      setUIState(newState);
      saveUIStateDebounced(newState);
    },
    [uiState, saveUIStateDebounced]
  );

  // Project CRUD operations
  const saveProject = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const validation = validateFormFields(values);

      if (!validation.isValid) {
        return false;
      }

      const result = editingProject
        ? projectActions.updateProject(editingProject.name, values)
        : projectActions.addProject(values);

      if (result.success) {
        setIsModalVisible(false);
        setEditingProject(null);
        form.resetFields();
        return true;
      } else {
        setValidationResult({ isValid: false, error: result.error });
        return false;
      }
    } catch (error) {
      console.error("Failed to save project:", error);
      return false;
    }
  }, [form, validateFormFields, editingProject, projectActions]);

  return {
    // State
    isModalVisible,
    setIsModalVisible,
    editingProject,
    setEditingProject,
    form,
    validationResult,
    viewMode: uiState.viewMode,
    setViewMode,
    expandedGroups: uiState.expandedGroups,
    scrollPosition: uiState.scrollPosition,
    onGroupExpand,
    onScrollPositionChange,
    isModuleModalVisible,
    setIsModuleModalVisible,
    editingModule,
    setEditingModule,
    moduleForm,
    moduleOptions,

    // Methods
    getModuleList,
    projectActions,
    saveProject,
    importExport,
    validateFormFields,
  };
}
