import ProtectedRoutes from "@/components/common/protected-routes";
import MenuContainer from "@/components/menu/menu-container";
import { redirect } from "@/i18n/routing";
import { db } from "@/lib/prisma/db";

type MenuPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function MenuPage({
  params,
  searchParams,
}: MenuPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
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
    <ProtectedRoutes>
      <MenuContainer initialCategories={categories} />
    </ProtectedRoutes>
  );
}
