"use client";

import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";

type qualityControlProps = {
  quantity: number;
  hasText?: boolean;
  handleDecrement: () => void;
  handleIncrement: () => void;
};

export default function QuantityControl({
  quantity,
  hasText = true,
  handleDecrement,
  handleIncrement,
}: qualityControlProps) {
  const t = useTranslations();
  return (
    <div className="flex items-center justify-between">
      {hasText && (
        <span className="text-sm font-medium">{t("orders.quantity")}</span>
      )}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleDecrement}
          disabled={quantity <= 1}
          type="button"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-6 text-center text-base font-semibold">
          {quantity}
        </span>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleIncrement}
          type="button"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
