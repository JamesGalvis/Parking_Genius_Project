import { phoneRegex } from "@/constants";
import { z } from "zod";

export const CreateVehicleTypeSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "El nombre debe tener mínimo dos caracteres.",
    })
    .trim(),
});

export const CreateClientTypeSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "El nombre debe tener mínimo dos caracteres.",
    })
    .trim(),
});

export const CreateFeeSchema = z.object({
  vehicleTypeId: z.string({
    required_error: "Por favor seleccione un tipo de vehículo.",
  }),
  clientTypeId: z.string({
    required_error: "Por favor seleccione un tipo de cliente.",
  }),
  hourlyFee: z
    .number({
      required_error: "La tarifa por hora es requerida.",
      invalid_type_error: "La tarifa por hora debe ser un número.",
    })
    .min(0, "La tarifa por hora no puede ser negativa."),
  monthlyFee: z
    .number({
      required_error: "La tarifa por mes es requerida.",
      invalid_type_error: "La tarifa por mes debe ser un número.",
    })
    .min(0, "La tarifa por mes no puede ser negativa."),
});

export const CreateEmployeeSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener por lo menos 2 caracteres." })
    .trim(),
  phone: z.string().regex(phoneRegex, {
    message: "El número de teléfono no es válido",
  }),
  email: z
    .string()
    .email({ message: "Por favor ingresa un correo válido." })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Debe tener al menos 8 caracteres" })
    .regex(/[a-zA-Z]/, { message: "Debe contener por lo menos 1 letra." })
    .regex(/[0-9]/, { message: "Debe contener al menos 1 numero." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Debe contener al menos 1 caracterer especial.",
    })
    .trim(),
});
