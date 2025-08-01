import { Select } from "antd";
import { getAvailableLanguages, shouldShowLanguageSelector } from "../lib/i18n";

interface LanguageSelectorProps {
  lang: string;
  onChange: (lang: string) => void;
}

export function LanguageSelector({ lang, onChange }: LanguageSelectorProps) {
  // Don't show language selector if only one language is available
  if (!shouldShowLanguageSelector()) {
    return null;
  }

  const languages = getAvailableLanguages();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: 6,
      }}
    >
      <Select
        size="small"
        value={lang}
        style={{ width: 80 }}
        options={Object.entries(languages).map(([k, v]) => ({
          value: k,
          label: v,
        }))}
        onChange={onChange}
      />
    </div>
  );
}
