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
  const canonical = buildLocalizedUrl(params.locale, localizedRoutes.catering[params.locale]);
  return {
    title: content.cateringPage.title,
    description: content.cateringPage.intro,
    alternates: {
      canonical,
      languages: getRouteAlternates("catering")
    },
    openGraph: {
      title: content.cateringPage.title,
      description: content.cateringPage.intro,
      url: canonical,
      siteName: siteSettings.name,
      type: "website",
      locale: params.locale,
      images: [{ url: ogImageUrl }]
    }
  };
}

export default function CateringPage({ params }: { params: { locale: Locale } }) {
  const content = getLocaleContent(params.locale);

  return (
    <div className="pb-24 space-y-16">
      <PageIntro title={content.cateringPage.title} description={content.cateringPage.intro} />

      <section className="container grid gap-6 md:grid-cols-3">
        {content.cateringPage.cards.map((card) => (
          <div key={card.title} className="rounded-3xl border border-latte bg-white/80 p-6 shadow-card">
            <h3 className="font-serif text-2xl text-espresso">{card.title}</h3>
            <p className="mt-4 text-espresso/70 text-[0.98rem] leading-relaxed">{card.description}</p>
          </div>
        ))}
      </section>

      <section className="container">
        <div className="rounded-[32px] border border-latte bg-espresso px-10 py-12 text-cream shadow-soft grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <p className="section-label text-cream/70">Catering</p>
            <h2 className="font-serif text-3xl">{content.cateringPage.ctaTitle}</h2>
            <p className="text-cream/80 text-[1.02rem] leading-relaxed">{content.cateringPage.ctaDescription}</p>
          </div>
          <div className="flex flex-col gap-4">
            <a
              href={`mailto:${siteSettings.email}`}
              className="w-full sm:w-auto rounded-full bg-cream px-6 py-3 text-sm uppercase tracking-[0.2em] text-espresso text-center hover:bg-cream/90 transition"
            >
              {content.cateringPage.cta}
            </a>
            <p className="text-[0.75rem] text-cream/70">{siteSettings.email} · {siteSettings.phone}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
