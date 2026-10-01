import { User } from "@prisma/client";
import axios from "axios";

export async function fetchStaff(): Promise<User[]> {
  const { data } = await axios.get<User[]>("/api/staff");
  return data;
}
