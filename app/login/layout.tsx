import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - Lite SaaS Admin",
  description: "Sign in to your account",
}

export default function LoginLayout({
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
