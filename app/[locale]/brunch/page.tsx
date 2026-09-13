import type { Metadata } from "next";
import BrunchReservationForm from "../../../components/BrunchReservationForm";
import PageIntro from "../../../components/PageIntro";
import {
  Locale,
  buildLocalizedUrl,
  getLocaleContent,
  getRouteAlternates,
  localizedRoutes,
  ogImageUrl,
  siteSettings
} from "../../../data/site-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(
  props: {
    params: Promise<{ locale: Locale }>;
  }
): Promise<Metadata> {
  const params = await props.params;
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

export default async function BrunchPage(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  const content = getLocaleContent(params.locale);

  return (
    <div className="bg-linen pb-24">
      <PageIntro title={content.brunchPage.title} description={content.brunchPage.intro} />

      <section className="container space-y-10">
        <BrunchReservationForm locale={params.locale} />

        <div className="grid gap-px bg-espresso/10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-white p-8 md:p-12">
            <h2 className="font-serif text-4xl text-espresso md:text-6xl">{content.brunchPage.title}</h2>
            <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-espresso/70">{content.brunchPage.note}</p>
            <div className="mt-10 grid gap-4 border-t border-espresso/10 pt-8">
              {content.brunchPage.details.map((detail) => (
                <div key={detail.label} className="flex items-center justify-between gap-6 border-b border-espresso/10 pb-3">
                  <span className="text-[0.65rem] uppercase tracking-[0.25em] text-cafe">{detail.label}</span>
                  <span className="text-right font-medium text-espresso">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="min-h-[420px] bg-cover bg-center"
            style={{ backgroundImage: `url(${siteSettings.heroImage})` }}
            aria-hidden="true"
          />
        </div>
      </section>
    </div>
  );
}
