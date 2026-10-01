"use client";

import { deleteStaffMember } from "@/lib/actions/auth";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { ConfirmDialog } from "../common/confirm-modal";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

export default function DeleteStaff({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const res = await deleteStaffMember(userId);
        if (res.success) {
          toast.success(t("toast.deleteStaff"));
          queryClient.invalidateQueries({ queryKey: ["staff"] });
        } else {
          toast.error(t("toast.deleteStaffFailed"));
        }
      } catch {
        toast.error(t("common.errorOccurred"));
      }
    });
  };

  return (
    <ConfirmDialog
      trigger={
        <Button
          variant={"destructive"}
          className="text-destructive self-end"
          type="button"
          disabled={isPending}
        >
          {t(isPending ? "common.deleting" : "common.delete")}
        </Button>
      }
      destructive={true}
      title={t("admin.staff.confirmTitle")}
      description={t("admin.staff.confirmSubtitle", { username })}
      confirmText={t("common.delete")}
      cancelText={t("common.cancel")}
      onConfirm={handleConfirm}
    />
  );
}
