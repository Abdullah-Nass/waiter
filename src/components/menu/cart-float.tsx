"use client";

import { Link } from "@/i18n/routing";
import { useCartHydrated } from "@/lib/stores/cart";
import { useCartStore } from "@/providers/cart-provider";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CartFloat() {
  const t = useTranslations();

  const isHydrated = useCartHydrated();

  const totalItems = useCartStore((state) => state.totalItems());

  const activeOrdersCount = isHydrated ? totalItems : 0;
  return (
    <Link
      href="/checkout"
      aria-label={t("metadata.checkoutBtn")}
      className="fixed bottom-20 end-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-card text-primary border border-border shadow-xl backdrop-blur-md transition-all active:scale-95 hover:bg-accent"
    >
      <div className="relative">
        <ShoppingCart className="size-7" />

        {activeOrdersCount > 0 && (
          <span className="absolute -top-2.5 -end-2.5 flex min-w-5 h-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground shadow-sm">
            {activeOrdersCount > 99 ? "99+" : activeOrdersCount}
          </span>
        )}
      </div>
    </Link>
  );
}
