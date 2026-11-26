import "./globals.css";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { siteSettings } from "../data/site-content";
import { headers } from "next/headers";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif"
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans"
});

export const metadata = {
  metadataBase: new URL(siteSettings.siteUrl)
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = (await headers()).get("x-site-locale") ?? "fr";
  return (
    <html lang={locale} className={`${serif.variable} ${sans.variable}`}>
      <body className="bg-linen text-espresso">
        {children}
      </body>
    </html>
  );
}
