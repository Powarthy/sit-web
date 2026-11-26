import type { Metadata } from "next";
import { legalContent, type LegalPage } from "../data/legal-content";
import { buildLocalizedUrl, getRouteAlternates, localizedRoutes, ogImageUrl, siteSettings, type Locale } from "../data/site-content";
import PageIntro from "./PageIntro";

export function legalMetadata(locale: Locale, kind: LegalPage): Metadata {
  const { title, intro } = legalContent[locale][kind];
  const canonical = buildLocalizedUrl(locale, localizedRoutes[kind][locale]);
  return {
    title: `${title} | The French Café`,
    description: intro,
    alternates: { canonical, languages: getRouteAlternates(kind) },
    openGraph: { title, description: intro, url: canonical, images: [ogImageUrl] },
  };
}

export default function LegalDocument({ locale, kind }: { locale: Locale; kind: LegalPage }) {
  const { title, intro, sections } = legalContent[locale][kind];
  return (
    <div className="pb-24">
      <PageIntro title={title} description={intro} />
      <section className="container">
        <div className="mx-auto max-w-3xl space-y-9">
          {sections.map(([heading, body]) => (
            <section key={heading} className="border-b border-latte pb-6">
              <h2 className="font-serif text-3xl text-espresso">{heading}</h2>
              <p className="mt-3 leading-relaxed text-espresso/80">{body}</p>
            </section>
          ))}
          <address className="flex flex-wrap gap-x-6 gap-y-2 text-sm not-italic">
            <a href={`mailto:${siteSettings.email}`} className="break-all underline underline-offset-4">{siteSettings.email}</a>
            <a href={`tel:${siteSettings.phoneInternational}`} className="underline underline-offset-4">{siteSettings.phone}</a>
            {kind === "privacy" && (
              <a href="https://tietosuoja.fi/en/home" className="underline underline-offset-4">Tietosuojavaltuutetun toimisto</a>
            )}
          </address>
        </div>
      </section>
    </div>
  );
}
