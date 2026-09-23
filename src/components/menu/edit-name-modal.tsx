"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateNames } from "@/lib/actions/menu-items";
import { MenuItem } from "@prisma/client";
import { useTranslations } from "next-intl";
import EditTrigger from "./edit-trigger";
import FormModal from "./form-modal";
import { useQueryClient } from "@tanstack/react-query";

// validation rules
const menuItemSchema = z.object({
  nameEn: z
    .string()
    .trim()
    .min(2, "edit.errors.name.min")
    .max(50, "edit.errors.name.max"),
  nameAr: z
    .string()
    .trim()
    .min(2, "edit.errors.name.min")
    .max(50, "edit.errors.name.max"),
});

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

export function EditNameModal({
  item,
  onSuccess,
}: {
  item: MenuItem;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid, isDirty },
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    mode: "onChange",
    defaultValues: {
      nameEn: item?.nameEn ?? "",
      nameAr: item?.nameAr ?? "",
    },
  });

  if (!item) return null;

  const onSubmit = (data: MenuItemFormValues) => {
    startTransition(async () => {
      const res = await updateNames({
        id: item.id,
        nameEn: data.nameEn,
        nameAr: data.nameAr,
      });

      if (!res.success) {
        setError("root", { message: res.error || "common.errorOccurred" });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["menu"] });

      onSuccess();
      setOpen(false);
    });
  };

  return (
    <FormModal
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        reset();
      }}
      trigger={<EditTrigger />}
      title={t(`edit.name.title`)}
      description={t(`edit.name.subtitle`, {
        id: item.id ?? 0,
      })}
      isPending={isPending}
      isValid={isValid}
      isDirty={isDirty}
      onSubmit={handleSubmit(onSubmit)}
      rootError={errors.root?.message}
    >
      {/* English Input */}
      <div className="space-y-1.5 text-left">
        <Label htmlFor="nameEn">{t("edit.name.labelEn")}</Label>
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

      {/* Arabic Input */}
      <div className="space-y-1.5 text-right">
        <Label htmlFor="nameAr">{t("edit.name.labelAr")}</Label>
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
    </FormModal>
  );
}
