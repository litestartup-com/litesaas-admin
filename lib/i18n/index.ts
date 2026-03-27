import { useI18n } from "@/store/use-i18n"
import enTranslations from "./translations/en.json"
import zhTranslations from "./translations/zh.json"

type TranslationKey = keyof typeof enTranslations
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

type TranslationKeys = NestedKeyOf<typeof enTranslations>

const translations = {
  en: enTranslations,
  zh: zhTranslations,
}

export function useTranslation() {
  const { locale } = useI18n()

  const t = (key: TranslationKeys, params?: Record<string, string | number>): string => {
    const keys = key.split(".")
    let value: any = translations[locale]

    for (const k of keys) {
      value = value?.[k]
    }

    if (value === undefined) {
      // Fallback to English if translation not found
      let fallbackValue: any = translations.en
      for (const k of keys) {
        fallbackValue = fallbackValue?.[k]
      }
      value = fallbackValue || key
    }

    // Replace parameters
    if (params && typeof value === "string") {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match
      })
    }

    return value || key
  }

  return { t, locale }
}

export type { TranslationKeys }
