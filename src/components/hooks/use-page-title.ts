"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const pathnameToKey: Record<string, string> = {
  "/menu": "metadata.menu.title",
  "/checkout": "metadata.checkout.title",
  "/kitchen": "metadata.kitchen.title",
  "/my-orders": "metadata.myOrders.title",
  "/staff": "metadata.staff.title",
};

export function usePageTitle() {
  const pathname = usePathname();
  const t = useTranslations();

  const stripped = "/" + pathname.split("/").slice(2).join("/");
  const key = pathnameToKey[stripped];

  return key ? t(key) : "";
}
