import {
  Button,
  Card,
  Popconfirm,
  Select,
  Space,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  DragOutlined,
} from "@ant-design/icons";
import type { ProjectCardProps } from "../types/project";
import { ProjectForm } from "./ProjectForm";
import { createTranslator } from "../lib/i18n";
import {
  getElementCountFromPageInfo,
  isUrlMatch,
  createBehaviorOptions,
} from "../utils/projectUtils";

const { Text } = Typography;

export function ProjectCard({
  project,
  pageInfo,
  lang,
  dragListeners,
  isEditing,
  editingProject,
  form,
  validationResult,
  moduleOptions,
  getModuleList,
  onEdit,
  onCopy,
  onDelete,
  onToggle,
  onUpdateBehavior,
  onEditCancel,
  onEditSave,
}: ProjectCardProps) {
  const t = createTranslator(lang);
  const behaviorOptions = createBehaviorOptions(t);

  // If current project is being edited, render edit form
  if (isEditing && editingProject?.name === project.name) {
    return (
      <div key={project.name} style={{ marginBottom: 8 }}>
        <ProjectForm
          visible={true}
          editingProject={editingProject}
          form={form}
          validationResult={validationResult}
          moduleOptions={moduleOptions}
          getModuleList={getModuleList}
          lang={lang}
          onCancel={onEditCancel}
          onSave={onEditSave}
        />
      </div>
    );
  }

  // Render selector display
  const renderSelectorDisplay = () => {
    const selectors = project.selector
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (selectors.length === 1) {
      return (
        <Text code style={{ fontSize: 10, wordBreak: "break-all" }}>
          {selectors[0]}
        </Text>
      );
    }

    return (
      <div>
        {selectors.map((selector, index) => (
          <div key={index} style={{ marginBottom: 2 }}>
            <Text code style={{ fontSize: 10, wordBreak: "break-all" }}>
              {selector}
            </Text>
          </div>
        ))}
        <Text type="secondary" style={{ fontSize: 10 }}>
          {t("selectorsCount", { count: selectors.length })}
        </Text>
      </div>
    );
  };

  // Render URL matching status
  const renderUrlMatchingStatus = () => {
    if (!pageInfo) {
      return (
        <span style={{ color: "#999", fontSize: 10 }}>{t("noPageInfo")}</span>
      );
    }

    const projectInfo = pageInfo.projects.find((p) => p.name === project.name);

    if (!projectInfo) {
      // Check URL matching
      if (project.urlPattern) {
        const urlMatches = isUrlMatch(project.urlPattern, pageInfo.url);
        if (!urlMatches) {
          return (
            <Tag color="orange" style={{ fontSize: 10, marginLeft: 4 }}>
              {t("urlNoMatch")}
            </Tag>
          );
        }
      }
      return (
        <Tag color="default" style={{ fontSize: 10, marginLeft: 4 }}>
          {t("noMatchingElements")}
        </Tag>
      );
    }

    // Show URL matching status
    const urlMatches = projectInfo.urlMatches;
    const hasUrlPattern = projectInfo.urlPattern?.trim();

    if (hasUrlPattern) {
      return (
        <Tag
          color={urlMatches ? "blue" : "orange"}
          style={{ fontSize: 10, marginLeft: 4 }}
        >
          {urlMatches ? t("urlMatch") : t("urlNoMatch")}
        </Tag>
      );
    }
    return null;
  };

  return (
    <Card
      key={project.name}
      size="small"
      style={{ marginBottom: 8 }}
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Drag handle */}
            <div
              {...dragListeners}
              style={{
                cursor: "grab",
                display: "flex",
                alignItems: "center",
                padding: "2px",
                borderRadius: "2px",
                backgroundColor: dragListeners ? "#f0f0f0" : "transparent",
              }}
            >
              <DragOutlined style={{ fontSize: 10, color: "#999" }} />
            </div>
            <Switch
              size="small"
              checked={project.enabled}
              onChange={(checked) => onToggle(project.name, checked)}
            />
            <Text strong style={{ fontSize: 12 }}>
              {project.name}
            </Text>
            <Tag
              color={project.enabled ? "red" : "green"}
              style={{ fontSize: 10, margin: 0 }}
            >
              {project.enabled ? t("controlling") : t("normalDisplay")}
            </Tag>
            {project.code && (
              <Tag color="cyan" style={{ fontSize: 10, margin: 0 }}>
                {project.code}
              </Tag>
            )}
          </div>
          <Space size="small">
            <Tooltip title={t("editProjectAction")}>
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(project)}
                style={{ fontSize: 10 }}
              />
            </Tooltip>
            <Tooltip title={t("copyProject")}>
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => onCopy(project)}
                style={{ fontSize: 10 }}
              />
            </Tooltip>
            <Popconfirm
              title={t("confirmDelete", { name: project.name })}
              onConfirm={() => onDelete(project.name)}
              okText={t("delete")}
              cancelText={t("cancel")}
              okType="danger"
            >
              <Tooltip title={t("deleteProjectAction")}>
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
      <div style={{ fontSize: 11, lineHeight: 1.4 }}>
        {project.description && (
          <div style={{ marginBottom: 4 }}>
            <Text type="secondary">{project.description}</Text>
          </div>
        )}

        <div style={{ marginBottom: 4 }}>
          <Text strong>{t("selectorLabel")}</Text>
          <div style={{ marginTop: 2 }}>{renderSelectorDisplay()}</div>
        </div>

        <div style={{ marginBottom: 4 }}>
          <Text strong>{t("matchingElements")}</Text>
          <Tag
            color={
              getElementCountFromPageInfo(project.name, pageInfo) > 0
                ? "green"
                : "default"
            }
            style={{ fontSize: 10 }}
          >
            {t("elementCount", {
              count: getElementCountFromPageInfo(project.name, pageInfo),
            })}
          </Tag>
          {renderUrlMatchingStatus()}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Text strong style={{ fontSize: 10 }}>
              {t("controlBehavior")}
            </Text>
            <Select
              size="small"
              value={project.behavior}
              style={{ width: 80, marginLeft: 4 }}
              options={behaviorOptions}
              onChange={(value) => onUpdateBehavior(project.name, value)}
            />
          </div>
          <Tag color="blue" style={{ fontSize: 10 }}>
            {project.module || t("uncategorized")}
          </Tag>
        </div>
      </div>
    </Card>
  );
}
