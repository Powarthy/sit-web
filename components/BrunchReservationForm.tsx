"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Loader2, Mail, Phone, Users } from "lucide-react";
import type { Locale } from "../data/site-content";
import { trackEvent } from "../lib/analytics";

type BrunchDate = {
  date: string;
  endDate: string;
  slots: string[];
  title: string;
  titleI18n?: Partial<Record<Locale, string>>;
  shortText?: string;
  shortTextI18n?: Partial<Record<Locale, string>>;
};

type BrunchMenuItem = {
  id: string;
  category: "drinks" | "sweet" | "savory";
  name: Partial<Record<Locale, string>>;
  description: Partial<Record<Locale, string>>;
};

type FormState = {
  date: string;
  time: string;
  fullName: string;
  email: string;
  phone: string;
  allergies: string;
  partySize: string;
  offer: "classic" | "sparkling";
};

const defaultForm: FormState = {
  date: "",
  time: "10:45",
  fullName: "",
  email: "",
  phone: "",
  allergies: "",
  partySize: "2",
  offer: "classic"
};

const labelsByLocale: Record<Locale, {
  loading: string;
  noDates: string;
  date: string;
  time: string;
  fullName: string;
  email: string;
  phone: string;
  allergies: string;
  partySize: string;
  submit: string;
  sending: string;
  success: string;
  redirected: (time: string) => string;
  waiting: string;
  error: string;
  optional: string;
  people: string;
  slotsTitle: string;
  detailsTitle: string;
  confirmTitle: string;
  confirmBody: string;
  confirmCancelRule: string;
  confirmBack: string;
  confirmOk: string;
  offer: string;
  classicOffer: string;
  sparklingOffer: string;
  menuTitle: string;
  noMenu: string;
  slotFullTitle: string;
  slotFullBody: string;
  chooseAlternate: (time: string) => string;
  chooseWaitlist: string;
  noAlternate: string;
}> = {
  fr: {
    loading: "Chargement des dates de brunch...",
    noDates: "Aucune date de brunch n'est ouverte à la réservation pour le moment.",
    date: "Date du brunch",
    time: "Créneau - deux services",
    fullName: "Nom et prénom",
    email: "Adresse mail",
    phone: "Téléphone",
    allergies: "Allergies",
    partySize: "Nombre de personnes",
    submit: "Confirmer la réservation",
    sending: "Envoi...",
    success: "Merci, votre demande de réservation est enregistrée.",
    redirected: (time) => `Le créneau demandé est complet. Votre réservation a été enregistrée sur le service de ${time}.`,
    waiting: "Les deux services sont complets pour cette taille de table. Votre demande est enregistrée en liste d'attente.",
    error: "Impossible d'enregistrer la réservation. Merci de réessayer.",
    optional: "optionnel",
    people: "personnes",
    slotsTitle: "Deux services",
    detailsTitle: "Vos informations",
    confirmTitle: "Avant de confirmer",
    confirmBody: "Tous nos produits sont faits maison et préparés spécialement pour le brunch.",
    confirmCancelRule: "Aucune annulation n'est possible moins de 24h avant la réservation.",
    confirmBack: "Modifier",
    confirmOk: "J'ai compris, confirmer",
    offer: "Offre brunch",
    classicOffer: "Brunch classique - 45 € / personne",
    sparklingOffer: "Brunch avec vin effervescent - +13,50 € / personne",
    menuTitle: "Menu du brunch",
    noMenu: "Le menu arrivera prochainement",
    slotFullTitle: "Ce service est complet",
    slotFullBody: "Le créneau choisi n'a plus de disponibilité pour cette taille de table. Vous pouvez choisir un autre service disponible ou rester sur liste d'attente pour ce créneau.",
    chooseAlternate: (time) => `Choisir le service de ${time}`,
    chooseWaitlist: "Me placer sur liste d'attente",
    noAlternate: "Aucun autre service disponible pour cette taille de table."
  },
  en: {
    loading: "Loading brunch dates...",
    noDates: "No brunch date is open for booking yet.",
    date: "Brunch date",
    time: "Time slot - two services",
    fullName: "Full name",
    email: "Email address",
    phone: "Phone",
    allergies: "Allergies",
    partySize: "Number of guests",
    submit: "Confirm booking",
    sending: "Sending...",
    success: "Thank you, your booking request has been saved.",
    redirected: (time) => `The requested service is full. Your booking has been saved for the ${time} service.`,
    waiting: "Both services are full for this table size. Your request has been saved on the waiting list.",
    error: "We could not save the booking. Please try again.",
    optional: "optional",
    people: "guests",
    slotsTitle: "Two services",
    detailsTitle: "Your details",
    confirmTitle: "Before confirming",
    confirmBody: "All our products are homemade and prepared specially for brunch.",
    confirmCancelRule: "Cancellations are not possible less than 24h before the booking.",
    confirmBack: "Edit",
    confirmOk: "I understand, confirm",
    offer: "Brunch offer",
    classicOffer: "Classic brunch - €45 / person",
    sparklingOffer: "Brunch with sparkling wine - +€13.50 / person",
    menuTitle: "Brunch menu",
    noMenu: "The menu is coming soon",
    slotFullTitle: "This service is full",
    slotFullBody: "The selected time no longer has availability for this table size. You can choose another available service or stay on the waiting list for this time.",
    chooseAlternate: (time) => `Choose the ${time} service`,
    chooseWaitlist: "Join the waiting list",
    noAlternate: "No other service is available for this table size."
  },
  fi: {
    loading: "Ladataan brunssipäiviä...",
    noDates: "Brunssivarauksia ei ole vielä avoinna.",
    date: "Ajankohta",
    time: "Aika - kaksi kattausta",
    fullName: "Nimi",
    email: "Sähköposti",
    phone: "Puhelin",
    allergies: "Allergiat",
    partySize: "Henkilömäärä",
    submit: "Vahvista varaus",
    sending: "Lähetetään...",
    success: "Kiitos, varauspyyntösi on tallennettu.",
    redirected: (time) => `Valitsemasi kattaus on täynnä. Varaus on tallennettu kattaukseen ${time}.`,
    waiting: "Molemmat kattaukset ovat täynnä tälle henkilömäärälle. Varauspyyntö on tallennettu jonotuslistalle.",
    error: "Varausta ei voitu tallentaa. Yritä uudelleen.",
    optional: "valinnainen",
    people: "henkilöä",
    slotsTitle: "Kaksi kattausta",
    detailsTitle: "Tietosi",
    confirmTitle: "Ennen vahvistusta",
    confirmBody: "Kaikki tuotteemme ovat kotitekoisia ja valmistetaan brunssia varten.",
    confirmCancelRule: "Peruutus ei ole mahdollinen alle 24 tuntia ennen varausta.",
    confirmBack: "Muokkaa",
    confirmOk: "Ymmärrän, vahvista",
    offer: "Brunssivaihtoehto",
    classicOffer: "Klassinen brunssi - 45 € / henkilö",
    sparklingOffer: "Brunssi kuohuviinillä - +13,50 € / henkilö",
    menuTitle: "Brunssimenu",
    noMenu: "Menu julkaistaan pian",
    slotFullTitle: "Tämä kattaus on täynnä",
    slotFullBody: "Valitussa kattauksessa ei ole enää tilaa tälle henkilömäärälle. Voit valita toisen vapaan kattauksen tai jäädä jonotuslistalle tähän aikaan.",
    chooseAlternate: (time) => `Valitse kattaus ${time}`,
    chooseWaitlist: "Liity jonotuslistalle",
    noAlternate: "Toista vapaata kattausta ei ole tälle henkilömäärälle."
  }
};

function formatDate(dateId: string, locale: Locale) {
  const parsed = new Date(`${dateId}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateId;
  return parsed.toLocaleDateString(locale === "fr" ? "fr-FR" : locale === "en" ? "en-GB" : "fi-FI", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
}

function getReservationService(time: string) {
  return time === "13:00" ? "service_2" : "service_1";
}

export default function BrunchReservationForm({ locale }: { locale: Locale }) {
  const labels = labelsByLocale[locale] ?? labelsByLocale.fr;
  const [dates, setDates] = useState<BrunchDate[]>([]);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<BrunchMenuItem[]>([]);
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [slotConflict, setSlotConflict] = useState<{ requestedTime: string; alternateTime: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadDates() {
      try {
        const response = await fetch("/api/brunch/dates", { cache: "no-store" });
        const payload = (await response.json()) as { items?: BrunchDate[] };
        const items = Array.isArray(payload.items) ? payload.items : [];
        if (cancelled) return;
        setDates(items);
        setForm((prev) => ({
          ...prev,
          date: prev.date || items[0]?.date || "",
          time: items[0]?.slots?.[0] || "10:45"
        }));
      } catch {
        if (!cancelled) setMessage({ kind: "error", text: labels.error });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadDates();
    return () => {
      cancelled = true;
    };
  }, [labels.error]);

  const selectedDate = useMemo(() => dates.find((item) => item.date === form.date) ?? dates[0] ?? null, [dates, form.date]);
  const slots = selectedDate?.slots?.length ? selectedDate.slots : ["10:45", "13:00"];

  useEffect(() => {
    let cancelled = false;
    async function loadMenu() {
      if (!form.date) return;
      const response = await fetch(`/api/brunch/menu?date=${encodeURIComponent(form.date)}&locale=${encodeURIComponent(locale)}`, { cache: "no-store" });
      const payload = (await response.json().catch(() => ({}))) as { items?: BrunchMenuItem[] };
      if (!cancelled) setMenuItems(Array.isArray(payload.items) ? payload.items : []);
    }
    void loadMenu();
    return () => {
      cancelled = true;
    };
  }, [form.date, locale]);

  async function sendReservation(choice?: "alternate" | "waitlist") {
    if (sending) return;
    setSending(true);
    setMessage(null);
    try {
      const response = await fetch("/api/brunch/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          locale,
          availabilityChoice: choice,
          alternateTime: choice === "alternate" ? slotConflict?.alternateTime : undefined
        })
      });
      const payload = (await response.json().catch(() => ({}))) as { placement?: string; finalTime?: string; requestedTime?: string; alternateTime?: string };
      if (response.status === 409) {
        setSlotConflict({ requestedTime: payload.requestedTime || form.time, alternateTime: payload.alternateTime || "" });
        return;
      }
      if (!response.ok) throw new Error("reservation_failed");
      const finalTime = payload.finalTime || form.time;
      trackEvent("brunch_reservation_submitted", {
        language: locale,
        source: "brunch_reservation_form",
        reservation_service: getReservationService(finalTime),
        placement: payload.placement || "confirmed"
      });
      setMessage({
        kind: "success",
        text: payload.placement === "redirected"
          ? labels.redirected(finalTime)
          : payload.placement === "waiting"
            ? labels.waiting
            : labels.success
      });
      setForm((prev) => ({
        ...defaultForm,
        date: prev.date,
        time: finalTime
      }));
      setSlotConflict(null);
    } catch {
      setMessage({ kind: "error", text: labels.error });
    } finally {
      setSending(false);
      setConfirmOpen(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!confirmOpen) {
      trackEvent("brunch_reservation_started", {
        language: locale,
        source: "brunch_reservation_form",
        reservation_service: getReservationService(form.time)
      });
      setConfirmOpen(true);
      return;
    }
    await sendReservation();
  }

  if (loading) {
    return (
      <div className="border border-espresso/10 bg-white/60 p-8 text-espresso/70">
        <Loader2 className="mb-4 h-5 w-5 animate-spin text-gold" />
        {labels.loading}
      </div>
    );
  }

  if (!dates.length) {
    return (
      <div className="border border-espresso/10 bg-white/70 p-8 text-espresso/70">
        <CalendarDays className="mb-4 h-6 w-6 text-gold" />
        {labels.noDates}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-px bg-espresso/10 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="bg-espresso p-8 text-white md:p-10">
        <div className="space-y-6">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/55">{labels.date}</span>
            <select
              className="w-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none focus:border-gold"
              value={form.date}
              onChange={(event) => {
                const nextDate = event.target.value;
                const next = dates.find((item) => item.date === nextDate);
                setForm((prev) => ({ ...prev, date: nextDate, time: next?.slots?.[0] || "10:45" }));
              }}
            >
              {dates.map((item) => (
                <option key={item.date} value={item.date} className="text-espresso">
                  {formatDate(item.date, locale)}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="mb-3 block text-xs uppercase tracking-[0.2em] text-white/55">{labels.time}</span>
            <div className="grid grid-cols-2 gap-3">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`border px-4 py-5 text-center font-serif text-3xl transition ${
                    form.time === slot
                      ? "border-gold bg-gold text-white"
                      : "border-white/20 bg-white/5 text-white hover:border-white/50"
                  }`}
                  onClick={() => setForm((prev) => ({ ...prev, time: slot }))}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <BrunchMenuPanel title={labels.menuTitle} items={menuItems} locale={locale} emptyText={labels.noMenu} />
        </div>
      </div>

      <div className="bg-white p-8 md:p-10">
        <p className="mb-6 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-cafe">{labels.detailsTitle}</p>
        <div className="grid gap-5">
          <label>
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-cafe">{labels.fullName}</span>
            <input className="w-full border border-espresso/15 px-4 py-3 outline-none focus:border-gold" required value={form.fullName} onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))} />
          </label>
          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cafe"><Mail className="h-3 w-3" />{labels.email}</span>
              <input className="w-full border border-espresso/15 px-4 py-3 outline-none focus:border-gold" type="email" required value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
            </label>
            <label>
              <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cafe"><Phone className="h-3 w-3" />{labels.phone}</span>
              <input className="w-full border border-espresso/15 px-4 py-3 outline-none focus:border-gold" required value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} />
            </label>
          </div>
          <label>
            <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cafe"><Users className="h-3 w-3" />{labels.partySize}</span>
            <input className="w-full border border-espresso/15 px-4 py-3 outline-none focus:border-gold" min="1" max="20" required type="number" value={form.partySize} onChange={(event) => setForm((prev) => ({ ...prev, partySize: event.target.value }))} />
          </label>
          <label>
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-cafe">{labels.offer}</span>
            <select className="w-full border border-espresso/15 px-4 py-3 outline-none focus:border-gold" value={form.offer} onChange={(event) => setForm((prev) => ({ ...prev, offer: event.target.value as FormState["offer"] }))}>
              <option value="classic">{labels.classicOffer}</option>
              <option value="sparkling">{labels.sparklingOffer}</option>
            </select>
          </label>
          <label>
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-cafe">{labels.allergies} <span className="text-espresso/40">({labels.optional})</span></span>
            <textarea className="min-h-28 w-full border border-espresso/15 px-4 py-3 outline-none focus:border-gold" value={form.allergies} onChange={(event) => setForm((prev) => ({ ...prev, allergies: event.target.value }))} />
          </label>
        </div>

        {message ? (
          <div className={`mt-6 flex items-start gap-3 border p-4 text-sm ${message.kind === "success" ? "border-emerald-600/20 bg-emerald-50 text-emerald-900" : "border-red-600/20 bg-red-50 text-red-900"}`}>
            {message.kind === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4" /> : null}
            <span>{message.text}</span>
          </div>
        ) : null}
        {slotConflict ? (
          <div className="mt-6 border border-gold/35 bg-gold/10 p-5 text-sm text-espresso">
            <h3 className="font-serif text-2xl">{labels.slotFullTitle}</h3>
            <p className="mt-2 text-espresso/75">{labels.slotFullBody}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {slotConflict.alternateTime ? (
                <button type="button" disabled={sending} className="bg-espresso px-4 py-3 text-xs uppercase tracking-[0.2em] text-white disabled:opacity-60" onClick={() => void sendReservation("alternate")}>
                  {labels.chooseAlternate(slotConflict.alternateTime)}
                </button>
              ) : (
                <div className="border border-espresso/10 px-4 py-3 text-espresso/60">{labels.noAlternate}</div>
              )}
              <button type="button" disabled={sending} className="border border-espresso/20 px-4 py-3 text-xs uppercase tracking-[0.2em] disabled:opacity-60" onClick={() => void sendReservation("waitlist")}>
                {labels.chooseWaitlist}
              </button>
            </div>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={sending}
          className="mt-8 inline-flex w-full items-center justify-center bg-espresso px-8 py-4 text-xs font-medium uppercase tracking-[0.25em] text-white transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? labels.sending : labels.submit}
        </button>
        {confirmOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/70 p-4">
            <div className="max-w-lg bg-white p-8 text-espresso shadow-2xl">
              <h3 className="font-serif text-3xl">{labels.confirmTitle}</h3>
              <p className="mt-4 text-espresso/75">{labels.confirmBody}</p>
              <p className="mt-3 font-semibold text-espresso">{labels.confirmCancelRule}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="button" className="flex-1 border border-espresso/20 px-5 py-3 text-xs uppercase tracking-[0.2em]" onClick={() => setConfirmOpen(false)}>
                  {labels.confirmBack}
                </button>
                <button type="submit" disabled={sending} className="flex-1 bg-espresso px-5 py-3 text-xs uppercase tracking-[0.2em] text-white disabled:opacity-60">
                  {sending ? labels.sending : labels.confirmOk}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}

function BrunchMenuPanel({ title, items, locale, emptyText }: { title: string; items: BrunchMenuItem[]; locale: Locale; emptyText: string }) {
  const labels: Record<BrunchMenuItem["category"], string> = {
    drinks: locale === "en" ? "Drinks" : locale === "fi" ? "Juomat" : "Boissons",
    sweet: locale === "en" ? "Sweet" : locale === "fi" ? "Makea" : "Sucré",
    savory: locale === "en" ? "Savory" : locale === "fi" ? "Suolainen" : "Salé",
  };
  if (!items.length) return <div className="border border-white/10 p-4 text-center text-sm text-white/65">{emptyText}</div>;
  return (
    <div className="space-y-5 border border-white/10 p-5 text-center">
      <div className="font-serif text-3xl text-white">{title}</div>
      {(["drinks", "sweet", "savory"] as const).map((category) => {
        const categoryItems = items.filter((item) => item.category === category);
        if (!categoryItems.length) return null;
        return (
          <div key={category}>
            <div className="mb-2 text-xs font-medium uppercase tracking-[0.24em] text-gold">{labels[category]}</div>
            <div className="space-y-2">
              {categoryItems.map((item) => (
                <div key={item.id}>
                  <div className="font-medium text-white">{item.name?.[locale] || item.name?.fr}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
