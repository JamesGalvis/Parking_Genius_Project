import { CarFront, Loader2 } from "lucide-react";
import Image from "next/image";

export function Loader() {
  return (
    <div className="flex items-center justify-center size-full pt-10">
      {/* <CarFront className="size-12 z-10 animate-pulse" /> */}
      <Loader2 className="size-12 text-main z-10 animate-spin" />
    </div>
  );
}
