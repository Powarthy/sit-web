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
  const canonical = buildLocalizedUrl(params.locale, localizedRoutes.about[params.locale]);
  return {
    title: content.aboutPage.title,
    description: content.aboutPage.intro,
    alternates: {
      canonical,
      languages: getRouteAlternates("about")
    },
    openGraph: {
      title: content.aboutPage.title,
      description: content.aboutPage.intro,
      url: canonical,
      siteName: siteSettings.name,
      type: "website",
      locale: params.locale,
      images: [{ url: ogImageUrl }]
    }
  };
}

export default function AboutPageEn({ params }: { params: { locale: Locale } }) {
  const content = getLocaleContent(params.locale);
  const imagePositions = ["center 80%", "center 15%", "center 20%"];

  return (
    <div className="pb-24 space-y-24">
      <PageIntro title={content.aboutPage.title} description={content.aboutPage.intro} />

      <section className="container space-y-20">
        {content.aboutPage.sections.map((section, index) => (
          <div
            key={section.title}
            className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] items-center"
          >
            <div className={index % 2 === 1 ? "order-2 lg:order-1" : "order-1"}>
              <div className="rounded-[36px] border border-latte/60 bg-white/70 p-10 shadow-card space-y-7">
                <p className="section-label text-[0.78rem] md:text-xs">{section.title}</p>
                <h3 className="font-serif text-3xl md:text-4xl text-espresso">{section.title}</h3>
                <div className="rich-text space-y-6 text-[1.12rem] leading-[1.85] max-w-2xl">
                  {section.paragraphs.map((paragraph: string) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
            <div className={index % 2 === 1 ? "order-1 lg:order-2" : "order-2"}>
              <div className="overflow-hidden rounded-[36px] border border-latte/60 bg-white/80 shadow-card">
                <div
                  className="h-80 sm:h-96 lg:h-[480px]"
                  style={{
                    backgroundImage: `url(${section.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: imagePositions[index] ?? "center"
                  }}
                  role="img"
                  aria-label={section.imageAlt}
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="container">
        <div className="rounded-[44px] border border-latte/60 bg-editorial-wash p-12 shadow-soft space-y-7">
          <SectionTitle title={content.aboutPage.visionTitle} />
          <div className="rich-text space-y-6 text-[1.1rem] leading-[1.85] max-w-3xl">
            {content.aboutPage.vision.map((paragraph: string) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="container space-y-12">
        <SectionTitle title={content.aboutPage.valuesTitle} />
        <div className="grid gap-8 md:grid-cols-3">
          {content.aboutPage.values.map((value) => (
            <div key={value.title} className="rounded-[28px] border border-latte/60 bg-soft-wash p-8 min-h-[220px]">
              <SectionTitle title={value.title} description={value.description} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
