"use client";

import { NavLink } from "./nav-link";
import { ClipboardList } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/providers/cart-provider";

export function WaiterOrders() {
  const t = useTranslations();
  const hasNotification = useCartStore((state) => state.hasNotification);

  return (
    <NavLink
      href="/my-orders"
      className="w-full md:w-fit justify-start inline-flex items-center gap-2 font-semibold leading-none"
      aria-label={t("metadata.checkoutBtn")}
    >
      <span className="relative inline-flex items-center justify-center">
        <ClipboardList size={20} strokeWidth={1.4} />

        {hasNotification && (
          <span className="absolute -top-1 -end-1 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-white" />
          </span>
        )}
      </span>

      <span>{t("navigation.myOrders")}</span>
    </NavLink>
  );
}
