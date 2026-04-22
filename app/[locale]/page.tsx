import Link from "next/link";
import type { Metadata } from "next";
import EventHighlight from "../../components/EventHighlight";
import OfferCard from "../../components/OfferCard";
import OpeningHours from "../../components/OpeningHours";
import SectionTitle from "../../components/SectionTitle";
import FadeIn from "../../components/FadeIn";
import SignatureSlider from "../../components/SignatureSlider";
import {
  getHighlightPrimaryType,
  getUpcomingBrunch,
  getWeeklyHighlights
} from "../../lib/planning-highlights";
import {
  Locale,
  buildLocalizedUrl,
  getLocaleContent,
  getRouteAlternates,
  localizedRoutes,
  locationByLocale,
  ogImageUrl,
  siteSettings
} from "../../data/site-content";
import { ArrowDownRight, ArrowRight, MapPin, Phone } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const current = getLocaleContent(params.locale);
  const canonical = buildLocalizedUrl(params.locale, localizedRoutes.home[params.locale]);
  return {
    title: current.seo.title,
    description: current.seo.description,
    alternates: {
      canonical,
      languages: getRouteAlternates("home")
    },
    openGraph: {
      title: current.seo.title,
      description: current.seo.description,
      url: canonical,
      siteName: siteSettings.name,
      type: "website",
      locale: params.locale,
      images: [{ url: ogImageUrl }]
    }
  };
}

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const content = getLocaleContent(params.locale);
  const heroImageUrl = siteSettings.heroImage.startsWith("http")
    ? siteSettings.heroImage
    : `${siteSettings.siteUrl}${siteSettings.heroImage}`;

  const ctaLabels = {
    reserve: params.locale === "fr" ? "Réserver" : params.locale === "en" ? "Reserve" : "Varaa",
    menu: params.locale === "fr" ? "Voir la carte" : params.locale === "en" ? "View menu" : "Katso menu",
    find: params.locale === "fr" ? "Nous trouver" : params.locale === "en" ? "Find us" : "Löydä meidät",
    hours: params.locale === "fr" ? "Horaires" : params.locale === "en" ? "Hours" : "Aukiolo",
    today: params.locale === "fr" ? "Aujourd'hui" : params.locale === "en" ? "Today" : "Tänään",
    signature: params.locale === "fr" ? "Signature brunch" : params.locale === "en" ? "Signature brunch" : "Signature-brunssi",
    house: params.locale === "fr" ? "Maison" : params.locale === "en" ? "House" : "Talo",
    reservation: params.locale === "fr" ? "Réservation" : params.locale === "en" ? "Reservation" : "Varaus",
    address: params.locale === "fr" ? "Adresse" : params.locale === "en" ? "Address" : "Osoite",
    contact: params.locale === "fr" ? "Contact" : params.locale === "en" ? "Contact" : "Yhteys",
    visit: params.locale === "fr" ? "Visite" : params.locale === "en" ? "Visit" : "Vierailu",
    brunchTitle: params.locale === "fr" ? "Brunch & Pâtisserie" : params.locale === "en" ? "Brunch & Patisserie" : "Brunssi & Patisserie",
    brunchHours: params.locale === "fr" ? "Horaires" : params.locale === "en" ? "Hours" : "Aika",
    brunchPrice: params.locale === "fr" ? "Prix" : params.locale === "en" ? "Price" : "Hinta",
    signatureLabel: params.locale === "fr" ? "Signature" : params.locale === "en" ? "Signature" : "Signature",
    offerLabel: params.locale === "fr" ? "Savoir-faire" : params.locale === "en" ? "Savoir-faire" : "Osaaminen",
    proofLabel: params.locale === "fr" ? "Réputation" : params.locale === "en" ? "Reputation" : "Maine",
    catering: params.locale === "fr" ? "Demander un devis" : params.locale === "en" ? "Request catering" : "Pyydä catering"
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: siteSettings.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteSettings.address,
      addressLocality: "Kuusamo",
      addressCountry: "FI"
    },
    telephone: siteSettings.phone,
    url: siteSettings.siteUrl,
    sameAs: [siteSettings.instagramUrl],
    openingHours: siteSettings.openingHours.map((item) => `${item.day} ${item.hours}`),
    image: heroImageUrl
  };

  const [weeklyHighlights, brunchHighlight] = await Promise.all([
    getWeeklyHighlights(),
    getUpcomingBrunch()
  ]);
  const highlights = brunchHighlight ? [brunchHighlight, ...weeklyHighlights.slice(0, 3)] : weeklyHighlights.slice(0, 3);
  const highlightItems = highlights.map((highlight) => {
    const primaryType = getHighlightPrimaryType(highlight);
    const highlightDate = new Date(`${highlight.startDate}T00:00:00`);
    const formattedDate = Number.isNaN(highlightDate.getTime())
      ? highlight.startDate
      : highlightDate.toLocaleDateString(
          params.locale === "fr" ? "fr-FR" : params.locale === "en" ? "en-GB" : "fi-FI",
          { weekday: "long", day: "numeric", month: "long" }
        );

    const value = (() => {
      if (primaryType === "brunch") return formattedDate;
      if (primaryType === "happy_hour") {
        const range = highlight.startTime && highlight.endTime ? `${highlight.startTime}–${highlight.endTime}` : "";
        const shortLower = highlight.shortText.toLowerCase();
        const isGeneric = shortLower === "happy hour" || shortLower === "happy_hour";
        const parts = [] as string[];
        if (!isGeneric) parts.push(highlight.shortText);
        if (formattedDate) parts.push(formattedDate);
        if (range) parts.push(range);
        return parts.join(" · ");
      }
      if (primaryType === "closure") return formattedDate;
      return highlight.shortText;
    })();

    const label =
      primaryType === "brunch"
        ? params.locale === "fr" ? "Prochain brunch" : params.locale === "en" ? "Next brunch" : "Seuraava brunssi"
        : primaryType === "closure"
          ? params.locale === "fr" ? "Fermeture exceptionnelle" : params.locale === "en" ? "Exceptional closure" : "Poikkeuksellinen sulku"
          : highlight.title;
    
    const meta = primaryType === "brunch" && highlight.startTime && highlight.endTime ? `${highlight.startTime}–${highlight.endTime}` : undefined;
    
    return { label, value, meta };
  }).filter((item) => {
    if (item.label.toLowerCase().includes("happy")) return Boolean(item.value && item.value.trim().length > 0);
    return true;
  });

  const nowItems = highlightItems.length > 0 ? highlightItems : content.now.items;

  return (
    <div className="bg-linen min-h-screen selection:bg-gold selection:text-white pb-24">
      {/* HAUTE COUTURE HERO SECTION */}
      <section className="relative w-full min-h-[100svh] flex flex-col justify-start overflow-hidden">
        {/* Background Image full bleed */}
        <div 
          className="absolute inset-0 w-full h-full scale-[1.02] transform transition-transform duration-[20s] ease-out hover:scale-[1.05]"
          style={{
            backgroundImage: `url(${siteSettings.heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%"
          }}
        />
        {/* Elegant gradient overlay - LIGHT FOR BLACK TEXT */}
        {/* Un léger dégradé clair plus bas, et un voile clair plus marqué en haut pour lire le header noir */}
        <div className="absolute inset-0 bg-gradient-to-t from-linen/80 via-linen/20 to-linen/60" />
        
        {/* Hero Content */}
        <div className="relative z-10 w-full px-6 md:px-12 lg:px-24 pt-40 md:pt-48 lg:pt-56">
          <FadeIn direction="up" delay={0.2} className="w-full">
            <div className="flex flex-col gap-6">
              <h1 className="text-espresso font-serif text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.9] tracking-tight max-w-2xl lg:max-w-4xl">
                {content.hero.headline}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end mt-4 max-w-5xl">
                <p className="text-espresso/80 font-light text-lg md:text-xl max-w-md leading-relaxed">
                  {content.hero.subhead}
                </p>
                <div className="flex gap-4 md:justify-end">
                  <a
                    href={siteSettings.reservationUrl}
                    className="flex items-center justify-center bg-espresso text-white px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium transition-all hover:bg-gold hover:text-white"
                  >
                    {content.hero.primaryCta}
                  </a>
                  <Link
                    href={`/${params.locale}/menu`}
                    className="flex items-center justify-center border border-espresso/30 bg-white text-espresso px-8 py-4 text-xs uppercase tracking-[0.25em] transition-all hover:bg-espresso/5 hover:border-espresso"
                  >
                    {content.hero.secondaryCta}
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SIGNATURE SECTION - ASYMMETRICAL EDITORIAL LAYOUT */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <FadeIn direction="up" delay={0.2}>
              <p className="section-label mb-6">{ctaLabels.house}</p>
              <h2 className="display-title mb-8">{content.signature.title}</h2>
              <div className="rich-text mb-10">
                <p>{content.signature.description}</p>
              </div>
              <div className="space-y-px bg-espresso/10">
                {content.signature.highlights.map((item, i) => (
                  <div key={i} className="bg-linen py-4 text-espresso/80 font-light flex items-center justify-between">
                    <span>{item}</span>
                    <ArrowDownRight className="w-4 h-4 text-gold" />
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
          
          <div className="lg:col-span-7 order-1 lg:order-2">
            <FadeIn direction="left" delay={0.4}>
              <SignatureSlider />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* EVENTS / HIGHLIGHTS SECTION */}
      <section className="py-16 md:py-24 border-y border-espresso/10 bg-white/40">
        <div className="px-6 md:px-12 lg:px-24">
          <FadeIn direction="up">
            <EventHighlight
              title={content.now.title}
              subtitle={content.now.subtitle}
              items={nowItems}
              locale={params.locale}
            />
          </FadeIn>
        </div>
      </section>

      {/* OFFERS & SAVOIR FAIRE */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <FadeIn direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="section-label mb-4">{ctaLabels.offerLabel}</p>
              <h2 className="display-title">{content.offers.title}</h2>
            </div>
            <Link
              href={`/${params.locale}/menu`}
              className="inline-flex items-center gap-4 text-xs uppercase tracking-[0.25em] text-espresso hover:text-gold transition-colors font-medium"
            >
              {ctaLabels.menu} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>

        <div className="grid gap-1 grid-cols-1 md:grid-cols-3 bg-espresso/10">
          {content.offers.cards.map((card, i) => (
            <FadeIn key={card.title} delay={i * 0.1} direction="up" className="bg-linen p-8 md:p-12 hover:bg-white transition-colors duration-500 flex flex-col justify-between min-h-[400px]">
              <div>
                <h3 className="font-serif text-3xl md:text-4xl text-espresso mb-4">{card.title}</h3>
                <p className="text-espresso/70 font-light leading-relaxed mb-8">{card.description}</p>
              </div>
              <ul className="space-y-3">
                {card.highlights.map((h) => (
                  <li key={h} className="text-sm font-medium uppercase tracking-[0.15em] text-cafe flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                    {h}
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* BRUNCH & INFO BOX */}
      <section className="py-12 md:py-24 px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-espresso/10">
          <FadeIn className="bg-espresso text-white p-10 md:p-16 lg:p-20 flex flex-col justify-between min-h-[500px]">
            <div>
              <p className="uppercase tracking-[0.3em] text-[0.65rem] text-white/50 mb-6">{ctaLabels.signature}</p>
              <h3 className="font-serif text-5xl md:text-6xl mb-6">{ctaLabels.brunchTitle}</h3>
              <p className="text-white/70 font-light text-lg leading-relaxed max-w-md">{content.hero.brunchNote}</p>
            </div>
            
            <div className="space-y-4 mt-12 pt-12 border-t border-white/10">
              <div className="flex justify-between text-sm uppercase tracking-[0.1em]">
                <span className="text-white/50">{ctaLabels.brunchHours}</span>
                <span>{siteSettings.brunch.hours}</span>
              </div>
              <div className="flex justify-between text-sm uppercase tracking-[0.1em]">
                <span className="text-white/50">{ctaLabels.brunchPrice}</span>
                <span>{siteSettings.brunch.price}</span>
              </div>
              <a
                href={siteSettings.reservationUrl}
                className="mt-8 inline-flex items-center justify-center w-full border border-white/30 py-4 text-xs uppercase tracking-[0.25em] hover:bg-white hover:text-espresso transition-colors"
              >
                {ctaLabels.reserve}
              </a>
            </div>
          </FadeIn>
          
          <FadeIn className="bg-white p-10 md:p-16 lg:p-20 flex flex-col justify-center min-h-[500px]">
            <p className="section-label mb-6">{ctaLabels.proofLabel}</p>
            <h3 className="font-serif text-4xl md:text-5xl mb-8">{content.proof.title}</h3>
            <div className="space-y-6">
              {content.proof.quotes.map((quote, i) => (
                <p key={i} className="text-xl md:text-2xl font-light italic text-espresso/80 leading-snug">
                  "{quote}"
                </p>
              ))}
            </div>
            <div className="mt-16 pt-8 border-t border-espresso/10 grid grid-cols-2 gap-8">
               <div>
                 <p className="text-xs uppercase tracking-[0.2em] text-cafe mb-2 flex items-center gap-2"><MapPin className="w-3 h-3"/>{ctaLabels.address}</p>
                 <p className="font-medium">{siteSettings.address}</p>
               </div>
               <div>
                 <p className="text-xs uppercase tracking-[0.2em] text-cafe mb-2 flex items-center gap-2"><Phone className="w-3 h-3"/>{ctaLabels.contact}</p>
                 <p className="font-medium">{siteSettings.phone}</p>
               </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </div>
  );
}
