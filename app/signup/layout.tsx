import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up - Lite SaaS Admin",
  description: "Sign up to get started for free!",
}

export default function SignupLayout({
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
