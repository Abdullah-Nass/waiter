import { ConfirmDialog } from "../common/confirm-modal";
import { useTranslations } from "next-intl";
import type { Category } from "@prisma/client";
import { deleteCategory } from "@/lib/actions/admin";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

export default function DeleteCategoryModal({
  category,
  trigger
}: {
  category: Category;
  trigger: ReactNode
}) {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const handelSubmit = async () => {
    try {
      await deleteCategory({
        categoryId: category.id,
      });
      toast.success(t("toast.deleteCategory"));
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    } catch {
      toast.error(t("toast.deleteCategoryFaild"));
    }
  };

  return (
    <ConfirmDialog
      trigger={trigger}
      destructive={true}
      title={t("admin.deleteCategory.title", {
        category: `${category.nameEn} | ${category.nameAr}`,
      })}
      description={t("admin.deleteCategory.description")}
      confirmText={t("common.delete")}
      cancelText={t("common.cancel")}
      onConfirm={handelSubmit}
    />
  );
}
