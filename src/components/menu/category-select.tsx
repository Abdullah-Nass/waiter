"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

interface CategorySelectProps {
  categories: Category[];
  value?: number;
  onChange: (value: number | undefined) => void;
  placeholder: string;
  disabled?: boolean;
  hasError?: boolean;
}

export function CategorySelect({
  categories,
  value,
  onChange,
  disabled = false,
  placeholder,
  hasError = false,
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedCategory = categories.find((c) => c.id === value);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          "flex h-8 w-full items-center justify-between rounded-md border bg-background px-3 py-1 text-sm shadow-xs transition-colors",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          hasError
            ? "border-destructive text-destructive"
            : "border-input text-foreground",
          !selectedCategory && "text-muted-foreground",
        )}
      >
        <span className="truncate">
          {selectedCategory ? (
            <span className="flex items-center gap-2">
              <span className="font-medium text-foreground">
                {selectedCategory.nameEn}
              </span>
              <span className="text-xs text-muted-foreground">/</span>
              <span className="text-xs text-muted-foreground" dir="rtl">
                {selectedCategory.nameAr}
              </span>
            </span>
          ) : (
            placeholder
          )}
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          <ul role="listbox" className="space-y-0.5">
            {categories.map((cat) => {
              const isSelected = cat.id === value;
              return (
                <li
                  key={cat.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(cat.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center justify-between rounded-sm px-2.5 py-1.5 text-sm outline-none transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isSelected &&
                      "bg-accent/60 font-medium text-accent-foreground",
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{cat.nameEn}</span>
                    <span className="text-xs text-muted-foreground">
                      ({cat.nameAr})
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
