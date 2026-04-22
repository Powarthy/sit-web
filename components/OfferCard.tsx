export default function OfferCard({
  title,
  description,
  highlights,
  variant = "standard"
}: {
  title: string;
  description: string;
  highlights: string[];
  key?: string;
  variant?: "featured" | "standard";
}) {
  const isFeatured = variant === "featured";
  return (
    <div
      className={`rounded-[28px] border p-6 shadow-card flex flex-col gap-4 ${
        isFeatured
          ? "border-espresso bg-espresso text-cream shadow-lift"
          : "border-latte bg-white/70 text-espresso"
      }`}
    >
      <h3 className={`font-serif ${isFeatured ? "text-3xl text-cream" : "text-2xl text-espresso"}`}>
        {title}
      </h3>
      <p className={`${isFeatured ? "text-cream/80" : "text-espresso/70"} text-[0.98rem] leading-relaxed`}>
        {description}
      </p>
      <ul className={`space-y-2 text-[0.95rem] ${isFeatured ? "text-cream/80" : "text-espresso/70"}`}>
        {highlights.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${isFeatured ? "bg-cream" : "bg-gold"}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
