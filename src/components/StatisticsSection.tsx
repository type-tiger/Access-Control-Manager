import { Badge, Card, Space, Typography } from "antd";
import type { AccessControlConfig } from "../lib/access-control";
import { createTranslator } from "../lib/i18n";

const { Text } = Typography;

interface PageInfo {
  url: string;
  title: string;
  projects: Array<{
    id: string;
    name: string;
    selector: string;
    elementCount: number;
    enabled: boolean;
    behavior: string;
    module: string;
    description: string;
    urlMatches?: boolean; // Whether URL matches
    urlPattern?: string; // URL match pattern
  }>;
  totalElementCount: number;
  totalMatchingElementCount?: number; // Total element count considering URL matching
  configuredProjectCount: number;
  enabledProjectCount: number;
  enabledMatchingProjectCount?: number; // Number of enabled and URL-matched projects
}

interface StatisticsSectionProps {
  config: AccessControlConfig;
  pageInfo: PageInfo | null;
  lang: string;
}

export function StatisticsSection({
  config,
  pageInfo,
  lang,
}: StatisticsSectionProps) {
  const t = createTranslator(lang);
  const enabledProjectCount = Object.values(config.customProjects).filter(
    (item) => item.enabled
  ).length;
  const totalProjectCount = Object.keys(config.customProjects).length;
  const pageElementCount = pageInfo?.totalElementCount || 0;
  const pageTypesCount = pageInfo?.projects.length || 0;

  return (
    <>
      {/* Statistics badges */}
      <div style={{ marginTop: 6, textAlign: "center" }}>
        <Space size="middle">
          <Badge count={enabledProjectCount} showZero color="#ff4d4f">
            <Text style={{ fontSize: 12 }}>{t("controlling")}</Text>
          </Badge>
          <Badge
            count={totalProjectCount - enabledProjectCount}
            showZero
            color="#52c41a"
          >
            <Text style={{ fontSize: 12 }}>{t("normalDisplay")}</Text>
          </Badge>
          {pageInfo && (
            <Badge count={pageElementCount} showZero color="#1890ff">
              <Text style={{ fontSize: 12 }}>{t("pageElements")}</Text>
            </Badge>
          )}
        </Space>
      </div>

      {/* Page info card */}
      {pageInfo && (
        <Card size="small" style={{ marginBottom: 12, marginTop: 12 }}>
          <div style={{ fontSize: 11, lineHeight: 1.4 }}>
            <Text strong>{t("currentPage")}: </Text>
            <Text>
              {pageInfo.title.length > 30
                ? pageInfo.title.substring(0, 30) + "..."
                : pageInfo.title}
            </Text>
            <br />
            <Text type="secondary">
              {t("detectedTypes")}: {pageTypesCount} | {t("elementCount")}:{" "}
              {pageElementCount}
            </Text>
          </div>
        </Card>
      )}
    </>
  );
}
