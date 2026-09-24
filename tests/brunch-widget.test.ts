import assert from "node:assert/strict";
import test from "node:test";
import {
  BrunchContractError,
  buildBrunchDatesResponse,
  buildBrunchMenuResponse,
} from "../lib/brunch-widget.ts";

function menu(
  id: string,
  category: "drinks" | "sweet" | "savory",
  names: Record<string, string>,
) {
  return {
    id,
    name: id,
    items: [
      {
        id: `${id}-item`,
        publicDisplay: {
          locale: "en",
          category,
          name: names.en,
          description: "",
          complete: true,
        },
      },
    ],
  };
}

function offerFixture() {
  const october = menu("menu-october", "savory", { en: "French onion soup" });
  const november = menu("menu-november", "sweet", { en: "Chocolate mousse" });
  return {
    id: "offer-1",
    slug: "brunch",
    name: "Brunch",
    pricePerPerson: 45,
    currency: "EUR",
    publicMetadata: {
      titleI18n: { fi: "Brunssi", en: "Brunch", fr: "Brunch" },
      options: [
        { code: "classic", price: 45 },
        { code: "sparkling", priceSupplement: 13.5 },
      ],
    },
    dates: [
      {
        date: "2026-10-11",
        endDate: "2026-10-11",
        slots: ["10:45", "13:00"],
        occurrences: [
          {
            time: "10:45",
            available: true,
            remainingCapacity: 8,
            menu: october,
          },
          {
            time: "13:00",
            available: false,
            remainingCapacity: 0,
            menu: october,
          },
        ],
      },
      {
        date: "2026-11-08",
        slots: ["10:45", "13:00"],
        occurrences: [
          {
            time: "10:45",
            available: true,
            remainingCapacity: 12,
            menu: november,
          },
          {
            time: "13:00",
            available: true,
            remainingCapacity: 12,
            menu: november,
          },
        ],
      },
      {
        date: "2026-12-13",
        slots: ["10:45", "13:00"],
        occurrences: [
          {
            time: "10:45",
            available: true,
            remainingCapacity: 12,
            menu: { id: "menu-empty", name: "December", items: [] },
          },
          {
            time: "13:00",
            available: true,
            remainingCapacity: 12,
            menu: { id: "menu-empty", name: "December", items: [] },
          },
        ],
      },
    ],
  };
}

test("dates contract comes from ToqueHub with exact slots, prices and sold-out state", () => {
  const result = buildBrunchDatesResponse(offerFixture());
  assert.deepEqual(
    result.items.map((item) => item.date),
    ["2026-10-11", "2026-11-08", "2026-12-13"],
  );
  assert.deepEqual(result.items[0].slots, ["10:45", "13:00"]);
  assert.deepEqual(result.items[0].slotAvailability, [
    { time: "10:45", available: true, remainingCapacity: 8 },
    { time: "13:00", available: false, remainingCapacity: 0 },
  ]);
  assert.deepEqual(result.offer.options, [
    { code: "classic", price: 45, priceSupplement: null },
    { code: "sparkling", price: null, priceSupplement: 13.5 },
  ]);
});

test("changing the selected occurrence changes the menu", () => {
  const offer = offerFixture();
  assert.equal(
    buildBrunchMenuResponse(offer, "2026-10-11", "en").menu?.id,
    "menu-october",
  );
  assert.equal(
    buildBrunchMenuResponse(offer, "2026-11-08", "en").menu?.id,
    "menu-november",
  );
  assert.equal(
    buildBrunchMenuResponse(offer, "2026-10-11", "en").items[0].name,
    "French onion soup",
  );
});

test("an intentionally empty ToqueHub menu produces the bookable upcoming-menu state", () => {
  const result = buildBrunchMenuResponse(offerFixture(), "2026-12-13", "fi");
  assert.equal(result.menu?.id, "menu-empty");
  assert.deepEqual(result.items, []);
});

test("an inconsistent menu between the two services fails closed", () => {
  const offer = offerFixture();
  offer.dates[0].occurrences[1].menu = menu("wrong-menu", "sweet", {
    en: "Wrong",
  });
  assert.throws(
    () => buildBrunchMenuResponse(offer, "2026-10-11", "en"),
    (error) =>
      error instanceof BrunchContractError &&
      error.code === "INCONSISTENT_OCCURRENCE_MENU",
  );
});

test("missing localized public content never falls back to stale or technical content", () => {
  const offer = offerFixture();
  offer.dates[0].occurrences[0].menu.items[0].publicDisplay.complete = false;
  offer.dates[0].occurrences[1].menu.items[0].publicDisplay.complete = false;
  assert.throws(
    () => buildBrunchMenuResponse(offer, "2026-10-11", "fr"),
    (error) =>
      error instanceof BrunchContractError &&
      error.code === "INVALID_MENU_PUBLIC_CONTENT",
  );
});

test("an invalid backend payload is a controlled contract error", () => {
  assert.throws(
    () => buildBrunchDatesResponse({ ok: false }),
    (error) =>
      error instanceof BrunchContractError &&
      error.code === "INVALID_OFFER_CONTRACT",
  );
});
