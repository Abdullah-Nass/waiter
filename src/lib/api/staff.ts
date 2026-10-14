import { User } from "@prisma/client";

export async function fetchStaff(): Promise<User[]> {
  const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseURL}/api/staff`, {
    next: { revalidate: 300 } // Revalidate every 5 minutes
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch staff: ${res.status}`);
  }

  return res.json();
}
