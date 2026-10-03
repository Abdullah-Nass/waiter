"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { LogOut } from "lucide-react";

export default function Logout() {
  const t = useTranslations();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await authClient.signOut();

      router.push("/login");
      router.refresh();
    });
  };

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={handleLogout}
      disabled={isPending}
      aria-label={t("metadata.logoutBtn")}
    >
      <LogOut />
      <span> {t("auth.logout")}</span>
    </Button>
  );
}
