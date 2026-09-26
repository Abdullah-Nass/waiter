"use client";

import { Loader2, Utensils } from "lucide-react";
import { Button } from "../ui/button";
import { useCartStore } from "@/providers/cart-provider";
import { useMutation } from "@tanstack/react-query";
import { placeOrder } from "@/lib/actions/orders";
import toast from "react-hot-toast";
import { useCartHydrated } from "@/lib/stores/cart";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

// validation rules
const tableSchema = z.object({
  tableNumber: z.number({
    message: "cart.errors.tableNumber",
  }),
});

type tableFormValues = z.infer<typeof tableSchema>;

export default function Checkout({ waiterId }: { waiterId: string }) {
  const isHydrated = useCartHydrated();

  const t = useTranslations();

  const total = useCartStore((state) => state.totalPrice());
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(tableSchema),
    mode: "onChange",
  });
  const mutation = useMutation({
    mutationFn: placeOrder,
    mutationKey: ["orders"],
    onSuccess: () => {
      toast.success("Order Placed");
      clearCart();
      reset();
    },
    onError: () => {
      setError("root", { message: t("common.errorOccurred") });
    },
  });
  const onSubmit = (data: tableFormValues) => {
    mutation.mutate({ items, waiterId, tableNumber: data.tableNumber });
  };
  return (
    <div className="sm:sticky top-[84px] container mx-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-sm w-64">
      <div className="space-y-7">
        <h3 className="text-lg font-semibold text-gray-900">
          {t("cart.checkout.title")}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <Label htmlFor="tableNumber">{t("cart.tableInputLabel")}</Label>
          <Input
            id="tableNumber"
            type="number"
            inputMode="numeric"
            step="1"
            disabled={mutation.isPending}
            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            {...register("tableNumber", { valueAsNumber: true })}
          />
          {errors.tableNumber && (
            <p className="text-xs text-destructive">
              {t(errors.tableNumber.message as string)}
            </p>
          )}
          <div className="flex items-baseline justify-between">
            <span className="text-base font-semibold text-gray-900 mt-5">
              {t("cart.checkout.total")}
            </span>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              {isHydrated ? total.toFixed(2) : "0.00"}
            </span>
          </div>
          {errors.root && (
            <p className="text-xs text-destructive">
              {t(errors.root.message as string)}
            </p>
          )}
          <Button
            type="submit"
            className="flex w-full items-center justify-center gap-2 text-sm "
            disabled={
              items.length < 1 || mutation.isPending || !isValid || !isDirty
            }
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span> {t("cart.checkout.placing")}</span>
              </>
            ) : (
              <>
                <Utensils className="size-4" />
                <span> {t("cart.checkout.place")}</span>
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
