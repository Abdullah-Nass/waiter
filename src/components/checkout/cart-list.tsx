"use client";

import { useCartStore } from "@/providers/cart-provider";
import Item from "./cart-item";
import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "../ui/button";

export default function CartList() {
  const cart = useCartStore((state) => state.items);
  const t = useTranslations();
  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border/80 bg-muted/30 shadow-sm p-4 sm:p-8 h-full">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <ShoppingBag className="h-6 w-6 stroke-[1.5]" />
        </div>
        <p className="mt-4 text-xl font-medium text-foreground">
          {t("cart.empty")}
        </p>
        <Button asChild>
          <Link href={{ pathname: "/menu" }}>{t("cart.ctaAdd")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-dashed border-border/80 bg-muted/30 shadow-sm p-4 sm:p-8 h-full">
      <ul className="divide-y divide-border/60 bg-card">
        {cart.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}
