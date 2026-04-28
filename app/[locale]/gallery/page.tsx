import GalleryPage, { generateGalleryMetadata } from "../../../components/GalleryPage";
import type { Locale } from "../../../data/site-content";

export function generateMetadata({ params }: { params: { locale: Locale } }) {
  return generateGalleryMetadata(params.locale);
}

export default function Page({ params }: { params: { locale: Locale } }) {
  return <GalleryPage locale={params.locale} />;
}
