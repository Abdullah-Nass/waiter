"use client";

import { Category, MenuItem } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CategoryList from "./category-list";
import MenuList from "./menu-list";
import { authClient } from "@/lib/auth-client";
import { getSocket } from "@/lib/socket/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMenu } from "@/lib/api/menu";
import LoadingComponent from "../common/loading-component";
import CartFloat from "./cart-float";

type CategoryWithItems = Category & { items: MenuItem[] };

export default function MenuContainer({
  initialCategories,
}: {
  initialCategories: CategoryWithItems[];
}) {
  const searchParams = useSearchParams();

  const queryClient = useQueryClient();
  const { data: categories = initialCategories } = useQuery({
    queryKey: ["menu"],
    queryFn: fetchMenu,
    initialData: initialCategories,
  });

  const { data: session, isPending } = authClient.useSession();

  const categoryParam = searchParams.get("category");
  const validCategory =
    categories.find((cat) => cat.id === Number(categoryParam)) ?? categories[0];
  const [selectedId, setSelectedId] = useState<number>(validCategory.id);

  const activeCategory =
    categories.find((cat) => cat.id === selectedId) ?? categories[0];

  useEffect(() => {
    if (!session?.user.role) return;

    const socket = getSocket(session.user.role);

    socket.on(
      "menu:item-availability",
      ({ id, available }: { id: number; available: boolean }) => {
        queryClient.setQueryData(["menu"], (prev: CategoryWithItems[]) =>
          prev.map((cat) => ({
            ...cat,
            items: cat.items.map((item) =>
              item.id === id ? { ...item, available } : item,
            ),
          })),
        );
      },
    );

    return () => {
      socket.off("menu:item-availability");
    };
  }, [session?.user.role, queryClient]);

  if (isPending) return <LoadingComponent />;

  return (
    <div className="flex relative">
      <CategoryList
        categories={categories}
        selectedId={selectedId}
        role={session!.user.role}
        onSelect={(id) => {
          setSelectedId(id);
          window.history.replaceState(null, "", `?category=${id}`);
        }}
      />
      <MenuList items={activeCategory?.items} categories={categories} />
      {session!.user.role === "WAITER" && <CartFloat />}
    </div>
  );
}
