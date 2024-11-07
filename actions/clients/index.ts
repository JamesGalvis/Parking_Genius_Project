"use server";

import { currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";
import { MonthlyClientSchema } from "@/schemas/clients";
import { z } from "zod";
import { addMonths } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { monthlyPaymentEmail } from "@/lib/brevo";
import { revalidatePath } from "next/cache";

export async function getMonthlyClients() {
  try {
    const clients = await db.client.findMany({
      where: {
        clientCategory: "MONTHLY",
      },
      select: {
        id: true,
        name: true,
        document: true,
        phone: true,
        email: true,
        plate: true,
        createdAt: true,
        endDate: true,
        vehicleType: {
          select: {
            id: true,
            name: true,
          },
        },
        clientType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return clients;
  } catch (error) {
    return [];
  }
}

export async function createMonthlyClient(
  values: z.infer<typeof MonthlyClientSchema>
) {
  const result = MonthlyClientSchema.safeParse(values);

  if (result.error) {
    return { error: "Datos inválidos." };
  }

  try {
    const loggedUser = await currentUser();

    if (!loggedUser) {
      return { error: "Proceso no autorizado." };
    }

    const { name, email, phone, document, plate, vehicleTypeId, clientTypeId } =
      result.data;

    const fee = await db.fee.findFirst({
      where: {
        clientTypeId,
        vehicleTypeId,
        feeType: "MONTHLY",
      },
      select: {
        price: true,
      },
    });

    // Define la zona horaria de Colombia
    const timeZone = "America/Bogota";

    // Obtén la fecha de inicio en la zona horaria de Colombia
    const currentDate = new Date();
    const startDate = toZonedTime(currentDate, timeZone);

    // Calcula la fecha de finalización sumando un mes
    const endDate = toZonedTime(addMonths(currentDate, 1), timeZone);

    // Crea el cliente mensual en la base de datos
    const newClient = await db.client.create({
      data: {
        name,
        document,
        phone,
        plate,
        email,
        clientTypeId,
        vehicleTypeId,
        clientCategory: "MONTHLY",
        startDate,
        endDate,
        totalPaid: fee?.price || 0,
        parkingLotId: loggedUser.parkingLotId!,
      },
      include: {
        parkingLot: {
          select: {
            name: true,
          },
        },
      },
    });

    monthlyPaymentEmail(
      newClient.email!,
      newClient.name!,
      newClient.startDate!,
      newClient.endDate!,
      newClient.totalPaid!,
      newClient.parkingLot.name
    );

    revalidatePath("/")
    revalidatePath("/monthly-clients")
    return { success: "Cliente creado." };
  } catch (error) {
    return { error: "Algo salió mal en el proceso." };
  }
}
