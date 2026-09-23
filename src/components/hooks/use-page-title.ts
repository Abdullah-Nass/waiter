"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const pathnameToKey: Record<string, string> = {
  "/menu": "metadata.menu.title",
};

export function usePageTitle() {
  const pathname = usePathname();
  const t = useTranslations();

  // strip locale prefix (/en/menu → /menu)
  const stripped = "/" + pathname.split("/").slice(2).join("/");
  const key = pathnameToKey[stripped];

  return key ? t(key) : "";
}
