"use client";

import { useQuery } from "@tanstack/react-query";
import KitchenColumn from "./kitchen-column";
import { OrderWithMenuItems } from "@/types/types";
import { fetchOrders } from "@/lib/api/order";
import { useTranslations } from "next-intl";
import useKitchenSocket from "../hooks/use-kitchen-socket";

export default function KitchenContainer({
  orders,
}: {
  orders: OrderWithMenuItems[];
}) {
  const t = useTranslations();

  const { data: queryOrders = orders, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    initialData: orders,
  });

  useKitchenSocket();

  if (isError)
    return (
      <div className="text-xl text-destructive text-center mt-10">
        {t("kitchen.errors.loadOrders")}
      </div>
    );
  const newOrders = queryOrders.filter((order) => order.status === "SENT");
  const progessOrders = queryOrders.filter(
    (order) => order.status === "IN_PROGRESS",
  );
  const readyOrders = queryOrders.filter((order) => order.status === "READY");
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-5">
      <div className="grid sm:grid-cols-3 gap-3">
        <KitchenColumn color={"blue"} orders={newOrders} title="newOrders" />
        <KitchenColumn
          color={"yellow"}
          orders={progessOrders}
          title="inProgressOrders"
        />
        <KitchenColumn
          color={"green"}
          orders={readyOrders}
          title="readyOrders"
        />
      </div>
    </div>
  );
}
