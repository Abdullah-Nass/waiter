"use client";

import type { ComponentProps, ReactNode } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/routing";

// Extract props directly from next-intl's Link
type BaseLinkProps = ComponentProps<typeof Link>;

interface NavLinkProps extends BaseLinkProps {
  children: ReactNode;
  className?: string;
  activeClassName?: string;
}

export function NavLink({ href, children, className, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const targetHref = href.toString();

  const isActive =
    pathname === targetHref || pathname.startsWith(`${targetHref}/`);

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="lg"
      asChild
      className={cn("flex items-center gap-2.5", className)}
    >
      <Link href={href} aria-current={isActive ? "page" : undefined} {...props}>
        {children}
      </Link>
    </Button>
  );
}
