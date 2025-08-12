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
    <Select
      size="small"
      value={lang}
      style={{ width: 120 }}
      options={Object.entries(languages).map(([k, v]) => ({
        value: k,
        label: v,
      }))}
      onChange={onChange}
    />
  );
}
