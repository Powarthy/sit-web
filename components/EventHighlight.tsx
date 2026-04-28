import { Locale, seasonalByLocale, siteSettings } from "../data/site-content";

export default function EventHighlight({
  title,
  subtitle,
  items,
  locale = "fr"
}: {
  title: string;
  subtitle: string;
  items: { label: string; value: string; meta?: string }[];
  locale?: Locale;
}) {
  const seasonal = seasonalByLocale[locale] ?? siteSettings.seasonal;
  
  return (
    <section className="py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <p className="section-label mb-4">{title}</p>
          <h2 className="display-title">{subtitle}</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-12 h-px bg-gold/50" />
          <span className="uppercase tracking-[0.2em] text-[0.65rem] text-cafe font-medium">
            {seasonal.title}
          </span>
        </div>
      </div>
      
      <div className="border-t border-espresso/10">
        {items.map((item, index) => (
          <div 
            key={item.label} 
            className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-espresso/10 transition-colors hover:bg-white/40 px-4 md:px-8 -mx-4 md:-mx-8"
          >
            <div className="w-full md:w-1/3 mb-2 md:mb-0">
              <p className="text-[0.65rem] uppercase tracking-[0.25em] text-cafe group-hover:text-gold transition-colors">{item.label}</p>
            </div>
            
            <div className="w-full md:w-1/2">
              <p className="font-serif text-3xl md:text-4xl text-espresso group-hover:pl-4 transition-all duration-500 ease-out">{item.value}</p>
            </div>
            
            <div className="w-full md:w-1/6 text-left md:text-right mt-2 md:mt-0">
              {item.meta && (
                <span className="inline-block border border-espresso/10 rounded-full px-4 py-1.5 text-xs text-espresso/60 uppercase tracking-widest bg-white/50 group-hover:bg-espresso group-hover:text-white transition-colors">
                  {item.meta}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-col md:flex-row gap-6 items-start md:items-center bg-espresso/5 p-8 md:p-10">
        <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center shrink-0">
          <span className="w-1.5 h-1.5 bg-gold rounded-full" />
        </div>
        <p className="text-base md:text-lg text-espresso/80 font-light leading-relaxed">
          <strong className="font-medium mr-2 uppercase text-xs tracking-widest">{seasonal.title} —</strong>
          {seasonal.description}
        </p>
      </div>
    </section>
  );
}
