import React from "react";
import {
  Form,
  Input,
  Typography,
  AutoComplete,
  Card,
  Space,
  Button,
} from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import type {
  CustomProjectConfig,
  ProjectValidationResult,
} from "../lib/access-control";
import { generateSelectorString } from "../lib/access-control";
import { createTranslator } from "../lib/i18n";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

interface ProjectFormProps {
  visible: boolean;
  editingProject: CustomProjectConfig | null;
  form: FormInstance;
  validationResult: ProjectValidationResult;
  moduleOptions: Array<{ label: string; value: string }>;
  getModuleList: () => string[];
  lang: string;
  onCancel: () => void;
  onSave: () => void;
}

const ProjectFormComponent = ({
  visible,
  editingProject,
  form,
  moduleOptions,
  onCancel,
  onSave,
  lang,
}: ProjectFormProps) => {
  const t = createTranslator(lang);
  const title = editingProject ? t("editProject") : t("addProject");

  if (!visible) return null;

  return (
    <Card
      title={title}
      size="small"
      style={{ marginBottom: 16 }}
      extra={
        <Space>
          <Button
            size="small"
            onClick={onSave}
            type="primary"
            icon={<SaveOutlined />}
          >
            {t("save")}
          </Button>
          <Button size="small" onClick={onCancel} icon={<CloseOutlined />}>
            {t("cancel")}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        size="small"
        initialValues={{
          enabled: false,
          behavior: "hide",
          selector: "",
          code: "",
          urlPattern: "",
        }}
        preserve={false}
      >
        <Form.Item
          label={t("projectNameLabel")}
          name="name"
          rules={[
            { required: true, message: t("nameRequired") },
            { max: 50, message: t("projectNameMaxLength") },
          ]}
        >
          <Input placeholder={t("projectNamePlaceholder")} size="small" />
        </Form.Item>

        <Form.Item
          label={t("projectDescriptionLabel")}
          name="description"
          rules={[
            {
              max: 200,
              message: t("projectDescriptionMaxLength"),
            },
          ]}
        >
          <TextArea
            rows={2}
            placeholder={t("projectDescriptionPlaceholder")}
            size="small"
          />
        </Form.Item>

        <Form.Item
          label={t("inflowwCodeLabel")}
          name="code"
          extra={t("inflowwCodeExtra")}
        >
          <Input placeholder={t("inflowwCodePlaceholder")} size="small" />
        </Form.Item>

        <Form.Item
          label={t("belongingGroupLabel")}
          name="module"
          rules={[{ required: true, message: t("groupRequired") }]}
        >
          <AutoComplete
            placeholder={t("belongingGroupPlaceholder")}
            allowClear
            size="small"
            options={moduleOptions}
            filterOption={(inputValue, option) =>
              option?.value?.toLowerCase().includes(inputValue.toLowerCase()) ||
              false
            }
          />
        </Form.Item>

        <Form.Item
          label={t("cssSelector")}
          name="selector"
          rules={[{ required: true, message: t("cssSelectorRequired") }]}
          extra={
            <div style={{ fontSize: 12, color: "#666" }}>
              <div>{t("cssSelectorHint")}</div>
              <div
                style={{ marginTop: 4, fontWeight: "bold", color: "#1890ff" }}
              >
                {t("cssSelectorMultiHint")}
              </div>
            </div>
          }
        >
          <TextArea
            rows={3}
            placeholder={t("cssSelectorPlaceholder")}
            size="small"
          />
        </Form.Item>

        <Form.Item
          label={t("urlPatternLabel")}
          name="urlPattern"
          extra={
            <div style={{ fontSize: 12, color: "#666" }}>
              <div>{t("urlPatternHint")}</div>
              <div style={{ marginTop: 4 }}>{t("urlPatternEmptyHint")}</div>
            </div>
          }
        >
          <Input
            placeholder={t("urlPatternPlaceholder")}
            size="small"
            allowClear
          />
        </Form.Item>

        {/* Hidden behavior field with default value */}
        <Form.Item name="behavior" hidden>
          <Input />
        </Form.Item>

        {/* Hidden enabled status field with default value */}
        <Form.Item name="enabled" hidden>
          <Input />
        </Form.Item>
      </Form>
    </Card>
  );
};

// Use React.memo to optimize component and prevent unnecessary re-renders
export const ProjectForm = React.memo(
  ProjectFormComponent,
  (prevProps, nextProps) => {
    // Only re-render when key props change
    return (
      prevProps.visible === nextProps.visible &&
      prevProps.editingProject?.name === nextProps.editingProject?.name &&
      prevProps.lang === nextProps.lang &&
      prevProps.moduleOptions.length === nextProps.moduleOptions.length
    );
  }
);
