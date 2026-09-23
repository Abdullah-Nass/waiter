import type { MenuItem } from "@prisma/client";
import { cn } from "cn";
import { useLocale, useTranslations } from "next-intl";
import DeleteItemModal from "./delete-item-modal";

export default function Item({
  item,
  handleSelectItem,
  role = "WAITER",
}: {
  item: MenuItem;
  handleSelectItem: (item: MenuItem) => void;
  role?: string;
}) {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div
      // Disable the clicking if the user is a WAITER AND the item is UNAVAILABLE
      onClick={() =>
        !item.available && role === "WAITER" ? null : handleSelectItem(item)
      }
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border p-4 text-start transition-all duration-200 min-w-[260px] flex-1",
        !item.available
          ? "border-dashed border-muted-foreground/30 bg-muted/20 opacity-75"
          : "border-border bg-card shadow-xs hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
      )}
    >
      {role === "ADMIN" && <DeleteItemModal item={item} />}
      <h3 className="font-semibold">
        {locale === "ar" ? item.nameAr : item.nameEn}
      </h3>

      <p className="text-sm text-muted-foreground line-clamp-2">
        {locale === "ar" ? item.descAr : item.descEn}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-2.5">
        <span className="mt-2 font-medium mt-auto text-gray-500">
          ${item.price.toFixed(2)}
        </span>
        {!item.available && (
          <span className="shrink-0 inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive ring-1 ring-inset ring-destructive/20">
            {t("orders.outOfStock")}
          </span>
        )}
      </div>
    </div>
  );
}
