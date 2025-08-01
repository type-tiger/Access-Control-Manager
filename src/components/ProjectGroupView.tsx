import {
  Button,
  Collapse,
  Popconfirm,
  Space,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createTranslator } from "../lib/i18n";
import { DraggableProjectCard } from "./DraggableProjectCard";
import type { ProjectCardProps } from "../types/project";
import type { CustomProjectConfig } from "../lib/access-control";

const { Text } = Typography;
const { Panel } = Collapse;

interface ProjectGroupViewProps
  extends Omit<ProjectCardProps, "project" | "dragListeners"> {
  projectModuleGroups: Record<string, Array<[string, CustomProjectConfig]>>;
  expandedGroups: string[];
  onGroupExpand: (expandedKeys: string[]) => void;
  onBatchToggle: (projectNames: string[], enabled: boolean) => void;
  onEditModule: (moduleName: string) => void;
  onDeleteModule: (moduleName: string) => void;
}

export function ProjectGroupView({
  projectModuleGroups,
  expandedGroups,
  onGroupExpand,
  onBatchToggle,
  onEditModule,
  onDeleteModule,
  ...projectCardProps
}: ProjectGroupViewProps) {
  const { lang } = projectCardProps;
  const t = createTranslator(lang);

  const handleCollapseChange = (activeKeys: string | string[]) => {
    const keys = Array.isArray(activeKeys) ? activeKeys : [activeKeys];
    onGroupExpand(keys);
  };

  return (
    <Collapse
      ghost
      size="small"
      activeKey={expandedGroups}
      onChange={handleCollapseChange}
    >
      {Object.entries(projectModuleGroups).map(([module, projects]) => (
        <Panel
          key={module}
          header={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FolderOutlined />
                <Text strong style={{ fontSize: 13 }}>
                  {module}
                </Text>
                <Tag color="blue" style={{ fontSize: 10 }}>
                  {t("projectCount", { count: projects.length })}
                </Tag>
                <Tag
                  color={(() => {
                    const enabledCount = projects.filter(
                      ([, project]) => project.enabled
                    ).length;
                    return enabledCount > 0 ? "red" : "green";
                  })()}
                  style={{ fontSize: 10 }}
                >
                  {(() => {
                    const enabledCount = projects.filter(
                      ([, project]) => project.enabled
                    ).length;
                    return enabledCount > 0
                      ? t("projectsControlling", { count: enabledCount })
                      : t("normalDisplay");
                  })()}
                </Tag>
              </div>
              <Space size="small" onClick={(e) => e.stopPropagation()}>
                <Tooltip
                  title={(() => {
                    const enabledCount = projects.filter(
                      ([, project]) => project.enabled
                    ).length;
                    const allEnabled = enabledCount === projects.length;
                    return allEnabled
                      ? t("disableGroupControl")
                      : t("enableGroupControl");
                  })()}
                >
                  <Switch
                    size="small"
                    checked={(() => {
                      const enabledCount = projects.filter(
                        ([, project]) => project.enabled
                      ).length;
                      return enabledCount === projects.length;
                    })()}
                    onChange={() => {
                      const enabledCount = projects.filter(
                        ([, project]) => project.enabled
                      ).length;
                      const allEnabled = enabledCount === projects.length;
                      const targetState = !allEnabled;
                      const projectIds = projects.map(
                        ([projectId]) => projectId
                      );
                      onBatchToggle(projectIds, targetState);
                    }}
                    style={{ marginRight: 4 }}
                  />
                </Tooltip>
                <Tooltip title={t("renameModule")}>
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => onEditModule(module)}
                    style={{ fontSize: 10 }}
                  />
                </Tooltip>
                <Popconfirm
                  title={t("confirmDeleteModule")}
                  description={t("confirmDeleteModuleDesc", {
                    name: module,
                    count: projects.length,
                  })}
                  onConfirm={() => onDeleteModule(module)}
                  okText={t("delete")}
                  cancelText={t("cancel")}
                  okType="danger"
                >
                  <Tooltip title={t("deleteModule")}>
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      danger
                      style={{ fontSize: 10 }}
                    />
                  </Tooltip>
                </Popconfirm>
              </Space>
            </div>
          }
        >
          <SortableContext
            items={projects.map(([id]) => id)}
            strategy={verticalListSortingStrategy}
          >
            {projects.map(([id, project]) => (
              <DraggableProjectCard
                key={id}
                project={project}
                {...projectCardProps}
              />
            ))}
          </SortableContext>
        </Panel>
      ))}
    </Collapse>
  );
}
