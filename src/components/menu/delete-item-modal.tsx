import { ConfirmDialog } from "../common/confirm-modal";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MenuItem } from "@prisma/client";
import { deleteItem } from "@/lib/actions/admin";
import toast from "react-hot-toast";
import { cn } from "cn";
import { useQueryClient } from "@tanstack/react-query";

export default function DeleteItemModal({ item }: { item: MenuItem }) {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const handelSubmit = async () => {
    try {
      await deleteItem({
        itemId: item.id,
      });
      toast.success(t("toast.deleteItem"));
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    } catch {
      toast.error(t("toast.deleteItemFaild"));
    }
  };
  return (
    <ConfirmDialog
      trigger={
        <Button
          type="button"
          variant="icon"
          size="icon"
          onClick={(e) => e.stopPropagation()} // Prevents card selection
          className={cn("absolute top-4 end-4 h-6 w-6 hover:text-gray-600")}
          aria-label={t("metadata.deleteItemBtn")}
          asChild
        >
          <X />
        </Button>
      }
      destructive={true}
      title={t("admin.deleteItem.title", {
        item: `${item.nameEn} | ${item.nameAr}`,
      })}
      description={t("admin.deleteItem.description")}
      confirmText={t("common.delete")}
      cancelText={t("common.cancel")}
      onConfirm={handelSubmit}
    />
  );
}
