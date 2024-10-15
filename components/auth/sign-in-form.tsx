"use client";

import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Carrousel from "./carrousel";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormWrapper } from "@/components/auth/form-wrapper";
import { PasswordInput } from "@/components/auth/password-input";
import { LoginFormSchema } from "@/schemas/auth";
import { FormStateMessage } from "@/components/auth/form-state-message";
import { login } from "@/actions/auth";

export function SignInForm() {
  const searchParams = useSearchParams();

  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "El correo ya está en uso con otra cuenta!"
      : "";

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof LoginFormSchema>) => {
    setError("");
    setSuccess("");

    try {
      const response = await login(values);
      setError(response?.error);

      if (!response?.error) {
        form.reset();
        setSuccess("Inicio de sesión exitoso!");
      }
    } catch {
      toast.error("Algo salió mal!");
    }
  };

  return (
    <div className="grid grid-cols-2 bg-zinc-900 rounded-2xl ">
      <div className="col-span-1 flex items-center justify-center mx-3 my-4 ">
        <Carrousel />
      </div>
      <div>
        <FormWrapper
          headerTitle="Bienvenido a ParkGenius"
          headerSubtitle="Por favor inicia sesión para continuar"
          backButtonHref="/auth/register"
          backButtonLabel="No tienes una cuenta? Regístrate"
          showSocial
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4 mt-4">
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
                          disabled={isSubmitting}
                          {...field}
                          className="border border-zinc-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition duration-200"
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
                          className="border border-zinc-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Checkbox /> <small className="mx-2">Recuerdame</small>
                  </div>
                  <small className="underline">Olvidaste tu contraseña?</small>
                </div>

                <FormStateMessage type="Success" message={success} />
                <FormStateMessage type="Error" message={error || urlError} />
                <div className="pt-3 pb-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="w-full font-semibold py-5 "
                  >
                    {isSubmitting && (
                      <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                    )}
                    Iniciar sesión
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </FormWrapper>
      </div>
    </div>
  );
}
