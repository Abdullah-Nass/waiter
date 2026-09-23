import { Button } from "../ui/button";
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { useOptimistic, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MenuItem } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { updateAvailability } from "@/lib/actions/menu-items";

export default function KitchenDrawer({ item }: { item: MenuItem | null }) {
  const t = useTranslations();
  const locale = useLocale();
  const [currentAvailable, setCurrentAvailable] = useState(
    item?.available ?? true,
  );
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState("");

  const [optimisticAvailable, setOptimisticAvailable] = useOptimistic(
    currentAvailable,
    (_current, next: boolean) => next,
  );
  if (!item) return null;

  const handleAvailablity = () => {
    const nextValue = !optimisticAvailable;

    startTransition(async () => {
      setOptimisticAvailable(nextValue);
      const res = await updateAvailability({
        id: item.id,
        available: nextValue,
      });
      if (!res.success) {
        setServerError(res.error || "common.errorOccurred");
        return;
      }
      setCurrentAvailable(nextValue);
    });
  };

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
        {/* Availability Toggle */}
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div className="space-y-0.5">
            <label
              htmlFor="availability-toggle"
              className="text-sm font-medium cursor-pointer"
            >
              {t("orders.availability")}
            </label>
            <p className="text-xs text-muted-foreground">
              {optimisticAvailable
                ? t("orders.inStock")
                : t("orders.outOfStock")}
            </p>
          </div>
          <Switch
            id="availability-toggle"
            checked={optimisticAvailable}
            onCheckedChange={handleAvailablity}
            disabled={isPending}
          />
        </div>
      </div>
      {serverError && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
          {t(serverError)}
        </div>
      )}
      <DrawerFooter className="pt-6">
        <DrawerClose asChild>
          <Button className="w-full">{t("common.cancel")}</Button>
        </DrawerClose>
      </DrawerFooter>
    </>
  );
}
