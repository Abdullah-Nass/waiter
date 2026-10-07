import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { ROLE_HOME } from "@/lib/permissions";
import { headers } from "next/headers";

export default async function page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { locale } = await params;

  if (session) {
    redirect({
      href: { pathname: ROLE_HOME[session.user.role] },
      locale,
    });
  }
}
