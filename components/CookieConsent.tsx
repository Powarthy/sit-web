"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { localizedRoutes, type Locale } from "../data/site-content";
import { GA_MEASUREMENT_ID, setMeasurementDisabled } from "../lib/analytics";
import { getAnalyticsChoice, setAnalyticsChoice, subscribeToAnalyticsChoice, type AnalyticsChoice } from "../lib/cookie-consent";
import GoogleAnalytics from "./GoogleAnalytics";

const openPreferences = "tfc:cookie-preferences";
const headingId = "cookie-consent-heading";

const labels = {
  fr: {
    settings: "Préférences de cookies", title: "Cookies de mesure d’audience",
    description: "Avec votre accord, Google Analytics utilise des cookies pour mesurer les visites. Vous pouvez modifier votre choix à tout moment.",
    accept: "Accepter", refuse: "Refuser", privacy: "Politique de confidentialité",
  },
  en: {
    settings: "Cookie preferences", title: "Analytics cookies",
    description: "With your permission, Google Analytics uses cookies to measure visits. You can change your choice at any time.",
    accept: "Accept", refuse: "Decline", privacy: "Privacy policy",
  },
  fi: {
    settings: "Evästeasetukset", title: "Analytiikkaevästeet",
    description: "Suostumuksellasi Google Analytics mittaa käyntejä evästeiden avulla. Voit muuttaa valintaasi milloin tahansa.",
    accept: "Hyväksy", refuse: "Hylkää", privacy: "Tietosuojaseloste",
  },
} satisfies Record<Locale, Record<string, string>>;

export function CookiePreferencesButton({ locale }: { locale: Locale }) {
  return (
    <button
      type="button"
      className="text-left underline underline-offset-4 hover:text-cream"
      onClick={() => window.dispatchEvent(new Event(openPreferences))}
    >
      {labels[locale].settings}
    </button>
  );
}

const getServerChoice = () => undefined;

export default function CookieConsent({ locale }: { locale: Locale }) {
  const choice = useSyncExternalStore(subscribeToAnalyticsChoice, getAnalyticsChoice, getServerChoice);
  const [editing, setEditing] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const copy = labels[locale];

  useEffect(() => {
    const open = () => setEditing(true);
    window.addEventListener(openPreferences, open);
    return () => window.removeEventListener(openPreferences, open);
  }, []);

  useEffect(() => {
    if (editing) heading.current?.focus();
  }, [editing]);

  useEffect(() => {
    if (choice !== undefined) setMeasurementDisabled(choice !== "accepted");
  }, [choice]);

  function choose(value: AnalyticsChoice) {
    setMeasurementDisabled(value === "refused");
    setAnalyticsChoice(value);
    setEditing(false);
  }

  return (
    <>
      {(choice === null || editing) && (
        <section
          aria-labelledby={headingId}
          className="fixed inset-x-3 bottom-3 z-[80] max-h-[85svh] max-w-lg overflow-auto rounded-lg border border-latte bg-linen p-4 text-espresso shadow-xl sm:left-auto sm:right-5 sm:bottom-5 sm:p-5"
        >
          <h2 id={headingId} ref={heading} tabIndex={-1} className="font-serif text-2xl">{copy.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-espresso/80">{copy.description}</p>
          <Link className="mt-2 inline-block text-sm underline underline-offset-4" href={`/${locale}/${localizedRoutes.privacy[locale]}`}>
            {copy.privacy}
          </Link>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => choose("refused")} className="border border-espresso bg-white px-2 py-2.5 text-sm hover:bg-latte/30">{copy.refuse}</button>
            <button type="button" onClick={() => choose("accepted")} className="border border-espresso bg-white px-2 py-2.5 text-sm hover:bg-latte/30">{copy.accept}</button>
          </div>
        </section>
      )}
      {choice === "accepted" && GA_MEASUREMENT_ID && <GoogleAnalytics />}
    </>
  );
}
