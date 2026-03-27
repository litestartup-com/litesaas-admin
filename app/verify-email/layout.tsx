import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Verify Email - Lite SaaS Admin",
  description: "Verify your email address to complete signup",
}

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      {children}
    </div>
  )
}
