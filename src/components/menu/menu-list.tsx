"use client";

import type { Category, MenuItem } from "@prisma/client";
import { useState } from "react";
import { ItemDrawer } from "./item-drawer";
import WaiterDrawer from "./waiter-drawer";
import AdminDrawer from "./admin-drawer";
import KitchenDrawer from "./kitchen-drawer";
import Item from "./item";
import AddItemModal from "./add-item-modal";

export default function MenuList({
  items,
  categories,
  role,
}: {
  items: MenuItem[];
  categories: Category[];
  role: string;
}) {
  const [selectedItem, setSelectedItem] = useState<(typeof items)[0] | null>(
    null,
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };
  console.log({
    role,
    items,
    itemsLength: items?.length,
  });
  return (
    <div className="container max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
      <div className="grid sm:flex flex-wrap gap-2">
        {role === "ADMIN" && <AddItemModal categories={categories} />}
        {items.length < 1 && role !== "ADMIN" ? (
          <div>No Items</div>
        ) : (
          items.map((item) => (
            <Item
              key={item.id}
              handleSelectItem={handleSelectItem}
              item={item}
              role={role}
            />
          ))
        )}
      </div>
      <ItemDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        {role === "WAITER" ? (
          <WaiterDrawer item={selectedItem} onOpenChange={setIsDrawerOpen} />
        ) : role === "ADMIN" ? (
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
