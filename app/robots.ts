import { MetadataRoute } from "next";
import { siteSettings } from "../data/site-content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${siteSettings.siteUrl}/sitemap.xml`
  };
}
