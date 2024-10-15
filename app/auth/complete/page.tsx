import Image from "next/image"
import { redirect } from "next/navigation"

import { RegistrationCompletionForm } from "@/components/auth/registration-completion-form"
import { Logo } from "@/components/common/logo"
import { currentUser } from "@/lib/auth-user"
import { getUserById } from "@/actions/user"

export default async function AuthCompletePage() {
  const loggedUser = await currentUser()
  const existingUser = await getUserById(loggedUser?.id)

  const missingData =
    existingUser?.emailVerified !== null && !existingUser?.password

  if (!missingData) {
    redirect("/dashboard")
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="max-lg:hidden relative shrink-0 min-h-full w-[430px] bg-black pt-16 px-8">
        <Logo />

        <div className="my-14 space-y-5">
          <h3 className="text-[34px] leading-9 font-bold text-white">
            Descubre el poder de una gestión ágil
          </h3>
          <p className="text-muted/70 dark:text-muted-foreground">
            Completa tu registro y empieza a disfrutar de una administración sin
            complicaciones. Hola
          </p>
        </div>

        <div className="w-full h-[250px] absolute bottom-0 left-0">
          <Image
            alt="Ilustration"
            src="/assets/images/composition-2.png"
            fill
            className="w-full h-full rounded-t-xl"
          />
        </div>
      </div>
      <div className="px-4 py-6 w-full overflow-y-auto">
        <RegistrationCompletionForm />
      </div>
    </div>
  )
}
