import { getMenu } from "@/lib/actions/menu-items";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await getMenu();
  if (!res.success)
    return NextResponse.json({ error: res.error }, { status: 500 });
  return NextResponse.json(res.data);
}
