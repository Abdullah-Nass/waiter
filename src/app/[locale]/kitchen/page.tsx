import ProtectedRoutes from "@/components/common/protected-routes";
import KitchenContainer from "@/components/kitchen/kitchen-container";
import { db } from "@/lib/prisma/db";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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

export default async function kitchen() {
  const orders = await db.order.findMany({
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
  });
  return (
    <ProtectedRoutes>
      <KitchenContainer orders={orders} />
    </ProtectedRoutes>
  );
}
