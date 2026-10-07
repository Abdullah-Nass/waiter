"use client";

import { Category, MenuItem } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CategoryList from "./category-list";
import MenuList from "./menu-list";
import { getSocket } from "@/lib/socket/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMenu } from "@/lib/api/menu";
import CartFloat from "./cart-float";

type CategoryWithItems = Category & { items: MenuItem[] };

export default function MenuContainer({
  initialCategories,
  role,
}: {
  initialCategories: CategoryWithItems[];
  role: string;
}) {
  const searchParams = useSearchParams();

  const queryClient = useQueryClient();
  const { data: categories = initialCategories } = useQuery({
    queryKey: ["menu"],
    queryFn: fetchMenu,
    initialData: initialCategories,
  });

  const categoryParam = searchParams.get("category");
  const validCategory =
    categories.find((cat) => cat.id === Number(categoryParam)) ?? categories[0];
  const [selectedId, setSelectedId] = useState<number>(validCategory.id);

  const activeCategory =
    categories.find((cat) => cat.id === selectedId) ?? categories[0];

  useEffect(() => {
    const socket = getSocket(role);

    const handleItemAvailability = ({
      id,
      available,
    }: {
      id: number;
      available: boolean;
    }) => {
      queryClient.setQueryData(["menu"], (prev: CategoryWithItems[]) =>
        prev.map((cat) => ({
          ...cat,
          items: cat.items.map((item) =>
            item.id === id ? { ...item, available } : item,
          ),
        })),
      );
    };

    socket.on("menu:item-availability", handleItemAvailability);

    return () => {
      socket.off("menu:item-availability", handleItemAvailability);
    };
  }, [role, queryClient]);

  return (
    <div className="flex relative">
      <CategoryList
        categories={categories}
        selectedId={selectedId}
        role={role}
        onSelect={(id) => {
          setSelectedId(id);
          window.history.replaceState(null, "", `?category=${id}`);
        }}
      />
      <MenuList items={activeCategory?.items} categories={categories} />
      {role === "WAITER" && <CartFloat />}
    </div>
  );
}
