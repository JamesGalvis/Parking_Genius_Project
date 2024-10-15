"use client"

import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { DesktopSidebar } from "@/components/dashboard/navigation/desktop-sidebar"

export function MobileSidebar() {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="size-6 shrink-0" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[280px] p-0" side="left">
          <SheetDescription className="hidden" aria-readonly></SheetDescription>
          <SheetTitle className="hidden" aria-readonly></SheetTitle>
          <DesktopSidebar mobileItems />
        </SheetContent>
      </Sheet>
    </div>
  )
}
