const baseUrl = process.env.PLANNING_SITE_BASE_URL || "http://localhost:3000";
const token = process.env.PLANNING_SYNC_TOKEN;
const runDestructive = process.env.RUN_DESTRUCTIVE === "1";

if (!token) {
  console.error("Missing PLANNING_SYNC_TOKEN in env.");
  process.exit(1);
}

const addDays = (date, days) => {
  const next = new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  const yyyy = next.getFullYear();
  const mm = String(next.getMonth() + 1).padStart(2, "0");
  const dd = String(next.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const today = new Date();

const buildHighlight = ({ id, types, startOffset, endOffset, title, shortText }) => ({
  id,
  showOnWebsite: true,
  types,
  title,
  shortText,
  startDate: addDays(today, startOffset),
  endDate: addDays(today, endOffset ?? startOffset),
  startTime: null,
  endTime: null
});

const payload = {
  generatedAt: new Date().toISOString(),
  highlights: [
    buildHighlight({
      id: "happy-hour-2d",
      types: ["happy_hour"],
      startOffset: 2,
      title: "Happy hour cette semaine",
      shortText: "2 jours"
    }),
    buildHighlight({
      id: "announcement-20d",
      types: ["announcement"],
      startOffset: 20,
      title: "Annonce lointaine",
      shortText: "Trop loin"
    }),
    buildHighlight({
      id: "closure-1d",
      types: ["closure"],
      startOffset: 1,
      title: "Fermeture demain",
      shortText: "Demain"
    }),
    buildHighlight({
      id: "seasonal-5d",
      types: ["seasonal_special"],
      startOffset: 5,
      title: "Spécial saison",
      shortText: "Dans 5 jours"
    }),
    buildHighlight({
      id: "brunch-past",
      types: ["brunch"],
      startOffset: -3,
      endOffset: -3,
      title: "Brunch passé",
      shortText: "Déjà fini"
    }),
    buildHighlight({
      id: "brunch-today",
      types: ["brunch"],
      startOffset: 0,
      endOffset: 0,
      title: "Brunch en cours",
      shortText: "Aujourd'hui"
    }),
    buildHighlight({
      id: "brunch-10d",
      types: ["brunch"],
      startOffset: 10,
      title: "Brunch prochain",
      shortText: "Dans 10 jours"
    }),
    buildHighlight({
      id: "brunch-40d",
      types: ["brunch"],
      startOffset: 40,
      title: "Brunch lointain",
      shortText: "Dans 40 jours"
    })
  ]
};

const request = async (path, options = {}) => {
  const resp = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`
    }
  });
  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(`${path} failed: ${resp.status} ${text}`);
  }
  return { status: resp.status, body: text ? JSON.parse(text) : null };
};

const run = async () => {
  console.log("Posting payload to site...");
  console.log("Payload:");
  console.log(JSON.stringify(payload, null, 2));
  const syncResp = await request("/api/internal/planning-sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  console.log("Sync response:", syncResp);

  console.log("Fetching debug output...");
  const debugResp = await request("/api/internal/planning-debug");
  const debug = debugResp.body;
  console.log("Debug response:", debugResp);

  const weeklyIds = new Set(debug.weekly.map((item) => item.id));
  const mergedIds = new Set(debug.merged.map((item) => item.id));
  const brunchId = debug.brunch?.id ?? null;

  const checks = [
    ["A happy_hour in 2 days appears", weeklyIds.has("happy-hour-2d")],
    ["B announcement in 20 days hidden", !weeklyIds.has("announcement-20d")],
    ["C closure tomorrow appears", weeklyIds.has("closure-1d")],
    ["D seasonal_special in 5 days appears", weeklyIds.has("seasonal-5d")],
    ["E only one brunch selected", Boolean(brunchId) && !weeklyIds.has("brunch-10d") && !weeklyIds.has("brunch-40d")],
    ["F brunch chosen is in-progress (today)", brunchId === "brunch-today"],
    ["H merged list contains brunch + weekly", mergedIds.has(brunchId) && weeklyIds.has("happy-hour-2d")]
  ];

  console.log("\nResults:");
  checks.forEach(([label, ok]) => {
    console.log(`${ok ? "✅" : "❌"} ${label}`);
  });

  console.log("\nDebug snapshot:");
  console.log(JSON.stringify({ brunch: debug.brunch, weekly: debug.weekly }, null, 2));

  if (runDestructive) {
    console.log("\nScenario F2 (brunch after end): mark brunch-today as past...");
    payload.highlights = payload.highlights.map((item) =>
      item.id === "brunch-today"
        ? { ...item, startDate: addDays(today, -1), endDate: addDays(today, -1) }
        : item
    );
    const brunchPastResp = await request("/api/internal/planning-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const brunchPastDebug = (await request("/api/internal/planning-debug")).body;
    console.log("Brunch past sync response:", brunchPastResp);
    console.log(
      `${brunchPastDebug.brunch?.id === "brunch-10d" ? "✅" : "❌"} F2 next brunch selected after past`
    );

    console.log("\nScenario G (removal): sending payload without happy-hour...");
    payload.highlights = payload.highlights.filter((item) => item.id !== "happy-hour-2d");
    const removalResp = await request("/api/internal/planning-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const debugAfterRemoval = (await request("/api/internal/planning-debug")).body;
    const weeklyAfterRemoval = new Set(debugAfterRemoval.weekly.map((item) => item.id));
    console.log("Removal sync response:", removalResp);
    console.log(`${weeklyAfterRemoval.has("happy-hour-2d") ? "❌" : "✅"} G removal hides happy-hour`);
  } else {
    console.log("\nSkipping destructive scenarios (set RUN_DESTRUCTIVE=1 to run them).");
  }
};

run().catch((err) => {
  console.error("E2E sync test failed:", err);
  process.exit(1);
});
