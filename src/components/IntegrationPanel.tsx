import React, { useMemo, useState } from "react";
import { Button, Divider, Select, Tag, Typography } from "antd";

const { Title, Text } = Typography;

type IntegrationPanelProps = {
  pageInfo: any | null;
  onBack: () => void;
  onSendTheme: (mode: "light" | "dark") => Promise<void> | void;
  onSendLanguage: (language: string) => Promise<void> | void;
  onRefresh: () => Promise<void> | void;
};

export default function IntegrationPanel(props: IntegrationPanelProps) {
  const { pageInfo, onBack, onSendTheme, onSendLanguage, onRefresh } = props;

  const [language, setLanguage] = useState<string>("en");

  const themeIntegrated = useMemo(
    () => !!pageInfo?.thirdPartyIntegration_themeMode,
    [pageInfo]
  );
  const languageIntegrated = useMemo(
    () => !!pageInfo?.thirdPartyIntegration_language,
    [pageInfo]
  );

  return (
    <div style={{ padding: 12, width: 600, minHeight: 400 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Button onClick={onBack}>Back</Button>
        <Title level={4} style={{ margin: 0 }}>
          Third-party Integration Tester
        </Title>
        <div style={{ marginLeft: "auto" }}>
          <Button onClick={() => onRefresh()}>Refresh</Button>
        </div>
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div
          style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: 12 }}
        >
          <Title level={5} style={{ marginTop: 0 }}>
            Integration Status
          </Title>
          <div style={{ display: "grid", gap: 8 }}>
            <div>
              <Text strong>Theme event response</Text>
              <div>
                {themeIntegrated ? (
                  <Tag color="green">Received</Tag>
                ) : (
                  <Tag color="default">Waiting</Tag>
                )}
              </div>
            </div>
            <div>
              <Text strong>Language event response</Text>
              <div>
                {languageIntegrated ? (
                  <Tag color="green">Received</Tag>
                ) : (
                  <Tag color="default">Waiting</Tag>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: 12 }}
        >
          <Title level={5} style={{ marginTop: 0 }}>
            Send Theme
          </Title>
          <div style={{ display: "flex", gap: 8 }}>
            <Button onClick={() => onSendTheme("light")}>Set Light</Button>
            <Button type="primary" onClick={() => onSendTheme("dark")}>
              Set Dark
            </Button>
          </div>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          padding: 12,
          marginTop: 16,
        }}
      >
        <Title level={5} style={{ marginTop: 0 }}>
          Send Language
        </Title>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Select
            value={language}
            onChange={setLanguage}
            style={{ minWidth: 220 }}
            options={[
              { value: "en-US", label: "English (en-US)" },
              { value: "zh-CN", label: "Chinese (zh-CN)" },
              { value: "fr-FR", label: "French (fr-FR)" },
              { value: "de-DE", label: "German (de-DE)" },
              { value: "es-ES", label: "Spanish (es-ES)" },
            ]}
          />
          <Button type="primary" onClick={() => onSendLanguage(language)}>
            Set Language
          </Button>
        </div>
      </div>
    </div>
  );
}
