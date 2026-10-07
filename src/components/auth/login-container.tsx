"use client";

import { useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./login-form";
import LanguageSwitcher from "../common/language-switcher";

export default function LoginContainer() {
  const t = useTranslations();

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="absolute top-5 end-5">
        <LanguageSwitcher />
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
