import OrdersContainer from "@/components/common/orders-container";
import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma/db";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("kitchen.title"),
    description: t("kitchen.description"),
  };
}

export default async function kitchen({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { locale } = await params;

  if (session?.user.role === "WAITER") {
    redirect({
      href: {
        pathname: "/my-orders",
      },
      locale: locale,
    });
    return;
  }
  const orders = await db.order.findMany({
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
  });

  return <OrdersContainer orders={orders} role={session?.user.role} />;
}
