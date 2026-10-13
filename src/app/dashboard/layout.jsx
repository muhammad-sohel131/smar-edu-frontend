'use client'

import { DashboardSidebar } from "@/components/modules/dashboard/DashboardSidebar"

export default function AdminLayout({
  children,
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--color-background)]">
      <DashboardSidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        {children}
      </main>
    </div>
  )
}
