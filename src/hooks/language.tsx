import { useState, createContext, useContext } from "react";
import en from "../i18n/en.json";
import th from "../i18n/th.json";
import zh from "../i18n/zh.json";
import ja from "../i18n/ja.json";
import ko from "../i18n/ko.json";
import bin from "../i18n/bin.json";

export type Language = "en" | "th" | "zh" | "ja" | "ko" | "bin";
const dict: Record<Language, Record<string, string>> = {
  en,
  th,
  zh,
  ja,
  ko,
  bin,
};

const LanguageContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
} | null>(null);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const browserLang = navigator.language.split("-")[0] as Language;
    const supportedLanguages: Language[] = ["en", "th", "ko", "ja", "zh"];
    return supportedLanguages.includes(browserLang) ? browserLang : "en";
  });

  const t = (key: string) => {
    return dict[lang][key] || dict["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
