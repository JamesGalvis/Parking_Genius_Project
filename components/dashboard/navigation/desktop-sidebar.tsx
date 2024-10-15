"use client"

import Link from "next/link"
import { LayoutDashboard, LogOut, Package2Icon } from "lucide-react"

import { SignOutButton } from "@/components/auth/sign-out-button"
import { SidebarRoutes } from "@/components/dashboard/navigation/sidebar-routes"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarRouteItem } from "./sidebar-route-item"
import { adminRoutes, employeeRoutes } from "@/constants"

interface DesktopSidebarProps {
  mobileItems?: boolean
}

export function DesktopSidebar({ mobileItems }: DesktopSidebarProps) {
  return (
    <aside className="flex flex-col w-[280px] max-h-screen h-full shrink-0 border-r bg-zinc-100/40 dark:bg-zinc-900/10 overflow-hidden">
      <div className="h-[60px] shrink-0 border-b px-7">
        <Link
          href="/dashboard"
          className="h-full flex items-center gap-3 font-semibold select-none"
        >
          <Package2Icon className="h-6 w-6" />
          <span>ParkGenius</span>
        </Link>
      </div>

      <ScrollArea className="h-full">
        <nav className="flex-1 py-2 overflow-y-auto">
          <SidebarRouteItem
            label="Inicio"
            href="/dashboard"
            Icon={LayoutDashboard}
            mobileItem={mobileItems}
          />
          <SidebarRoutes
            routes={employeeRoutes}
            title="Clientes"
            className="mt-1"
            mobileItems={mobileItems}
          />
          <SidebarRoutes
            routes={adminRoutes}
            title="Administaración"
            className="mt-1"
            mobileItems={mobileItems}
            onlyAdmin
          />
        </nav>
      </ScrollArea>

      <div className="px-4 border-t">
        <SignOutButton
          variant="ghost"
          className="flex items-center justify-start gap-3 w-full my-2"
        >
          <LogOut className="h-5 w-5 shrink-0" />
        </SignOutButton>
      </div>
    </aside>
  )
}
