"use server";

import { CartItem } from "@/types/types";
import { db } from "../prisma/db";
import { getIO } from "../socket/server";

type PlaceOrderInput = {
  tableNumber: number;
  waiterId: string;
  items: CartItem[];
};

export async function placeOrder(input: PlaceOrderInput) {
  try {
    const total = input.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await db.order.create({
      data: {
        tableNumber: input.tableNumber,
        waiterId: input.waiterId,
        status: "SENT",
        total,
        items: {
          create: input.items.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            menuItemId: item.id,
            notes: item.notes,
          })),
        },
      },
      include: { items: true },
    });

    // Notify kitchen
    try {
      const io = getIO();
      io.to("kitchen").emit("order:new", order);
    } catch (e) {
      console.error("Socket emit failed:", e);
    }

    return { success: true, data: order };
  } catch {
    return { success: false, error: "common.errorOccurred" };
  }
}
