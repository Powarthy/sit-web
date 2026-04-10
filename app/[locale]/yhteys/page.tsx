import type { Metadata } from "next";
import OpeningHours from "../../../components/OpeningHours";
import PageIntro from "../../../components/PageIntro";
import SectionTitle from "../../../components/SectionTitle";
import {
  Locale,
  buildLocalizedUrl,
  getLocaleContent,
  getRouteAlternates,
  localizedRoutes,
  ogImageUrl,
  siteSettings
} from "../../../data/site-content";

export async function generateMetadata({
  params
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const content = getLocaleContent(params.locale);
  const canonical = buildLocalizedUrl(params.locale, localizedRoutes.contact[params.locale]);
  return {
    title: content.contactPage.title,
    description: content.contactPage.intro,
    alternates: {
      canonical,
      languages: getRouteAlternates("contact")
    },
    openGraph: {
      title: content.contactPage.title,
      description: content.contactPage.intro,
      url: canonical,
      siteName: siteSettings.name,
      type: "website",
      locale: params.locale,
      images: [{ url: ogImageUrl }]
    }
  };
}

export default function ContactPageFi({ params }: { params: { locale: Locale } }) {
  const content = getLocaleContent(params.locale);
  const labels = {
    hours: "Aukiolo",
    today: "Tänään"
  };

  return (
    <div className="pb-24 space-y-16">
      <PageIntro title={content.contactPage.title} description={content.contactPage.intro} />

      <section className="container grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-latte bg-white/80 p-8 shadow-card space-y-6">
          <SectionTitle eyebrow="Yhteys" title="Tule käymään" />
          <div className="space-y-3 text-espresso/70">
            {content.contactPage.methods.map((method) => (
              <div key={method.label} className="flex items-center justify-between border-b border-latte pb-3">
                <span className="uppercase tracking-[0.2em] text-[0.7rem] text-cafe">{method.label}</span>
                <span className="font-medium text-espresso text-[0.98rem] md:text-base">{method.value}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${siteSettings.email}`}
              className="rounded-full border border-espresso px-5 py-2 text-[0.7rem] uppercase tracking-[0.22em] text-espresso hover:bg-espresso hover:text-cream transition"
            >
              Sähköposti
            </a>
            <a
              href={`tel:${siteSettings.phone}`}
              className="rounded-full border border-espresso px-5 py-2 text-[0.7rem] uppercase tracking-[0.22em] text-espresso hover:bg-espresso hover:text-cream transition"
            >
              Soita
            </a>
            <a
              href={siteSettings.mapUrl}
              className="w-full sm:w-auto rounded-full bg-espresso px-5 py-2 text-[0.7rem] uppercase tracking-[0.22em] text-cream text-center hover:bg-espresso/90 transition"
            >
              Avaa kartta
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <OpeningHours title={labels.hours} badge={labels.today} locale={params.locale} />
          <div className="rounded-3xl border border-latte bg-espresso p-6 text-cream">
            <p className="section-label text-cream/70">{content.contactPage.reservationTitle}</p>
            <p className="font-serif text-2xl mt-4">{content.contactPage.reservationDescription}</p>
            <a
              href={siteSettings.reservationUrl}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-cream px-4 py-2 text-[0.7rem] uppercase tracking-[0.22em] text-cream hover:bg-cream hover:text-espresso transition"
            >
              Varaa
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
