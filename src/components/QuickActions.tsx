import { Button, Space } from "antd";
import type { AccessControlConfig } from "../lib/access-control";
import { createTranslator } from "../lib/i18n";

interface QuickActionsProps {
  lang: string;
  onEnableAll: () => void;
  onDisableAll: () => void;
}

export function QuickActions({
  lang,
  onEnableAll,
  onDisableAll,
}: QuickActionsProps) {
  const t = createTranslator(lang);

  return (
    <div style={{ marginBottom: 12 }}>
      <Space wrap size="small">
        <Button size="small" onClick={onEnableAll} style={{ fontSize: 11 }}>
          {t("enableAllControl")}
        </Button>
        <Button size="small" onClick={onDisableAll} style={{ fontSize: 11 }}>
          {t("disableAllControl")}
        </Button>
      </Space>
    </div>
  );
}
