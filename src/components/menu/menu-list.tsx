"use client";

import type { Category, MenuItem } from "@prisma/client";
import { useState } from "react";
import { ItemDrawer } from "./item-drawer";
import WaiterDrawer from "./waiter-drawer";
import AdminDrawer from "./admin-drawer";
import KitchenDrawer from "./kitchen-drawer";
import Item from "./item";
import { authClient } from "@/lib/auth-client";
import AddItemModal from "./add-item-modal";

export default function MenuList({
  items,
  categories,
}: {
  items: MenuItem[];
  categories: Category[];
}) {
  const [selectedItem, setSelectedItem] = useState<(typeof items)[0] | null>(
    null,
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };
  const { data: session } = authClient.useSession();

  return (
    <div className="container max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
      <div className="grid sm:flex flex-wrap gap-2">
        {session?.user.role === "ADMIN" && (
          <AddItemModal categories={categories} />
        )}
        {items.length < 1 && session?.user.role !== "ADMIN" ? (
          <div>No Items</div>
        ) : (
          items.map((item) => (
            <Item
              key={item.id}
              handleSelectItem={handleSelectItem}
              item={item}
              role={session?.user.role}
            />
          ))
        )}
      </div>
      <ItemDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        {session?.user.role === "WAITER" ? (
          <WaiterDrawer item={selectedItem} onOpenChange={setIsDrawerOpen} />
        ) : session?.user.role === "ADMIN" ? (
          <AdminDrawer
            item={selectedItem}
            onSuccess={() => setIsDrawerOpen((open) => !open)}
          />
        ) : (
          <KitchenDrawer item={selectedItem} />
        )}
      </ItemDrawer>
    </div>
  );
}
