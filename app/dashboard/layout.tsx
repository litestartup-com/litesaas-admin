import { PageLayout } from "@/components/layout/page-layout"

export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PageLayout>{children}</PageLayout>
}
