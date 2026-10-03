"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./login-form";

export default function LoginContainer() {
  const t = useTranslations();

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div className="h-72 w-72 rounded-full bg-primary/10 blur-3xl sm:h-96 sm:w-96" />
      </div>

      <Card className="w-full max-w-md border-border/60 shadow-lg backdrop-blur-sm">
        <CardHeader className="space-y-1.5 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {t("auth.welcomeBack")}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            {t("auth.enterCredentialsPrompt")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
