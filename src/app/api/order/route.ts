import { getOrders } from "@/lib/actions/kitchen";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await getOrders();
  if (!res.success)
    return NextResponse.json({ error: res.error }, { status: 500 });
  return NextResponse.json(res.data);
}
