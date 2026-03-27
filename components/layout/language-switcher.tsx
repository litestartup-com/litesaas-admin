"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"
import { useI18n } from "@/store/use-i18n"
import { useRouter, usePathname } from "next/navigation"

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (newLocale: "en" | "zh") => {
    setLocale(newLocale)
    // Update HTML lang attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLocale
    }
    // Refresh the page to apply translations
    router.refresh()
  }

  const languages = [
    { code: "en" as const, label: "English", native: "English" },
    { code: "zh" as const, label: "中文", native: "简体中文" },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="Change language">
          <Languages className="h-4 w-4" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLocaleChange(lang.code)}
            className={locale === lang.code ? "bg-muted" : ""}
          >
            <span>{lang.native}</span>
            {locale === lang.code && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
