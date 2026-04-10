import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { Locale } from "../data/site-content";

export default function Header({
  locale,
  navigation,
  reservationUrl
}: {
  locale: Locale;
  navigation: { label: string; href: string }[];
  reservationUrl: string;
}) {
  return (
    <header className="sticky top-0 z-40 bg-linen/95 backdrop-blur border-b border-latte">
      <div className="container py-[1.35rem]">
        <div className="flex items-center justify-between gap-6">
          <Link href={`/${locale}`} className="text-[1.4rem] font-serif tracking-wide">
            The French Café
            <span className="block text-xs uppercase tracking-[0.3em] text-cafe">Kuusamo</span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLocale={locale} />
            <a
              href={reservationUrl}
              className="hidden sm:inline-flex items-center justify-center rounded-full bg-espresso px-5 py-2 text-[0.7rem] uppercase tracking-[0.24em] text-cream shadow-soft hover:bg-espresso/90 transition"
            >
              {locale === "fr" ? "Réserver" : locale === "en" ? "Reserve" : "Varaa"}
            </a>
          </div>
        </div>

        <nav className="mt-5 hidden lg:flex flex-wrap gap-6 text-[0.95rem] uppercase tracking-[0.17em] text-espresso/70">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-espresso transition">
              {item.label}
            </Link>
          ))}
        </nav>

        <details className="mt-4 lg:hidden group">
          <summary className="flex items-center justify-between rounded-full border border-latte bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.22em] text-espresso/70 cursor-pointer">
            {locale === "fr" ? "Menu" : locale === "en" ? "Menu" : "Valikko"}
            <span className="text-espresso/60">+</span>
          </summary>
          <div className="mt-4 rounded-2xl border border-latte bg-white/95 p-4 shadow-card space-y-3">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="block text-sm uppercase tracking-[0.16em] text-espresso/80">
                {item.label}
              </Link>
            ))}
            <a
              href={reservationUrl}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-espresso px-4 py-2 text-xs uppercase tracking-[0.22em] text-cream"
            >
              {locale === "fr" ? "Réserver" : locale === "en" ? "Reserve" : "Varaa"}
            </a>
          </div>
        </details>
      </div>
    </header>
  );
}
