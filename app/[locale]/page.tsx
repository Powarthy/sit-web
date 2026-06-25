import type { Metadata } from "next";
import EventHighlight from "../../components/EventHighlight";
import OfferCard from "../../components/OfferCard";
import OpeningHours from "../../components/OpeningHours";
import SectionTitle from "../../components/SectionTitle";
import FadeIn from "../../components/FadeIn";
import SignatureSlider from "../../components/SignatureSlider";
import { TrackedLink } from "../../components/TrackedLink";
import {
  getHighlightPrimaryType,
  getLocalizedHighlightShortText,
  getLocalizedHighlightTitle,
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
    hours: params.locale === "fr" ? "Horaires" : params.locale === "en" ? "Hours" : "Palvelemme",
    today: params.locale === "fr" ? "Aujourd'hui" : params.locale === "en" ? "Today" : "Tänään",
    signature: params.locale === "fr" ? "Signature brunch" : params.locale === "en" ? "Signature brunch" : "Signature-brunssi",
    house: params.locale === "fr" ? "Maison" : params.locale === "en" ? "House" : "Notre maison",
    reservation: params.locale === "fr" ? "Réservation" : params.locale === "en" ? "Reservation" : "Varaus",
    address: params.locale === "fr" ? "Adresse" : params.locale === "en" ? "Address" : "Osoite",
    contact: params.locale === "fr" ? "Contact" : params.locale === "en" ? "Contact" : "Puhelin",
    visit: params.locale === "fr" ? "Visite" : params.locale === "en" ? "Visit" : "Vierailu",
    brunchTitle: params.locale === "fr" ? "Brunch & Pâtisserie" : params.locale === "en" ? "Brunch & Patisserie" : "Brunssi & Kahvila",
    brunchHours: params.locale === "fr" ? "Horaires" : params.locale === "en" ? "Hours" : "Aika",
    brunchPrice: params.locale === "fr" ? "Prix" : params.locale === "en" ? "Price" : "Hinta",
    signatureLabel: params.locale === "fr" ? "Signature" : params.locale === "en" ? "Signature" : "Signature",
    offerLabel: params.locale === "fr" ? "Savoir-faire" : params.locale === "en" ? "Savoir-faire" : "Osaaminen",
    proofLabel: params.locale === "fr" ? "Réputation" : params.locale === "en" ? "Reputation" : "Vahvuutemme",
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
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const windowEnd = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000);
  const dateLocale = params.locale === "fr" ? "fr-FR" : params.locale === "en" ? "en-GB" : "fi-FI";
  const formatHighlightDate = (dateId: string, includeWeekday = false) => {
    const date = new Date(`${dateId}T00:00:00`);
    if (Number.isNaN(date.getTime())) return dateId;
    if (params.locale === "fi" && includeWeekday) {
      const weekday = date.toLocaleDateString("fi-FI", { weekday: "long" });
      const weekdayWithSuffix = `${weekday}na`;
      const datePart = date.toLocaleDateString("fi-FI", {
        day: "numeric",
        month: "long"
      });
      return `${weekdayWithSuffix} ${datePart}`;
    }
    return date.toLocaleDateString(dateLocale, {
      ...(includeWeekday ? { weekday: "long" as const } : {}),
      day: "numeric",
      month: "long"
    });
  };
  const formatRange = (startDate: string, endDate: string) => {
    const start = formatHighlightDate(startDate);
    const end = formatHighlightDate(endDate);
    if (startDate === endDate) return start;
    if (params.locale === "en") return `From ${start} to ${end}`;
    if (params.locale === "fi") return `${start} – ${end}`;
    return `Du ${start} au ${end}`;
  };
  const formatClosureText = (startDate: string, endDate: string) => {
    const start = formatHighlightDate(startDate, true);
    const end = formatHighlightDate(endDate, true);
    if (startDate === endDate) {
      if (params.locale === "en") return `We will be closed on ${start}.`;
      if (params.locale === "fi") return `Olemme suljettu ${start}.`;
      return `Nous serons fermés le ${start}.`;
    }
    if (params.locale === "en") return `We will be closed from ${start} to ${end}.`;
    if (params.locale === "fi") return `Olemme suljettu ${start} – ${end}.`;
    return `Nous serons fermés du ${start} au ${end}.`;
  };
  const isInCurrentWindow = (startDate: string, endDate: string) => {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    return !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start <= windowEnd && end >= todayStart;
  };
  const brunchOpeningItem =
    brunchHighlight && isInCurrentWindow(brunchHighlight.startDate, brunchHighlight.endDate)
      ? {
          label:
            params.locale === "fr"
              ? "Ouverture du café"
              : params.locale === "en"
                ? "Café opening"
                : "Kahvilan aukiolo",
          value:
            params.locale === "fr"
              ? "11:00 – 15:00 ce dimanche"
              : params.locale === "en"
                ? "Café open 11:00–15:00 this Sunday"
                : "Kahvila avoinna tänä sunnuntaina klo 11:00–15:00"
        }
      : null;

  const highlightItems = highlights.flatMap((highlight) => {
    const primaryType = getHighlightPrimaryType(highlight);
    const title = getLocalizedHighlightTitle(highlight, params.locale);
    const shortText = getLocalizedHighlightShortText(highlight, params.locale);
    const publicTitle =
      primaryType === "brunch"
        ? params.locale === "fr" ? "Brunch signature" : params.locale === "en" ? "Signature brunch" : "Signature-brunssi"
        : primaryType === "happy_hour"
          ? params.locale === "fr" ? "Happy hours le vendredi" : params.locale === "en" ? "Happy hours on Friday" : "Happy hours perjantaina"
          : title;
    const brunchDate = formatHighlightDate(highlight.startDate, true);
    const brunchText =
      params.locale === "fr"
        ? `Prochain brunch le ${brunchDate}`
        : params.locale === "en"
          ? `Next brunch on ${brunchDate}`
          : `Seuraava brunssi ${brunchDate}`;

    const value = (() => {
      if (primaryType === "brunch") return brunchText;
      if (primaryType === "happy_hour") return publicTitle;
      if (primaryType === "closure") return formatClosureText(highlight.startDate, highlight.endDate);
      if (primaryType === "seasonal_special") return formatRange(highlight.startDate, highlight.endDate);
      return shortText;
    })();

    const label =
      primaryType === "brunch"
        ? publicTitle
        : primaryType === "closure"
          ? publicTitle
          : primaryType === "seasonal_special"
            ? publicTitle
            : primaryType === "happy_hour"
              ? params.locale === "fr" ? "Pause café" : params.locale === "en" ? "Coffee break" : "Tapahtumat"
              : publicTitle;

    const item = { label, value };
    if (primaryType === "brunch" && brunchOpeningItem) return [item, brunchOpeningItem];
    return [item];
  }).filter((item) => Boolean(item.label?.trim() && item.value?.trim()));

  const nowItems = highlightItems;
  const brunchPriceValue = params.locale === "fi" ? "45 € / henkilö" : siteSettings.brunch.price;

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
                  <TrackedLink
                    href={`/${params.locale}/${localizedRoutes.brunch[params.locale]}`}
                    eventName="brunch_reservation_started"
                    eventParams={{ language: params.locale, source: "home_hero", button_location: "hero_primary" }}
                    className="flex items-center justify-center bg-espresso text-white px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium transition-all hover:bg-gold hover:text-white"
                  >
                    {content.hero.primaryCta}
                  </TrackedLink>
                  <TrackedLink
                    href={`/${params.locale}/menu`}
                    eventName="menu_viewed"
                    eventParams={{ language: params.locale, source: "home_hero", button_location: "hero_secondary" }}
                    className="flex items-center justify-center border border-espresso/30 bg-white text-espresso px-8 py-4 text-xs uppercase tracking-[0.25em] transition-all hover:bg-espresso/5 hover:border-espresso"
                  >
                    {content.hero.secondaryCta}
                  </TrackedLink>
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
            <TrackedLink
              href={`/${params.locale}/menu`}
              eventName="menu_viewed"
              eventParams={{ language: params.locale, source: "home_offers", button_location: "offers_header" }}
              className="inline-flex items-center gap-4 text-xs uppercase tracking-[0.25em] text-espresso hover:text-gold transition-colors font-medium"
            >
              {ctaLabels.menu} <ArrowRight className="w-4 h-4" />
            </TrackedLink>
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
                <span>{brunchPriceValue}</span>
              </div>
              <TrackedLink
                href={`/${params.locale}/${localizedRoutes.brunch[params.locale]}`}
                eventName="brunch_reservation_started"
                eventParams={{ language: params.locale, source: "home_brunch_block", button_location: "brunch_info_box" }}
                className="mt-8 inline-flex items-center justify-center w-full border border-white/30 py-4 text-xs uppercase tracking-[0.25em] hover:bg-white hover:text-espresso transition-colors"
              >
                {ctaLabels.reserve}
              </TrackedLink>
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
