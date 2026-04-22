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
  const canonical = buildLocalizedUrl(params.locale, localizedRoutes.brunch[params.locale]);
  return {
    title: content.brunchPage.title,
    description: content.brunchPage.intro,
    alternates: {
      canonical,
      languages: getRouteAlternates("brunch")
    },
    openGraph: {
      title: content.brunchPage.title,
      description: content.brunchPage.intro,
      url: canonical,
      siteName: siteSettings.name,
      type: "website",
      locale: params.locale,
      images: [{ url: ogImageUrl }]
    }
  };
}

export default function BrunchPage({ params }: { params: { locale: Locale } }) {
  const content = getLocaleContent(params.locale);

  return (
    <div className="pb-24 space-y-16">
      <PageIntro title={content.brunchPage.title} description={content.brunchPage.intro} />

      <section className="container grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-latte bg-white/80 p-8 shadow-card space-y-6">
          <SectionTitle eyebrow="Brunch" title={content.brunchPage.title} />
          <p className="text-espresso/70 text-[1.02rem] leading-relaxed">{content.brunchPage.note}</p>
          <div className="grid gap-4">
            {content.brunchPage.details.map((detail) => (
              <div key={detail.label} className="flex items-center justify-between border-b border-latte pb-3 text-espresso/70">
                <span className="uppercase tracking-[0.2em] text-[0.7rem] text-cafe">{detail.label}</span>
                <span className="font-medium text-espresso text-[0.98rem] md:text-base">{detail.value}</span>
              </div>
            ))}
          </div>
          <a
            href={siteSettings.reservationUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-espresso px-6 py-3 text-sm uppercase tracking-[0.22em] text-cream shadow-soft hover:bg-espresso/90 transition"
          >
            {content.brunchPage.cta}
          </a>
        </div>
        <div className="rounded-3xl border border-latte bg-soft-wash p-8 shadow-soft">
          <SectionTitle eyebrow="Process" title={params.locale === "fr" ? "Comment ça fonctionne" : params.locale === "en" ? "How it works" : "Miten se toimii"} />
          <ol className="mt-6 space-y-4 text-espresso/70 text-[0.98rem] md:text-base">
            {content.brunchPage.steps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="h-8 w-8 rounded-full border border-espresso/40 flex items-center justify-center text-xs font-semibold">
                  0{index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
