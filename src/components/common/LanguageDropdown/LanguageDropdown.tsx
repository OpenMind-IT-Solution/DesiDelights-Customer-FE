"use client";

import { useLanguage } from "@/app/context/LanguageContext";

const LanguageDropdown = () => {
  const { lang, setLang } = useLanguage();
  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as "en" | "fr" | "nl")}
      className="border rounded-md px-2 py-1 text-sm bg-white text-gray-700"
    >
      <option value="en">🇬🇧 EN</option>
      <option value="fr">🇫🇷 FR</option>
      <option value="nl">🇧🇪 NL</option>
    </select>
  );
};

export default LanguageDropdown;
