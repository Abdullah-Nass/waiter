import { ConfirmDialog } from "../common/confirm-modal";
import { useTranslations } from "next-intl";
import type { MenuItem } from "@prisma/client";
import { deleteItem } from "@/lib/actions/admin";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

export default function DeleteItemModal({
  item,
  trigger
}: {
  item: MenuItem;
  trigger: ReactNode
}) {
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
      trigger={trigger}
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
