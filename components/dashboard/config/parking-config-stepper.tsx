"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { createParkingLot } from "@/actions/config";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader as LoaderIcon } from "lucide-react";
import { Loader } from "@/components/common/loader";

export const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener por lo menos 2 caracteres." })
    .trim(),
});

export default function ParkingConfigStepper() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      name: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const { error, success } = await createParkingLot(values.name);

      if (error) {
        toast.error(error);
      }

      if (success) {
        setIsLoading(true)
        toast.success(success);
        router.push("/business-configuration");
      }
    } catch {
      toast.error("Algo salió mal.");
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <Card
        className={cn(
          "w-full max-w-4xl mx-auto sm:px-6 sm:py-2 px-0 border-none bg-muted-foreground/10",
          isLoading && "hidden"
        )}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Crea tu parqueadero
          </CardTitle>
          <CardDescription className="text-base">
            Ingresa el nombre de tu negocio
          </CardDescription>
        </CardHeader>
        <CardContent className="justify-start">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del parqueadero</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-background/60"
                        placeholder="Escribe aquí..."
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-end">
                <Button
                  disabled={isSubmitting || !isValid}
                  className=" bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting && (
                    <LoaderIcon className="size-4 animate-spin" />
                  )}
                  Crear parqueadero
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
