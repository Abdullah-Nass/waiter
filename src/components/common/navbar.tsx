import { auth } from "@/lib/auth";
import NavbarClient from "./navbar-client";
import { db } from "@/lib/prisma/db";
import { headers } from "next/headers";

interface NavbarProps {
  pageTitle?: string;
  waiterName?: string;
  queueCount?: number;
  activeOrdersCount?: number;
  revenueSummary?: string; // e.g. "$1,240.00"
}

export default async function Navbar() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <NavbarClient userName={session?.user.name} userRole={session?.user.role} />
  );
}
