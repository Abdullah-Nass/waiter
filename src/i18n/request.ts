import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  const targetLocale =
    locale &&
    routing.locales.includes(locale as (typeof routing.locales)[number])
      ? locale
      : routing.defaultLocale;

  return {
    locale: targetLocale,
    messages: (await import(`../../messages/${targetLocale}.json`)).default,
  };
});
