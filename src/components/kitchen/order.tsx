"use client";

import { TimeAgo } from "@/components/common/time-ago";
import { OrderWithMenuItems } from "@/types/types";
import { useLocale, useTranslations } from "next-intl";
import StatusBtn from "./status-btn";
import { colorsScheme } from "./kitchen-column";
import { cn } from "cn";

export default function Order({
  order,
  color,
  role,
}: {
  order: OrderWithMenuItems;
  color: keyof typeof colorsScheme;
  role: string;
}) {
  const locale = useLocale();
  const t = useTranslations();
  const scheme = colorsScheme[color];

  return (
    <li
      className={cn(
        "group overflow-hidden rounded-xl border bg-background p-4 space-y-2",
        "shadow-sm transition-all duration-200",
        "hover:shadow-md",
        scheme.border,
      )}
    >
      <div className="flex justify-between items-center">
        <span className={scheme.text}>#{order.id}</span>
        <span>
          <TimeAgo createdAt={order.createdAt} />
        </span>
      </div>
      <div className="space-x-2">
        <span>{t("kitchen.table")}</span>
        <span className={scheme.text}>{order.tableNumber}</span>
      </div>
      <ul className="space-y-2 divide-y divide-border/60">
        {order.items.map((item) => {
          const name =
            locale === "en" ? item.menuItem.nameEn : item.menuItem.nameAr;
          return (
            <li key={item.id} className="px-2 py-2">
              <div className="flex gap-2">
                <span
                  className={cn(
                    "w-7 h-7 rounded-full",
                    "flex  items-center justify-center",
                    scheme.bgSoft,
                  )}
                >
                  {item.quantity}
                </span>{" "}
                <span> {name}</span>
              </div>
              {item.notes && (
                <div className={scheme.text}>
                  {t("kitchen.note")}: {item.notes}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {role === "KITCHEN" && (
        <StatusBtn
          color={color}
          newStatus={color === "blue" ? "IN_PROGRESS" : "READY"}
          orderId={order.id}
          visible={color === "green"}
        />
      )}
    </li>
  );
}
