import { Cairo } from "next/font/google";
import "../globals.css";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import QueryProvider from "@/providers/query-provider";
import { Toaster } from "react-hot-toast";

const cairoSans = Cairo({
  variable: "--font-cairo-sans",
  subsets: ["latin"],
});

const cairoMono = Cairo({
  variable: "--font-cairo-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  const messages = await getMessages({ locale });
  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${cairoSans.variable} ${cairoMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <Toaster position="top-right" />

            {children}
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
