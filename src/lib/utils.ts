export { cn } from "cn";

export const getRoleVariant = (
  role: string,
): "destructive" | "secondary" | "outline" => {
  switch (role) {
    case "ADMIN":
      return "destructive";
    case "KITCHEN":
      return "secondary";
    default:
      return "outline";
  }
};
