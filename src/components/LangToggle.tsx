"use client";

import { langToggleLabel } from "@/data/i18n/lang";
import { useLang } from "@/context/LangContext";

type LangToggleProps = {
  className?: string;
};

export function LangToggle({ className = "lang-toggle" }: LangToggleProps) {
  const { lang, toggleLang } = useLang();

  return (
    <button
      type="button"
      onClick={toggleLang}
      className={className}
      aria-label={lang === "es" ? "Switch to English" : "Cambiar a español"}
    >
      {langToggleLabel(lang)}
    </button>
  );
}
