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
      "Façade éclairée du café",
      "Un serveur dans la salle du café",
      "Présentoir de brunch avec thé",
      "Brunch à trois étages",
      "Viennoiseries au comptoir",
      "Glaçage au pinceau",
      "Pâtons roulés avant cuisson",
      "Tartelettes garnies d’orange",
      "Pâte feuilletée repliée",
      "Farine saupoudrée sur des pâtons",
      "Brunch servi à table",
      "Présentoir garni de pâtisseries",
      "Brunch et verre de jus d’orange",
      "Pâtissier présentant une boîte de desserts",
      "Cappuccino et viennoiserie"
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
      "The café’s illuminated storefront",
      "A server in the café dining room",
      "Tiered brunch stand with tea",
      "Three-tier brunch spread",
      "Pastries on the counter",
      "Glaze being brushed onto pastry",
      "Rolled dough before baking",
      "Tartlets topped with orange slices",
      "Folded puff pastry dough",
      "Flour dusted over shaped dough",
      "Brunch served at a table",
      "Tiered stand filled with pastries",
      "Brunch with a glass of orange juice",
      "Pastry chef presenting a dessert box",
      "Cappuccino and a pastry"
    ]
  },
  fi: {
    eyebrow: "Galleria",
    title: "The French Café kuvina",
    description:
      "Astu sisään leivonnaisten, erikoiskahvien ja elämyksiin kahvilaan!",
    seoTitle: "Galleria | The French Café Kuusamo",
    seoDescription: "Tutustu The French Cafén leivonnaisiin, kahveihin ja tunnelmaan Kuusamossa visuaalisen gallerian kautta.",
    captions: [
      "Kahvilan valaistu julkisivu",
      "Tarjoilija kahvilasalissa",
      "Brunssitarjotin ja teekannu",
      "Kolmikerroksinen brunssitarjotin",
      "Leivonnaisia tiskillä",
      "Leivonnaisen voitelu siveltimellä",
      "Rullatut taikinapalat ennen paistamista",
      "Appelsiiniviipaleilla koristeltuja tartaletteja",
      "Taiteltu lehtitaikina",
      "Jauhojen sirottelu muotoillulle taikinalle",
      "Pöytään tarjoiltu brunssi",
      "Leivonnaisia kerrostarjottimella",
      "Brunssi ja lasillinen appelsiinimehua",
      "Kondiittori esittelee leivosrasiaa",
      "Cappuccino ja leivonnainen"
    ]
  }
};

const imageFiles = [
  ["French_Cafe_stillit9.webp", 2000, 1125],
  ["French_Cafe_stillit11.webp", 2400, 2400],
  ["French_Cafe_stillit26.webp", 2400, 3000],
  ["French_Cafe_stillit27.webp", 2400, 4266],
  ["French_Cafe_stillit33.webp", 2400, 3198],
  ["French_Cafe_stillit39.webp", 2400, 4267],
  ["French_Cafe_stillit42.webp", 2400, 3000],
  ["French_Cafe_stillit44.webp", 2400, 3000],
  ["French_Cafe_stillit45.webp", 2400, 4267],
  ["French_Cafe_stillit69.webp", 2400, 3198],
  ["French_Cafe_stillit74.webp", 2400, 4267],
  ["French_Cafe_stillit75.webp", 2400, 4267],
  ["French_Cafe_stillit32.webp", 2400, 3198],
  ["French_Cafe_stillit34.webp", 2400, 4267],
  ["boissons.webp", 2400, 3200]
] as const;

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
  const images = imageFiles.map(([file, width, height], i) => ({
    src: `/images/diapo/${file}`,
    width,
    height,
    alt: `${c.captions[i]} – The French Café`,
    caption: c.captions[i]
  }));

  return (
    <div className="pb-8">
      <PageIntro eyebrow={c.eyebrow} title={c.title} description={c.description} />
      <GalleryClient locale={locale} images={images} />
    </div>
  );
}
