// src/providers/cart-provider.tsx
"use client";

import { createCartStore } from "@/lib/stores/cart";
import type { CartStore } from "@/lib/stores/cart";
import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";

type CartStoreApi = ReturnType<typeof createCartStore>;

const CartStoreContext = createContext<CartStoreApi | undefined>(undefined);

interface CartProviderProps {
  waiterId: string;
  children: ReactNode;
}

export function CartProvider({ waiterId, children }: CartProviderProps) {
  const [store] = useState<CartStoreApi>(() => createCartStore(waiterId));

  return (
    <CartStoreContext.Provider value={store}>
      {children}
    </CartStoreContext.Provider>
  );
}

export function useCartStore<T>(selector: (store: CartStore) => T): T {
  const store = useContext(CartStoreContext);
  if (!store) {
    throw new Error("useCartStore must be used within CartProvider");
  }
  return useStore(store, selector);
}
