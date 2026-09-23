"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateDesc } from "@/lib/actions/menu-items";
import { MenuItem } from "@prisma/client";
import { useTranslations } from "next-intl";
import FormModal from "./form-modal";
import EditTrigger from "./edit-trigger";
import { useQueryClient } from "@tanstack/react-query";

// validation rules
const menuItemSchema = z.object({
  descEn: z
    .string()
    .trim()
    .min(2, "edit.errors.desc.min")
    .max(300, "edit.errors.desc.max"),
  descAr: z
    .string()
    .trim()
    .min(2, "edit.errors.desc.min")
    .max(300, "edit.errors.desc.max"),
});

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

export function EditDescModal({
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
    setError,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    mode: "onChange",
    defaultValues: {
      descEn: item?.descEn ?? "",
      descAr: item?.descAr ?? "",
    },
  });

  if (!item) return null;

  const onSubmit = (data: MenuItemFormValues) => {
    startTransition(async () => {
      const res = await updateDesc({
        id: item.id,
        descEn: data.descEn,
        descAr: data.descAr,
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
      title={t(`edit.desc.title`)}
      description={t(`edit.desc.subtitle`, {
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
        <Label htmlFor="descEn">{t("edit.desc.labelEn")}</Label>
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

      {/* Arabic Input */}
      <div className="space-y-1.5 text-right">
        <Label htmlFor="descAr">{t("edit.desc.labelAr")}</Label>
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
