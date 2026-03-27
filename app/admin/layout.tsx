import { PageLayout } from "@/components/layout/page-layout"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PageLayout>{children}</PageLayout>
}
