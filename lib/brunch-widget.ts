export type BrunchLocale = "fi" | "en" | "fr";

type JsonRecord = Record<string, unknown>;

export class BrunchContractError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(code);
    this.code = code;
  }
}

function record(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : {};
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function numberValue(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function localeValue(value: unknown): BrunchLocale {
  const locale = stringValue(value).toLowerCase().split(/[-_]/)[0];
  return locale === "fi" || locale === "en" ? locale : "fr";
}

export function buildBrunchDatesResponse(input: unknown) {
  const offer = record(input);
  const metadata = record(offer.publicMetadata);
  const rawOptions = Array.isArray(metadata.options) ? metadata.options : [];
  const options = rawOptions.flatMap((candidate) => {
    const option = record(candidate);
    const code = stringValue(option.code);
    if (!code) return [];
    const price = numberValue(option.price);
    const priceSupplement = numberValue(option.priceSupplement);
    return [{ code, price, priceSupplement }];
  });
  const dates = Array.isArray(offer.dates) ? offer.dates : [];
  const offerId = stringValue(offer.id);
  const slug = stringValue(offer.slug);
  const pricePerPerson = numberValue(offer.pricePerPerson);
  const currency = stringValue(offer.currency);
  if (
    !offerId ||
    slug !== "brunch" ||
    pricePerPerson == null ||
    !currency ||
    !options.some(
      (option) => option.code === "classic" && option.price != null,
    ) ||
    !options.some(
      (option) => option.code === "sparkling" && option.priceSupplement != null,
    )
  ) {
    throw new BrunchContractError("INVALID_OFFER_CONTRACT");
  }

  return {
    ok: true,
    offer: {
      id: offerId,
      slug,
      name: stringValue(offer.name),
      pricePerPerson,
      currency,
      titleI18n: record(metadata.titleI18n),
      options,
    },
    items: dates.flatMap((candidate) => {
      const date = record(candidate);
      const dateId = stringValue(date.date);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateId)) return [];
      const slots = Array.isArray(date.slots)
        ? date.slots.map(stringValue).filter(Boolean)
        : [];
      const occurrences = Array.isArray(date.occurrences)
        ? date.occurrences
        : [];
      const slotAvailability = slots.map((time) => {
        const occurrence = occurrences
          .map(record)
          .find((item) => item.time === time);
        return {
          time,
          available: occurrence?.available === true,
          remainingCapacity: numberValue(occurrence?.remainingCapacity) ?? 0,
        };
      });
      return [
        {
          date: dateId,
          endDate: stringValue(date.endDate) || dateId,
          slots,
          slotAvailability,
          title:
            stringValue(record(metadata.titleI18n).fr) ||
            stringValue(offer.name) ||
            "Brunch",
          titleI18n: record(metadata.titleI18n),
        },
      ];
    }),
  };
}

export function buildBrunchMenuResponse(
  input: unknown,
  requestedDate: string,
  requestedLocale: string,
) {
  const offer = record(input);
  const dates = Array.isArray(offer.dates) ? offer.dates.map(record) : [];
  const date = dates.find((candidate) => candidate.date === requestedDate);
  if (!date) throw new BrunchContractError("DATE_NOT_FOUND");

  const occurrences = Array.isArray(date.occurrences)
    ? date.occurrences.map(record)
    : [];
  const menus = occurrences.map((occurrence) => record(occurrence.menu));
  const menuIds = [
    ...new Set(menus.map((menu) => stringValue(menu.id)).filter(Boolean)),
  ];
  const missingMenu = menus.some((menu) => !stringValue(menu.id));

  if (menuIds.length > 1 || (menuIds.length === 1 && missingMenu)) {
    throw new BrunchContractError("INCONSISTENT_OCCURRENCE_MENU");
  }
  if (menuIds.length === 0) return { ok: true, menu: null, items: [] };

  const menu = menus.find((candidate) => candidate.id === menuIds[0])!;
  const rawItems = Array.isArray(menu.items) ? menu.items.map(record) : [];
  if (!rawItems.length) {
    return {
      ok: true,
      menu: { id: menuIds[0], name: stringValue(menu.name) },
      items: [],
    };
  }

  const locale = localeValue(requestedLocale);
  const items = rawItems.map((item) => {
    const display = record(item.publicDisplay);
    const category = stringValue(display.category);
    const name = stringValue(display.name);
    if (
      display.complete !== true ||
      !["drinks", "sweet", "savory"].includes(category) ||
      !name
    ) {
      throw new BrunchContractError("INVALID_MENU_PUBLIC_CONTENT");
    }
    return {
      id: stringValue(item.id),
      category: category as "drinks" | "sweet" | "savory",
      name,
      description: stringValue(display.description),
      locale,
    };
  });

  return {
    ok: true,
    menu: { id: menuIds[0], name: stringValue(menu.name) },
    items,
  };
}
