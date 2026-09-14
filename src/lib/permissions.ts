export const ROLE_HOME: Record<string, string> = {
  ADMIN: "/admin",
  WAITER: "/pos",
  KITCHEN: "/kitchen",
};

export const ROLE_ALLOWED_PREFIXES: Record<string, string[]> = {
  ADMIN: ["/admin", "/pos", "/kitchen"],
  WAITER: ["/pos"],
  KITCHEN: ["/kitchen"],
};
