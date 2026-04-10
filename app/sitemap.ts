import { MetadataRoute } from "next";
import { buildLocalizedUrl, locales, localizedRoutes } from "../data/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = Object.values(localizedRoutes);
  const urls = locales.flatMap((locale) =>
    pages.map((page) => ({
      url: buildLocalizedUrl(locale, page[locale]),
      lastModified: new Date()
    }))
  );

  return urls;
}
