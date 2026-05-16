"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import nl from "@/locales/nl.json";

type Lang = "en" | "fr" | "nl";
type TranslationKeys = keyof typeof en;
type Translations = Record<Lang, Record<TranslationKeys, string>>;
const translations: Translations = { en, fr, nl };
interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");

  const t = (key: TranslationKeys) => translations[lang][key];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
