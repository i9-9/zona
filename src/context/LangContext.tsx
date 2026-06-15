"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { SiteLang } from "@/data/i18n/lang";

type LangContextValue = {
  lang: SiteLang;
  setLang: (lang: SiteLang) => void;
  toggleLang: () => void;
  hydrated: boolean;
};

const LangContext = createContext<LangContextValue | null>(null);

const LANG_KEY = "zona-lang";
const LEGACY_LANG_KEY = "zona-shop-lang";

function loadLang(): SiteLang {
  if (typeof window === "undefined") return "es";
  const stored = localStorage.getItem(LANG_KEY) ?? localStorage.getItem(LEGACY_LANG_KEY);
  return stored === "en" ? "en" : "es";
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<SiteLang>("es");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadLang();
    setLangState(stored);
    localStorage.setItem(LANG_KEY, stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = lang;
  }, [lang, hydrated]);

  const setLang = useCallback((next: SiteLang) => {
    setLangState(next);
    localStorage.setItem(LANG_KEY, next);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "es" ? "en" : "es");
  }, [lang, setLang]);

  return (
    <LangContext.Provider value={{ lang, setLang, toggleLang, hydrated }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
