import type { Metadata } from "next";
import FadeIn from "../../../components/FadeIn";
import {
  Locale,
  buildLocalizedUrl,
  getLocaleContent,
  getRouteAlternates,
  localizedRoutes,
  ogImageUrl,
  siteSettings
} from "../../../data/site-content";
import { ArrowDownRight } from "lucide-react";

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

export default function AboutPageFi({ params }: { params: { locale: Locale } }) {
  const content = getLocaleContent(params.locale);

  const ctaLabels = {
    house: "Notre maison",
    story: "Tarina",
    team: "Tiimi",
    vision: "Visio",
    values: "Arvot"
  };

  return (
    <div className="bg-linen min-h-screen selection:bg-gold selection:text-white pb-24">
      {/* HERO SECTION - INTRO WITH IMAGE BELOW */}
      <section className="pt-32 pb-16 md:pt-48 md:pb-24 px-6 md:px-12 lg:px-24 border-b border-espresso/10">
        <div className="w-full max-w-5xl">
          <FadeIn direction="up" delay={0.2}>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="w-8 h-px bg-gold/50" />
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-cafe font-medium">
                  {ctaLabels.house}
                </p>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl text-espresso tracking-tight leading-[0.9]">
                {content.aboutPage.title}
              </h1>
              <p className="text-espresso/80 font-light text-lg md:text-2xl max-w-2xl leading-relaxed mt-4">
                {content.aboutPage.intro}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* HERO IMAGE - FRENCH CAFE PHOTO */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-24">
        <FadeIn direction="up" delay={0.3}>
          <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
            <div
              className="absolute inset-0 w-full h-full scale-[1.02] transform transition-transform duration-[20s] ease-out hover:scale-[1.05]"
              style={{
                backgroundImage: `url(/images/diapo/French_Cafe_stillit9.webp)`,
                backgroundSize: "cover",
                backgroundPosition: "center 30%"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-linen/40 via-transparent to-transparent" />
          </div>
        </FadeIn>
      </section>

      {/* STORY SECTION - THE FRENCH CAFÉ */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          <div className="lg:col-span-7 order-1">
            <FadeIn direction="up" delay={0.2}>
              <div className="overflow-hidden">
                <div
                  className="h-80 sm:h-96 lg:h-[480px] w-full"
                  style={{
                    backgroundImage: `url(/images/diapo/French_Cafe_stillit39.webp)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                  role="img"
                  aria-label={content.aboutPage.sections[0].imageAlt}
                />
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-5 order-2">
            <FadeIn direction="up" delay={0.4}>
              <p className="section-label mb-6">{ctaLabels.story}</p>
              <h2 className="display-title mb-8">{content.aboutPage.sections[0].title}</h2>
              <div className="rich-text mb-10">
                {content.aboutPage.sections[0].paragraphs.map((paragraph: string, i: number) => (
                  <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* TEAM SECTION - MOONA & ARTHUR */}
      <section className="py-16 md:py-24 border-y border-espresso/10 bg-white/40">
        <div className="px-6 md:px-12 lg:px-24">
          <FadeIn direction="up">
            <p className="section-label mb-4">{ctaLabels.team}</p>
            <h2 className="display-title mb-16">Perustajat</h2>
          </FadeIn>

          <div className="grid gap-1 grid-cols-1 md:grid-cols-2 bg-espresso/10">
            {content.aboutPage.sections.slice(1).map((section, i) => (
              <FadeIn key={section.title} delay={i * 0.1} direction="up" className="bg-linen p-8 md:p-12 hover:bg-white transition-colors duration-500 flex flex-col justify-between min-h-[500px]">
                <div>
                  <h3 className="font-serif text-3xl md:text-4xl text-espresso mb-6">{section.title}</h3>
                  <div className="rich-text text-espresso/70 font-light leading-relaxed mb-8">
                    {section.paragraphs.map((p: string, j: number) => (
                      <p key={j} className="mb-4 last:mb-0">{p}</p>
                    ))}
                  </div>
                </div>
                <div className="mt-6 overflow-hidden">
                  <div
                    className="h-72 sm:h-80 md:h-96 w-full"
                    style={{
                      backgroundImage: `url(${section.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: i === 0 ? "center 15%" : "center 20%"
                    }}
                    role="img"
                    aria-label={section.imageAlt}
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* VISION SECTION */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <FadeIn direction="up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-espresso/10">
            <div className="bg-espresso text-white p-10 md:p-16 lg:p-20 flex flex-col justify-between min-h-[400px]">
              <div>
                <p className="uppercase tracking-[0.3em] text-[0.65rem] text-white/50 mb-6">{ctaLabels.vision}</p>
                <h3 className="font-serif text-4xl md:text-5xl">{content.aboutPage.visionTitle}</h3>
              </div>
              <div className="space-y-4 mt-12 pt-12 border-t border-white/10">
                {content.aboutPage.vision.map((paragraph: string, i: number) => (
                  <p key={i} className="text-white/70 font-light leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 sm:p-10 md:p-16 lg:p-20 flex flex-col justify-center min-h-[400px]">
              <p className="section-label mb-6">{ctaLabels.values}</p>
              <h3 className="font-serif text-4xl md:text-5xl mb-6 sm:mb-8">{content.aboutPage.valuesTitle}</h3>
              <div className="space-y-px bg-espresso/10">
                {content.aboutPage.values.map((value, i) => (
                  <div key={i} className="bg-linen grid grid-cols-1 sm:grid-cols-[minmax(120px,150px)_minmax(0,1fr)_auto] gap-3 sm:gap-4 py-4 px-4 sm:px-5 md:px-6 text-espresso/80 font-light items-start sm:items-center">
                    <span className="font-medium text-espresso break-words">{value.title}</span>
                    <span className="min-w-0 text-sm text-espresso/60 leading-relaxed text-left sm:text-right sm:max-w-[320px] sm:justify-self-end break-words">{value.description}</span>
                    <ArrowDownRight className="w-4 h-4 text-gold self-start sm:self-center mt-1 sm:mt-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
