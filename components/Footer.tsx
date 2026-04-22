import Link from "next/link";
import { Locale, getLocaleNavigation, siteSettings } from "../data/site-content";
import { getPublicHoursForLocale } from "../lib/planning-hours";

export default async function Footer({
  locale,
  content
}: {
  locale: Locale;
  content: { description: string; rights: string };
}) {
  const navigation = getLocaleNavigation(locale);
  const openingHours = await getPublicHoursForLocale(locale);
  const labels = {
    address: locale === "fr" ? "Adresse" : locale === "en" ? "Address" : "Osoite",
    hours: locale === "fr" ? "Horaires" : locale === "en" ? "Hours" : "Aukiolo",
    navigation: locale === "fr" ? "Navigation" : locale === "en" ? "Navigation" : "Navigointi"
  };
  return (
    <footer className="bg-espresso text-cream relative overflow-hidden">
      <div className="absolute inset-0 bg-footer-glow opacity-60" />
      <div className="container relative py-16 grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-5">
          <h3 className="font-serif text-3xl">The French Café</h3>
          <p className="text-cream/80 max-w-md text-[1.05rem] leading-relaxed">{content.description}</p>
          <p className="text-cream/60 text-sm leading-relaxed">
            {locale === "fr"
              ? "Maison artisanale & accueil délicat depuis Kuusamo."
              : locale === "en"
                ? "An artisan house with gentle hospitality in Kuusamo."
                : "Artesaanitalo ja hienovarainen vieraanvaraisuus Kuusamossa."}
          </p>
        </div>
        <div className="space-y-4 text-sm text-cream/80">
          <p className="uppercase tracking-[0.2em] text-cream">{labels.address}</p>
          <p className="text-[0.98rem]">{siteSettings.address}</p>
          <p className="text-[0.98rem]">{siteSettings.phone}</p>
          <p className="text-[0.98rem]">{siteSettings.email}</p>
          <a href={siteSettings.instagramUrl} className="block text-cream/80 hover:text-cream">
            Instagram
          </a>
        </div>
        <div className="space-y-4 text-sm text-cream/80">
          <p className="uppercase tracking-[0.2em] text-cream">{labels.hours}</p>
          <div className="space-y-2">
            {openingHours.map((item) => (
              <div key={item.day} className="flex items-center justify-between gap-4">
                <span className="uppercase tracking-[0.18em] text-[0.7rem] text-cream/60">{item.day}</span>
                <span className="text-cream/90 text-[0.98rem] whitespace-nowrap text-right">{item.hours}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 text-sm text-cream/80">
          <p className="uppercase tracking-[0.2em] text-cream">{labels.navigation}</p>
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="block hover:text-cream">
              {item.label}
            </Link>
          ))}
          <a
            href={siteSettings.reservationUrl}
            className="inline-flex items-center justify-center rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.22em] text-espresso hover:bg-cream/90 transition"
          >
            {locale === "fr" ? "Réserver" : locale === "en" ? "Reserve" : "Varaa"}
          </a>
        </div>
      </div>
      <div className="border-t border-cream/20">
        <div className="container py-4 text-[0.75rem] text-cream/60 flex flex-col md:flex-row md:justify-between gap-3">
          <span>{content.rights}</span>
          <span>© {new Date().getFullYear()} The French Café</span>
        </div>
      </div>
    </footer>
  );
}
