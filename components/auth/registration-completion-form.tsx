"use client"

import { z } from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CompleteRegisterFormSchema } from "@/schemas/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/auth/password-input"
import { FormStateMessage } from "@/components/auth/form-state-message"
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Logo } from "@/components/common/logo"
import { completeRegistration } from "@/actions/auth"

export function RegistrationCompletionForm() {
  const currentUser = useCurrentUser()
  const router = useRouter()

  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)

  const form = useForm<z.infer<typeof CompleteRegisterFormSchema>>({
    resolver: zodResolver(CompleteRegisterFormSchema),
    defaultValues: {
      name: currentUser?.name ?? "",
      phone: "",
      email: currentUser?.email ?? "",
      password: "",
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (
    values: z.infer<typeof CompleteRegisterFormSchema>
  ) => {
    setError("")
    setSuccess("")

    try {
      const response = await completeRegistration(values)
      if (response?.error) {
        setError(response?.error)
      }

      if (!response?.error) router.push("/dashboard")
    } catch (error) {
      toast.error("Algo salió mal!")
    }
  }

  return (
    <div className="xl:max-w-[480px] sm:max-w-[440px] w-full mx-auto px-1 py-10 overflow-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Logo className="lg:hidden" />
          <h1 className="text-[34px] leading-10 font-bold max-lg:mt-6">
            Culmina tu registro
          </h1>
          <p className="lg:hidden mt-4 text-muted/70 dark:text-muted-foreground">
            Completa tu registro y empieza a disfrutar de una administración sin
            complicaciones.
          </p>
          <div className="space-y-6 mt-12">
            <div className="flex items-center gap-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        variant="largeRounded"
                        placeholder="Jhon Doe"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input
                        variant="largeRounded"
                        type="tel"
                        placeholder="Numero de teléfono"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      variant="largeRounded"
                      type="email"
                      placeholder="ej. jhon@gmail.com"
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <PasswordInput
                      variant="largeRounded"
                      field={field}
                      isSubmitting={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription className="text-[13.5px]">
                    La contraseña debe tener un mínimo de 8 caracteres,
                    incluyendo al menos 1 letra, 1 número y 1 carácter especial.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormStateMessage type="Success" message={success} />
            <FormStateMessage type="Error" message={error} />
            <div className="pt-8 pb-2">
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full font-semibold py-5 rounded-3xl"
              >
                {isSubmitting && (
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                )}
                Continuar
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
