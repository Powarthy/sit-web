import Link from "next/link";
import type { Metadata } from "next";
import EventHighlight from "../../components/EventHighlight";
import OfferCard from "../../components/OfferCard";
import OpeningHours from "../../components/OpeningHours";
import SectionTitle from "../../components/SectionTitle";
import { getWebsiteHighlights } from "../../lib/planning-highlights";
import {
  Locale,
  buildLocalizedUrl,
  getLocaleContent,
  getRouteAlternates,
  localizedRoutes,
  locationByLocale,
  ogImageUrl,
  seasonalByLocale,
  siteSettings
} from "../../data/site-content";

export const dynamic = "force-dynamic";

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
    brunchTitle: params.locale === "fr" ? "Brunch & pâtisserie fine" : params.locale === "en" ? "Brunch & fine patisserie" : "Brunssi & patisserie",
    brunchHours: params.locale === "fr" ? "Horaires" : params.locale === "en" ? "Hours" : "Aika",
    brunchPrice: params.locale === "fr" ? "Prix" : params.locale === "en" ? "Price" : "Hinta",
    signatureLabel: params.locale === "fr" ? "Signature" : params.locale === "en" ? "Signature" : "Signature",
    offerLabel: params.locale === "fr" ? "Offre" : params.locale === "en" ? "Offer" : "Tarjonta",
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

  const highlights = await getWebsiteHighlights();
  const highlightItems = highlights.slice(0, 3).map((highlight) => {
    const slots = highlight.slots?.length ? ` · ${highlight.slots.join(" · ")}` : "";
    const timeRange =
      highlight.startTime && highlight.endTime
        ? ` · ${highlight.startTime}–${highlight.endTime}`
        : "";
    const location = highlight.locationLabel ? ` · ${highlight.locationLabel}` : "";

    const value = (() => {
      if (highlight.type === "brunch") return `${highlight.shortText}${slots || timeRange}`;
      if (highlight.type === "happy_hour") return `${highlight.shortText}${timeRange}`;
      if (highlight.type === "closure") return `${highlight.shortText}${location}`;
      return highlight.shortText;
    })();

    return {
      label: highlight.title,
      value
    };
  });

  const nowItems = highlightItems.length > 0 ? highlightItems : content.now.items;

  return (
    <div className="space-y-24 md:space-y-28 pb-24">
      <section className="relative overflow-hidden bg-soft-wash">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute inset-0 bg-hero-sheen" />
        <div className="container relative py-16 md:py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] items-center">
            <div className="space-y-9">
              <div className="flex flex-wrap gap-3 items-center">
                <span className="lux-chip">{content.hero.badge}</span>
                <span className="section-label">{locationByLocale[params.locale]}</span>
              </div>
              <h1 className="display-title">{content.hero.headline}</h1>
              <p className="text-[1.15rem] md:text-xl text-espresso/70 max-w-xl">{content.hero.subhead}</p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={siteSettings.reservationUrl}
                  className="w-full sm:w-auto rounded-full bg-espresso px-7 py-3 text-sm uppercase tracking-[0.22em] text-cream shadow-soft text-center"
                >
                  {content.hero.primaryCta}
                </a>
                <Link
                  href={`/${params.locale}/menu`}
                  className="w-full sm:w-auto rounded-full border border-espresso px-7 py-3 text-sm uppercase tracking-[0.22em] text-espresso hover:bg-espresso hover:text-cream transition text-center"
                >
                  {content.hero.secondaryCta}
                </Link>
              </div>
              <div className="editorial-divider" />
              <div className="grid gap-4 sm:grid-cols-2 text-sm text-espresso/70">
                <div className="rounded-2xl border border-latte bg-white/70 px-4 py-3">
                  <p className="uppercase tracking-[0.2em] text-[0.7rem] text-cafe">{ctaLabels.address}</p>
                  <p className="font-medium text-espresso text-[0.98rem] md:text-base">{siteSettings.address}</p>
                </div>
                <div className="rounded-2xl border border-latte bg-white/70 px-4 py-3">
                  <p className="uppercase tracking-[0.2em] text-[0.7rem] text-cafe">{ctaLabels.contact}</p>
                  <p className="font-medium text-espresso text-[0.98rem] md:text-base">{siteSettings.phone}</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 right-6 h-32 w-32 rounded-full bg-gold/30 blur-2xl" />
              <div className="rounded-[44px] border border-latte bg-editorial-wash p-6 shadow-lift space-y-7">
                <div className="overflow-hidden rounded-[34px] border border-latte bg-white/80">
                  <div
                    className="relative h-64 sm:h-72 lg:h-[420px]"
                    style={{
                      backgroundImage: `url(${siteSettings.heroImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center 35%"
                    }}
                    role="img"
                    aria-label={siteSettings.heroImageAlt}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-espresso/10 via-espresso/5 to-espresso/55" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-cream/10" />
                  </div>
                  <div className="px-6 py-5">
                    <div className="flex items-center justify-between gap-4">
                      <p className="section-label">{content.hero.imageLabel}</p>
                      <span className="lux-chip">{locationByLocale[params.locale]}</span>
                    </div>
                    <p className="mt-3 text-sm text-espresso/70">{content.hero.imageCaption}</p>
                  </div>
                </div>
                <div className="rounded-[32px] border border-latte bg-white/80 p-6 shadow-card">
                  <p className="section-label">{ctaLabels.signature}</p>
                  <h3 className="font-serif text-[1.7rem] text-espresso mt-3">{ctaLabels.brunchTitle}</h3>
                  <p className="text-espresso/70 mt-3 text-sm md:text-base">{content.hero.brunchNote}</p>
                  <div className="mt-6 space-y-3 text-sm md:text-base text-espresso/70">
                    <div className="flex items-center justify-between">
                      <span>{ctaLabels.brunchHours}</span>
                      <span className="font-medium text-espresso">{siteSettings.brunch.hours}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{ctaLabels.brunchPrice}</span>
                      <span className="font-medium text-espresso">{siteSettings.brunch.price}</span>
                    </div>
                  </div>
                  <a
                    href={siteSettings.reservationUrl}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-espresso px-5 py-3 text-xs uppercase tracking-[0.24em] text-cream shadow-soft hover:bg-espresso/90 transition"
                  >
                    {ctaLabels.reserve}
                  </a>
                </div>
                <div className="rounded-[28px] border border-latte bg-white/70 p-6">
                  <p className="section-label">{ctaLabels.house}</p>
                  <p className="font-serif text-2xl text-espresso mt-4">{content.signature.title}</p>
                  <p className="text-espresso/70 mt-3 text-sm md:text-base leading-relaxed">{content.signature.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <SectionTitle eyebrow={ctaLabels.signatureLabel} title={content.signature.title} description={content.signature.description} />
        <div className="space-y-4">
          {content.signature.highlights.map((item) => (
            <div key={item} className="rounded-2xl border border-latte bg-white/70 px-5 py-4 text-espresso/80">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="container">
        <EventHighlight
          title={content.now.title}
          subtitle={content.now.subtitle}
          items={nowItems}
          locale={params.locale}
        />
      </section>

      <section className="container space-y-12">
        <SectionTitle eyebrow={ctaLabels.offerLabel} title={content.offers.title} />
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <OfferCard
            title={content.offers.cards[0].title}
            description={content.offers.cards[0].description}
            highlights={content.offers.cards[0].highlights}
            variant="featured"
          />
          <div className="grid gap-6 md:grid-cols-2">
            {content.offers.cards.slice(1).map((card) => (
              <OfferCard key={card.title} title={card.title} description={card.description} highlights={card.highlights} />
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={`/${params.locale}/menu`}
            className="w-full sm:w-auto rounded-full bg-espresso px-6 py-3 text-sm uppercase tracking-[0.2em] text-cream text-center shadow-soft hover:bg-espresso/90 transition"
          >
            {ctaLabels.menu}
          </Link>
          <Link
            href={`/${params.locale}/catering`}
            className="w-full sm:w-auto rounded-full border border-espresso px-6 py-3 text-sm uppercase tracking-[0.2em] text-espresso text-center hover:bg-espresso hover:text-cream transition"
          >
            {ctaLabels.catering}
          </Link>
        </div>
      </section>

      <section className="container grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-latte bg-white/80 p-8 shadow-card">
          <SectionTitle eyebrow={ctaLabels.proofLabel} title={content.proof.title} />
          <div className="mt-6 space-y-4 text-espresso/70 text-[1.05rem] leading-relaxed">
            {content.proof.quotes.map((quote) => (
              <p key={quote}>“{quote}”</p>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <OpeningHours title={ctaLabels.hours} badge={ctaLabels.today} locale={params.locale} />
          <div className="rounded-[28px] border border-latte bg-espresso px-6 py-6 text-cream shadow-lift">
            <p className="section-label text-cream/70">{ctaLabels.reservation}</p>
            <p className="font-serif text-2xl mt-4">{content.contactBlock.title}</p>
            <p className="text-cream/80 mt-2 text-[0.98rem] leading-relaxed">{content.brunchPage.note}</p>
            <a
              href={siteSettings.reservationUrl}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-cream px-4 py-2 text-[0.7rem] uppercase tracking-[0.22em] text-cream hover:bg-cream hover:text-espresso transition"
            >
              {ctaLabels.reserve}
            </a>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="rounded-[40px] border border-latte bg-editorial-wash p-10 shadow-soft grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="section-label">{ctaLabels.visit}</p>
            <h2 className="font-serif text-3xl text-espresso">{content.contactBlock.title}</h2>
            <p className="text-espresso/70 text-[1.02rem] leading-relaxed">
              {siteSettings.address} · {siteSettings.phone} · {siteSettings.email}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <a
              href={siteSettings.mapUrl}
              className="w-full sm:w-auto rounded-full border border-espresso px-6 py-3 text-sm uppercase tracking-[0.2em] text-espresso hover:bg-espresso hover:text-cream transition text-center"
            >
              {ctaLabels.find}
            </a>
            <Link
              href={`/${params.locale}/menu`}
              className="w-full sm:w-auto rounded-full bg-espresso px-6 py-3 text-sm uppercase tracking-[0.2em] text-cream text-center shadow-soft hover:bg-espresso/90 transition"
            >
              {ctaLabels.menu}
            </Link>
            <Link
              href={`/${params.locale}/catering`}
              className="w-full sm:w-auto rounded-full border border-espresso px-6 py-3 text-sm uppercase tracking-[0.2em] text-espresso text-center hover:bg-espresso hover:text-cream transition"
            >
              {ctaLabels.catering}
            </Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </div>
  );
}
