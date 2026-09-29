import { OrderWithMenuItems } from "@/types/types";
import axios from "axios";

export async function fetchOrders(): Promise<OrderWithMenuItems[]> {
  const { data } = await axios.get<OrderWithMenuItems[]>("/api/order");
  return data;
}
