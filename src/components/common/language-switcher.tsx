"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../ui/button";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const isArabic = locale === "ar";
  const targetLocale = isArabic ? "en" : "ar";
  const label = isArabic ? "English" : "العربية";

  const handleToggle = () => {
    // Strip the current locale prefix before passing to router.replace
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

    startTransition(() => {
      router.replace(pathnameWithoutLocale, { locale: targetLocale });
    });
  };

  return (
    <Button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      variant={"ghost"}
      aria-label={t("metadata.langaugeBtn", { label })}
    >
      <Globe className="size-4" /> <span>{label}</span>
    </Button>
  );
}
