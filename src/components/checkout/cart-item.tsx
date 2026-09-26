import type { CartItem } from "@/types/types";
import { useLocale, useTranslations } from "next-intl";
import QuantityControl from "../common/quantity-control";
import { useCartStore } from "@/providers/cart-provider";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { ConfirmDialog } from "../menu/confirm-modal";

export default function Item({ item }: { item: CartItem }) {
  const locale = useLocale();
  const t = useTranslations();

  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleIncrement = () => updateQuantity(item.id, item.quantity + 1);
  const handleDecrement = () => updateQuantity(item.id, item.quantity - 1);

  const name = locale === "ar" ? item.nameAr : item.nameEn;
  const totalPrice = (item.price * item.quantity).toFixed(2);

  return (
    <li className="flex items-center justify-between gap-4 border-b border-border/60 p-4 transition-colors hover:bg-muted/40 sm:p-5">
      {/* Product Details */}
      <div className="min-w-0 flex-1 space-y-1">
        <h6 className="truncate text-sm font-semibold text-foreground">
          {name}
        </h6>
        {item.notes && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {item.notes}
          </p>
        )}
        <span className="inline-block text-xs font-medium text-muted-foreground =">
          {t("cart.each", { price: item.price.toFixed(2) })}
        </span>
      </div>

      {/* Controls & Price */}
      <div className="flex items-center sm:gap-6">
        <ConfirmDialog
          trigger={
            <Button type="button" size={"icon"} variant={"icon"}>
              <Trash />
            </Button>
          }
          title={t("cart.delete.title")}
          description={t("cart.delete.description")}
          confirmText={t("common.delete")}
          cancelText={t("common.cancel")}
          onConfirm={() => removeItem(item.id)}
          destructive={true}
        />
        <QuantityControl
          handleDecrement={handleDecrement}
          handleIncrement={handleIncrement}
          quantity={item.quantity}
          hasText={false}
        />

        <div className="min-w-10 text-end">
          <span className="text-base font-bold tabular-nums text-foreground">
            ${totalPrice}
          </span>
        </div>
      </div>
    </li>
  );
}
