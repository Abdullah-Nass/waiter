"use server";

import { db } from "../prisma/db";
import { getIO } from "../socket/server";

export async function getMenu() {
  try {
    const menu = await db.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        items: {
          orderBy: { id: "asc" },
        },
      },
    });

    return { success: true, data: menu };
  } catch {
    return {
      success: false,
      error: "common.errorOccurred",
    };
  }
}

export async function updateNames({
  id,
  nameEn,
  nameAr,
}: {
  id: number;
  nameEn: string;
  nameAr: string;
}) {
  if (!nameEn?.trim() || !nameAr?.trim()) {
    return {
      success: false,
      error: "edit.requiredFields",
    };
  }

  try {
    const updatedItem = await db.menuItem.update({
      where: { id },
      data: {
        nameEn: nameEn.trim(),
        nameAr: nameAr.trim(),
      },
    });

    return { success: true, data: updatedItem };
  } catch (error) {
    console.error("Failed to update MenuItem:", error);
    return {
      success: false,
      error: "errorOccurred",
    };
  }
}
export async function updateDesc({
  id,
  descEn,
  descAr,
}: {
  id: number;
  descEn: string;
  descAr: string;
}) {
  if (!descEn?.trim() || !descAr?.trim()) {
    return {
      success: false,
      error: "edit.requiredFields",
    };
  }

  try {
    const updatedItem = await db.menuItem.update({
      where: { id },
      data: {
        descEn: descEn.trim(),
        descAr: descAr.trim(),
      },
    });

    return { success: true, data: updatedItem };
  } catch {
    return {
      success: false,
      error: "common.errorOccurred",
    };
  }
}
export async function updatePrice({
  id,
  price,
}: {
  id: number;
  price: number;
}) {
  if (!price) {
    return {
      success: false,
      error: "edit.requiredFields",
    };
  }

  try {
    const updatedItem = await db.menuItem.update({
      where: { id },
      data: {
        price,
      },
    });

    return { success: true, data: updatedItem };
  } catch {
    return {
      success: false,
      error: "common.errorOccurred",
    };
  }
}

export async function updateAvailability({
  id,
  available,
}: {
  id: number;
  available: boolean;
}) {
  try {
    const item = await db.menuItem.update({
      where: { id },
      data: { available },
    });

    // Broadcast change to all connected clients
    try {
      const io = getIO();
      io.emit("menu:item-availability", { id, available });
    } catch (socketError) {
      console.error("Socket broadcast failed:", socketError);
    }
    return { success: true, item };
  } catch {
    return {
      success: false,
      error: "common.errorOccurred",
    };
  }
}
