import { Loader2 } from "lucide-react"

export function Loader() {
  return (
    <div className="flex items-center justify-center size-full pt-10">
      <Loader2 className="size-12 text-main z-10 animate-spin" />
    </div>
  )
}
