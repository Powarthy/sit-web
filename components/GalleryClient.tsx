"use client";

import { useCallback, useEffect, useState } from "react";
import type { Locale } from "../data/site-content";

type GalleryImage = {
  src: string;
  alt: string;
  caption?: string;
};

const translations: Record<Locale, { close: string; prev: string; next: string; counter: (i: number, n: number) => string }> = {
  fr: {
    close: "Fermer",
    prev: "Précédent",
    next: "Suivant",
    counter: (i, n) => `${i} sur ${n}`
  },
  en: {
    close: "Close",
    prev: "Previous",
    next: "Next",
    counter: (i, n) => `${i} of ${n}`
  },
  fi: {
    close: "Sulje",
    prev: "Edellinen",
    next: "Seuraava",
    counter: (i, n) => `${i} / ${n}`
  }
};

export default function GalleryClient({
  locale,
  images
}: {
  locale: Locale;
  images: GalleryImage[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const t = translations[locale];

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [activeIndex, close, next, prev]);

  return (
    <>
      {/* MASONRY GALLERY */}
      <section className="container pb-24">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 [column-fill:_balance]">
          {images.map((img, index) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group mb-4 md:mb-6 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-latte bg-white/60 shadow-soft focus:outline-none focus:ring-2 focus:ring-gold/60"
              aria-label={img.alt}
            >
              <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  loading={index < 3 ? "eager" : "lazy"}
                  className="w-full h-auto object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/60 via-espresso/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                {img.caption ? (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-cream translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="inline-block text-[0.65rem] uppercase tracking-[0.3em] text-gold">The French Café</span>
                    <p className="mt-1 font-serif text-lg md:text-xl leading-snug">{img.caption}</p>
                  </div>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* LIGHTBOX */}
      {activeIndex !== null ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-espresso/95 backdrop-blur-md animate-[fadeIn_.3s_ease-out]"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          {/* COUNTER */}
          <div className="absolute top-6 left-6 text-cream/80 text-xs uppercase tracking-[0.3em]">
            {t.counter(activeIndex + 1, images.length)}
          </div>

          {/* CLOSE */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute top-5 right-5 flex items-center gap-2 rounded-full border border-cream/30 bg-cream/5 px-4 py-2 text-[0.7rem] uppercase tracking-[0.3em] text-cream hover:bg-cream/15 transition"
            aria-label={t.close}
          >
            <span>{t.close}</span>
            <span aria-hidden>✕</span>
          </button>

          {/* PREV */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border border-cream/30 bg-cream/5 text-cream text-xl hover:bg-cream/15 transition"
            aria-label={t.prev}
          >
            ‹
          </button>

          {/* IMAGE */}
          <div
            className="relative max-h-[85vh] max-w-[92vw] md:max-w-[80vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[activeIndex].src}
              alt={images[activeIndex].alt}
              className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl animate-[fadeIn_.4s_ease-out]"
            />
            {images[activeIndex].caption ? (
              <div className="mt-4 text-center text-cream/80 text-sm md:text-base font-serif italic">
                {images[activeIndex].caption}
              </div>
            ) : null}
          </div>

          {/* NEXT */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border border-cream/30 bg-cream/5 text-cream text-xl hover:bg-cream/15 transition"
            aria-label={t.next}
          >
            ›
          </button>

          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.98); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      ) : null}
    </>
  );
}
