"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HourlyClientColumns } from "./columns";
import { toast } from "sonner";
import { useTransition } from "react";
import { Loader } from "lucide-react";
import { HourlyClientSchema } from "@/schemas/clients";
import { createHourlyClient, updateHourlyClient } from "@/actions/clients";

type FormValues = z.infer<typeof HourlyClientSchema>;

interface HourlyClientFormProps {
  initialData?: HourlyClientColumns;
  vehicleTypes: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  clientTypes: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  closeDialog: () => void;
}

export function HourlyClientForm({
  initialData,
  clientTypes,
  vehicleTypes,
  closeDialog,
}: HourlyClientFormProps) {
  const [isLoading, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(HourlyClientSchema),
    defaultValues: {
      plate: initialData?.plate || "",
      clientTypeId: initialData?.clientTypeId || "",
      vehicleTypeId: initialData?.vehicleTypeId || "",
    },
  });

  const { isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof HourlyClientSchema>) {
    try {
      if (!initialData) {
        handleCreateClient(values);
      } else {
        handleUpdateClient(values);
      }
    } catch {
      toast.error("Ocurrió un problema con tu solicitud.");
    }
  }

  function handleCreateClient(values: z.infer<typeof HourlyClientSchema>) {
    startTransition(async () => {
      try {
        const { error, success } = await createHourlyClient(values);

        if (error) {
          toast.error("Error", {
            description: error,
          });
        }

        if (success) {
          form.reset();
          toast.success("Proceso exitoso.", {
            description: success,
          });
          closeDialog();
        }
      } catch {
        toast.error("Ocurrió un problema con tu solicitud.");
      }
    });
  }

  function handleUpdateClient(values: z.infer<typeof HourlyClientSchema>) {
    startTransition(async () => {
      try {
        const { error, success } = await updateHourlyClient(
          values,
          initialData?.id!
        );

        if (error) {
          toast.error("Error", {
            description: error,
          });
        }

        if (success) {
          form.reset();
          toast.success("Proceso exitoso.", {
            description: success,
          });
          closeDialog();
        }
      } catch {
        toast.error("Ocurrió un problema con tu solicitud.");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="plate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matrícula del vehículo</FormLabel>
              <FormControl>
                <Input placeholder="Matrícula" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clientTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de cliente</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seleccione un tipo de cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clientTypes.map((clientType) => (
                    <SelectItem key={clientType.id} value={clientType.id}>
                      {clientType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehicleTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de vehículo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seleccione un tipo de vehículo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vehicleTypes.map((vehicleType) => (
                    <SelectItem key={vehicleType.id} value={vehicleType.id}>
                      {vehicleType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          variant="primary"
          disabled={isLoading || !isValid}
          className="w-full"
        >
          {isLoading && <Loader className="animate-spin" />}
          {initialData ? "Actualizar Datos" : "Crear Cliente"}
        </Button>
      </form>
    </Form>
  );
}
