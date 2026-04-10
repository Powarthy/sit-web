import { Locale, seasonalByLocale, siteSettings } from "../data/site-content";

export default function EventHighlight({
  title,
  subtitle,
  items,
  locale = "fr"
}: {
  title: string;
  subtitle: string;
  items: { label: string; value: string }[];
  locale?: Locale;
}) {
  const seasonal = seasonalByLocale[locale] ?? siteSettings.seasonal;
  return (
    <section className="lux-card p-8 md:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-label">{title}</p>
          <h3 className="font-serif text-3xl md:text-4xl text-espresso mt-4">{subtitle}</h3>
        </div>
        <span className="lux-chip">{seasonal.title}</span>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="space-y-2">
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-cafe">{item.label}</p>
            <p className="font-serif text-[1.65rem] text-espresso">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 rounded-[24px] border border-latte bg-editorial-wash px-6 py-5 text-[0.98rem] text-espresso/70 shadow-inner">
        <strong className="text-espresso">{seasonal.title}:</strong> {seasonal.description}
      </div>
    </section>
  );
}
