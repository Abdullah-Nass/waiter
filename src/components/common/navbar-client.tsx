"use client";
import { Link } from "@/i18n/routing";
import { ChefHat, ShoppingCart, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "cn";

interface NavbarProps {
  pageTitle: string;
  userName?: string;
  userRole?: string;
  activeOrdersCount?: number;
}

export default function NavbarClient({
  pageTitle = "Menu",
  userName = "User",
  userRole = "Waiter",
  activeOrdersCount = 12,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations();
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <h1 className="text-xl font-bold text-foreground truncate tracking-tight">
              {pageTitle}
            </h1>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground border border-border rounded-full font-medium text-sm">
              <User size={20} strokeWidth={1.4} />

              <span>
                <strong className="font-semibold"> {userName}</strong>
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant={"outline"}
              type="button"
              size={"lg"}
              className="flex items-center gap-2.5"
              asChild
            >
              <Link href={{ pathname: "/kitchen" }}>
                <ChefHat size={20} strokeWidth={1.4} />
                <span>{t("navigation.kitchenQueue")}</span>
              </Link>
            </Button>
            {userRole === "WAITER" && (
              <Button
                variant={"outline"}
                type="button"
                size={"lg"}
                className="flex items-center gap-2.5"
                asChild
              >
                <Link href={{ pathname: "/checkout" }}>
                  <ShoppingCart size={20} strokeWidth={1.4} />
                  <p className="font-semibold text-muted-foreground  leading-none">
                    {t("navigation.orderSummary")}
                  </p>
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-primary-foreground bg-primary rounded-full">
                    {activeOrdersCount}
                  </span>
                </Link>
              </Button>
            )}
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
          <Button
            variant={"outline"}
            size={"lg"}
            className="w-full justify-start p-2.5"
            asChild
          >
            <Link
              href={{ pathname: "/kitchen" }}
              className="flex items-center gap-2"
            >
              <ChefHat size={20} strokeWidth={1.4} />
              <span>{t("navigation.kitchenQueue")}</span>
            </Link>
          </Button>
          {userRole === "WAITER" && (
            <Button
              variant={"outline"}
              type="button"
              size={"lg"}
              className="flex justify-between w-full p-2.5"
              asChild
            >
              <Link href={{ pathname: "/checkout" }}>
                <span className="flex items-center gap-2">
                  <ShoppingCart size={20} strokeWidth={1.4} />
                  <p className="font-semibold text-muted-foreground  leading-none">
                    {t("navigation.orderSummary")}
                  </p>
                </span>
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-primary-foreground bg-primary rounded-full">
                  {activeOrdersCount}
                </span>
              </Link>
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
