"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/routing";
import { LoginFormValues, loginSchema } from "@/lib/validation";
import { login } from "@/lib/actions/auth";

export default function LoginForm() {
  const t = useTranslations();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = (data: LoginFormValues) => {
    clearErrors("root");

    startTransition(async () => {
      const res = await login({
        email: data.email,
        password: data.password,
      });

      if (res && !res.success) {
        setError("root", {
          message: res.error,
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">{t("auth.email")}</Label>

        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t("auth.emailPlaceholder")}
          disabled={isPending}
          aria-invalid={!!errors.email}
          {...register("email")}
        />

        {errors.email && (
          <p className="text-destructive text-sm">
            {t("auth.validation.email")}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">{t("auth.password")}</Label>

        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder={t("auth.passwordPlaceholder")}
          disabled={isPending}
          aria-invalid={!!errors.password}
          {...register("password")}
        />

        {errors.password && (
          <p className="text-destructive text-sm">
            {t("auth.validation.password")}
          </p>
        )}
      </div>

      {/* Server error */}
      {errors.root?.message && (
        <p className="text-destructive text-sm" role="alert">
          {t(errors.root.message)}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending || !isValid || !isDirty}
        className="w-full"
        aria-label={t("metadata.loginBtn")}
      >
        {isPending ? t("auth.loggingin") : t("auth.login")}
      </Button>
    </form>
  );
}
