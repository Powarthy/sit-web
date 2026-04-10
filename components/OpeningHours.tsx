import { Locale, openingHoursByLocale, siteSettings } from "../data/site-content";

export default function OpeningHours({
  title = "Horaires",
  badge = "Aujourd'hui",
  locale = "fr"
}: {
  title?: string;
  badge?: string;
  locale?: Locale;
}) {
  const openingHours = openingHoursByLocale[locale] ?? siteSettings.openingHours;
  return (
    <div className="rounded-[28px] border border-latte bg-white/80 p-6 shadow-card">
      <div className="flex items-center justify-between">
        <p className="section-label">{title}</p>
        <span className="lux-chip">{badge}</span>
      </div>
      <div className="mt-5 space-y-3">
        {openingHours.map((item) => (
          <div key={item.day} className="flex items-center justify-between text-sm md:text-base text-espresso/70">
            <span className="uppercase tracking-[0.15em] text-[0.7rem] text-espresso/60">{item.day}</span>
            <span className="font-medium text-espresso">{item.hours}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
