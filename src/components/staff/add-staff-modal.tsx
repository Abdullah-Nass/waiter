"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormModal from "../menu/form-modal";
import { Button } from "../ui/button";
import { StaffFormValues, staffSchema } from "@/lib/validation";
import { createStaffMember } from "@/lib/actions/auth";
import { DialogTrigger } from "../ui/dialog";
import { useQueryClient } from "@tanstack/react-query";

export default function AddStaffModal() {
  const queryClient = useQueryClient();

  const t = useTranslations("admin.staff");
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    formState: { errors, isValid, isDirty },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "WAITER",
    },
  });

  const onSubmit = (values: StaffFormValues) => {
    clearErrors("root");
    startTransition(async () => {
      const res = await createStaffMember(values);

      if (!res.success) {
        setError("root", {
          type: "server",
          message: res.error ?? "errors.createFailed",
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["staff"] });
        reset();
        setOpen(false);
      }
    });
  };

  return (
    <FormModal
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        reset();
      }}
      trigger={
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t("add.trigger")}
          </Button>
        </DialogTrigger>
      }
      title={t("add.title")}
      description={t("add.description")}
      isPending={isPending}
      isValid={isValid}
      isDirty={isDirty}
      onSubmit={handleSubmit(onSubmit)}
      rootError={errors.root?.message}
    >
      {/* Name Input */}
      <div className="space-y-1.5 text-left">
        <Label htmlFor="name">{t("fields.name")}</Label>
        <Input
          id="name"
          {...register("name")}
          disabled={isPending}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-xs text-destructive">
            {t(errors.name.message as string)}
          </p>
        )}
      </div>

      {/* Email Input */}
      <div className="space-y-1.5 text-left">
        <Label htmlFor="email">{t("fields.email")}</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          disabled={isPending}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-xs text-destructive">
            {t(errors.email.message as string)}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-1.5 text-left">
        <Label htmlFor="password">{t("fields.password")}</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          disabled={isPending}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="text-xs text-destructive">
            {t(errors.password.message as string)}
          </p>
        )}
      </div>

      {/* Role Select (requires Controller for shadcn Select) */}
      <div className="space-y-1.5 text-left">
        <Label htmlFor="role">{t("fields.role")}</Label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isPending}
            >
              <SelectTrigger id="role" aria-invalid={!!errors.role}>
                <SelectValue placeholder={t("roles.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WAITER">{t("roles.waiter")}</SelectItem>
                <SelectItem value="KITCHEN">{t("roles.kitchen")}</SelectItem>
                <SelectItem value="ADMIN">{t("roles.admin")}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.role && (
          <p className="text-xs text-destructive">
            {t(errors.role.message as string)}
          </p>
        )}
      </div>
    </FormModal>
  );
}
