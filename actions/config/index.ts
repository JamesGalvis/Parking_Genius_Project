"use server";

import { currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// export async function getVehicles() {
//   try {
//     const loggedUser = await currentUser()

//     if (!loggedUser) {
//       return null
//     }

//     const vehicles = await db.vehicleCategory.findMany()

//     if (!vehicles) return null

//     return vehicles
//   } catch {
//     return null
//   }
// }

export async function getCurrentParkingLot() {
  try {
    const loggedUser = await currentUser();

    if (!loggedUser) {
      return null;
    }

    const existingParking = await db.parkingLot.findFirst({
      where: { id: loggedUser.parkingLotId! },
    });

    if (!existingParking) return null;

    return existingParking;
  } catch {
    return null;
  }
}

export async function getParkingLotByUser() {
  try {
    const loggedUser = await currentUser();

    if (!loggedUser) {
      return null;
    }

    const existingParking = await db.parkingLot.findFirst({
      where: { users: { some: { id: loggedUser?.id! } } },
    });

    if (!existingParking) return null;

    return existingParking;
  } catch {
    return null;
  }
}

export async function createParkingLot(name: string) {
  try {
    const loggedUser = await currentUser();

    if (!loggedUser) {
      return { error: "Solicitud inválida." };
    }

    const existingParking = await db.parkingLot.findFirst({
      where: { name },
    });

    if (existingParking) {
      return { error: "Ya existe un negocio con este nombre." };
    }

    await db.parkingLot.create({
      data: { name, users: { connect: { id: loggedUser.id } } },
    });

    return { success: "Parqueadero creado." };
  } catch {
    return { error: "Algo salió mal en la creación del parqueadero." };
  }
}

// export async function createCategory(
//   name: string,
//   monthlyRate: number,
//   fractionalRate: number,
//   parkingLotId: string
// ) {
//   try {
//     // Verifica si la categoría ya existe
//     const existingCategory = await db.vehicleCategory.findUnique({
//       where: { name },
//     })

//     if (existingCategory) {
//       return { error: "La categoría ya existe." }
//     }

//     // Crea la nueva categoría
//     const newCategory = await db.vehicleCategory.create({
//       data: {
//         name,
//         monthlyRate,
//         fractionalRate,
//         parkingLotId,
//       },
//     })

//     // Revalida la ruta para actualizar los datos en el frontend
//     revalidatePath(`/config`)

//     return { success: "Categoría creada exitosamente.", category: newCategory }
//   } catch {
//     return { error: "Hubo un error al crear la categoría." }
//   }
// }

// export async function deleteCategory(id: string) {
//   try {
//     await db.vehicleCategory.delete({
//       where: { id },
//     })

//     // Revalida la ruta para actualizar los datos en el frontend
//     revalidatePath(`/config`)

//     return {
//       success: "Categoría eliminada exitosamente.",
//     }
//   } catch {
//     return { error: "Hubo un error al eliminar la categoría." }
//   }
// }

// export async function updateCategory(
//   id: string,
//   name: string,
//   monthlyRate: number,
//   fractionalRate: number
// ) {
//   try {
//     // Verifica si la categoría existe
//     const existingCategory = await db.vehicleCategory.findUnique({
//       where: { id },
//     })

//     if (!existingCategory) {
//       return { error: "La categoría no existe." }
//     }

//     // Actualiza la nueva categoría
//     await db.vehicleCategory.update({
//       where: { id },
//       data: { name, monthlyRate, fractionalRate },
//     })

//     // Revalida la ruta para actualizar los datos en el frontend
//     revalidatePath(`/config`)

//     return { success: "Categoría creada exitosamente." }
//   } catch {
//     return { error: "Hubo un error al crear la categoría." }
//   }
// }

// export async function linkCodeToParkingLot(
//   parkingLotId: string,
//   code: string,
//   codeValidationTime: Date
// ) {
//   try {
//     // Verifica si el parqueadero existe
//     const existingParking = await db.parkingLot.findUnique({
//       where: { id: parkingLotId },
//     })

//     if (!existingParking) {
//       return { error: "La categoría no existe." }
//     }

//     // Agreagr el codigo de vinculación
//     await db.parkingLot.update({
//       where: { id: parkingLotId },
//       data: { linkCode: code, codeValidationTime },
//     })

//     // Revalida la ruta para actualizar los datos en el frontend
//     revalidatePath(`/profile`)

//     return { success: "Codigo creado exitosamente." }
//   } catch {
//     return { error: "Hubo un error al crear el código." }
//   }
// }

// export async function deleteCode(
//   parkingLotId: string
// ) {
//   try {
//     // Verifica si el parqueadero existe
//     const existingParking = await db.parkingLot.findUnique({
//       where: { id: parkingLotId },
//     })

//     if (!existingParking) {
//       return { error: "La categoría no existe." }
//     }

//     // Limpiar el codigo de vinculación
//     await db.parkingLot.update({
//       where: { id: parkingLotId },
//       data: { linkCode: null, codeValidationTime: null },
//     })

//     // Revalida la ruta para actualizar los datos en el frontend
//     revalidatePath(`/profile`)

//     return { success: "Codigo eliminado exitosamente." }
//   } catch {
//     return { error: "Hubo un error al crear el código." }
//   }
// }
