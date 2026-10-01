"use client";

import {
  ChefHat,
  ClipboardList,
  IdCard,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "cn";
import { useCartStore } from "@/providers/cart-provider";
import { useCartHydrated } from "@/lib/stores/cart";
import { usePageTitle } from "../hooks/use-page-title";
import { NavbarProps } from "@/types/types";
import LanguageSwitcher from "./language-switcher";
import useWaiterSocket from "../hooks/use-waiter-socket";
import { NavLink } from "./nav-link";
import UserIcon from "./user-icon";

export default function Navbar({ userName, userRole }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHydrated = useCartHydrated();
  const title = usePageTitle();

  const hasNotification = useCartStore((state) => state.hasNotification);

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
              <UserIcon userRole={userRole} />

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
            {userRole === "ADMIN" && (
              <NavLink
                href="/staff"
                className="font-semibold leading-none"
                aria-label={t("metadata.staffBtn")}
              >
                <IdCard size={20} strokeWidth={1.4} />
                <span>{t("navigation.staff")}</span>
              </NavLink>
            )}
            {userRole !== "WAITER" && (
              <NavLink
                href="/kitchen"
                className="font-semibold leading-none"
                aria-label={t("metadata.kitchenBtn")}
              >
                <ChefHat size={20} strokeWidth={1.4} />
                <span>{t("navigation.kitchenQueue")}</span>
              </NavLink>
            )}
            {userRole === "WAITER" && (
              <>
                <NavLink
                  href="/my-orders"
                  className="inline-flex items-center gap-2 font-semibold leading-none"
                  aria-label={t("metadata.checkoutBtn")}
                >
                  <span className="relative inline-flex items-center justify-center">
                    <ClipboardList size={20} strokeWidth={1.4} />

                    {hasNotification && (
                      <span className="absolute -top-1 -end-1 flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-white" />
                      </span>
                    )}
                  </span>

                  <span>{t("navigation.myOrders")}</span>
                </NavLink>
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
              </>
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
        <div className="absolute flex flex-col top-full left-0 right-0 md:hidden border-t border-border bg-background/95 backdrop-blur px-4 pt-3 pb-4 gap-2.5 shadow-lg animate-in fade-in-0 duration-200">
          <div className="flex items-center justify-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground border border-border rounded-full font-medium text-md">
            <UserIcon userRole={userRole} />

            <span className="font-semibold">{userName}</span>
          </div>
          <NavLink
            className="w-full justify-start font-semibold leading-none"
            href={"/menu"}
            aria-label={t("metadata.menuBtn")}
          >
            <UtensilsCrossed size={20} strokeWidth={1.4} />
            <span>{t("navigation.menu")}</span>
          </NavLink>
          {userRole === "ADMIN" && (
            <NavLink
              className="w-full justify-start font-semibold leading-none"
              href={"/staff"}
              aria-label={t("metadata.staffBtn")}
            >
              <IdCard size={20} strokeWidth={1.4} />
              <span>{t("navigation.staff")}</span>
            </NavLink>
          )}
          {userRole !== "WAITER" && (
            <NavLink
              className="w-full justify-start font-semibold leading-none"
              href="/kitchen"
              aria-label={t("metadata.kitchenBtn")}
            >
              <ChefHat size={20} strokeWidth={1.4} />
              <span>{t("navigation.kitchenQueue")}</span>
            </NavLink>
          )}
          {userRole === "WAITER" && (
            <>
              <NavLink
                href="/my-orders"
                className="w-full justify-start font-semibold leading-none"
                aria-label={t("metadata.checkoutBtn")}
              >
                <ClipboardList size={20} strokeWidth={1.4} />
                <span>{t("navigation.myOrders")}</span>
              </NavLink>
              <NavLink
                className="w-full justify-start font-semibold leading-none"
                href="/checkout"
                aria-label={t("metadata.checkoutBtn")}
              >
                <ShoppingCart size={20} strokeWidth={1.4} />
                <p>{t("navigation.orderSummary")}</p>
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-primary-foreground bg-primary rounded-full">
                  {activeOrdersCount}
                </span>
              </NavLink>
            </>
          )}
          <div className="self-end">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
