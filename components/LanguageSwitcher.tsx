"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Locale, locales } from "../data/site-content";

const localeLabels: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  fi: "FI"
};

export default function LanguageSwitcher({ 
  currentLocale,
  scrolled = false,
  compact = false
}: { 
  currentLocale: Locale;
  scrolled?: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div
      className={`flex items-center rounded-full border border-latte bg-white/90 font-semibold uppercase text-espresso/70 ${
        compact
          ? "gap-1 px-1.5 py-1 text-[10px] tracking-[0.16em]"
          : "gap-2 px-2.5 py-1.5 text-[11px] tracking-[0.26em]"
      }`}
    >
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}`}
          className={`rounded-full py-1 transition ${compact ? "px-2" : "px-2.5"} ${
            currentLocale === locale
              ? scrolled ? "bg-espresso text-cream shadow-soft" : "bg-espresso text-cream shadow-soft"
              : scrolled ? "text-espresso/60 hover:text-espresso" : "text-espresso/60 hover:text-espresso"
          }`}
        >
          {localeLabels[locale]}
        </Link>
      ))}
    </div>
  );
}
