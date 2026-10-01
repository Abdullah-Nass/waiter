import { ChefHat, HandPlatter, ShieldUser } from "lucide-react";

export default function UserIcon({ userRole }: { userRole: string }) {
  if (userRole === "ADMIN") return <ShieldUser size={20} strokeWidth={1.4} />;
  if (userRole === "KITCHEN") return <ChefHat size={20} strokeWidth={1.4} />;

  return <HandPlatter size={20} strokeWidth={1.4} />;
}
