import { Minus, Plus } from "lucide-react";
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
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
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
      <p className="pt-2 text-lg font-semibold text-primary text-center">
        ${item.price.toFixed(2)}
      </p>
      <div className="space-y-5 p-4 pb-0">
        {/* Quantity */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t("orders.quantity")}</span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleDecrement}
              disabled={quantity <= 1}
              type="button"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-6 text-center text-base font-semibold">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleIncrement}
              type="button"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
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
        <Button onClick={() => handleAddItem(item)} className="w-full">
          {t("orders.add")} • ${totalPrice.toFixed(2)}
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
