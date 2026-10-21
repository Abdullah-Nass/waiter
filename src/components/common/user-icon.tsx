import { ChefHat, HandPlatter, ShieldUser } from "lucide-react";

export default function UserIcon({ userRole }: { userRole: string }) {
  if (userRole === "ADMIN") return <ShieldUser size={18} strokeWidth={1.4} />;
  if (userRole === "KITCHEN") return <ChefHat size={18} strokeWidth={1.4} />;

  return <HandPlatter size={18} strokeWidth={1.4} />;
}
