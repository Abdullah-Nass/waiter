import MenuContainer from "@/components/menu/menu-container";
import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma/db";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

type MenuPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("menu.title"),
    description: t("menu.description"),
  };
}

export default async function MenuPage({
  params,
  searchParams,
}: MenuPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });

  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      items: {
        orderBy: { id: "asc" },
      },
    },
  });

  if (!resolvedSearchParams.category && categories.length > 0) {
    redirect({
      href: {
        pathname: "/menu",
        query: { category: categories[0].id.toString() },
      },
      locale,
    });
  }

  return (
    <MenuContainer initialCategories={categories} role={session!.user.role} />
  );
}
