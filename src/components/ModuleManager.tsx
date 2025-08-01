import { Form, Input, Modal } from "antd";
import type { FormInstance } from "antd";
import type { AccessControlConfig } from "../lib/access-control";
import { createTranslator } from "../lib/i18n";

interface ModuleManagerProps {
  visible: boolean;
  editingModule: string | null;
  form: FormInstance<{ moduleName: string }>;
  config: AccessControlConfig;
  lang: string;
  onSave: () => void;
  onCancel: () => void;
  onConfigChange: (config: AccessControlConfig) => void;
  messageApi: any;
}

export function ModuleManager({
  visible,
  editingModule,
  form,
  config,
  lang,
  onSave,
  onCancel,
  onConfigChange,
  messageApi,
}: ModuleManagerProps) {
  const t = createTranslator(lang);
  const title = editingModule
    ? `${t("renameModule")} "${editingModule}"`
    : t("addModule");

  return (
    <Modal
      title={title}
      open={visible}
      onOk={onSave}
      onCancel={onCancel}
      width={400}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={t("moduleName")}
          name="moduleName"
          rules={[
            { required: true, message: t("nameRequired") },
            { max: 20, message: t("projectNameMaxLength") },
          ]}
        >
          <Input placeholder={t("enterModuleName")} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

// Module-related business logic
export function useModuleActions(
  config: AccessControlConfig,
  onConfigChange: (config: AccessControlConfig) => void,
  messageApi: any,
  lang: string = "en"
) {
  const t = createTranslator(lang);
  // Get all module list
  const getModuleList = () => {
    const usedModules = [
      ...new Set(Object.values(config.customProjects).map((p) => p.module)),
    ].filter(Boolean);

    const createdModules = config.createdModules || [];

    // Merge created groups and groups in use
    const allModules = [...new Set([...createdModules, ...usedModules])];

    return allModules;
  };

  // Save module
  const saveModule = async (
    moduleName: string,
    editingModule: string | null
  ) => {
    const existingModules = getModuleList();
    if (editingModule !== moduleName && existingModules.includes(moduleName)) {
      messageApi.error(
        `${t("moduleName")} "${moduleName}" ${t("duplicateWith")}`
      );
      return false;
    }

    let newConfig: AccessControlConfig = { ...config };

    if (editingModule && editingModule !== moduleName) {
      // Rename module: update all projects using this module
      const newCustomProjects = { ...config.customProjects };
      Object.keys(newCustomProjects).forEach((id) => {
        if (newCustomProjects[id].module === editingModule) {
          newCustomProjects[id].module = moduleName;
        }
      });

      // Update created group list
      const createdModules = config.createdModules || [];
      const updatedCreatedModules = createdModules.map((module) =>
        module === editingModule ? moduleName : module
      );

      newConfig = {
        ...config,
        customProjects: newCustomProjects,
        createdModules: updatedCreatedModules,
      };
      onConfigChange(newConfig);
      messageApi.success(
        `${t("moduleName")} "${editingModule}" renamed to "${moduleName}"`
      );
    } else if (!editingModule) {
      // Add new module: add it to created group list
      const createdModules = config.createdModules || [];
      if (!createdModules.includes(moduleName)) {
        newConfig = {
          ...config,
          createdModules: [...createdModules, moduleName],
        };
        onConfigChange(newConfig);
      }
      messageApi.success(`${t("moduleName")} "${moduleName}" added`);
    }

    return true;
  };

  // Delete module and all its projects
  const deleteModule = (moduleName: string) => {
    const projectsInModule = Object.values(config.customProjects).filter(
      (project) => project.module === moduleName
    );

    // Delete all projects in the module
    const newCustomProjects = { ...config.customProjects };
    projectsInModule.forEach((project) => {
      delete newCustomProjects[project.name];
    });

    // Remove the group from created group list
    const createdModules = config.createdModules || [];
    const updatedCreatedModules = createdModules.filter(
      (module) => module !== moduleName
    );

    const newConfig: AccessControlConfig = {
      ...config,
      customProjects: newCustomProjects,
      createdModules: updatedCreatedModules,
    };

    onConfigChange(newConfig);

    if (projectsInModule.length > 0) {
      messageApi.success(
        `${t("moduleName")} "${moduleName}" and its ${projectsInModule.length} projects deleted`
      );
    } else {
      messageApi.success(`Empty ${t("moduleName")} "${moduleName}" deleted`);
    }
  };

  return {
    getModuleList,
    saveModule,
    deleteModule,
  };
}
