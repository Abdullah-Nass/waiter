// app/[locale]/(protected)/layout.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import { CartProvider } from "@/providers/cart-provider";
import Navbar from "@/components/common/navbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect({
      href: { pathname: "/login" },
      locale,
    });
    return null;
  }

  return (
    <CartProvider waiterId={session.user.id}>
      <Navbar userName={session.user.name} userRole={session.user.role} />
      <main>{children}</main>
    </CartProvider>
  );
}
