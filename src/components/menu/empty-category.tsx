"use client";

import { CircleOff } from "lucide-react";
import { useTranslations } from "next-intl";

export default function EmptyCategory() {
  const t = useTranslations("navigation");

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 top-50">
      <CircleOff className="h-6 w-6 shrink-0 stroke-[1.5] text-muted-foreground" />
      <p className="text-center text-xl font-medium text-foreground">
        {t("emptyCategory")}
      </p>
    </div>
  );
}
