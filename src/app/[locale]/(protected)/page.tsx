import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { ROLE_HOME } from "@/lib/permissions";
import { getLocale } from "next-intl/server";
import { headers } from "next/headers";

export default async function page() {
  const session = await auth.api.getSession({ headers: await headers() });
  const locale = await getLocale();

  if (session) {
    redirect({
      href: { pathname: ROLE_HOME[session.user.role] },
      locale,
    });
  }
}
