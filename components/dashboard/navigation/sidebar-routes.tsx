"use client"

import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useCurrentRole } from "@/hooks/use-current-role"
import { SidebarRouteItem } from "@/components/dashboard/navigation/sidebar-route-item"

interface SidebarRoutesProps {
  routes: { href: string; label: string; Icon: LucideIcon }[]
  title: string
  onlyAdmin?: boolean
  className?: string
  mobileItems?: boolean
}

export function SidebarRoutes({
  routes,
  title,
  onlyAdmin,
  className,
  mobileItems
}: SidebarRoutesProps) {
  const userRole = useCurrentRole()

  console.log(userRole)

  return (
    <div
      className={cn(
        "py-4 space-y-1.5",
        onlyAdmin && userRole !== "ADMIN" && "hidden",
        className
      )}
    >
      <p className="font-bold px-7">{title}</p>
      {routes.map(({ label, href, Icon }) => (
        <SidebarRouteItem key={href} label={label} href={href} Icon={Icon} mobileItem={mobileItems} />
      ))}
    </div>
  )
}
