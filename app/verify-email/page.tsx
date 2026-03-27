"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { setAuthToken } from "@/lib/auth"
import { useUser } from "@/store/use-user"

const verifySchema = z.object({
  code: z.string().length(5, "Verification code must be 5 digits"),
})

type VerifyFormValues = z.infer<typeof verifySchema>

export default function VerifyEmailPage() {
  const router = useRouter()
  const { setUser } = useUser()
  const [email, setEmail] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(60)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
  })

  useEffect(() => {
    // Get email from session storage (from signup or login)
    if (typeof window !== "undefined") {
      const storedEmail = sessionStorage.getItem("signup_email") || sessionStorage.getItem("login_email")
      if (storedEmail) {
        setEmail(storedEmail)
      } else {
        // If no email, redirect to login
        router.push("/login")
      }
    }
  }, [router])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const onSubmit = async (data: VerifyFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: data.code,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Store token with expiration
        if (result.data.token) {
          setAuthToken(result.data.token)
        }
        // Store user info
        if (result.data.user) {
          setUser(result.data.user)
        }
        // Clean up session storage
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("signup_email")
          sessionStorage.removeItem("login_email")
        }
        // Navigate to dashboard
        router.push("/dashboard")
      } else {
        setError(result.error.message)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()
      if (result.success) {
        setResendTimer(60)
        // Show success message
      }
    } catch (err) {
      setError("Failed to resend code. Please try again.")
    }
  }

  if (!email) {
    return null // Will redirect
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome to litestartup</CardTitle>
        <CardDescription>Sign up to get started for free!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground">
          Code sent to {email}
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="•••••"
              maxLength={5}
              className={cn(
                "text-center text-2xl tracking-widest",
                errors.code && "border-destructive focus-visible:ring-destructive"
              )}
              {...register("code", {
                pattern: {
                  value: /^\d+$/,
                  message: "Code must contain only numbers",
                },
              })}
              onInput={(e) => {
                // Only allow numbers
                const target = e.target as HTMLInputElement
                target.value = target.value.replace(/[^0-9]/g, "")
              }}
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendTimer > 0}
              className={cn(
                "text-primary hover:underline",
                resendTimer > 0 && "text-muted-foreground cursor-not-allowed"
              )}
            >
              Resend code {resendTimer > 0 && `(${resendTimer}s)`}
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify & Sign In"}
          </Button>

          <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Can&apos;t find the code? Check your spam or junk folder
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/signup"
              className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
            >
              ← Change email address
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
