import { Button, Space, Upload, Switch, Typography, Popconfirm } from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";
import { createTranslator } from "../lib/i18n";

const { Text } = Typography;

interface ProjectToolbarProps {
  lang: string;
  viewMode: "list" | "group";
  onViewModeChange: (mode: "list" | "group") => void;
  onAddProject: () => void;
  onAddModule: () => void;
  onExportProjects: () => void;
  onImportProjects: (file: File) => boolean | Promise<boolean>;
  onClearAll: () => void; // Added
}

export function ProjectToolbar({
  lang,
  viewMode,
  onViewModeChange,
  onAddProject,
  onAddModule,
  onExportProjects,
  onImportProjects,
  onClearAll,
}: ProjectToolbarProps) {
  const t = createTranslator(lang);

  return (
    <div
      style={{
        marginBottom: 12,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 8,
        flexDirection: "column",
      }}
    >
      <Space align="center">
        <Text strong style={{ fontSize: 14 }}>
          {t("viewMode")}
        </Text>
        <Switch
          size="small"
          checked={viewMode === "group"}
          onChange={(checked) => onViewModeChange(checked ? "group" : "list")}
          checkedChildren={t("groupView")}
          unCheckedChildren={t("listView")}
        />
      </Space>

      <Space size="small">
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={onAddProject}
          style={{ fontSize: 11 }}
        >
          {t("addProject")}
        </Button>

        <Button
          size="small"
          icon={<FolderAddOutlined />}
          onClick={onAddModule}
          style={{ fontSize: 11 }}
        >
          {t("addModule")}
        </Button>

        <Button
          size="small"
          icon={<DownloadOutlined />}
          onClick={onExportProjects}
          style={{ fontSize: 11 }}
        >
          {t("export")}
        </Button>

        <Upload
          beforeUpload={onImportProjects}
          accept=".json"
          showUploadList={false}
        >
          <Button
            size="small"
            icon={<UploadOutlined />}
            style={{ fontSize: 11 }}
          >
            {t("import")}
          </Button>
        </Upload>

        {/* clear all projects */}
        <Popconfirm
          title={t("confirmClearAllTitle")}
          description={t("confirmClearAllDesc")}
          onConfirm={onClearAll}
          okText={t("clearAll")}
          cancelText={t("cancel")}
          okType="danger"
        >
          <Button size="small" danger style={{ fontSize: 11 }}>
            {t("clearAll")}
          </Button>
        </Popconfirm>
      </Space>
    </div>
  );
}
