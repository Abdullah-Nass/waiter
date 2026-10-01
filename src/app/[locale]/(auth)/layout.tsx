import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import { ROLE_HOME } from "@/lib/permissions";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect({
      href: { pathname: ROLE_HOME[session.user.role] },
      locale,
    });
    return null;
  }

  return <main>{children}</main>;
}
