"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { createCategory } from "@/lib/actions/admin";
import toast from "react-hot-toast";
import AddCategoryTrigger from "./add-category-trigger";
import FormModal from "./form-modal";
import { useQueryClient } from "@tanstack/react-query";

const categorySchema = z.object({
  catEn: z
    .string()
    .trim()
    .min(2, "edit.errors.name.min")
    .max(50, "edit.errors.name.max"),
  catAr: z
    .string()
    .trim()
    .min(2, "edit.errors.name.min")
    .max(50, "edit.errors.name.max"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AddCategoryModal() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isValid, isDirty },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
  });

  const onSubmit = (data: CategoryFormValues) => {
    clearErrors("root");
    startTransition(async () => {
      const res = await createCategory({
        catEn: data.catEn,
        catAr: data.catAr,
      });
      if (!res.success) {
        setError("root", { message: res.error || "common.errorOccurred" });
        toast.error(t("toast.categoryAddedFaild"));
        return;
      }
      toast.success(t("toast.categoryAdded"));
      queryClient.invalidateQueries({ queryKey: ["menu"] });
      setOpen(false);
      reset();
    });
  };

  return (
    <FormModal
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
      }}
      trigger={<AddCategoryTrigger />}
      title={t("admin.addCategory.title")}
      description={t("admin.addCategory.subtitle")}
      isPending={isPending}
      isValid={isValid}
      isDirty={isDirty}
      onSubmit={handleSubmit(onSubmit)}
      rootError={errors.root?.message}
    >
      {/* Description EN */}
      <div className="space-y-1.5 text-left">
        <Label htmlFor="catEn">{t("admin.addCategory.catEn")}</Label>
        <Input
          id="catEn"
          {...register("catEn")}
          disabled={isPending}
          aria-invalid={!!errors.catEn}
        />
        {errors.catEn && (
          <p className="text-xs text-destructive">
            {t(errors.catEn.message as string)}
          </p>
        )}
      </div>
      {/* Description AR */}

      <div className="space-y-1.5 text-right">
        <Label htmlFor="catAr">{t("admin.addCategory.catAr")}</Label>
        <Input
          id="catAr"
          dir="rtl"
          {...register("catAr")}
          disabled={isPending}
          aria-invalid={!!errors.catAr}
        />
        {errors.catAr && (
          <p className="text-xs text-destructive">
            {t(errors.catAr.message as string)}
          </p>
        )}
      </div>
    </FormModal>
  );
}
