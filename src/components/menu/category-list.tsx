"use client";

import { Link } from "@/i18n/routing";
import { Category } from "@prisma/client";
import { cn } from "cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "../ui/button";
import AddCategoryModal from "./add-category-modal";
import DeleteCategoryModal from "./delete-category-modal";

type categoryListProps = {
  categories: Category[];
  selectedId: number;
  role: string | undefined;
  onSelect: (id: number) => void;
};
export default function CategoryList({
  categories,
  selectedId,
  role,
  onSelect,
}: categoryListProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(true);
  const locale = useLocale();
  const isRtl = locale === "ar";
  return (
    <aside
      className={cn(
        "sticky top-[64px] h-[calc(100vh-64px)] z-30 transition-[margin] duration-300 ease-in-out select-none",
        !isOpen && (isRtl ? "-mr-64" : "-ml-64"),
      )}
    >
      {/* Hanging Button attached to the outer edge */}
      <Button
        type="button"
        variant={"outline"}
        size={"icon"}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={
          isOpen ? t("metadata.menuButtonOpen") : t("metadata.menuButtonClosed")
        }
        className={cn(
          "absolute top-6 z-40 flex h-9 w-9 items-center justify-center",
          isRtl ? "-left-9 rounded-r-none" : "-right-9 rounded-l-none",
        )}
      >
        {isOpen ? (
          isRtl ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )
        ) : isRtl ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      {/* Sidebar Content */}
      <div className="w-64 h-full border-e border-border/50 bg-card p-3 shadow-sm overflow-y-auto">
        <div className="mb-2 px-3 py-2">
          <h2 className="text-md font-semibold uppercase tracking-wider text-muted-foreground">
            {t ? t("navigation.categories") : "Categories"}
          </h2>
        </div>

        <nav className="flex flex-col gap-1.5" aria-label="Categories">
          {categories.map((category) => {
            const isSelected = selectedId === category.id;
            return (
              <div
                key={category.id}
                className={cn(
                  "group flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-base font-medium transition-all duration-200",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground",
                )}
              >
                <Link
                  href={{
                    pathname: "/menu",
                    query: { category: category.id },
                  }}
                  prefetch={true}
                  scroll={false}
                  onClick={() => onSelect(category.id)}
                  className="flex-1 truncate px-2 py-1.5"
                >
                  <span className="truncate">
                    {locale === "en" ? category.nameEn : category.nameAr}
                  </span>
                </Link>
                {role === "ADMIN" && (
                  <DeleteCategoryModal category={category} />
                )}
              </div>
            );
          })}
          {role === "ADMIN" && <AddCategoryModal />}
        </nav>
      </div>
    </aside>
  );
}
