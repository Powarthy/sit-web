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
  type: HighlightType;
  title: string;
  shortText: string;
  startDate: string;
  endDate: string;
  startTime: string | null;
  endTime: string | null;
  slots: string[];
  priority: number;
  visibleOnWebsite: boolean;
  color: string | null;
  locationLabel: string | null;
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

const coerceHighlight = (highlight: PlanningHighlight): PlanningHighlight => ({
  ...highlight,
  startTime: highlight.startTime ?? null,
  endTime: highlight.endTime ?? null,
  slots: Array.isArray(highlight.slots) ? highlight.slots : [],
  priority: Number.isFinite(highlight.priority) ? highlight.priority : 0,
  visibleOnWebsite: highlight.visibleOnWebsite !== false,
  color: highlight.color ?? null,
  locationLabel: highlight.locationLabel ?? null
});

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

      if (!highlight.type || typeof highlight.type !== "string") {
        errors.push(`highlights[${index}].type must be a string`);
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

      if (highlight.slots !== undefined && !Array.isArray(highlight.slots)) {
        errors.push(`highlights[${index}].slots must be an array`);
      }

      if (highlight.priority !== undefined && typeof highlight.priority !== "number") {
        errors.push(`highlights[${index}].priority must be a number`);
      }

      if (highlight.visibleOnWebsite !== undefined && typeof highlight.visibleOnWebsite !== "boolean") {
        errors.push(`highlights[${index}].visibleOnWebsite must be a boolean`);
      }

      if (highlight.color !== undefined && highlight.color !== null && typeof highlight.color !== "string") {
        errors.push(`highlights[${index}].color must be a string or null`);
      }

      if (highlight.locationLabel !== undefined && highlight.locationLabel !== null && typeof highlight.locationLabel !== "string") {
        errors.push(`highlights[${index}].locationLabel must be a string or null`);
      }
    });
  }

  return { isValid: errors.length === 0, errors };
};

const typeWeight: Record<HighlightType, number> = {
  brunch: 0,
  happy_hour: 1,
  closure: 2,
  seasonal_special: 3,
  announcement: 4
};

const parseDate = (value: string) => new Date(`${value}T00:00:00`);

export const getWebsiteHighlights = async () => {
  const { highlights } = await readPlanningHighlights();
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return highlights
    .map((highlight) => coerceHighlight(highlight))
    .filter((highlight) => highlight.visibleOnWebsite !== false)
    .filter((highlight) => {
      const endDate = parseDate(highlight.endDate);
      return endDate >= todayStart;
    })
    .sort((a, b) => {
      const aStart = parseDate(a.startDate);
      const bStart = parseDate(b.startDate);
      const aActive = aStart <= todayStart && parseDate(a.endDate) >= todayStart;
      const bActive = bStart <= todayStart && parseDate(b.endDate) >= todayStart;

      if (aActive !== bActive) return aActive ? -1 : 1;
      if (typeWeight[a.type] !== typeWeight[b.type]) return typeWeight[a.type] - typeWeight[b.type];
      if (a.priority !== b.priority) return b.priority - a.priority;
      return aStart.getTime() - bStart.getTime();
    });
};

export const getCurrentHighlight = async () => {
  const highlights = await getWebsiteHighlights();
  return highlights[0] ?? null;
};

export const getUpcomingBrunch = async () => {
  const highlights = await getWebsiteHighlights();
  return highlights.find((highlight) => highlight.type === "brunch") ?? null;
};
