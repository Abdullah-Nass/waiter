"use client";

import { useEffect } from "react";
import { useUnlockAudio } from "./use-unlock-audio";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Bell } from "lucide-react";
import { getSocket } from "@/lib/socket/client";
import { Order } from "@prisma/client";
import toast from "react-hot-toast";

export default function useKitchenSocket() {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const t = useTranslations();
  const audioRef = useUnlockAudio("/sounds/notification.mp3");

  useEffect(() => {
    if (!session?.user.role) return;

    const socket = getSocket(session.user.role);

    const handleNewOrder = (order: Order) => {
      toast(
        t("notifications.newOrderAlert", {
          tableNumber: order.tableNumber,
        }),
        {
          icon: <Bell className="h-5 w-5 text-primary" />,
        },
      );

      audioRef.current?.pause();
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.log);
      }

      queryClient.invalidateQueries({ queryKey: ["orders"] });
    };

    const handleOrderUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    };

    socket.on("order:new", handleNewOrder);
    socket.on("order:updated", handleOrderUpdated);

    return () => {
      socket.off("order:new", handleNewOrder);
      socket.off("order:updated", handleOrderUpdated);
    };
  }, [session?.user.role, queryClient, t, audioRef]);
}
