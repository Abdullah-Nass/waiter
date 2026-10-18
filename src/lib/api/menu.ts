import { Category, MenuItem } from "@prisma/client";
export type CategoryWithItems = Category & { items: MenuItem[] };

export async function fetchMenu(): Promise<CategoryWithItems[]> {
  const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseURL}/api/menu`);

  if (!res.ok) {
    throw new Error(`Failed to fetch menu: ${res.status}`);
  }

  return res.json();
}
