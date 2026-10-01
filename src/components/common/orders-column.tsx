"use client";

import { OrderWithMenuItems } from "@/types/types";
import { cn } from "cn";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Order from "../kitchen/order";
import { OrderSkeleton } from "./order-skeleton";

export const colorsScheme = {
  blue: {
    bg: "bg-blue-500",
    bgSoft: "bg-blue-500/10",
    text: "text-blue-600",
    border: "border-blue-500/20",
    bgHover: "hover:bg-blue-600",
  },
  yellow: {
    bg: "bg-yellow-500",
    bgSoft: "bg-yellow-500/10",
    text: "text-yellow-600",
    border: "border-yellow-500/20",
    bgHover: "hover:bg-yellow-600",
  },
  green: {
    bg: "bg-green-500",
    bgSoft: "bg-green-500/10",
    text: "text-green-600=",
    border: "border-green-500/20",
    bgHover: "hover:bg-green-600",
  },
  red: {
    bg: "bg-red-500",
    bgSoft: "bg-red-500/10",
    text: "text-red-600",
    border: "border-red-500/20",
    bgHover: "hover:bg-red-600",
  },
};

type columnProps = {
  color: keyof typeof colorsScheme;
  orders: OrderWithMenuItems[];
  title: string;
};
export default function OrdersColumn({ color, orders, title }: columnProps) {
  const scheme = colorsScheme[color];
  const t = useTranslations("kitchen");

  const { data: session, isPending } = authClient.useSession();
  return (
    <section
      className={cn("rounded-md bg-card border min-h-[500px]", scheme.border)}
    >
      <div className={cn("flex justify-between p-4", scheme.bgSoft)}>
        <div className="flex gap-2 items-center">
          <span
            className={cn("w-3 h-3 rounded-full", "animate-pulse", scheme.bg)}
          />
          <span className="text-lg font-semibold select-none">{t(title)}</span>
        </div>
        <span
          className={cn(
            "w-7 h-7 rounded-full",
            "flex items-center justify-center",
            "select-none",
            scheme.text,
            scheme.bgSoft,
          )}
        >
          {orders.length}
        </span>
      </div>
      <div className="flex-1 p-3">
        {isPending ? (
          <ul className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <OrderSkeleton key={index} />
            ))}
          </ul>
        ) : orders.length > 0 ? (
          <ul className="space-y-3">
            {orders.map((order) => (
              <Order
                role={session!.user.role}
                key={order.id}
                order={order}
                color={color}
              />
            ))}
          </ul>
        ) : (
          <div className="flex min-h-[250px] items-center justify-center">
            <div className="text-center">
              <div
                className={cn(
                  "mx-auto mb-3 flex h-10 w-10 items-center justify-center",
                  "rounded-full",
                  scheme.bgSoft,
                  scheme.text,
                )}
              >
                <Check className="size-4" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("noOrders")}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
