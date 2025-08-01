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
}: ProjectFormProps) => {
  const title = editingProject ? "Edit Project" : "Add Project";

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
            Save
          </Button>
          <Button size="small" onClick={onCancel} icon={<CloseOutlined />}>
            Cancel
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
          label="Project Name"
          name="name"
          rules={[
            { required: true, message: "Please enter project name" },
            { max: 50, message: "Project name cannot exceed 50 characters" },
          ]}
        >
          <Input placeholder="Enter project name" size="small" />
        </Form.Item>

        <Form.Item
          label="Project Description"
          name="description"
          rules={[
            {
              max: 200,
              message: "Project description cannot exceed 200 characters",
            },
          ]}
        >
          <TextArea
            rows={2}
            placeholder="Enter project description"
            size="small"
          />
        </Form.Item>

        <Form.Item
          label="Infloww Permission Code"
          name="code"
          extra="Optional permission code for Infloww platform integration (can be duplicated)"
        >
          <Input placeholder="Enter permission code (optional)" size="small" />
        </Form.Item>

        <Form.Item
          label="Belonging Group"
          name="module"
          rules={[
            { required: true, message: "Please select or enter group name" },
          ]}
        >
          <AutoComplete
            placeholder="Select existing group or enter new group name"
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
          label="CSS Selector"
          name="selector"
          rules={[{ required: true, message: "Please enter CSS selector" }]}
          extra={
            <div style={{ fontSize: 12, color: "#666" }}>
              <div>
                All CSS selectors supported: .class, #id, tag, [attribute],
                [attribute="value"], .class1.class2, .parent .child, etc.
              </div>
              <div
                style={{ marginTop: 4, fontWeight: "bold", color: "#1890ff" }}
              >
                💡 Multiple selectors supported: separate with commas, e.g.:
                .btn, #header, [data-role]
              </div>
            </div>
          }
        >
          <TextArea
            rows={3}
            placeholder="Enter CSS selectors, multiple selectors separated by commas:&#10;.container, #main, div.active, [data-role='admin']"
            size="small"
          />
        </Form.Item>

        <Form.Item
          label="URL Pattern (Regex)"
          name="urlPattern"
          extra={
            <div style={{ fontSize: 12, color: "#666" }}>
              <div>Regex only. Common patterns:</div>
              <div style={{ marginTop: 2 }}>
                • <code>^/settings$</code> - Exact match /settings page
              </div>
              <div>
                • <code>^/settings</code> - Match paths starting with /settings
              </div>
              <div>
                • <code>.*admin.*</code> - Match paths containing admin
              </div>
              <div>
                • <code>settings|account</code> - Match settings or account
                pages
              </div>
              <div style={{ marginTop: 4 }}>
                Empty means effective on all pages
              </div>
            </div>
          }
        >
          <Input
            placeholder="e.g.: ^/settings$, .*admin.*, settings|account (empty for all pages)"
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
