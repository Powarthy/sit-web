export default function PageIntro({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <section className="py-16 bg-soft-wash">
      <div className="container">
        <div className="max-w-3xl space-y-4">
          {eyebrow ? <p className="section-label">{eyebrow}</p> : null}
          <h1 className="font-serif text-4xl md:text-5xl text-espresso">{title}</h1>
          <p className="text-espresso/70 text-[1.05rem] md:text-lg leading-relaxed">{description}</p>
        </div>
      </div>
    </section>
  );
}
