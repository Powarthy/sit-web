import GalleryPage, { generateGalleryMetadata } from "../../../components/GalleryPage";
import type { Locale } from "../../../data/site-content";

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  return generateGalleryMetadata(params.locale);
}

export default async function Page(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  return <GalleryPage locale={params.locale} />;
}
