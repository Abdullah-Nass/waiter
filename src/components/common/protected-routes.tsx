import { auth } from "@/lib/auth";
import Navbar from "./navbar";
import { headers } from "next/headers";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import { CartProvider } from "@/providers/cart-provider";

export default async function ProtectedRoutes({
  ...props
}: React.ComponentProps<"div">) {
  const locale = await getLocale();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect({
      href: {
        pathname: "/login",
      },
      locale: locale,
    });
    return;
  }
  return (
    <CartProvider waiterId={session.user.id}>
      <Navbar />
      <div {...props} />
    </CartProvider>
  );
}
