import { Button } from "../ui/button";
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { useLocale, useTranslations } from "next-intl";
import { MenuItem } from "@prisma/client";
import { EditNameModal } from "./edit-name-modal";
import { EditDescModal } from "./edit-desc-modal";
import { EditPriceModal } from "./edit-price-modal";

export default function AdminDrawer({
  item,
  onSuccess,
}: {
  item: MenuItem | null;
  onSuccess: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations();

  if (!item) return null;
  const itemName = locale === "ar" ? item.nameAr : item.nameEn;
  const itemDesc = locale === "ar" ? item.descAr : item.descEn;
  return (
    <>
      <DrawerHeader>
        <DrawerTitle className="flex items-center justify-center gap-3">
          <span className="text-xl font-bold">{itemName}</span>
          <EditNameModal item={item} onSuccess={onSuccess} />
        </DrawerTitle>
        <div className="flex items-center justify-center gap-3">
          <DrawerDescription>{itemDesc}</DrawerDescription>
          <EditDescModal item={item} onSuccess={onSuccess} />
        </div>
      </DrawerHeader>

      <div className="flex items-center justify-center gap-3">
        <p className="text-lg font-semibold text-primary text-center">
          ${item.price.toFixed(2)}
        </p>
        <EditPriceModal item={item} onSuccess={onSuccess} />
      </div>
      <div className="space-y-5 p-4 pb-0"></div>
      <DrawerFooter className="pt-6">
        <Button className="w-full">{t("edit.delete")}</Button>
        <DrawerClose asChild>
          <Button variant={"outline"} className="w-full">
            {t("common.cancel")}
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </>
  );
}
