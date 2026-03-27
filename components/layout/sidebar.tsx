"use client"

import { useUI } from "@/store/use-ui"
import { SidebarContent } from "./sidebar-content"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUI()

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r bg-background transition-all duration-300 ease-in-out relative",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col h-full">
        <SidebarContent />
      </div>
      
      {/* Toggle Button at Bottom Right */}
      <div className="absolute bottom-4 -right-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-6 w-6 rounded-full bg-white dark:bg-gray-800 border border-border shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
    </aside>
  )
}
