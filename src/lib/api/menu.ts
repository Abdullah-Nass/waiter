import { Category, MenuItem } from "@prisma/client";
import axios from "axios";
export type CategoryWithItems = Category & { items: MenuItem[] };
export async function fetchMenu(): Promise<CategoryWithItems[]> {
  const { data } = await axios.get<CategoryWithItems[]>("/api/menu");
  return data;
}
