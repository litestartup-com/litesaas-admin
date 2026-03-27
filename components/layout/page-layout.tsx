"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useUI } from "@/store/use-ui"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { SidebarContent } from "@/components/layout/sidebar-content"
import { useEffect, useState } from "react"

export function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { sidebarOpen, setSidebarOpen } = useUI()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-6">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout with Sheet - Only render on mobile */}
      {isMobile && (
        <div className="flex lg:hidden h-screen overflow-hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent 
              side="left" 
              className="w-64 p-0 border-r" 
              showOverlay={false}
              showCloseButton={false}
            >
              <div className="flex flex-col h-full">
                <SidebarContent isMobile={true} />
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex flex-col flex-1 overflow-hidden w-full">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  )
}
