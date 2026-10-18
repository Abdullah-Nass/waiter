"use client";

import { NavLink } from "./nav-link";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCartHydrated } from "@/lib/stores/cart";
import { useCartStore } from "@/providers/cart-provider";

export function CartLink({ onClick }: { onClick?: () => void }) {
  const t = useTranslations();
  const isHydrated = useCartHydrated();
  const totalItems = useCartStore((state) => state.totalItems());
  const activeOrdersCount = isHydrated ? totalItems : 0;

  return (
    <NavLink
      href="/checkout"
      className="w-full md:w-fit justify-start font-semibold leading-none"
      aria-label={t("metadata.checkoutBtn")}
      onClick={onClick}
    >
      <ShoppingCart size={20} strokeWidth={1.4} />
      <span>{t("navigation.orderSummary")}</span>
      <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-primary-foreground bg-primary rounded-full">
        {activeOrdersCount}
      </span>
    </NavLink>
  );
}
