export type SiteLang = "es" | "en";

export function langToggleLabel(lang: SiteLang): string {
  return lang === "es" ? "EN" : "ES";
}
