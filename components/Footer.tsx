import Link from "next/link";
import { Locale, getLocaleNavigation, localizedRoutes, siteSettings } from "../data/site-content";
import { getPublicHoursForLocale } from "../lib/planning-hours";
import { TrackedAnchor, TrackedLink } from "./TrackedLink";

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
    hours: locale === "fr" ? "Horaires" : locale === "en" ? "Hours" : "Palvelemme",
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
                : "Käsityötä ja kaunista kahvilamiljöötä Kuusamossa."}
          </p>
        </div>
        <div className="space-y-4 text-sm text-cream/80">
          <p className="uppercase tracking-[0.2em] text-cream">{labels.address}</p>
          <p className="text-[0.98rem]">{siteSettings.address}</p>
          <p className="text-[0.98rem]">{siteSettings.phone}</p>
          <p className="text-[0.98rem]">{siteSettings.email}</p>
          <TrackedAnchor
            href={siteSettings.instagramUrl}
            eventName="instagram_clicked"
            eventParams={{ language: locale, source: "footer" }}
            className="block text-cream/80 hover:text-cream"
          >
            Instagram
          </TrackedAnchor>
        </div>
        <div className="space-y-4 text-sm text-cream/80">
          <p className="uppercase tracking-[0.2em] text-cream">{labels.hours}</p>
          <div className="space-y-2">
            {openingHours.map((item) => (
              <div key={item.day} className="grid grid-cols-[minmax(4.75rem,auto)_1fr] items-start gap-3">
                <span className="uppercase tracking-[0.18em] text-[0.7rem] leading-5 text-cream/60">{item.day}</span>
                <span className="text-right text-[0.98rem] leading-5 text-cream/90">{item.hours}</span>
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
          <TrackedLink
            href={`/${locale}/${localizedRoutes.brunch[locale]}`}
            eventName="brunch_reservation_started"
            eventParams={{ language: locale, source: "footer", button_location: "footer_navigation" }}
            className="inline-flex items-center justify-center rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.22em] text-espresso hover:bg-cream/90 transition"
          >
            {locale === "fr" ? "Réserver" : locale === "en" ? "Reserve" : "Varaa"}
          </TrackedLink>
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
