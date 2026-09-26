"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updatePrice } from "@/lib/actions/menu-items";

import type { MenuItem } from "@prisma/client";
import { useState, useTransition } from "react";
import FormModal from "./form-modal";
import EditTrigger from "./edit-trigger";
import { useQueryClient } from "@tanstack/react-query";

// validation rules
const menuItemSchema = z.object({
  price: z.number({
    message: "edit.errors.price.error",
  }),
});

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

export function EditPriceModal({
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
  } = useForm({
    resolver: zodResolver(menuItemSchema),
    mode: "onChange",
    defaultValues: { price: item?.price ?? 0 },
  });

  const onSubmit = (data: MenuItemFormValues) => {
    startTransition(async () => {
      const res = await updatePrice({
        id: item.id,
        price: Number(data.price),
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
      title={t(`edit.price.title`)}
      description={t(`edit.price.subtitle`, {
        id: item.id ?? 0,
      })}
      isPending={isPending}
      isValid={isValid}
      isDirty={isDirty}
      onSubmit={handleSubmit(onSubmit)}
      rootError={errors.root?.message}
    >
      <div className="space-y-1.5 text-left">
        <Label htmlFor="price">{t("edit.price.label")}</Label>
        <Input
          id="price"
          type="number"
          inputMode="decimal"
          step="0.01"
          disabled={isPending}
          className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          {...register("price", { valueAsNumber: true })}
        />
        {errors.price && (
          <p className="text-xs text-destructive">
            {t(errors.price.message as string)}
          </p>
        )}
      </div>
    </FormModal>
  );
}
