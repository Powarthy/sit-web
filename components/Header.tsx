"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { Locale, getLocaleContent, locationByLocale } from "../data/site-content";

export default function Header({
  locale,
  navigation,
  reservationUrl
}: {
  locale: Locale;
  navigation: { label: string; href: string }[];
  reservationUrl: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const content = getLocaleContent(locale);
  const location = locationByLocale[locale];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-700 text-espresso ${
        scrolled 
          ? "bg-linen/95 backdrop-blur-md border-b border-espresso/10" 
          : "bg-gradient-to-b from-linen/50 via-linen/10 to-transparent"
      }`}
    >
      {/* TOP ANNOUNCEMENT BAR - CENTERED & MODERN */}
      <div className={`w-full flex items-center justify-center gap-4 py-3 md:py-4 text-[0.65rem] md:text-[0.75rem] uppercase tracking-[0.35em] transition-all duration-500 font-medium ${
        scrolled 
          ? "border-b border-espresso/10 bg-linen/50 text-cafe" 
          : "border-b border-espresso/10 bg-transparent text-espresso/80"
      }`}>
        <span>{location}</span>
        <span className="w-4 md:w-8 h-px bg-current opacity-40" />
        <span>{content.hero.badge}</span>
      </div>

      <div className={`container flex items-center justify-between gap-6 transition-all duration-500 ${scrolled ? "py-4" : "py-6 md:py-8"}`}>
        
        {/* LOGO */}
        <div className="flex flex-col shrink-0">
          <Link href={`/${locale}`} className="text-2xl md:text-3xl lg:text-4xl font-serif tracking-tight uppercase hover:opacity-80 transition-opacity text-espresso whitespace-nowrap">
            The French Café
          </Link>
        </div>
        
        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-10">
          <nav className={`flex items-center gap-6 xl:gap-10 text-sm xl:text-[0.85rem] uppercase tracking-[0.2em] font-medium ${scrolled ? "text-espresso/80" : "text-espresso/90"}`}>
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-gold whitespace-nowrap">
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-6 border-l border-espresso/20 pl-6 shrink-0">
            <LanguageSwitcher currentLocale={locale} scrolled={scrolled} />
            {/* 
            <a
              href={reservationUrl}
              className={`inline-flex items-center justify-center border px-8 py-3 text-xs xl:text-sm uppercase tracking-[0.25em] font-medium transition-all whitespace-nowrap ${
                scrolled 
                  ? "border-espresso bg-espresso text-white hover:bg-transparent hover:text-espresso" 
                  : "border-espresso/40 bg-white/50 backdrop-blur-sm text-espresso hover:bg-espresso hover:text-white"
              }`}
            >
              {locale === "fr" ? "Réserver" : locale === "en" ? "Reserve" : "Varaa"}
            </a>
            */}
          </div>
        </div>

        {/* MOBILE NAVIGATION TOGGLE */}
        <div className="flex lg:hidden items-center gap-4">
          <details className="group relative">
            <summary className={`flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-[0.2em] font-medium cursor-pointer list-none border ${scrolled ? "border-espresso/20 text-espresso" : "border-espresso/30 text-espresso"} rounded-full`}>
              {locale === "fr" ? "Menu" : locale === "en" ? "Menu" : "Valikko"}
            </summary>
            
            {/* MOBILE DROPDOWN */}
            <div className="absolute right-0 top-full mt-4 w-[280px] p-8 space-y-6 border bg-linen border-espresso/10 shadow-2xl rounded-2xl z-50">
              <nav className="flex flex-col gap-6">
                {navigation.map((item) => (
                  <Link key={item.href} href={item.href} className="block text-sm uppercase tracking-[0.2em] text-espresso/90 font-medium">
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* LANGUAGE SWITCHER */}
              <div className="pt-6 border-t border-espresso/10">
                <p className="mb-3 text-[0.65rem] uppercase tracking-[0.3em] text-cafe">
                  {locale === "fr" ? "Langue" : locale === "en" ? "Language" : "Kieli"}
                </p>
                <LanguageSwitcher currentLocale={locale} scrolled={scrolled} />
              </div>
              {/*
              <a
                href={reservationUrl}
                className="flex w-full items-center justify-center border border-espresso bg-espresso text-white px-4 py-4 text-xs uppercase tracking-[0.25em] mt-8 rounded-full"
              >
                {locale === "fr" ? "Réserver" : locale === "en" ? "Reserve" : "Varaa"}
              </a>
              */}
            </div>
          </details>
        </div>
        
      </div>
    </header>
  );
}
