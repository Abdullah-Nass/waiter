import CheckoutContainer from "@/components/checkout/checkout-container";
import ProtectedRoutes from "@/components/common/protected-routes";
import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { ROLE_HOME } from "@/lib/permissions";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { headers } from "next/headers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("checkout.title"),
    description: t("menu.description"),
  };
}

export default async function checkout() {
  const session = await auth.api.getSession({ headers: await headers() });
  const locale = await getLocale();
  if (session?.user.role !== "WAITER") {
    redirect({
      href: {
        pathname: ROLE_HOME[session?.user.role || "KITCHEN"],
      },
      locale: locale,
    });
    return;
  }
  return <CheckoutContainer waiterId={session?.user.id} />;
}
