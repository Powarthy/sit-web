import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { locales, siteSettings, getLocaleContent, getLocaleNavigation, localizedRoutes, Locale } from "../../data/site-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
  }
): Promise<Metadata> {
  const params = (await props.params) as { locale: Locale };
  const current = getLocaleContent(params.locale);
  return {
    title: current.seo.title,
    description: current.seo.description,
    openGraph: {
      title: current.seo.title,
      description: current.seo.description,
      type: "website",
      locale: params.locale,
      siteName: siteSettings.name,
      url: siteSettings.siteUrl
    }
  };
}

export default async function LocaleLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }
) {
  const params = (await props.params) as { locale: Locale };

  const {
    children
  } = props;

  const content = getLocaleContent(params.locale);
  const navigation = getLocaleNavigation(params.locale);

  return (
    <div className="min-h-screen flex flex-col">
      <Header locale={params.locale} navigation={navigation} reservationUrl={`/${params.locale}/${localizedRoutes.brunch[params.locale]}`} />
      <main className="flex-1">{children}</main>
      <Footer locale={params.locale} content={content.footer} />
    </div>
  );
}
