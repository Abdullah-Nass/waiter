"use client";

import { Link } from "@/i18n/routing";
import { ChefHat, ShoppingCart, User, UtensilsCrossed } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "cn";
import { useCartStore } from "@/providers/cart-provider";
import { useCartHydrated } from "@/lib/stores/cart";
import { usePageTitle } from "../hooks/use-page-title";
import { NavbarProps } from "@/types/types";
import LanguageSwitcher from "./language-switcher";
import useWaiterSocket from "../hooks/use-waiter-socket";
import { NavLink } from "./nav-link";

export default function NavbarClient({ userName, userRole }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHydrated = useCartHydrated();
  const title = usePageTitle();

  const t = useTranslations();

  useWaiterSocket();

  const totalItems = useCartStore((state) => state.totalItems());

  const activeOrdersCount = isHydrated ? totalItems : 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border shadow-xs h-[64px]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <h1 className="text-xl font-bold text-foreground truncate tracking-tight">
              {title}
            </h1>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground border border-border rounded-full font-medium text-sm">
              <User size={20} strokeWidth={1.4} />

              <span>
                <strong className="font-semibold"> {userName}</strong>
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <NavLink
              href="/menu"
              className="font-semibold leading-none"
              aria-label={t("metadata.menuBtn")}
            >
              <UtensilsCrossed size={20} strokeWidth={1.4} />
              <span>{t("navigation.menu")}</span>
            </NavLink>
            <NavLink
              href="/kitchen"
              className="font-semibold leading-none"
              aria-label={t("metadata.kitchenBtn")}
            >
              <ChefHat size={20} strokeWidth={1.4} />
              <span>{t("navigation.kitchenQueue")}</span>
            </NavLink>
            {userRole === "WAITER" && (
              <NavLink
                href="/checkout"
                className="font-semibold leading-none"
                aria-label={t("metadata.checkoutBtn")}
              >
                <ShoppingCart size={20} strokeWidth={1.4} />
                <span>{t("navigation.orderSummary")}</span>
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-primary-foreground bg-primary rounded-full">
                  {activeOrdersCount}
                </span>
              </NavLink>
            )}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex lg:hidden flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
              aria-label="Toggle menu"
            >
              <span
                className={cn(
                  "block w-6 h-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out",
                  mobileMenuOpen && "translate-y-2 rotate-45",
                )}
              />

              <span
                className={cn(
                  "block w-6 h-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out",
                  mobileMenuOpen ? "opacity-0" : "opacity-100",
                )}
              />

              <span
                className={cn(
                  "block w-6 h-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out",
                  mobileMenuOpen && "-translate-y-2 -rotate-45",
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden border-t border-border bg-background/95 backdrop-blur px-4 pt-3 pb-4 space-y-2.5 shadow-lg animate-in fade-in-0 duration-200">
          <div className="flex items-center justify-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground border border-border rounded-full font-medium text-md">
            <User size={20} strokeWidth={1.4} />

            <span className="font-semibold">{userName}</span>
          </div>
          <NavLink
            className="w-full justify-start"
            href={"/menu"}
            aria-label={t("metadata.menuBtn")}
          >
            <UtensilsCrossed size={20} strokeWidth={1.4} />
            <span>{t("navigation.menu")}</span>
          </NavLink>

          <NavLink
            className="w-full justify-start"
            href="/kitchen"
            aria-label={t("metadata.kitchenBtn")}
          >
            <ChefHat size={20} strokeWidth={1.4} />
            <span>{t("navigation.kitchenQueue")}</span>
          </NavLink>
          {userRole === "WAITER" && (
            <NavLink
              className="w-full justify-start"
              href="/checkout"
              aria-label={t("metadata.checkoutBtn")}
            >
              <ShoppingCart size={20} strokeWidth={1.4} />
              <p className="font-semibold leading-none">
                {t("navigation.orderSummary")}
              </p>
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-primary-foreground bg-primary rounded-full">
                {activeOrdersCount}
              </span>
            </NavLink>
          )}
          <LanguageSwitcher />
        </div>
      )}
    </header>
  );
}
