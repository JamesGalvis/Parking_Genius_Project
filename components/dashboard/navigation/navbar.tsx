import { ModeToggle } from "@/components/common/mode-toggle"
import { UserButton } from "@/components/common/user-button"
import { MobileSidebar } from "@/components/dashboard/navigation/mobile-sidebar"

export async function Navbar() {
  return (
    <div className="flex items-center lg:justify-end justify-between w-full h-[60px] lg:px-6 px-4 border-b">
      <UserButton className="lg:hidden block" />
      <div className="flex items-center gap-3">
        <ModeToggle />
        <UserButton className="hidden lg:block" />
        <MobileSidebar />
      </div>
    </div>
  )
}
