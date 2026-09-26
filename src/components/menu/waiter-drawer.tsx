import { Button } from "../ui/button";
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCartStore } from "@/providers/cart-provider";
import { MenuItem } from "@prisma/client";
import QuantityControl from "../common/quantity-control";
import { ShoppingCart } from "lucide-react";
type waiterDrawerProps = {
  item: MenuItem | null;
  onOpenChange: (open: boolean) => void;
};

export default function WaiterDrawer({
  item,
  onOpenChange,
}: waiterDrawerProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const addItem = useCartStore((state) => state.addItem);

  const resetValues = () => {
    onOpenChange(false);
    setQuantity(1);
    setNotes("");
  };
  const handleAddItem = (item: MenuItem) => {
    if (!item.available) return setError("orders.outOfStock");
    resetValues();
    addItem({
      id: item.id,
      nameAr: item.nameAr,
      nameEn: item.nameEn,
      price: item.price,
      quantity,
      notes: notes || undefined,
    });
  };
  if (!item) return null;
  const totalPrice = item.price * quantity;
  const itemName = locale === "ar" ? item.nameAr : item.nameEn;
  const itemDesc = locale === "ar" ? item.descAr : item.descEn;
  return (
    <>
      <DrawerHeader>
        <DrawerTitle className="text-xl font-bold">{itemName}</DrawerTitle>
        <DrawerDescription>{itemDesc}</DrawerDescription>
      </DrawerHeader>
      <div className="flex flex-col pt-2 text-center">
        <span className="text-lg font-semibold text-primary">
          ${item.price.toFixed(2)}
        </span>
        <span className="text-sm text-foreground/50">
          {t("orders.total")}: ${totalPrice.toFixed(2)}
        </span>
      </div>
      <div className="space-y-5 p-4 pb-0">
        {/* Quantity */}
        <QuantityControl
          handleDecrement={handleDecrement}
          handleIncrement={handleIncrement}
          quantity={quantity}
        />
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
            {t(error)}
          </div>
        )}
        {/* Notes */}
        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium">
            {t("orders.notes")}
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("orders.addNotesPlaceholder")}
            rows={3}
            className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>
      <DrawerFooter className="pt-6">
        <Button
          onClick={() => handleAddItem(item)}
          className="w-full flex items-center"
        >
          <ShoppingCart className="size-4" /> <span>{t("orders.add")}</span>
        </Button>
        <DrawerClose asChild>
          <Button onClick={resetValues} variant="outline" className="w-full">
            {t("common.cancel")}
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </>
  );
}
