"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket/client";
import { OrderStatus } from "@prisma/client";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { useUnlockAudio } from "./use-unlock-audio";
import { useTranslations } from "next-intl";
import { CheckCircle2, Clock, X } from "lucide-react";
import { useCartStore } from "@/providers/cart-provider";

export default function useWaiterSocket() {
  const t = useTranslations();

  const setNotification = useCartStore((state) => state.setNotification);

  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const audioRef = useUnlockAudio("/sounds/notification.mp3");
  useEffect(() => {
    if (!session?.user.role) return;

    const socket = getSocket(session.user.role, session.user.id);

    const handleStatusChanged = ({
      tableNumber,
      status,
    }: {
      orderId: number;
      tableNumber: number;
      status: OrderStatus;
    }) => {
      if (status !== "SERVED") {
        toast(
          t("notifications.statusChanged", {
            tableNumber,
            status: t(`kitchen.status.${status}`),
          }),
          {
            icon:
              status === "IN_PROGRESS" ? (
                <Clock className="w-5 h-5 text-yellow-500" />
              ) : status === "CANCELLED" ? (
                <X className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ),
            duration: 3000,
          },
        );
        setNotification(true);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((e) => console.log(e));
        }
      }
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    };

    socket.on("order:statusChanged", handleStatusChanged);

    return () => {
      socket.off("order:statusChanged", handleStatusChanged);
    };
  }, [session, audioRef, t, queryClient, setNotification]);
}
