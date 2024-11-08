"use server";

import { currentRole, currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";
import { HourlyClientSchema, MonthlyClientSchema } from "@/schemas/clients";
import { z } from "zod";
import { monthlyPaymentEmail } from "@/lib/brevo";
import { revalidatePath } from "next/cache";
import { DateTime } from "luxon";
import { HourlyClientColumns } from "@/app/(dashboard)/hourly-clients/_components/columns";

export async function getClientsCount() {
  try {
    const loggedUser = await currentUser();

    const monthlyClientsCount = await db.client.count({
      where: {
        clientCategory: "MONTHLY",
        isActive: true,
        parkingLotId: loggedUser?.parkingLotId!,
      },
    });

    const hourlyClientsCount = await db.client.count({
      where: {
        clientCategory: "HOURLY",
        isActive: true,
        parkingLotId: loggedUser?.parkingLotId!,
      },
    });

    return {
      monthlyClientsCount,
      hourlyClientsCount,
    };
  } catch (error) {
    return {
      monthlyClientsCount: 0,
      hourlyClientsCount: 0,
    };
  }
}

export async function getMonthlyClients() {
  try {
    const loggedUser = await currentUser();

    const clients = await db.client.findMany({
      where: {
        clientCategory: "MONTHLY",
        isActive: true,
        parkingLotId: loggedUser?.parkingLotId!,
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

export async function getHourlyClients() {
  try {
    const loggedUser = await currentUser();

    const clients = await db.client.findMany({
      where: {
        clientCategory: "HOURLY",
        isActive: true,
        parkingLotId: loggedUser?.parkingLotId!,
      },
      select: {
        id: true,
        plate: true,
        entryDate: true,
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

    const existingClient = await db.client.findUnique({
      where: { plate, isActive: true },
    });

    if (existingClient) {
      return {
        error: `El vehículo con plata ${plate}, ya se encuentra registrado.`,
      };
    }

    const fee = await db.fee.findFirst({
      where: {
        clientTypeId,
        vehicleTypeId,
        feeType: "MONTHLY",
        parkingLotId: loggedUser.parkingLotId!,
      },
      select: {
        price: true,
      },
    });

    if (!fee) {
      return {
        error:
          "La tarifa para el tipo de cliente y vehículo especificado, no existe.",
      };
    }

    // Obtén la fecha actual y ajusta a la zona horaria de Colombia
    const currentDate = DateTime.now().setZone("America/Bogota");
    const startDate = currentDate.toJSDate();

    // Calcula la fecha de finalización sumando un mes
    const endDate = currentDate.plus({ months: 1 }).toJSDate();

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

    revalidatePath("/");
    revalidatePath("/monthly-clients");
    return { success: "Cliente creado." };
  } catch (error) {
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function deleteMonthlyClient(id: string) {
  try {
    const role = await currentRole();

    if (role !== "SuperAdmin" && role !== "Admin") {
      return { error: "Proceso no autorizado." };
    }

    const existingUser = await db.client.findUnique({
      where: { id, clientCategory: "MONTHLY" },
    });

    if (!existingUser) {
      return { error: "El cliente a eliminar no existe." };
    }

    await db.client.delete({
      where: { id, clientCategory: "MONTHLY" },
    });

    revalidatePath("/");
    revalidatePath("/monthly-clients");
    return { success: "Cliente eliminado." };
  } catch (error) {
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function updateMonthlyClient(
  values: z.infer<typeof MonthlyClientSchema>,
  clientId: string
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

    const existingMonthlyClient = await db.client.findUnique({
      where: { id: clientId, clientCategory: "MONTHLY" },
    });

    if (!existingMonthlyClient) {
      return { error: "El cliente que quieres actualizar no existe." };
    }

    const { name, email, phone, document, plate, vehicleTypeId, clientTypeId } =
      result.data;

    const fee = await db.fee.findFirst({
      where: {
        clientTypeId,
        vehicleTypeId,
        feeType: "MONTHLY",
        parkingLotId: loggedUser.parkingLotId!,
      },
      select: {
        price: true,
      },
    });

    if (!fee) {
      return {
        error:
          "La tarifa para el tipo de cliente y vehículo especificado, no existe.",
      };
    }

    // Crea el cliente mensual en la base de datos
    await db.client.update({
      where: {
        id: clientId,
        isActive: true,
      },
      data: {
        name,
        document,
        phone,
        plate,
        email,
        clientTypeId,
        vehicleTypeId,
        totalPaid: fee.price,
      },
    });

    // TODO: Si se actualiza el tipo de cliente o vehiculo entonces enviar el correo de cambio de tarifa

    revalidatePath("/");
    revalidatePath("/monthly-clients");
    return { success: "Cliente actualizado." };
  } catch (error) {
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function createHourlyClient(
  values: z.infer<typeof HourlyClientSchema>
) {
  const result = HourlyClientSchema.safeParse(values);

  if (result.error) {
    return { error: "Datos inválidos." };
  }

  try {
    const loggedUser = await currentUser();

    if (!loggedUser) {
      return { error: "Proceso no autorizado." };
    }

    const { plate, vehicleTypeId, clientTypeId } = result.data;

    const existingClient = await db.client.findUnique({
      where: { plate, isActive: true },
    });

    if (existingClient) {
      return {
        error: `El vehículo con plata ${plate}, ya se encuentra registrado.`,
      };
    }

    const fee = await db.fee.findFirst({
      where: {
        clientTypeId,
        vehicleTypeId,
        feeType: "HOURLY",
        parkingLotId: loggedUser.parkingLotId!,
      },
      select: {
        price: true,
      },
    });

    if (!fee) {
      return {
        error:
          "La tarifa para el tipo de cliente y vehículo especificado, no existe.",
      };
    }

    // Obtiene la fecha actual y ajusta a la zona horaria de Colombia
    const currentDate = DateTime.now().setZone("America/Bogota");
    const entryDate = currentDate.toJSDate();

    await db.client.create({
      data: {
        plate,
        clientTypeId,
        vehicleTypeId,
        clientCategory: "HOURLY",
        entryDate,
        parkingLotId: loggedUser.parkingLotId!,
      },
    });

    revalidatePath("/");
    revalidatePath("/hourly-clients");
    return { success: "Cliente creado." };
  } catch (error) {
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function updateHourlyClient(
  values: z.infer<typeof HourlyClientSchema>,
  clientId: string
) {
  const result = HourlyClientSchema.safeParse(values);

  if (result.error) {
    return { error: "Datos inválidos." };
  }

  try {
    const loggedUser = await currentUser();

    if (!loggedUser) {
      return { error: "Proceso no autorizado." };
    }

    const { plate, vehicleTypeId, clientTypeId } = result.data;

    const fee = await db.fee.findFirst({
      where: {
        clientTypeId,
        vehicleTypeId,
        feeType: "HOURLY",
        parkingLotId: loggedUser.parkingLotId!,
      },
      select: {
        price: true,
      },
    });

    if (!fee) {
      return {
        error:
          "La tarifa para el tipo de cliente y vehículo especificado, no existe.",
      };
    }

    await db.client.update({
      where: {
        id: clientId,
        isActive: true,
        parkingLotId: loggedUser.parkingLotId!,
      },
      data: {
        plate,
        clientTypeId,
        vehicleTypeId,
      },
    });

    revalidatePath("/");
    revalidatePath("/hourly-clients");
    return { success: "Cliente actualizado." };
  } catch (error) {
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function calculateTotalFee(clientData: HourlyClientColumns) {
  try {
    const loggedUser = await currentUser();

    // Obtiene los datos del cliente, incluyendo su tipo de cliente y la tarifa
    const client = await db.client.findUnique({
      where: {
        id: clientData.id,
        parkingLotId: loggedUser?.parkingLotId!,
        clientCategory: "HOURLY",
      },
      select: {
        entryDate: true,
      },
    });

    if (!client || !client.entryDate) {
      return {
        error: "Datos de cliente no válidos o cliente no es de tipo por hora",
      };
    }

    // Establece la hora de salida como la hora actual
    const exitDate = DateTime.now().setZone("America/Bogota").toJSDate();
    const entryDate = DateTime.fromJSDate(client.entryDate)
      .setZone("America/Bogota")
      .toJSDate();

    // Calcula la diferencia en milisegundos y convierte a horas
    const diffInMilliseconds = exitDate.getTime() - entryDate.getTime();
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

    // Redondea hacia arriba a la hora completa más cercana
    const roundedHours = Math.ceil(diffInHours);

    // Asegúrate de que el máximo sea 3 horas
    const hoursToCharge = Math.min(roundedHours, 3);

    // Obtiene la tarifa del cliente
    const fee = await db.fee.findFirst({
      where: {
        feeType: "HOURLY",
        clientTypeId: clientData.clientTypeId,
        vehicleTypeId: clientData.vehicleTypeId,
        parkingLotId: loggedUser?.parkingLotId!,
      },
    });

    if (!fee) {
      return { error: "No se encontró una tarifa válida para el cliente" };
    }

    // Calcula el monto total sin decimales
    const totalAmount = Math.floor(hoursToCharge * fee.price);

    // Actualiza la hora de salida del cliente en la base de datos
    await db.client.update({
      where: { id: clientData.id },
      data: {
        totalPaid: totalAmount,
        exitDate,
        isActive: false,
      },
    });

    revalidatePath("/");
    revalidatePath("/hourly-clients");
    return { success: "Pago registrado con éxito." };
  } catch (error) {
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function getPaidDetails(clientData: HourlyClientColumns) {
  try {
    const loggedUser = await currentUser();

    // Obtiene los datos del cliente, incluyendo su tipo de cliente y la tarifa
    const client = await db.client.findUnique({
      where: { id: clientData.id, parkingLotId: loggedUser?.parkingLotId! },
    });

    // Establece la hora de entrada en la zona horaria de Colombia
    const entryDate = DateTime.fromJSDate(client?.entryDate!).setZone(
      "America/Bogota"
    );

    // Establece la hora de salida en la zona horaria de Colombia (hora actual)
    const exitDate = DateTime.now().setZone("America/Bogota");

    // Calcula la diferencia en horas y minutos
    const diffInMilliseconds = exitDate.diff(
      entryDate,
      "milliseconds"
    ).milliseconds;
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60)); // Horas completas
    const diffInMinutes = Math.floor(
      (diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    ); // Minutos restantes

    // Redondea hacia arriba a la hora completa más cercana si son más de 30 minutos
    const roundedHours = diffInMinutes > 30 ? diffInHours + 1 : diffInHours;

    // Asegúrate de que el máximo sea 3 horas
    const hoursToCharge = Math.min(roundedHours, 3);

    // Obtiene la tarifa del cliente
    const fee = await db.fee.findFirst({
      where: {
        clientTypeId: clientData.clientTypeId,
        vehicleTypeId: clientData.vehicleTypeId,
        feeType: "HOURLY",
        parkingLotId: loggedUser?.parkingLotId!,
      },
    });

    if (!fee) {
      return {
        stayDuration: `0 horas 0 minutos`,
        totalAmount: 0,
      };
    }

    // Calcula el monto total sin decimales
    const totalAmount = Math.floor(hoursToCharge * fee.price);

    // Formatea el tiempo de estancia en horas y minutos
    const stayDuration = `${hoursToCharge} horas ${diffInMinutes} minutos`;

    return {
      stayDuration,
      totalAmount,
    };
  } catch (error) {
    return {
      stayDuration: `0 horas 0 minutos`,
      totalAmount: 0,
    };
  }
}
