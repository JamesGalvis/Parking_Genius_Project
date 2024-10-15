"use client"

import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { SheetClose } from "@/components/ui/sheet"

interface SidebarRouteItemProps {
  label: string
  href: string
  Icon: LucideIcon
  mobileItem?: boolean
}

export function SidebarRouteItem({
  Icon,
  href,
  label,
  mobileItem = false,
}: SidebarRouteItemProps) {
  const pathname = usePathname()

  const isActive =
    (pathname === "/dashboard" && href === "/dashboard") || pathname === href

  return (
    <>
      {!mobileItem && (
        <Link
          href={href}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-3 mx-4 text-primary/70 transition-all hover:text-primary dark:text-primary/70 dark:hover:text-primary hover:bg-indigo-300/20 dark:hover:bg-indigo-300/20",
            isActive &&
              "text-white bg-main hover:text-white hover:bg-main dark:text-white dark:bg-main dark:hover:bg-main dark:hover:text-white font-semibold"
          )}
        >
          <Icon className="size-5" strokeWidth={isActive ? "2.25" : "2"} />
          <p className="text-[15px] font-medium">{label}</p>
        </Link>
      )}
      {mobileItem && (
        <SheetClose asChild>
          <Link
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-3 mx-4 text-primary/70 transition-all hover:text-primary dark:text-primary/70 dark:hover:text-primary hover:bg-indigo-300/20 dark:hover:bg-indigo-300/20",
              isActive &&
                "text-white bg-main hover:text-white hover:bg-main dark:text-white dark:bg-main dark:hover:bg-main dark:hover:text-white font-semibold"
            )}
          >
            <Icon className="size-5" strokeWidth={isActive ? "2.25" : "2"} />
            <p className="text-[15px] font-medium">{label}</p>
          </Link>
        </SheetClose>
      )}
    </>
  )
}
