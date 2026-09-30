"use client";

import { useMutation } from "@tanstack/react-query";
import { changeStatus } from "@/lib/actions/kitchen";
import { OrderStatus } from "@prisma/client";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { colorsScheme } from "../common/orders-column";

type StatusBtnProps = React.ComponentProps<"button"> & {
  color: keyof typeof colorsScheme;
  newStatus: OrderStatus;
  orderId: number;
  visible?: boolean;
};

export default function StatusBtn({
  color,
  newStatus,
  orderId,
  visible = true,
  ...props
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
      disabled={mutation.isPending}
      className={cn(
        "w-full rounded-md px-4 py-1",
        "text-sm font-semibold text-white",
        "shadow-sm transition-all",
        "disabled:cursor-not-allowed disabled:opacity-60",
        scheme.bg,
        scheme.bgHover,
        !visible && "hidden",
      )}
      {...props}
    >
      {mutation.isPending
        ? `${t(`kitchen.statusBtn.${newStatus}`)}...`
        : t(`kitchen.statusBtn.${newStatus}`)}
    </button>
  );
}
