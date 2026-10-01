import ProtectedRoutes from "@/components/common/protected-routes";
import StaffContaienr from "@/components/staff/staff-container";
import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { ROLE_HOME } from "@/lib/permissions";
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
    title: t("myOrders.title"),
    description: t("myOrders.description"),
  };
}

export default async function staff({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { locale } = await params;

  if (session?.user.role !== "ADMIN") {
    redirect({
      href: {
        pathname: ROLE_HOME[session?.user.role || "WAITER"],
      },
      locale: locale,
    });
    return;
  }
  const staffMembers = await db.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <StaffContaienr staffMembers={staffMembers} />;
}
