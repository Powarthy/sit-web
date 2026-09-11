import { Locale, openingHoursByLocale, siteSettings } from "../data/site-content";
import { planningApiUrl } from "./planning-api";
import { readJson, writeJson } from "./storage";

export type PublicHoursDay = {
  date: string;
  weekday: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
  noteType?: string | null;
  noteText?: string | null;
  source?: string;
};

export type PlanningHoursPayload = {
  generatedAt: string;
  days: PublicHoursDay[];
};

const STORAGE_KEY = "planning-hours";
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const defaultPayload: PlanningHoursPayload = {
  generatedAt: new Date(0).toISOString(),
  days: []
};

const weekdayLabels: Record<Locale, Record<PublicHoursDay["weekday"], string>> = {
  fr: { mon: "Lun", tue: "Mar", wed: "Mer", thu: "Jeu", fri: "Ven", sat: "Sam", sun: "Dim" },
  en: { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" },
  fi: { mon: "Ma", tue: "Ti", wed: "Ke", thu: "To", fri: "Pe", sat: "La", sun: "Su" }
};
const weekdays: PublicHoursDay["weekday"][] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const closedLabels: Record<Locale, string> = { fr: "Fermé", en: "Closed", fi: "Suljettu" };
const openLabels: Record<Locale, string> = { fr: "Ouvert", en: "Open", fi: "Avoinna" };
const closureLabels: Record<Locale, string> = {
  fr: "Fermé exceptionnellement",
  en: "Exceptionally closed",
  fi: "Poikkeuksellisesti suljettu"
};
const noteLabels: Record<Locale, Record<string, string>> = {
  fr: {
    happy_hour: "Happy hour",
    brunch: "Brunch",
    high_season: "Haute saison",
    closure: closureLabels.fr
  },
  en: {
    happy_hour: "Happy hour",
    brunch: "Brunch",
    high_season: "High season",
    closure: closureLabels.en
  },
  fi: {
    happy_hour: "Happy hour",
    brunch: "Brunch",
    high_season: "Sesonkikausi",
    closure: closureLabels.fi
  }
};

const coerceDay = (day: PublicHoursDay): PublicHoursDay => ({
  ...day,
  openTime: day.openTime ?? null,
  closeTime: day.closeTime ?? null,
  noteType: day.noteType ?? null,
  noteText: day.noteText ?? null
});

type PlanningApiDay = {
  date: string;
  dayOfWeek: number;
  isOpen: boolean;
  openTime?: string | null;
  closeTime?: string | null;
  eventType?: string | null;
  label?: string | null;
  labelFr?: string | null;
  labelEn?: string | null;
  labelFi?: string | null;
  source?: string;
};

const getTodayDateKey = () =>
  new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Helsinki",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());

const getLocalizedApiLabel = (day: PlanningApiDay, locale: Locale) => {
  if (locale === "en") return day.labelEn || day.label || day.labelFr || day.labelFi || null;
  if (locale === "fi") return day.labelFi || day.label || day.labelFr || day.labelEn || null;
  return day.labelFr || day.label || day.labelEn || day.labelFi || null;
};

const fetchLivePlanningHours = async (locale: Locale): Promise<PlanningHoursPayload | null> => {
  try {
    const search = new URLSearchParams({ days: "7", language: locale });
    const response = await fetch(
      planningApiUrl(`/api/public/site/hours?${search.toString()}`),
      { cache: "no-store" }
    );

    if (!response.ok) return null;

    const payload = (await response.json()) as {
      ok?: boolean;
      config?: { updatedAt?: string };
      days?: PlanningApiDay[];
    };
    if (payload.ok !== true || !Array.isArray(payload.days)) return null;

    const days = payload.days
      .filter(
        (day) =>
          dateRegex.test(day.date) &&
          Number.isInteger(day.dayOfWeek) &&
          day.dayOfWeek >= 0 &&
          day.dayOfWeek <= 6 &&
          typeof day.isOpen === "boolean"
      )
      .map((day) => {
        const noteType = day.eventType && day.eventType !== "none" ? day.eventType : null;
        return {
          date: day.date,
          weekday: weekdays[day.dayOfWeek],
          isOpen: day.isOpen,
          openTime: day.openTime || null,
          closeTime: day.closeTime || null,
          noteType,
          noteText: noteType ? getLocalizedApiLabel(day, locale) : null,
          source: day.source || "application"
        } satisfies PublicHoursDay;
      });

    if (!days.length) return null;

    return {
      generatedAt: payload.config?.updatedAt || new Date().toISOString(),
      days
    };
  } catch {
    return null;
  }
};

export const readPlanningHours = async (): Promise<PlanningHoursPayload> => {
  const parsed = await readJson<PlanningHoursPayload>(STORAGE_KEY, defaultPayload);
  if (!parsed || !Array.isArray(parsed.days)) return defaultPayload;
  return {
    generatedAt: parsed.generatedAt ?? defaultPayload.generatedAt,
    days: parsed.days.map((day) => coerceDay(day))
  };
};

/**
 * Deduplicate days by date with priority rules:
 * 1. closure always wins (highest priority)
 * 2. for non-closure duplicates, keep the last entry
 * 3. ensure exactly one entry per date
 */
const deduplicateDays = (days: PublicHoursDay[]): PublicHoursDay[] => {
  const byDate = new Map<string, PublicHoursDay[]>();
  
  // Group by date
  for (const day of days) {
    const existing = byDate.get(day.date) ?? [];
    existing.push(day);
    byDate.set(day.date, existing);
  }
  
  // Resolve conflicts per date
  const resolved: PublicHoursDay[] = [];
  for (const [date, dayList] of byDate) {
    if (dayList.length === 1) {
      resolved.push(dayList[0]);
      continue;
    }
    
    // Priority 1: closure wins
    const closureDay = dayList.find(d => d.noteType === "closure" || d.source === "closure");
    if (closureDay) {
      resolved.push({
        ...closureDay,
        isOpen: false,
        openTime: null,
        closeTime: null,
        noteType: "closure",
        noteText: closureDay.noteText ?? "Fermeture exceptionnelle",
        source: "closure"
      });
      continue;
    }
    
    // Priority 2: keep the last entry (most recent in array)
    // This provides stable behavior for non-conflicting duplicates
    resolved.push(dayList[dayList.length - 1]);
  }
  
  return resolved.sort((a, b) => a.date.localeCompare(b.date));
};

export const writePlanningHours = async (payload: PlanningHoursPayload) => {
  // Deduplicate with closure priority before saving
  const deduplicated: PlanningHoursPayload = {
    generatedAt: payload.generatedAt,
    days: deduplicateDays(payload.days)
  };
  await writeJson(STORAGE_KEY, deduplicated);
};

export const validatePlanningHours = (payload: PlanningHoursPayload) => {
  const errors: string[] = [];
  if (!payload || typeof payload !== "object") {
    return { isValid: false, errors: ["Payload must be an object"] };
  }
  if (typeof payload.generatedAt !== "string" || Number.isNaN(Date.parse(payload.generatedAt))) {
    errors.push("generatedAt must be a valid ISO date string");
  }
  if (!Array.isArray(payload.days)) {
    errors.push("days must be an array");
  } else {
    payload.days.forEach((day, index) => {
      if (!day || typeof day !== "object") {
        errors.push(`days[${index}] must be an object`);
        return;
      }
      if (!dateRegex.test(day.date)) {
        errors.push(`days[${index}].date must be YYYY-MM-DD`);
      }
      if (!day.weekday) {
        errors.push(`days[${index}].weekday is required`);
      }
      if (typeof day.isOpen !== "boolean") {
        errors.push(`days[${index}].isOpen must be a boolean`);
      }
    });
  }
  return { isValid: errors.length === 0, errors };
};

export const getPublicHoursForLocale = async (locale: Locale) => {
  const livePayload = await fetchLivePlanningHours(locale);
  const storedPayload = livePayload ? null : await readPlanningHours();
  const today = getTodayDateKey();
  const days = livePayload?.days || storedPayload?.days.filter((day) => day.date >= today) || [];

  if (!days.length) {
    return openingHoursByLocale[locale] ?? siteSettings.openingHours;
  }
  return days.map((day) => {
    const label = weekdayLabels[locale]?.[day.weekday] ?? day.weekday;
    const dateValue = new Date(`${day.date}T00:00:00`);
    const dateLabel = Number.isNaN(dateValue.getTime())
      ? day.date
      : dateValue
          .toLocaleDateString(locale === "fr" ? "fr-FR" : locale === "en" ? "en-GB" : "fi-FI", {
            day: "numeric",
            month: "short"
          });
    const isClosure = day.noteType === "closure";
    const usesDefaultBrunchHours =
      day.noteType === "brunch" && day.isOpen && (!day.openTime || !day.closeTime);
    const baseHours = isClosure
      ? closureLabels[locale]
      : day.isOpen && day.openTime && day.closeTime
        ? `${day.openTime} – ${day.closeTime}`
        : usesDefaultBrunchHours
          ? "11:00 – 15:00"
        : day.isOpen
          ? openLabels[locale]
          : closedLabels[locale];
    const noteText = day.noteType ? noteLabels[locale]?.[day.noteType] ?? day.noteText ?? "" : day.noteText ?? "";
    const note = usesDefaultBrunchHours
      ? " (Brunch)"
      : !isClosure && noteText
        ? ` · ${noteText}`
        : "";
    return { day: `${label} ${dateLabel}`, hours: `${baseHours}${note}` };
  });
};
