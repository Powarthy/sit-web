"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Locale, locales } from "../data/site-content";
import { trackEvent } from "../lib/analytics";

const localeFlags: Record<Locale, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  fi: "🇫🇮"
};

const localeNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  fi: "Suomi"
};

const withLocale = (pathname: string, currentLocale: Locale, nextLocale: Locale) => {
  if (pathname === `/${currentLocale}`) return `/${nextLocale}`;
  if (pathname.startsWith(`/${currentLocale}/`)) {
    return pathname.replace(`/${currentLocale}/`, `/${nextLocale}/`);
  }
  if (pathname === "/") return `/${nextLocale}`;
  return `/${nextLocale}`;
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
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onClickOutside);
    window.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", onClickOutside);
      window.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const currentPath = pathname || `/${currentLocale}`;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Change language"
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex items-center rounded-full border border-latte bg-white/90 font-semibold text-espresso/80 shadow-soft transition ${
          compact
            ? "gap-1 px-1.5 py-1"
            : "gap-1.5 px-2 py-1.5"
        } ${scrolled ? "hover:bg-white" : "hover:bg-white"}`}
      >
        <span className={compact ? "text-sm leading-none" : "text-base leading-none"}>{localeFlags[currentLocale]}</span>
        <span className={`text-[0.6rem] leading-none transition-transform ${open ? "rotate-180" : "rotate-0"}`}>▾</span>
      </button>

      {open ? (
        <div
          role="menu"
          className={`absolute right-0 z-50 mt-2 min-w-[8.5rem] rounded-2xl border border-latte bg-white/95 p-2 shadow-soft backdrop-blur ${
            compact ? "text-[0.68rem]" : "text-[0.72rem]"
          }`}
        >
          {locales.map((locale) => {
            const targetPath = withLocale(currentPath, currentLocale, locale);
            return (
              <Link
                key={locale}
                href={targetPath}
                role="menuitem"
                onClick={() => {
                  if (locale !== currentLocale) {
                    trackEvent("language_changed", {
                      language: locale,
                      source: "language_switcher"
                    });
                  }
                  setOpen(false);
                }}
                className={`flex items-center gap-2 rounded-xl px-2.5 py-2 uppercase tracking-[0.18em] transition ${
                  locale === currentLocale
                    ? "bg-espresso text-cream"
                    : "text-espresso/80 hover:bg-espresso/5"
                }`}
              >
                <span className="text-base leading-none">{localeFlags[locale]}</span>
                <span>{localeNames[locale]}</span>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
