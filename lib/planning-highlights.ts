import fs from "fs/promises";
import path from "path";

export type HighlightType =
  | "brunch"
  | "happy_hour"
  | "closure"
  | "seasonal_special"
  | "announcement";

export type PlanningHighlight = {
  id: string;
  types: HighlightType[];
  title: string;
  shortText: string;
  startDate: string;
  endDate: string;
  startTime: string | null;
  endTime: string | null;
  showOnWebsite: boolean;
  startAt?: string | null;
  endAt?: string | null;
  // Legacy fields (kept for backwards compatibility)
  type?: HighlightType;
  visibleOnWebsite?: boolean;
  slots?: string[];
  priority?: number;
  color?: string | null;
  locationLabel?: string | null;
};

export type PlanningSyncPayload = {
  generatedAt: string;
  highlights: PlanningHighlight[];
};

const STORAGE_PATH = path.join(process.cwd(), "data", "planning-highlights.json");

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^\d{2}:\d{2}$/;

const defaultPayload: PlanningSyncPayload = {
  generatedAt: new Date(0).toISOString(),
  highlights: []
};

const coerceHighlight = (highlight: PlanningHighlight): PlanningHighlight => {
  const rawTypes = Array.isArray(highlight.types)
    ? highlight.types
    : highlight.type
      ? [highlight.type]
      : [];
  const types = rawTypes.filter((item): item is HighlightType => Boolean(item));
  const showOnWebsite = highlight.showOnWebsite ?? highlight.visibleOnWebsite ?? true;
  return {
    ...highlight,
    types,
    startTime: highlight.startTime ?? null,
    endTime: highlight.endTime ?? null,
    showOnWebsite,
    slots: Array.isArray(highlight.slots) ? highlight.slots : [],
    priority: Number.isFinite(highlight.priority) ? highlight.priority : 0,
    visibleOnWebsite: highlight.visibleOnWebsite ?? showOnWebsite,
    color: highlight.color ?? null,
    locationLabel: highlight.locationLabel ?? null
  };
};

export const readPlanningHighlights = async (): Promise<PlanningSyncPayload> => {
  try {
    const raw = await fs.readFile(STORAGE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as PlanningSyncPayload;
    if (!parsed || !Array.isArray(parsed.highlights)) {
      return defaultPayload;
    }
    return {
      generatedAt: parsed.generatedAt ?? defaultPayload.generatedAt,
      highlights: parsed.highlights.map((item) => coerceHighlight(item))
    };
  } catch {
    return defaultPayload;
  }
};

export const writePlanningHighlights = async (payload: PlanningSyncPayload) => {
  await fs.mkdir(path.dirname(STORAGE_PATH), { recursive: true });
  await fs.writeFile(STORAGE_PATH, JSON.stringify(payload, null, 2), "utf-8");
};

export const validatePlanningPayload = (payload: PlanningSyncPayload) => {
  const errors: string[] = [];

  if (!payload || typeof payload !== "object") {
    return { isValid: false, errors: ["Payload must be an object"] };
  }

  if (typeof payload.generatedAt !== "string" || Number.isNaN(Date.parse(payload.generatedAt))) {
    errors.push("generatedAt must be a valid ISO date string");
  }

  if (!Array.isArray(payload.highlights)) {
    errors.push("highlights must be an array");
  } else {
    payload.highlights.forEach((highlight, index) => {
      if (!highlight || typeof highlight !== "object") {
        errors.push(`highlights[${index}] must be an object`);
        return;
      }

      if (!highlight.id || typeof highlight.id !== "string") {
        errors.push(`highlights[${index}].id must be a string`);
      }

      const hasType = typeof (highlight as PlanningHighlight).type === "string";
      const hasTypes = Array.isArray((highlight as PlanningHighlight).types);
      if (!hasType && !hasTypes) {
        errors.push(`highlights[${index}].types must be an array or type must be a string`);
      }

      if (!highlight.title || typeof highlight.title !== "string") {
        errors.push(`highlights[${index}].title must be a string`);
      }

      if (!highlight.shortText || typeof highlight.shortText !== "string") {
        errors.push(`highlights[${index}].shortText must be a string`);
      }

      if (!dateRegex.test(highlight.startDate)) {
        errors.push(`highlights[${index}].startDate must be YYYY-MM-DD`);
      }

      if (!dateRegex.test(highlight.endDate)) {
        errors.push(`highlights[${index}].endDate must be YYYY-MM-DD`);
      }

      if (highlight.startTime !== null && highlight.startTime !== undefined && !timeRegex.test(highlight.startTime)) {
        errors.push(`highlights[${index}].startTime must be HH:mm or null`);
      }

      if (highlight.endTime !== null && highlight.endTime !== undefined && !timeRegex.test(highlight.endTime)) {
        errors.push(`highlights[${index}].endTime must be HH:mm or null`);
      }

      if (
        highlight.showOnWebsite !== undefined &&
        typeof (highlight as PlanningHighlight).showOnWebsite !== "boolean" &&
        typeof (highlight as PlanningHighlight).visibleOnWebsite !== "boolean"
      ) {
        errors.push(`highlights[${index}].showOnWebsite must be a boolean`);
      }
    });
  }

  return { isValid: errors.length === 0, errors };
};

const typeOrder: HighlightType[] = ["brunch", "happy_hour", "closure", "seasonal_special", "announcement"];
const allowedWeeklyTypes: HighlightType[] = ["happy_hour", "closure", "seasonal_special", "announcement"];

const parseDate = (value: string) => new Date(`${value}T00:00:00`);
const addDays = (date: Date, days: number) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

export const getHighlightPrimaryType = (highlight: PlanningHighlight): HighlightType | null => {
  for (const type of typeOrder) {
    if (highlight.types.includes(type)) return type;
  }
  return highlight.types[0] ?? null;
};

const isWithinWindow = (highlight: PlanningHighlight, start: Date, end: Date) => {
  const startDate = parseDate(highlight.startDate);
  const endDate = parseDate(highlight.endDate);
  return startDate <= end && endDate >= start;
};

export const getWeeklyHighlights = async () => {
  const { highlights } = await readPlanningHighlights();
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const windowEnd = addDays(todayStart, 7);

  return highlights
    .map((highlight) => coerceHighlight(highlight))
    .filter((highlight) => highlight.showOnWebsite !== false)
    .filter((highlight) => highlight.types.some((type) => allowedWeeklyTypes.includes(type)))
    .filter((highlight) => isWithinWindow(highlight, todayStart, windowEnd))
    .sort((a, b) => parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime());
};

export const getUpcomingBrunch = async () => {
  const { highlights } = await readPlanningHighlights();
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return highlights
    .map((highlight) => coerceHighlight(highlight))
    .filter((highlight) => highlight.showOnWebsite !== false)
    .filter((highlight) => highlight.types.includes("brunch"))
    .filter((highlight) => parseDate(highlight.endDate) >= todayStart)
    .sort((a, b) => parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime())[0] ?? null;
};

export const getWebsiteHighlights = async () => {
  const [weekly, brunch] = await Promise.all([getWeeklyHighlights(), getUpcomingBrunch()]);
  return brunch ? [brunch, ...weekly] : weekly;
};

export const getCurrentHighlight = async () => {
  const highlights = await getWebsiteHighlights();
  return highlights[0] ?? null;
};
