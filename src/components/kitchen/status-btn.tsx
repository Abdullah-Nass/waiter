"use client";

import { useMutation } from "@tanstack/react-query";
import { colorsScheme } from "./kitchen-column";
import { changeStatus } from "@/lib/actions/kitchen";
import { OrderStatus } from "@prisma/client";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { cn } from "cn";

type StatusBtnProps = {
  color: keyof typeof colorsScheme;
  newStatus: OrderStatus;
  orderId: number;
  visible: boolean;
};

export default function StatusBtn({
  color,
  newStatus,
  orderId,
  visible,
}: StatusBtnProps) {
  const scheme = colorsScheme[color];

  const t = useTranslations();

  const mutation = useMutation({
    mutationFn: changeStatus,
    mutationKey: ["orders"],

    onError: () => {
      toast.error(t("common.errorOccurred"));
    },
  });

  return (
    <button
      type="button"
      onClick={() =>
        mutation.mutate({
          orderId,
          newStatus,
        })
      }
      disabled={mutation.isPending || visible}
      className={cn(
        "w-full rounded-lg px-4 py-2.5",
        "text-sm font-semibold text-white",
        "shadow-sm transition-all",
        "disabled:cursor-not-allowed disabled:opacity-60",
        scheme.bg,
        scheme.bgHover,
        visible && "hidden",
      )}
    >
      {mutation.isPending
        ? `${t(`kitchen.statusBtn.${newStatus}`)}...`
        : t(`kitchen.statusBtn.${newStatus}`)}
    </button>
  );
}
