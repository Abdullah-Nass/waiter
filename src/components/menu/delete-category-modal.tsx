import { ConfirmDialog } from "./confirm-modal";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Category } from "@prisma/client";
import { deleteCategory } from "@/lib/actions/admin";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function DeleteCategoryModal({
  category,
}: {
  category: Category;
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
      trigger={
        <Button
          type="button"
          variant="icon"
          size="icon"
          onClick={(e) => e.stopPropagation()}
          className="h-6 w-6 hover:bg-background/20"
          aria-label={t("metadata.deleteCategoryBtn")}
          asChild
        >
          <X />
        </Button>
      }
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
