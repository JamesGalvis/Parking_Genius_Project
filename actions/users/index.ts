"use server";

import { currentUser } from "@/lib/auth-user";
import { db } from "@/lib/db";

export async function getUsers(currentUserId: string) {
  try {
    const loggedUser = await currentUser();

    const users = await db.user.findMany({
      where: {
        parkingLotId: loggedUser?.parkingLotId!,
        role: {
          not: "SuperAdmin",
        },
        id: {
          not: currentUserId,
        },
      },
    });

    return users;
  } catch {
    return [];
  }
}
