"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import UserIcon from "./user-icon";
import { NavbarProps } from "@/types/types";
import LanguageSwitcher from "./language-switcher";
import Logout from "../auth/logout";
//  className="text-xl font-bold text-foreground truncate tracking-tight"
export default function Dropdown({ userName, userRole }: NavbarProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="flex items-center gap-2 text-sm rounded-md outline-none hover:opacity-80 transition-opacity">
        <UserIcon userRole={userRole} />
        <span>{userName}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <LanguageSwitcher />
        <DropdownMenuSeparator />
        <Logout />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
