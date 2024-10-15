"use client"

import { useRouter } from "next/navigation"

import { SparklesCore } from "@/components/common/parkles"
import { Spotlight } from "@/components/common/spot-light"
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/use-current-user"
import { cn } from "@/lib/utils"

export default function MarketingPage() {
  const loggedUser = useCurrentUser()
  const router = useRouter()

  return (
    <div className="min-h-full h-full">
      <div className="min-h-full w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden p-4">
        <div
          className={cn(
            "flex justify-end items-center w-full absolute top-0 z-50 py-4 px-6 sm:space-x-3 space-x-1",
            loggedUser && "hidden"
          )}
        >
          <Button
            className="max-xs:px-3"
            variant="ghost"
            onClick={() => router.push("/auth/login")}
          >
            Inicia Sesión
          </Button>
          <Button
            className="max-xs:px-3"
            onClick={() => router.push("/auth/register")}
          >
            Regístrate
          </Button>
        </div>
        <div className="w-full absolute inset-0 h-screen">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={20}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)]" />
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <div className="flex flex-col items-center max-w-7xl mx-auto relative z-10 w-full pt-24 md:pt-0">
          <h1 className="md:text-7xl xs:text-6xl max-xs:text-[38px] leading-10 font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Impulsa tu negocio <br /> con ParkGenius
          </h1>
          <p className="mt-4 font-normal md:text-lg text-neutral-300 max-w-lg text-center mx-auto">
            Controla, organiza y maximiza tu operación con una solución diseñada
            para simplificar tu negocio.
          </p>
          <Button
            onClick={() => router.push("/dashboard")}
            className={cn("sm:h-11 rounded-lg px-6 mt-12 font-semibold", !loggedUser && "hidden")}
          >
            Ir al panel
          </Button>
        </div>
      </div>
    </div>
  )
}
