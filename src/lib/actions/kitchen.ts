"use server";

import { OrderStatus } from "@prisma/client";
import { db } from "../prisma/db";
import { getIO } from "../socket/server";

export async function getOrders() {
  try {
    const orders = await db.order.findMany({
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });
    return { success: true, data: orders };
  } catch {
    return {
      success: false,
      error: "common.errorOccurred",
    };
  }
}

type changeStatusProps = {
  orderId: number;
  newStatus: OrderStatus;
};
export async function changeStatus({ orderId, newStatus }: changeStatusProps) {
  try {
    const order = await db.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    try {
      const io = getIO();

      // Notify kitchen (for column sync)
      io.emit("order:updated", { orderId, newStatus });

      // Notify the specific waiter
      io.to(`waiter:${order.waiterId}`).emit("order:statusChanged", {
        orderId,
        tableNumber: order.tableNumber,
        status: newStatus,
      });
    } catch (e) {
      console.error("Socket emit failed:", e);
    }

    return { success: true, data: order };
  } catch {
    return {
      success: false,
      error: "common.errorOccurred",
    };
  }
}
