"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const content = getLocaleContent(locale);
  const location = locationByLocale[locale];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const timeout = window.setTimeout(() => setMobileMenuOpen(false), 10000);
    const closeOnScroll = () => setMobileMenuOpen(false);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!mobileMenuRef.current?.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", closeOnScroll, { passive: true });
    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsideClick);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("scroll", closeOnScroll);
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [mobileMenuOpen]);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-700 text-espresso ${
        scrolled 
          ? "bg-linen/95 backdrop-blur-md border-b border-espresso/10" 
          : "bg-gradient-to-b from-linen/50 via-linen/10 to-transparent"
      }`}
    >
      {/* TOP ANNOUNCEMENT BAR - CENTERED & MODERN */}
      <div className={`w-full py-3 md:py-4 text-[0.65rem] md:text-[0.75rem] uppercase tracking-[0.22em] md:tracking-[0.35em] transition-all duration-500 font-medium ${
        scrolled 
          ? "border-b border-espresso/10 bg-linen/50 text-cafe" 
          : "border-b border-espresso/10 bg-transparent text-espresso/80"
      }`}>
        <div className="mx-auto grid w-full max-w-xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-3 text-center leading-[1.35]">
          <span className="justify-self-end text-center">{location}</span>
          <span className="h-px w-4 bg-current opacity-40 md:w-8" />
          <span className="justify-self-start text-center">{content.hero.badge}</span>
        </div>
      </div>

      <div className={`container flex items-center justify-between gap-2 md:gap-6 transition-all duration-500 ${scrolled ? "py-4" : "py-6 md:py-8"}`}>
        
        {/* LOGO */}
        <div className="flex min-w-0 flex-col">
          <Link href={`/${locale}`} className="text-[clamp(1rem,5vw,1.35rem)] sm:text-2xl md:text-3xl min-[1320px]:text-4xl font-serif tracking-tight uppercase hover:opacity-80 transition-opacity text-espresso whitespace-nowrap">
            The French Café
          </Link>
        </div>
        
        {/* DESKTOP NAVIGATION */}
        <div className="hidden min-[1320px]:flex items-center gap-6 xl:gap-10">
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
        <div ref={mobileMenuRef} className="flex min-[1320px]:hidden items-center gap-2 min-[360px]:gap-3 shrink-0">
          <LanguageSwitcher currentLocale={locale} scrolled={scrolled} compact />
          <div className="relative">
            <button
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className={`flex items-center gap-2 px-2.5 min-[360px]:px-3 py-2 text-[0.68rem] min-[360px]:text-xs uppercase tracking-[0.16em] min-[360px]:tracking-[0.2em] font-medium cursor-pointer border ${scrolled ? "border-espresso/20 text-espresso" : "border-espresso/30 text-espresso"} rounded-full`}
            >
              {locale === "fi" ? "Valikko" : "Menu"}
            </button>
            
            {/* MOBILE DROPDOWN */}
            {mobileMenuOpen ? (
              <div
                id="mobile-navigation"
                className="absolute right-0 top-full z-50 mt-4 w-[min(18rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] p-6 min-[360px]:p-8 space-y-6 border bg-linen border-espresso/10 shadow-2xl rounded-2xl"
              >
                <nav className="flex flex-col gap-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm uppercase tracking-[0.2em] text-espresso/90 font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/*
                <a
                  href={reservationUrl}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center border border-espresso bg-espresso text-white px-4 py-4 text-xs uppercase tracking-[0.25em] mt-8 rounded-full"
                >
                  {locale === "fr" ? "Réserver" : locale === "en" ? "Reserve" : "Varaa"}
                </a>
                */}
              </div>
            ) : null}
          </div>
        </div>
        
      </div>
    </header>
  );
}
