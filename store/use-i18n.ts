import { create } from "zustand"

export type Locale = "en" | "zh"

interface I18nStore {
  locale: Locale
  setLocale: (locale: Locale) => void
}

// Simple persist using localStorage directly
const getStoredLocale = (): Locale => {
  if (typeof window === "undefined") return "en"
  const stored = localStorage.getItem("i18n-locale")
  return (stored === "en" || stored === "zh") ? stored : "en"
}

export const useI18n = create<I18nStore>((set) => ({
  locale: typeof window !== "undefined" ? getStoredLocale() : "en",
  setLocale: (locale: Locale) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("i18n-locale", locale)
    }
    set({ locale })
  },
}))
