import NavbarClient from "./navbar-client";
import { NavbarProps } from "@/types/types";

export default async function Navbar({ userName, userRole }: NavbarProps) {
  return <NavbarClient userName={userName} userRole={userRole} />;
}
