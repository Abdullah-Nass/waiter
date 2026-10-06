import { describe, it, expect, beforeEach } from "vitest";
import { CartItem } from "@/types/types";
import { createCartStore } from "@/lib/stores/cart";

// MOCKS

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

const hummus: CartItem = {
  id: 1,
  nameEn: "Hummus",
  nameAr: "حمص",
  price: 3.5,
  quantity: 1,
};

const fattoush: CartItem = {
  id: 2,
  nameEn: "Fattoush",
  nameAr: "فتوش",
  price: 4.0,
  quantity: 1,
};

function makeStore() {
  return createCartStore("test-waiter-id");
}

// TESTS

describe("cart store", () => {
  let store: ReturnType<typeof makeStore>;

  beforeEach(() => {
    localStorageMock.clear();
    store = makeStore();
  });

  // addItem
  describe("addItem", () => {
    it("adds a new item to an empty cart", () => {
      store.getState().addItem(hummus);
      expect(store.getState().items).toHaveLength(1);
      expect(store.getState().items[0].id).toBe(1);
    });

    it("increments quantity when adding an existing item", () => {
      store.getState().addItem(hummus);
      store.getState().addItem({ ...hummus, quantity: 2 });
      const items = store.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(3);
    });

    it("adds a second distinct item", () => {
      store.getState().addItem(hummus);
      store.getState().addItem(fattoush);
      expect(store.getState().items).toHaveLength(2);
    });
  });

  // removeItem
  describe("removeItem", () => {
    it("removes an item by id", () => {
      store.getState().addItem(hummus);
      store.getState().addItem(fattoush);
      store.getState().removeItem(1);
      expect(store.getState().items).toHaveLength(1);
      expect(store.getState().items[0].id).toBe(2);
    });

    it("does nothing when item does not exist", () => {
      store.getState().addItem(hummus);
      store.getState().removeItem(99);
      expect(store.getState().items).toHaveLength(1);
    });
  });

  // updateQuantity
  describe("updateQuantity", () => {
    it("updates quantity of an existing item", () => {
      store.getState().addItem(hummus);
      store.getState().updateQuantity(1, 5);
      expect(store.getState().items[0].quantity).toBe(5);
    });

    it("removes item when quantity is set to 0", () => {
      store.getState().addItem(hummus);
      store.getState().updateQuantity(1, 0);
      expect(store.getState().items).toHaveLength(0);
    });

    it("removes item when quantity is negative", () => {
      store.getState().addItem(hummus);
      store.getState().updateQuantity(1, -1);
      expect(store.getState().items).toHaveLength(0);
    });
  });

  // clearCart
  describe("clearCart", () => {
    it("removes all items", () => {
      store.getState().addItem(hummus);
      store.getState().addItem(fattoush);
      store.getState().clearCart();
      expect(store.getState().items).toHaveLength(0);
    });

    it("does nothing on an already empty cart", () => {
      store.getState().clearCart();
      expect(store.getState().items).toHaveLength(0);
    });
  });

  // totalPrice
  describe("totalPrice", () => {
    it("returns 0 for an empty cart", () => {
      expect(store.getState().totalPrice()).toBe(0);
    });

    it("calculates total correctly for one item", () => {
      store.getState().addItem({ ...hummus, quantity: 2 });
      expect(store.getState().totalPrice()).toBe(7.0);
    });

    it("calculates total correctly for multiple items", () => {
      store.getState().addItem({ ...hummus, quantity: 2 }); // 7.0
      store.getState().addItem({ ...fattoush, quantity: 3 }); // 12.0
      expect(store.getState().totalPrice()).toBe(19.0);
    });
  });

  // totalItems
  describe("totalItems", () => {
    it("returns 0 for an empty cart", () => {
      expect(store.getState().totalItems()).toBe(0);
    });

    it("counts quantities across all items", () => {
      store.getState().addItem({ ...hummus, quantity: 2 });
      store.getState().addItem({ ...fattoush, quantity: 3 });
      expect(store.getState().totalItems()).toBe(5);
    });
  });

  // setNotification
  describe("setNotification", () => {
    it("sets hasNotification to true", () => {
      store.getState().setNotification(true);
      expect(store.getState().hasNotification).toBe(true);
    });

    it("sets hasNotification back to false", () => {
      store.getState().setNotification(true);
      store.getState().setNotification(false);
      expect(store.getState().hasNotification).toBe(false);
    });
  });

  // store isolation
  describe("store isolation", () => {
    it("two stores with different waiter IDs do not share state", () => {
      const storeA = createCartStore("waiter-a");
      const storeB = createCartStore("waiter-b");
      storeA.getState().addItem(hummus);
      expect(storeB.getState().items).toHaveLength(0);
    });
  });
});
