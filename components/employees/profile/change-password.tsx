"use client"

import { z } from "zod"
import { ChangePasswordSchema } from "@/schemas/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { changePassword } from "@/actions/profile-user"
import { PasswordInput } from "@/components/auth/password-input"
import { logout } from "@/actions/auth"

export function ChangePassword() {
  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  })

  const { isValid, isSubmitting } = form.formState

  const onSubmit = async (values: z.infer<typeof ChangePasswordSchema>) => {
    try {
      const response = await changePassword(values)

      if (!response?.error) {
        form.reset()
        await logout()
      }

      if (response?.error) {
        toast.error(response?.error)
      }
    } catch (error) {
      toast.error("Algo salió mal!")
    }
  }

  return (
    <Card className="border-none bg-zinc-200/35 dark:bg-zinc-900 py-2">
      <CardHeader className="py-2 px-4 pt-4 pb-2 md:px-6 md:py-3">
        <CardTitle>Cambio de Contraseña</CardTitle>
        <CardDescription>
          Cambia tu contraseña aquí. Después de guardar, se cerrará la sesión.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 md:px-6 md:py-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                name="oldPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña anterior</FormLabel>
                    <FormControl>
                      <PasswordInput
                        variant="largeRounded"
                        className="bg-background/50 ring-main/40 hover:ring-4"
                        field={field}
                        isSubmitting={isSubmitting}
                        showPlaceholder={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="newPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña nueva</FormLabel>
                    <FormControl>
                      <PasswordInput
                        variant="largeRounded"
                        className="bg-background/50 ring-main/40 hover:ring-4"
                        field={field}
                        isSubmitting={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription className="text-[13.5px]">
                      La contraseña debe tener un mínimo de 8 caracteres,
                      incluyendo al menos 1 letra, 1 número y 1 carácter
                      especial.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-3 pb-2 text-end space-x-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="font-semibold bg-main text-white hover:bg-main/90 rounded-full"
                >
                  {isSubmitting && (
                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                  )}
                  Cambiar
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
