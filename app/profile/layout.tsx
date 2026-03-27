import { PageLayout } from "@/components/layout/page-layout"

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PageLayout>{children}</PageLayout>
}
