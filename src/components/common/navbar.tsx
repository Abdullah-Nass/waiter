import { auth } from "@/lib/auth";
import NavbarClient from "./navbar-client";
import { headers } from "next/headers";

export default async function Navbar() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <NavbarClient userName={session?.user.name} userRole={session?.user.role} />
  );
}
