"use server";

import { currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";

import { toZonedTime } from "date-fns-tz";

// export async function getDailyChartData() {
//   const loggedUser = await currentUser();

//   // Obtener los datos de clientes por hora
//   const hourlyClients = await db.client.findMany({
//     where: {
//       clientCategory: "HOURLY",
//       parkingLotId: loggedUser?.parkingLotId!,
//     },
//     select: { exitDate: true, totalPaid: true },
//   });

//   // Obtener los datos de clientes mensuales
//   const monthlyClients = await db.client.findMany({
//     where: {
//       clientCategory: "MONTHLY",
//       parkingLotId: loggedUser?.parkingLotId!,
//     },
//     select: { createdAt: true, totalPaid: true },
//   });

//   // Crear un arreglo con las ganancias por cada hora
//   const earningsByHour = Array(20).fill(0); // Arreglo con 24 horas

//   // Acumular ganancias por hora de clientes horarios
//   hourlyClients.forEach((client) => {
//     if (client.exitDate) {
//       const hour = client.exitDate.getHours();
//       if (hour >= 4 && hour <= 23) {
//         earningsByHour[hour - 4] += client.totalPaid; // Ajustar el índice al rango 4-23
//       }
//     }
//   });

//   // Acumular ganancias por hora de clientes mensuales
//   monthlyClients.forEach((client) => {
//     if (client.createdAt) {
//       const hour = client.createdAt.getHours();
//       if (hour >= 4 && hour <= 23) {
//         earningsByHour[hour - 4] += client.totalPaid; // Ajustar el índice al rango 4-23
//       }
//     }
//   });

//   // Función para convertir el formato de 24 horas a 12 horas con AM/PM
//   const formatHour = (hour: number) => {
//     const period = hour >= 12 ? "PM" : "AM";
//     const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
//     return `${formattedHour}:00 ${period}`;
//   };

//   // Formatear los datos para el gráfico desde 4 AM hasta 12 AM
//   const chartData = earningsByHour.map((earnings, index) => ({
//     hour: formatHour(index + 4), // Convertir el índice al formato de hora comenzando desde 4
//     earnings, // Ganancias acumuladas por hora
//   }));

//   return chartData;
// }

export async function getDailyChartData() {
  const loggedUser = await currentUser();
  const startDate = new Date();
  startDate.setHours(4, 0, 0, 0); // Comienza a las 4:00am
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999); // Termina a las 11:59pm (cubre hasta las 12:00am)

  // Obtener los datos de clientes por hora (salidas)
  const hourlyClients = await db.client.findMany({
    where: {
      clientCategory: "HOURLY",
      parkingLotId: loggedUser?.parkingLotId!,
      exitDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: { exitDate: true, totalPaid: true },
  });

  // Obtener los datos de clientes mensuales (creados)
  const monthlyClients = await db.client.findMany({
    where: {
      clientCategory: "MONTHLY",
      parkingLotId: loggedUser?.parkingLotId!,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: { createdAt: true, totalPaid: true },
  });

  // Crear un arreglo con las ganancias por cada hora desde las 4:00am hasta las 11:00pm
  const earningsByHour = Array(20).fill(0); // 20 horas de 4:00am a 11:00pm

  // Acumular ganancias por hora de clientes horarios
  hourlyClients.forEach((client) => {
    if (client.exitDate) {
      const hour = client.exitDate.getHours();
      if (hour >= 4 && hour <= 23) {
        earningsByHour[hour - 4] += client.totalPaid; // Ajustar el índice al rango 4-23
      }
    }
  });

  // Acumular ganancias por hora de clientes mensuales
  monthlyClients.forEach((client) => {
    if (client.createdAt) {
      const hour = client.createdAt.getHours();
      if (hour >= 4 && hour <= 23) {
        earningsByHour[hour - 4] += client.totalPaid; // Ajustar el índice al rango 4-23
      }
    }
  });

  // Función para convertir el formato de 24 horas a 12 horas con AM/PM
  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:00 ${period}`;
  };

  // Formatear los datos para el gráfico desde 4 AM hasta 12 AM
  const chartData = earningsByHour.map((earnings, index) => ({
    hour: formatHour(index + 4), // Convertir el índice al formato de hora comenzando desde 4
    earnings, // Ganancias acumuladas por hora
  }));

  return chartData;
}

export async function getDailyEarnings() {
  const loggedUser = await currentUser();

  // Obtener la fecha de hoy al comienzo del día en la zona horaria de Colombia
  const todayStart = toZonedTime(new Date(), "America/Bogota");
  todayStart.setHours(0, 0, 0, 0);

  // Obtener la fecha de hoy al final del día en la zona horaria de Colombia
  const todayEnd = toZonedTime(new Date(), "America/Bogota");
  todayEnd.setHours(23, 59, 59, 999);

  // Obtener las ganancias del día para clientes horarios
  const hourlyEarnings = await db.client.aggregate({
    _sum: { totalPaid: true },
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
      clientCategory: "HOURLY",
      exitDate: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  // Obtener las ganancias del día para clientes mensuales
  const monthlyEarnings = await db.client.aggregate({
    _sum: { totalPaid: true },
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
      clientCategory: "MONTHLY",
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  // Obtener las ganancias totales del día
  const totalEarnings = await db.client.aggregate({
    _sum: { totalPaid: true },
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
      OR: [
        {
          clientCategory: "HOURLY",
          exitDate: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
        {
          clientCategory: "MONTHLY",
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      ],
    },
  });

  // Obtener el número total de clientes que han salido hoy
  const hourlyClientsCount = await db.client.count({
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
      clientCategory: "HOURLY",
      exitDate: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  // Obtener el número total de clientes mensuales que se registraron hoy
  const monthlyClientsCount = await db.client.count({
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
      clientCategory: "MONTHLY",
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  // Obtener el número total de clientes por hora que aún no han salido
  const hourlyClientsStillInParking = await db.client.count({
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
      clientCategory: "HOURLY",
      exitDate: null, // Clientes que aún no han registrado una fecha de salida
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  return {
    hourlyClientsStillInParking,
    hourlyClientsCount, // Número total de clientes que han salido hoy
    monthlyClientsCount, // Número total de clientes mensuales que se registraron hoy
    hourlyEarnings: hourlyEarnings._sum.totalPaid || 0,
    monthlyEarnings: monthlyEarnings._sum.totalPaid || 0,
    totalEarnings: totalEarnings._sum.totalPaid || 0,
  };
}

export async function getFeesData() {
  const loggedUser = await currentUser();

  const clientTypes = await db.clientType.findMany({
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
    },
    select: {
      name: true,
    },
  });

  const fees = await db.fee.findMany({
    where: {
      parkingLotId: loggedUser?.parkingLotId!,
    },
    select: {
      id: true,
      feeType: true,
      price: true,
      clientType: {
        select: {
          name: true,
        },
      },
      vehicleType: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    clientTypes,
    fees,
  };
}
