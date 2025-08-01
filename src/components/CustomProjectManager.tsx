import type { AccessControlConfig } from "../lib/access-control";
import { useProjectManager } from "../hooks/useProjectManager";
import {
  reorderProjectsInModule,
  moveProjectToModule,
} from "../utils/projectUtils";
import { ProjectToolbar } from "./ProjectToolbar";
import { ProjectList } from "./ProjectList";
import { ModuleManager, useModuleActions } from "./ModuleManager";
import type { DragEndEvent } from "@dnd-kit/core";

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

interface CustomProjectManagerProps {
  config: AccessControlConfig;
  pageInfo: PageInfo | null;
  lang: string;
  onConfigChange: (config: AccessControlConfig) => void;
  messageApi: any;
}

export function CustomProjectManager({
  config,
  pageInfo,
  lang,
  onConfigChange,
  messageApi,
}: CustomProjectManagerProps) {
  const {
    // State
    isModalVisible,
    setIsModalVisible,
    editingProject,
    setEditingProject,
    form,
    validationResult,
    viewMode,
    setViewMode,
    expandedGroups,
    scrollPosition,
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
  } = useProjectManager(config, onConfigChange, messageApi, lang);

  const moduleActions = useModuleActions(
    config,
    onConfigChange,
    messageApi,
    lang
  );

  // Module management operations
  const handleAddModule = () => {
    setEditingModule(null);
    moduleForm.resetFields();
    setIsModuleModalVisible(true);
  };

  const handleEditModule = (moduleName: string) => {
    setEditingModule(moduleName);
    moduleForm.setFieldsValue({ moduleName });
    setIsModuleModalVisible(true);
  };

  const handleSaveModule = async () => {
    try {
      const values = await moduleForm.validateFields();
      const success = await moduleActions.saveModule(
        values.moduleName,
        editingModule
      );
      if (success) {
        setIsModuleModalVisible(false);
      }
    } catch (error) {
      console.error("Module form validation error:", error);
    }
  };

  const handleDeleteModule = (moduleName: string) => {
    moduleActions.deleteModule(moduleName);
  };

  // Drag handling function
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeProject = config.customProjects[active.id as string];
    const overProject = config.customProjects[over.id as string];

    if (!activeProject || !overProject) {
      return;
    }

    const sourceModule = activeProject.module;
    const targetModule = overProject.module;

    let newCustomProjects: { [id: string]: any };

    if (sourceModule === targetModule) {
      // Reorder within the same module
      const moduleProjects = Object.values(config.customProjects)
        .filter((p) => p.module === sourceModule)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      const sourceIndex = moduleProjects.findIndex((p) => p.name === active.id);
      const targetIndex = moduleProjects.findIndex((p) => p.name === over.id);

      if (sourceIndex !== -1 && targetIndex !== -1) {
        newCustomProjects = reorderProjectsInModule(
          config.customProjects,
          sourceModule,
          sourceIndex,
          targetIndex
        );
      } else {
        return;
      }
    } else {
      // Move to different module
      const targetProjects = Object.values(config.customProjects)
        .filter((p) => p.module === targetModule)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      const targetIndex = targetProjects.findIndex((p) => p.name === over.id);

      newCustomProjects = moveProjectToModule(
        config.customProjects,
        active.id as string,
        targetModule,
        targetIndex
      );
    }

    // Ensure group is added to createdModules
    const createdModules = config.createdModules || [];
    const allModulesInUse = [
      ...new Set(Object.values(newCustomProjects).map((p: any) => p.module)),
    ];
    const updatedCreatedModules = [
      ...new Set([...createdModules, ...allModulesInUse]),
    ];

    // Update configuration
    const newConfig: AccessControlConfig = {
      ...config,
      customProjects: newCustomProjects,
      createdModules: updatedCreatedModules,
    };

    onConfigChange(newConfig);
  };

  return (
    <div>
      {/* Toolbar */}
      <ProjectToolbar
        lang={lang}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddProject={() => setIsModalVisible(true)}
        onAddModule={handleAddModule}
        onExportProjects={importExport.handleExport}
        onImportProjects={importExport.handleImport}
        onClearAll={importExport.clearAllProjects}
      />

      {/* Project list */}
      <ProjectList
        customProjects={config.customProjects}
        createdModules={config.createdModules}
        pageInfo={pageInfo}
        viewMode={viewMode}
        expandedGroups={expandedGroups}
        scrollPosition={scrollPosition}
        onGroupExpand={onGroupExpand}
        onScrollPositionChange={onScrollPositionChange}
        lang={lang}
        onEdit={(project) => {
          setEditingProject(project);
          form.setFieldsValue(project);
          setIsModalVisible(true);
        }}
        onCopy={projectActions.copyProject}
        onDelete={projectActions.deleteProject}
        onToggle={projectActions.toggleProject}
        onBatchToggle={projectActions.batchToggleProjects}
        onUpdateBehavior={projectActions.updateProjectBehavior}
        onEditModule={handleEditModule}
        onDeleteModule={handleDeleteModule}
        // Edit-related props
        isEditing={isModalVisible}
        editingProject={editingProject}
        form={form}
        validationResult={validationResult}
        moduleOptions={moduleOptions}
        getModuleList={getModuleList}
        onEditCancel={() => setIsModalVisible(false)}
        onEditSave={saveProject}
        onDragEnd={handleDragEnd}
      />

      {/* Module management modal */}
      <ModuleManager
        visible={isModuleModalVisible}
        editingModule={editingModule}
        form={moduleForm}
        config={config}
        lang={lang}
        onSave={handleSaveModule}
        onCancel={() => setIsModuleModalVisible(false)}
        onConfigChange={onConfigChange}
        messageApi={messageApi}
      />
    </div>
  );
}
