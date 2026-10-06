import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { MenuItem } from "@prisma/client";
import Item from "@/components/menu/item";

// MOCKS

vi.mock("next-intl", () => ({
  useLocale: vi.fn(() => "en"),
  useTranslations: vi.fn(() => (key: string) => {
    const map: Record<string, string> = {
      "orders.outOfStock": "Out of stock",
    };
    return map[key] ?? key;
  }),
}));

vi.mock("@/components/menu/delete-item-modal", () => ({
  default: () => <div data-testid="delete-modal" />,
}));

vi.mock("cn", () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(" "),
}));

const availableItem: MenuItem = {
  id: 1,
  nameEn: "Hummus",
  nameAr: "حمص",
  descEn: "Creamy chickpea dip",
  descAr: "حمص كريمي",
  price: 3.5,
  available: true,
  image: null,
  categoryId: 1,
};

const unavailableItem: MenuItem = {
  ...availableItem,
  id: 2,
  available: false,
};

// TESTS

describe("Item component", () => {
  const handleSelectItem = vi.fn();

  beforeEach(() => {
    handleSelectItem.mockClear();
  });

  // English rendering
  describe("English locale", () => {
    it("renders English name", () => {
      render(<Item item={availableItem} handleSelectItem={handleSelectItem} />);
      expect(screen.getByText("Hummus")).toBeInTheDocument();
    });

    it("renders English description", () => {
      render(<Item item={availableItem} handleSelectItem={handleSelectItem} />);
      expect(screen.getByText("Creamy chickpea dip")).toBeInTheDocument();
    });

    it("renders price correctly", () => {
      render(<Item item={availableItem} handleSelectItem={handleSelectItem} />);
      expect(screen.getByText("$3.50")).toBeInTheDocument();
    });
  });

  // Arabic locale
  describe("Arabic locale", () => {
    beforeEach(async () => {
      const { useLocale } = vi.mocked(await import("next-intl"));
      useLocale.mockReturnValue("ar");
    });

    afterEach(async () => {
      const { useLocale } = vi.mocked(await import("next-intl"));
      useLocale.mockReturnValue("en");
    });

    it("renders Arabic name", () => {
      render(<Item item={availableItem} handleSelectItem={handleSelectItem} />);
      expect(screen.getByText("حمص")).toBeInTheDocument();
    });

    it("renders Arabic description", () => {
      render(<Item item={availableItem} handleSelectItem={handleSelectItem} />);
      expect(screen.getByText("حمص كريمي")).toBeInTheDocument();
    });
  });

  // Availability
  describe("availability", () => {
    it("calls handleSelectItem when available item is clicked as WAITER", () => {
      render(
        <Item
          item={availableItem}
          handleSelectItem={handleSelectItem}
          role="WAITER"
        />,
      );
      fireEvent.click(screen.getByText("Hummus"));
      expect(handleSelectItem).toHaveBeenCalledWith(availableItem);
    });

    it("does not call handleSelectItem when unavailable item is clicked as WAITER", () => {
      render(
        <Item
          item={unavailableItem}
          handleSelectItem={handleSelectItem}
          role="WAITER"
        />,
      );
      fireEvent.click(screen.getByText("Hummus"));
      expect(handleSelectItem).not.toHaveBeenCalled();
    });

    it("calls handleSelectItem when unavailable item is clicked as ADMIN", () => {
      render(
        <Item
          item={unavailableItem}
          handleSelectItem={handleSelectItem}
          role="ADMIN"
        />,
      );
      fireEvent.click(screen.getByText("Hummus"));
      expect(handleSelectItem).toHaveBeenCalledWith(unavailableItem);
    });

    it("shows out of stock badge when item is unavailable", () => {
      render(
        <Item item={unavailableItem} handleSelectItem={handleSelectItem} />,
      );
      expect(screen.getByText("Out of stock")).toBeInTheDocument();
    });

    it("does not show out of stock badge when item is available", () => {
      render(<Item item={availableItem} handleSelectItem={handleSelectItem} />);
      expect(screen.queryByText("Out of stock")).not.toBeInTheDocument();
    });
  });

  // Role-based rendering
  describe("role-based rendering", () => {
    it("shows delete modal for ADMIN", () => {
      render(
        <Item
          item={availableItem}
          handleSelectItem={handleSelectItem}
          role="ADMIN"
        />,
      );
      expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    });

    it("does not show delete modal for WAITER", () => {
      render(
        <Item
          item={availableItem}
          handleSelectItem={handleSelectItem}
          role="WAITER"
        />,
      );
      expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
    });

    it("does not show delete modal for KITCHEN", () => {
      render(
        <Item
          item={availableItem}
          handleSelectItem={handleSelectItem}
          role="KITCHEN"
        />,
      );
      expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
    });
  });
});
