import type { Metadata } from "next";
import Image from "next/image";
import FadeIn from "../../../components/FadeIn";
import TrackOnMount from "../../../components/TrackOnMount";
import { TrackedAnchor, TrackedLink } from "../../../components/TrackedLink";
import {
  Locale,
  buildLocalizedUrl,
  getLocaleContent,
  getRouteAlternates,
  localizedRoutes,
  ogImageUrl,
  siteSettings
} from "../../../data/site-content";

export async function generateMetadata(
  props: {
    params: Promise<{ locale: Locale }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const content = getLocaleContent(params.locale);
  const canonical = buildLocalizedUrl(params.locale, localizedRoutes.menu[params.locale]);
  return {
    title: content.menuPage.title,
    description: content.menuPage.intro,
    alternates: {
      canonical,
      languages: getRouteAlternates("menu")
    },
    openGraph: {
      title: content.menuPage.title,
      description: content.menuPage.intro,
      url: canonical,
      siteName: siteSettings.name,
      type: "website",
      locale: params.locale,
      images: [{ url: ogImageUrl }]
    }
  };
}

export default async function MenuPage(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  const content = getLocaleContent(params.locale);
  const labels = {
    reserve: params.locale === "fr" ? "Réserver" : params.locale === "en" ? "Reserve" : "Varaa",
    catering: params.locale === "fr" ? "Demander un devis" : params.locale === "en" ? "Request catering" : "Pyydä tarjous"
  };

  // Sélection d'images optimisées (webp) pour chaque section du menu
  const sectionImages = [
    "/images/diapo/French_Cafe_stillit44.webp", // Pour le Sucré
    "/images/diapo/French_Cafe_stillit32.webp", // Pour le Salé
    "/images/diapo/boissons.webp"               // Pour les Boissons
  ];

  return (
    <div className="bg-linen min-h-screen selection:bg-gold selection:text-white pb-24">
      <TrackOnMount eventName="menu_viewed" eventParams={{ language: params.locale, source: "menu_page" }} />
      {/* MENU HERO SECTION */}
      <section className="relative w-full h-[60vh] md:h-[75vh] min-h-[520px] pt-32 md:pt-40 flex flex-col justify-end overflow-hidden border-b border-espresso/10">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/diapo/French_Cafe_stillit45.webp"
            alt="Menu"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-linen/95 via-linen/60 to-linen/20" />
        
        <div className="relative z-10 w-full px-6 md:px-12 lg:px-24 pb-12 md:pb-16 max-w-5xl">
          <FadeIn direction="up" delay={0.2} className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="w-8 h-px bg-gold/50" />
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-cafe font-medium">
                La Carte
              </p>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl text-espresso tracking-tight leading-[0.95]">
              {content.menuPage.title}
            </h1>
            <p className="text-espresso/80 font-light text-lg md:text-xl max-w-2xl leading-relaxed mt-2">
              {content.menuPage.intro}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* THE MENU SECTIONS */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-32 max-w-[90rem] mx-auto space-y-32 md:space-y-48">
        {content.menuPage.sections.map((section, sectionIdx) => (
          <div key={section.title} className={`grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-24 items-start ${sectionIdx % 2 === 1 ? 'lg:grid-cols-[1.2fr_1fr]' : ''}`}>
            
            {/* IMAGE + TITLE (Sticky on Desktop) */}
            <FadeIn direction="up" delay={0.1} className={`flex flex-col gap-6 lg:sticky lg:top-32 ${sectionIdx % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="hidden lg:block mb-2">
                <h2 className="font-serif text-5xl md:text-6xl text-espresso tracking-tight">{section.title}</h2>
                <div className="w-12 h-px bg-gold/50 my-6" />
                <p className="text-espresso/70 font-light text-lg leading-relaxed max-w-md">
                  {section.description}
                </p>
              </div>
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-espresso/5 group">
                <Image
                  src={sectionImages[sectionIdx % sectionImages.length]}
                  alt={section.title}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeIn>

            {/* ITEMS LIST */}
            <div className={`flex flex-col gap-12 lg:pt-16 ${sectionIdx % 2 === 1 ? 'lg:order-1' : ''}`}>
              {/* Mobile Title (Hidden on Desktop) */}
              <div className="lg:hidden block">
                <h2 className="font-serif text-4xl text-espresso tracking-tight">{section.title}</h2>
                <div className="w-12 h-px bg-gold/50 my-6" />
                <p className="text-espresso/70 font-light text-[0.95rem] leading-relaxed">
                  {section.description}
                </p>
              </div>

              {/* Items directs (Sucré, Salé) */}
              {section.items.length > 0 && (
                <FadeIn direction="up" delay={0.15}>
                  <div className="flex flex-col gap-8">
                    {section.items.map((item) => (
                      <div key={item.name} className="group flex flex-col gap-3 border-b border-espresso/10 pb-8 transition-all duration-300 hover:border-gold/50 hover:pl-4">
                        <p className="font-serif text-2xl md:text-3xl text-espresso tracking-tight group-hover:text-gold transition-colors duration-300">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </FadeIn>
              )}

              {/* Sous-sections (Boissons) */}
              {section.subsections && section.subsections.length > 0 && (
                <div className="flex flex-col gap-20">
                  {section.subsections.map((subsection) => (
                    <FadeIn key={subsection.title} direction="up" delay={0.15}>
                      <div className="mb-10">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="w-4 h-px bg-gold/50" />
                          <h3 className="text-[0.65rem] uppercase tracking-[0.35em] text-cafe font-medium">{subsection.title}</h3>
                        </div>
                        {subsection.description && (
                          <p className="font-serif text-3xl text-espresso/90 tracking-tight leading-snug">{subsection.description}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                        {subsection.items.map((item) => (
                          <div key={item.name} className="flex flex-col border-b border-espresso/10 pb-4 group transition-all duration-300 hover:border-espresso/30">
                            <p className="font-medium text-espresso text-lg tracking-wide group-hover:text-gold transition-colors">{item.name}</p>
                            {item.detail && <p className="font-light text-[0.9rem] text-espresso/60 mt-2">{item.detail}</p>}
                          </div>
                        ))}
                      </div>
                    </FadeIn>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* BOTTOM CTA */}
      <section className="px-6 md:px-12 lg:px-24 mt-12">
        <FadeIn direction="up">
          <div className="max-w-5xl mx-auto border-t border-espresso/10 pt-16 md:pt-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-gold/50" />
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-cafe font-medium">
                  {params.locale === "fr" ? "À table" : params.locale === "en" ? "At the table" : "À table"}
                </p>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-espresso tracking-tight leading-[1.1]">
                {params.locale === "fr" ? "Réservez un brunch ou un service privé" : params.locale === "en" ? "Reserve a brunch or a private service" : "Varaa brunssi tai yksityistilaisuus"}
              </h2>
              <p className="mt-6 text-espresso/80 font-light text-lg leading-relaxed">{content.brunchPage.note}</p>
            </div>
            
            <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto">
              <TrackedLink
                href={`/${params.locale}/${localizedRoutes.brunch[params.locale]}`}
                eventName="brunch_reservation_started"
                eventParams={{ language: params.locale, source: "menu_page", button_location: "bottom_cta" }}
                className="flex items-center justify-center bg-espresso text-white px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium transition-all hover:bg-gold hover:text-white"
              >
                {labels.reserve}
              </TrackedLink>
              <TrackedAnchor
                href={`mailto:${siteSettings.email}`}
                eventName="contact_clicked"
                eventParams={{ language: params.locale, source: "menu_page", button_location: "catering_email" }}
                className="flex items-center justify-center border border-espresso/30 bg-transparent text-espresso px-8 py-4 text-xs uppercase tracking-[0.25em] transition-all hover:bg-espresso hover:text-white"
              >
                {labels.catering}
              </TrackedAnchor>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
