import type { Metadata } from "next";
import PageIntro from "./PageIntro";
import GalleryClient from "./GalleryClient";
import {
  Locale,
  buildLocalizedUrl,
  getRouteAlternates,
  localizedRoutes,
  ogImageUrl,
  siteSettings
} from "../data/site-content";

const copy: Record<Locale, { eyebrow: string; title: string; description: string; seoTitle: string; seoDescription: string; captions: string[] }> = {
  fr: {
    eyebrow: "Galerie",
    title: "L'univers The French Café en images",
    description:
      "Plongez dans nos pâtisseries, nos cafés signatures et l'atmosphère feutrée de notre maison à Kuusamo. Cliquez sur une image pour l'explorer en grand.",
    seoTitle: "Galerie | The French Café Kuusamo",
    seoDescription: "Découvrez en images les pâtisseries, cafés et ambiances de The French Café à Kuusamo.",
    captions: [
      "Pâtisseries du jour",
      "Croissants feuilletés",
      "Cafés de spécialité",
      "Dressage signature",
      "Bar à desserts",
      "Ambiance du matin",
      "Brunch dominical",
      "Créations saisonnières",
      "L'art du détail",
      "La salle en lumière",
      "Boissons signatures",
      "Mise en scène gourmande"
    ]
  },
  en: {
    eyebrow: "Gallery",
    title: "The French Café in pictures",
    description:
      "Step inside our pastries, signature coffees and the warm atmosphere of our Kuusamo house. Click any image to explore it in full screen.",
    seoTitle: "Gallery | The French Café Kuusamo",
    seoDescription: "Discover the pastries, coffees and atmosphere of The French Café in Kuusamo through our visual gallery.",
    captions: [
      "Today's pastries",
      "Buttery croissants",
      "Specialty coffees",
      "Signature plating",
      "Dessert bar",
      "Morning atmosphere",
      "Sunday brunch",
      "Seasonal creations",
      "The art of detail",
      "The room in daylight",
      "Signature drinks",
      "Gourmet staging"
    ]
  },
  fi: {
    eyebrow: "Galleria",
    title: "The French Café kuvina",
    description:
      "Astu sisään leivonnaistemme, signature-kahviemme ja Kuusamon talomme lämpimään tunnelmaan. Napsauta kuvaa katsellaksesi sitä suurempana.",
    seoTitle: "Galleria | The French Café Kuusamo",
    seoDescription: "Tutustu The French Cafén leivonnaisiin, kahveihin ja tunnelmaan Kuusamossa visuaalisen gallerian kautta.",
    captions: [
      "Päivän leivonnaiset",
      "Voiset croissantit",
      "Erikoiskahvit",
      "Signature-asettelu",
      "Jälkiruokabaari",
      "Aamun tunnelma",
      "Sunnuntain brunssi",
      "Kausiluomukset",
      "Yksityiskohtien taide",
      "Sali päivänvalossa",
      "Signature-juomat",
      "Gourmet-esillepano"
    ]
  }
};

const imageFiles = [
  "French_Cafe_stillit9.webp",
  "French_Cafe_stillit11.webp",
  "French_Cafe_stillit26.webp",
  "French_Cafe_stillit27.webp",
  "French_Cafe_stillit33.webp",
  "French_Cafe_stillit39.webp",
  "French_Cafe_stillit42.webp",
  "French_Cafe_stillit44.webp",
  "French_Cafe_stillit45.webp",
  "French_Cafe_stillit69.webp",
  "French_Cafe_stillit74.webp",
  "French_Cafe_stillit75.webp",
  "French_Cafe_stillit32.webp",
  "French_Cafe_stillit34.webp",
  "boissons.webp"
];

export function generateGalleryMetadata(locale: Locale): Metadata {
  const c = copy[locale];
  const canonical = buildLocalizedUrl(locale, localizedRoutes.gallery[locale]);
  return {
    title: c.seoTitle,
    description: c.seoDescription,
    alternates: {
      canonical,
      languages: getRouteAlternates("gallery")
    },
    openGraph: {
      title: c.seoTitle,
      description: c.seoDescription,
      url: canonical,
      siteName: siteSettings.name,
      type: "website",
      locale,
      images: [{ url: ogImageUrl }]
    }
  };
}

export default function GalleryPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const images = imageFiles.map((file, i) => ({
    src: `/images/diapo/${file}`,
    alt: `${c.captions[i % c.captions.length]} – The French Café`,
    caption: c.captions[i % c.captions.length]
  }));

  return (
    <div className="pb-8">
      <PageIntro eyebrow={c.eyebrow} title={c.title} description={c.description} />
      <GalleryClient locale={locale} images={images} />
    </div>
  );
}
