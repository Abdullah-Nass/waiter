import { CartItem } from "@/types/types";
import { useSyncExternalStore } from "react";
import { createStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartState = {
  items: CartItem[];
};

export type CartActions = {
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
};

export type CartStore = CartState & CartActions;

export const defaultInitState: CartState = {
  items: [],
};

export const createCartStore = (
  waiterId: string,
  initState: CartState = defaultInitState,
) =>
  createStore<CartStore>()(
    persist(
      (set, get) => ({
        ...initState,

        addItem: (item) =>
          set((state) => {
            const existing = state.items.find((i) => i.id === item.id);
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.id === item.id
                    ? {
                        ...i,
                        quantity: i.quantity + item.quantity,
                      }
                    : i,
                ),
              };
            }
            return { items: [...state.items, item] };
          }),

        removeItem: (menuItemId) =>
          set((state) => ({
            items: state.items.filter((i) => i.id !== menuItemId),
          })),

        updateQuantity: (menuItemId, quantity) =>
          set((state) => ({
            items:
              quantity <= 0
                ? state.items.filter((i) => i.id !== menuItemId)
                : state.items.map((i) =>
                    i.id === menuItemId ? { ...i, quantity } : i,
                  ),
          })),

        clearCart: () => set({ items: [] }),

        totalPrice: () =>
          get().items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          ),

        totalItems: () =>
          get().items.reduce((sum, item) => sum + item.quantity, 0),
      }),
      {
        name: `waiter_cart_${waiterId}`,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ items: state.items }),
      },
    ),
  );

// No-op subscribe function for useSyncExternalStore
const emptySubscribe = () => () => {};

/**
 * Idiomatic, linter-compliant hydration hook using useSyncExternalStore.
 * Returns false on SSR, true on Client.
 */
export function useCartHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // Client snapshot
    () => false, // Server snapshot
  );
}
