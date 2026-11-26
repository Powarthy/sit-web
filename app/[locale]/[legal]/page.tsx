import { notFound } from "next/navigation";
import LegalDocument, { legalMetadata } from "../../../components/LegalDocument";
import { localizedRoutes, locales } from "../../../data/site-content";

type PageProps = { params: Promise<{ locale: string; legal: string }> };

async function resolveLegalRoute({ params }: PageProps) {
  const { locale: segment, legal } = await params;
  const locale = locales.find((value) => value === segment);
  if (!locale) notFound();
  if (legal === localizedRoutes.privacy[locale]) return { locale, kind: "privacy" } as const;
  if (legal === localizedRoutes.terms[locale]) return { locale, kind: "terms" } as const;
  notFound();
}

export async function generateMetadata(props: PageProps) {
  const { locale, kind } = await resolveLegalRoute(props);
  return legalMetadata(locale, kind);
}

export default async function LegalPage(props: PageProps) {
  return <LegalDocument {...await resolveLegalRoute(props)} />;
}
