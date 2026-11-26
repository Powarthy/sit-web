import Link from "next/link";
import { headers } from "next/headers";
import { defaultLocale, localizedRoutes, type Locale } from "../data/site-content";

const copy = {
  fr: ["Page introuvable", "Cette adresse a peut-être changé.", "Retour à l’accueil", "Réserver le brunch"],
  en: ["Page not found", "This address may have changed.", "Back to the homepage", "Book brunch"],
  fi: ["Sivua ei löytynyt", "Osoite on saattanut muuttua.", "Takaisin etusivulle", "Varaa brunssi"],
} satisfies Record<Locale, [string, string, string, string]>;

export default async function NotFound() {
  const language = (await headers()).get("x-site-locale");
  const locale = language === "en" || language === "fi" ? language : defaultLocale;
  const [title, message, home, brunch] = copy[locale];
  return (
    <main className="container flex min-h-[75svh] flex-col items-start justify-center gap-5 py-20">
      <Link href={`/${locale}`} className="font-serif text-2xl">The French Café</Link>
      <p className="section-label">404</p>
      <h1 className="display-title text-5xl md:text-7xl">{title}</h1>
      <p className="text-espresso/70">{message}</p>
      <div className="flex flex-wrap items-center gap-5">
        <Link href={`/${locale}`} className="bg-espresso px-5 py-3 text-cream hover:bg-cafe">{home}</Link>
        <Link href={`/${locale}/${localizedRoutes.brunch[locale]}`} className="underline underline-offset-4">{brunch}</Link>
      </div>
    </main>
  );
}
