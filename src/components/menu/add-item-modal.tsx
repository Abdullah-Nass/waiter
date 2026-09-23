"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

import toast from "react-hot-toast";
import { createMenuItem } from "@/lib/actions/admin";
import { Category } from "@prisma/client";
import { CategorySelect } from "./category-select";
import AddItemTrigger from "./add-item-trigger";
import FormModal from "./form-modal";
import { useQueryClient } from "@tanstack/react-query";

const menuItemSchema = z.object({
  nameEn: z
    .string()
    .trim()
    .min(2, "edit.errors.name.min")
    .max(100, "edit.errors.name.max"),

  nameAr: z
    .string()
    .trim()
    .min(2, "edit.errors.name.min")
    .max(100, "edit.errors.name.max"),

  descEn: z
    .string()
    .trim()
    .max(500, "edit.errors.desc.max")
    .optional()
    .or(z.literal("")),

  descAr: z
    .string()
    .trim()
    .max(500, "edit.errors.desc.max")
    .optional()
    .or(z.literal("")),

  price: z
    .number({ message: "edit.errors.price.invalid" })
    .positive("edit.errors.price.positive"),

  categoryId: z
    .number({ message: "edit.errors.category.required" })
    .int()
    .positive("edit.errors.category.required"),
});

type MenuItemValues = z.infer<typeof menuItemSchema>;

export default function AddItemModal({
  categories,
}: {
  categories: Category[];
}) {
  const [open, setOpen] = useState<boolean>(false);
  const t = useTranslations();
  const queryClient = useQueryClient();

  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    formState: { errors, isValid, isDirty },
  } = useForm<MenuItemValues>({
    resolver: zodResolver(menuItemSchema),
    mode: "onChange",
  });

  const onSubmit = (data: MenuItemValues) => {
    clearErrors("root");

    startTransition(async () => {
      const res = await createMenuItem({
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        price: data.price,
        categoryId: data.categoryId,
        descAr: data.descAr || undefined,
        descEn: data.descEn || undefined,
      });

      if (!res.success) {
        setError("root", { message: res.error || "common.errorOccurred" });
        toast.error(t("toast.itemAddedFailed"));
        return;
      }

      toast.success(t("toast.itemAdded"));
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
      trigger={<AddItemTrigger />}
      title={t("admin.addItem.title")}
      description={t("admin.addItem.subtitle")}
      isPending={isPending}
      isValid={isValid}
      isDirty={isDirty}
      onSubmit={handleSubmit(onSubmit)}
      rootError={errors.root?.message}
    >
      {/* Names Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 text-left">
          <Label htmlFor="nameEn">{t("admin.addItem.nameEn")}</Label>
          <Input
            id="nameEn"
            {...register("nameEn")}
            disabled={isPending}
            aria-invalid={!!errors.nameEn}
          />
          {errors.nameEn && (
            <p className="text-xs text-destructive">
              {t(errors.nameEn.message as string)}
            </p>
          )}
        </div>

        <div className="space-y-1.5 text-right">
          <Label htmlFor="nameAr">{t("admin.addItem.nameAr")}</Label>
          <Input
            id="nameAr"
            dir="rtl"
            {...register("nameAr")}
            disabled={isPending}
            aria-invalid={!!errors.nameAr}
          />
          {errors.nameAr && (
            <p className="text-xs text-destructive">
              {t(errors.nameAr.message as string)}
            </p>
          )}
        </div>
      </div>

      {/* Category & Price Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 text-left">
          <Label htmlFor="categoryId">{t("admin.addItem.category")}</Label>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <CategorySelect
                categories={categories}
                value={field.value}
                onChange={field.onChange}
                disabled={isPending}
                placeholder={t("admin.addItem.selectCategory")}
                hasError={!!errors.categoryId}
              />
            )}
          />
          {errors.categoryId && (
            <p className="text-xs text-destructive">
              {t(errors.categoryId.message as string)}
            </p>
          )}
        </div>

        <div className="space-y-1.5 text-left">
          <Label htmlFor="price">{t("admin.addItem.price")}</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            {...register("price", { valueAsNumber: true })}
            disabled={isPending}
            aria-invalid={!!errors.price}
          />
          {errors.price && (
            <p className="text-xs text-destructive">
              {t(errors.price.message as string)}
            </p>
          )}
        </div>
      </div>

      {/* Description EN */}
      <div className="space-y-1.5 text-left">
        <Label htmlFor="descEn">{t("admin.addItem.descEn")}</Label>
        <Input
          id="descEn"
          {...register("descEn")}
          disabled={isPending}
          aria-invalid={!!errors.descEn}
        />
        {errors.descEn && (
          <p className="text-xs text-destructive">
            {t(errors.descEn.message as string)}
          </p>
        )}
      </div>

      {/* Description AR */}
      <div className="space-y-1.5 text-right">
        <Label htmlFor="descAr">{t("admin.addItem.descAr")}</Label>
        <Input
          id="descAr"
          dir="rtl"
          {...register("descAr")}
          disabled={isPending}
          aria-invalid={!!errors.descAr}
        />
        {errors.descAr && (
          <p className="text-xs text-destructive">
            {t(errors.descAr.message as string)}
          </p>
        )}
      </div>
    </FormModal>
  );
}
