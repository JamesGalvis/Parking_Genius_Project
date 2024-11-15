"use client";

import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Carrousel from "./carrousel";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormWrapper } from "./form-wrapper";
import { PasswordInput } from "@/components/auth/password-input";
import { RegisterFormSchema } from "@/schemas/auth";
import { FormStateMessage } from "@/components/auth/form-state-message";
import { register } from "@/actions/auth";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

export function SignUpForm() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof RegisterFormSchema>) => {
    setError(undefined);
    setSuccess(undefined);

    try {
      const response = await register(values);

      if (response?.error) {
        setError(response.error);
      } else {
        setSuccess("Registro exitoso!");
        form.reset();
      }
    } catch {
      toast.error("Algo salió mal!");
    }
  };

  return (
    <div className="lg:grid grid-cols-2 bg-zinc-900 lg:rounded-2xl h-full min-h-full max-lg:w-full overflow-y-auto">
      <div className="col-span-1 flex items-center justify-center mx-3 my-4 max-lg:hidden">
        <Carrousel />
      </div>

      <div className="lg:col-span-1 w-full h-full flex items-center justify-center">
        <FormWrapper
          headerTitle="Crea tu cuenta"
          backButtonLabel="Ya tiene una cuenta? Iniciar sesión"
          headerSubtitle="Rellena los datos para empezar"
          backButtonHref="/auth/login"
          showSocial
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background/60"
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
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <PhoneInput
                          className="bg-background/60 rounded-xl"
                          defaultCountry="co"
                          hideDropdown
                          value={field.value}
                          onChange={(phone) => {
                            field.onChange(phone);
                          }}
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
                        className="bg-background/60"
                        type="email"
                        placeholder="ej. jhon@gmail.com"
                        disabled={isSubmitting}
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
                        className="bg-background/60"
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

              <FormStateMessage type="Success" message={success} />
              <FormStateMessage type="Error" message={error} />

              <div className="pt-3 pb-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="w-full font-semibold"
                >
                  {isSubmitting && (
                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                  )}
                  Registrarse
                </Button>
              </div>
            </form>
          </Form>
        </FormWrapper>
      </div>
    </div>
  );
}
