import { Button, Flex, Space } from "antd";
import { createTranslator } from "../lib/i18n";
import { LanguageSelector } from "./LanguageSelector";

interface QuickActionsProps {
  lang: string;
  onEnableAll: () => void;
  onDisableAll: () => void;
  setShowIntegration: (show: boolean) => void;
  setLang: (lang: string) => void;
}

export function QuickActions({
  lang,
  onEnableAll,
  onDisableAll,
  setShowIntegration,
  setLang,
}: QuickActionsProps) {
  const t = createTranslator(lang);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <Button size="small" onClick={onEnableAll} style={{ fontSize: 11 }}>
          {t("enableAllControl")}
        </Button>
        <Button size="small" onClick={onDisableAll} style={{ fontSize: 11 }}>
          {t("disableAllControl")}
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          alignContent: "center",
        }}
      >
        {" "}
        <Button
          size="small"
          style={{ fontSize: 11 }}
          onClick={() => setShowIntegration(true)}
        >
          {t("integrationEntry")}
        </Button>
        <LanguageSelector lang={lang} onChange={setLang} />
      </div>
    </div>
  );
}
