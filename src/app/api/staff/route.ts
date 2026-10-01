import { getStaff } from "@/lib/actions/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await getStaff();
  if (!res.success)
    return NextResponse.json({ error: res.error }, { status: 500 });
  return NextResponse.json(res.data);
}
