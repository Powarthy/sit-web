export default function SectionTitle({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-4">
      {eyebrow ? <p className="section-label">{eyebrow}</p> : null}
      <h2 className="font-serif text-4xl md:text-5xl text-espresso leading-tight">{title}</h2>
      {description ? (
        <p className="text-espresso/70 max-w-2xl text-[1.05rem] md:text-lg leading-relaxed">
          {description}
        </p>
      ) : null}
    </div>
  );
}
