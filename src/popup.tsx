import React from "react";
import { Button, Divider, Typography } from "antd";
import { usePopupLogic } from "./hooks/usePopupLogic";
import { LanguageSelector } from "./components/LanguageSelector";
import { QuickActions } from "./components/QuickActions";
import { CustomProjectManager } from "./components/CustomProjectManager";
import { createTranslator } from "./lib/i18n";
import IntegrationPanel from "./components/IntegrationPanel";

const { Text } = Typography;

export default function Popup() {
  const {
    config,
    loading,
    pageInfo,
    lang,
    setLang,
    messageApi,
    contextHolder,
    enableAll,
    disableAll,
    handleConfigChange,
    getPageInfo,
    sendThemeEvent,
    sendLanguageEvent,
  } = usePopupLogic();

  const t = createTranslator(lang);
  const [showIntegration, setShowIntegration] = React.useState(false);

  if (loading) {
    return (
      <div style={{ padding: 20, width: 600, textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            fontSize: 24,
            marginBottom: 10,
          }}
        >
          Loading...
        </div>
        <div>{t("loading")}</div>
      </div>
    );
  }

  if (showIntegration) {
    return (
      <IntegrationPanel
        pageInfo={pageInfo}
        onBack={() => setShowIntegration(false)}
        onSendTheme={sendThemeEvent}
        onSendLanguage={sendLanguageEvent}
        onRefresh={getPageInfo}
      />
    );
  }

  return (
    <div style={{ padding: 12, width: 600, minHeight: 400, maxHeight: 1080 }}>
      {contextHolder}

      {/* Title and language switch on the same row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
            {t("title")}
          </h1>
          {/* Page info summary */}
          {pageInfo && (
            <div
              style={{
                fontSize: 12,
                color: "#666",
                marginTop: 4,
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <span>
                {t("matchingElements")}:
                <strong
                  style={{
                    color:
                      pageInfo.totalElementCount > 0 ? "#52c41a" : "#8c8c8c",
                  }}
                >
                  {pageInfo.totalElementCount}
                </strong>
              </span>
              <span>
                {t("actuallyEffective")}:
                <strong
                  style={{
                    color: (() => {
                      const activeElementCount = pageInfo.projects
                        .filter((p) => p.enabled && p.urlMatches)
                        .reduce((sum, p) => sum + p.elementCount, 0);
                      return activeElementCount > 0 ? "#ff4d4f" : "#8c8c8c";
                    })(),
                  }}
                >
                  {pageInfo.projects
                    .filter((p) => p.enabled && p.urlMatches)
                    .reduce((sum, p) => sum + p.elementCount, 0)}
                </strong>
              </span>
              <span>
                {t("enabledControls")}:
                <strong
                  style={{
                    color:
                      (pageInfo.enabledMatchingProjectCount || 0) > 0
                        ? "#f5222d"
                        : "#8c8c8c",
                  }}
                >
                  {pageInfo.enabledMatchingProjectCount || 0}
                </strong>
              </span>
              <span>
                {t("configuredProjects")}:
                <strong style={{ color: "#1890ff" }}>
                  {pageInfo.configuredProjectCount}
                </strong>
              </span>
            </div>
          )}
          {!pageInfo && !loading && (
            <div
              style={{
                fontSize: 12,
                color: "#8c8c8c",
                marginTop: 4,
              }}
            >
              {t("waitingForPageInfo")}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <QuickActions
        setShowIntegration={setShowIntegration}
        setLang={setLang}
        lang={lang}
        onEnableAll={enableAll}
        onDisableAll={disableAll}
      />

      <Divider style={{ margin: "8px 0" }} />

      {/* Custom project management */}
      <CustomProjectManager
        config={config}
        pageInfo={pageInfo}
        lang={lang}
        onConfigChange={handleConfigChange}
        messageApi={messageApi}
      />
    </div>
  );
}
