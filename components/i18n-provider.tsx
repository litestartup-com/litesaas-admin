"use client"

import { useEffect } from "react"
import { useI18n } from "@/store/use-i18n"

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useI18n()

  useEffect(() => {
    // Update HTML lang attribute when locale changes
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale
    }
  }, [locale])

  // Initialize locale from storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("i18n-locale")
      if (stored && (stored === "en" || stored === "zh")) {
        document.documentElement.lang = stored
      }
    }
  }, [])

  return <>{children}</>
}
