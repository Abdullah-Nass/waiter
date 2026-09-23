"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

type FormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description: string;

  isPending: boolean;
  isValid: boolean;
  isDirty: boolean;

  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

  trigger?: ReactNode;
  rootError?: string;
  contentClassName?: string;

  children: ReactNode;
};

export default function FormModal({
  open,
  onOpenChange,
  title,
  description,
  trigger,
  rootError,
  isPending,
  isValid,
  isDirty,
  onSubmit,
  contentClassName = "sm:max-w-lg",
  children,
}: FormModalProps) {
  const t = useTranslations();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger}

      <DialogContent className={contentClassName}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          {rootError && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
              {t(rootError)}
            </div>
          )}

          {children}

          <DialogFooter className="gap-2 pt-4 sm:gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                className="sm:w-20"
              >
                {t("common.cancel")}
              </Button>
            </DialogClose>

            <Button
              type="submit"
              className="sm:w-20"
              disabled={isPending || !isValid || !isDirty}
            >
              {isPending ? t("common.confirming") : t("common.confirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
