"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Mail, MoreVertical, Chrome } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { fetchWithAuth } from "@/lib/fetch-with-auth"

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type EmailFormValues = z.infer<typeof emailSchema>

interface AuthenticationMethod {
  id: string
  type: string
  name: string
  email: string
  connectedAt: string
  icon: string
  canDisconnect: boolean
}

interface ProfileData {
  email: string
  authentication: AuthenticationMethod[]
}

export function ProfileContent() {
  const { t } = useTranslation()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const response = await fetchWithAuth("/api/profile")
      if (response.status === 401) return
      const result = await response.json()

      if (result.success) {
        setProfileData(result.data)
        setValue("email", result.data.email)
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: EmailFormValues) => {
    setSaving(true)
    try {
      const response = await fetchWithAuth("/api/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      })
      if (response.status === 401) return

      const result = await response.json()

      if (result.success) {
        setProfileData(result.data)
        alert("Email updated successfully")
      } else {
        alert(result.error.message || "Failed to update email")
      }
    } catch (error) {
      console.error("Failed to update email:", error)
      alert("Failed to update email. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleDisconnect = async (id: string) => {
    if (!confirm("Are you sure you want to disconnect this authentication method?")) {
      return
    }

    try {
      const response = await fetchWithAuth(`/api/profile/authentication/${id}`, {
        method: "DELETE",
      })
      if (response.status === 401) return

      const result = await response.json()

      if (result.success) {
        fetchProfile()
        alert("Authentication method disconnected successfully")
      } else {
        alert(result.error.message || "Failed to disconnect")
      }
    } catch (error) {
      console.error("Failed to disconnect:", error)
      alert("Failed to disconnect. Please try again.")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Mail":
        return <Mail className="h-5 w-5" />
      case "Chrome":
        return (
          <div className="h-5 w-5 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>
        )
      default:
        return <Mail className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('profile.title')}</h1>
        <p className="text-muted-foreground">{t('profile.description')}</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">{t('common.loading')}</div>
      ) : (
        <div className="space-y-6">
          {/* Your Email Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.yourEmail')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('profile.emailAddress')}</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={cn(errors.email && "border-destructive")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? t('profile.saving') : t('profile.saveChanges')}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Authentication Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.authentication')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t('profile.authenticationDescription')}
              </p>
              <div className="space-y-4">
                {profileData?.authentication.map((auth) => (
                  <div
                    key={auth.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg overflow-hidden"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        {getIcon(auth.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{auth.name}</div>
                        <div className="text-sm text-muted-foreground truncate">{auth.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
                      <div className="text-sm text-muted-foreground">
                        {t('profile.connectedOn')} {formatDate(auth.connectedAt)}
                      </div>
                      {auth.canDisconnect && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => handleDisconnect(auth.id)}
                              className="text-destructive"
                            >
                              {t('profile.disconnect')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
