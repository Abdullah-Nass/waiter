"use client";

import { Direction } from "radix-ui";
import type { ReactNode } from "react";

/**
 * Radix primitives do not read the `dir` attribute from the DOM.
 * They resolve their direction from `DirectionProvider` and fall back to "ltr",
 * then explicitly write that value onto the rendered content.
 * Without this provider the portal content (menus, selects, popovers) stays LTR
 * even when the document is `dir="rtl"`.
 */
export default function DirectionProvider({
  dir,
  children,
}: {
  dir: "ltr" | "rtl";
  children: ReactNode;
}) {
  return <Direction.Provider dir={dir}>{children}</Direction.Provider>;
}
