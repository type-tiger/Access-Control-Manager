import React, { useMemo, useState } from "react";
import { Button, Divider, Select, Tag, Typography } from "antd";
import { createTranslator } from "../lib/i18n";

const { Title, Text } = Typography;

type IntegrationPanelProps = {
  pageInfo: any | null;
  onBack: () => void;
  onSendTheme: (mode: "light" | "dark") => Promise<void> | void;
  onSendLanguage: (language: string) => Promise<void> | void;
  onRefresh: () => Promise<void> | void;
  lang: string;
};

export default function IntegrationPanel(props: IntegrationPanelProps) {
  const { pageInfo, onBack, onSendTheme, onSendLanguage, onRefresh, lang } =
    props;

  const [language, setLanguage] = useState<string>("en-US");

  const t = createTranslator(lang);

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
        <Button onClick={onBack}>{t("integrationBack")}</Button>
        <Title level={4} style={{ margin: 0 }}>
          {t("integrationTesterTitle")}
        </Title>
        <div style={{ marginLeft: "auto" }}>
          <Button onClick={() => onRefresh()}>{t("integrationRefresh")}</Button>
        </div>
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div
          style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: 12 }}
        >
          <Title level={5} style={{ marginTop: 0 }}>
            {t("integrationStatus")}
          </Title>
          <div style={{ display: "grid", gap: 8 }}>
            <div>
              <Text strong>{t("integrationThemeEventResponse")}</Text>
              <div>
                {themeIntegrated ? (
                  <Tag color="green">{t("integrationReceived")}</Tag>
                ) : (
                  <Tag color="default">{t("integrationWaiting")}</Tag>
                )}
              </div>
            </div>
            <div>
              <Text strong>{t("integrationLanguageEventResponse")}</Text>
              <div>
                {languageIntegrated ? (
                  <Tag color="green">{t("integrationReceived")}</Tag>
                ) : (
                  <Tag color="default">{t("integrationWaiting")}</Tag>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: 12 }}
        >
          <Title level={5} style={{ marginTop: 0 }}>
            {t("integrationSendTheme")}
          </Title>
          <div style={{ display: "flex", gap: 8 }}>
            <Button onClick={() => onSendTheme("light")}>
              {t("integrationSetLight")}
            </Button>
            <Button type="primary" onClick={() => onSendTheme("dark")}>
              {t("integrationSetDark")}
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
          {t("integrationSendLanguage")}
        </Title>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Select
            value={language}
            onChange={setLanguage}
            style={{ minWidth: 220 }}
            options={[
              { value: "en-US", label: t("integrationLanguage_en_US") },
              { value: "fr-FR", label: t("integrationLanguage_fr_FR") },
              { value: "de-DE", label: t("integrationLanguage_de_DE") },
              { value: "es-ES", label: t("integrationLanguage_es_ES") },
            ]}
          />
          <Button type="primary" onClick={() => onSendLanguage(language)}>
            {t("integrationSetLanguage")}
          </Button>
        </div>
      </div>
    </div>
  );
}
