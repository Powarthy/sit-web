import Link from "next/link";
import { Locale, locales } from "../data/site-content";

const localeLabels: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  fi: "FI"
};

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-latte bg-white/90 px-2.5 py-1.5 text-[11px] font-semibold tracking-[0.26em] uppercase text-espresso/70">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}`}
          className={`rounded-full px-2.5 py-1 transition ${
            currentLocale === locale
              ? "bg-espresso text-cream shadow-soft"
              : "text-espresso/60 hover:text-espresso"
          }`}
        >
          {localeLabels[locale]}
        </Link>
      ))}
    </div>
  );
}
