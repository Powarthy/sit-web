import type { Metadata } from "next";
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

export default function MenuPage({ params }: { params: { locale: Locale } }) {
  const content = getLocaleContent(params.locale);
  const labels = {
    reserve: params.locale === "fr" ? "Réserver" : params.locale === "en" ? "Reserve" : "Varaa",
    catering: params.locale === "fr" ? "Demander un devis" : params.locale === "en" ? "Request catering" : "Pyydä catering"
  };

  return (
    <div className="pb-24 space-y-16">
      <PageIntro title={content.menuPage.title} description={content.menuPage.intro} />

      <section className="container space-y-12">
        {content.menuPage.sections.map((section) => (
          <div key={section.title} className="rounded-3xl border border-latte bg-white/80 p-8 shadow-card">
            <SectionTitle title={section.title} description={section.description} />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {section.items.map((item) => (
                <div key={item.name} className="rounded-2xl border border-latte/60 bg-linen px-4 py-3">
                  <p className="font-medium text-espresso">{item.name}</p>
                  <p className="text-[0.98rem] text-espresso/70">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="container">
        <div className="rounded-[32px] border border-latte bg-editorial-wash p-8 shadow-soft grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <p className="section-label">{params.locale === "fr" ? "À table" : params.locale === "en" ? "At the table" : "Pöydässä"}</p>
            <h2 className="font-serif text-3xl text-espresso">{params.locale === "fr" ? "Réservez un brunch ou un service privé" : params.locale === "en" ? "Reserve a brunch or a private service" : "Varaa brunssi tai yksityinen tarjoilu"}</h2>
            <p className="text-espresso/70 text-[1.02rem] leading-relaxed">{content.brunchPage.note}</p>
          </div>
          <div className="flex flex-col gap-4">
            <a
              href={siteSettings.reservationUrl}
              className="w-full sm:w-auto rounded-full bg-espresso px-6 py-3 text-sm uppercase tracking-[0.2em] text-cream text-center shadow-soft hover:bg-espresso/90 transition"
            >
              {labels.reserve}
            </a>
            <a
              href={`mailto:${siteSettings.email}`}
              className="w-full sm:w-auto rounded-full border border-espresso px-6 py-3 text-sm uppercase tracking-[0.2em] text-espresso text-center hover:bg-espresso hover:text-cream transition"
            >
              {labels.catering}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
