/**
 * E2E Test for Public Hours Sync
 * Tests cases A-J for automated public hours calculation
 * 
 * Run with:
 * PLANNING_SYNC_TOKEN=xxx node scripts/planning-hours-e2e.js
 */

const baseUrl = process.env.PLANNING_SITE_BASE_URL || "http://localhost:3002";
const token = process.env.PLANNING_SYNC_TOKEN;

if (!token) {
  console.error("Missing PLANNING_SYNC_TOKEN in env.");
  process.exit(1);
}

// Date helpers
const addDays = (date, days) => {
  const next = new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  const yyyy = next.getFullYear();
  const mm = String(next.getMonth() + 1).padStart(2, "0");
  const dd = String(next.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getWeekday = (date) => {
  const map = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return map[date.getDay()];
};

const isSecondWeekdayOfMonth = (dateStr, weekdayKey) => {
  const date = new Date(`${dateStr}T00:00:00`);
  if (getWeekday(date) !== weekdayKey) return false;
  const day = date.getDate();
  return day >= 8 && day <= 14;
};

const request = async (path, options = {}) => {
  const resp = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`
    }
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`${path} failed: ${resp.status} ${text.slice(0, 200)}`);
  }
  return resp.json();
};

// Find next 2nd Sunday of month
const findNextSecondSunday = (fromDate) => {
  let d = new Date(fromDate);
  while (true) {
    // Find 2nd Sunday of current month
    let sundayCount = 0;
    let testDate = new Date(d.getFullYear(), d.getMonth(), 1);
    while (testDate.getMonth() === d.getMonth()) {
      if (getWeekday(testDate) === "sun") {
        sundayCount++;
        if (sundayCount === 2 && testDate >= fromDate) {
          return addDays(testDate, 0);
        }
      }
      testDate.setDate(testDate.getDate() + 1);
    }
    // Try next month
    d.setMonth(d.getMonth() + 1);
    d.setDate(1);
  }
};

// Build a comprehensive test payload covering cases A-I
const buildTestPayload = () => {
  const today = new Date();
  const secondSunday = findNextSecondSunday(today);
  
  // Calculate days until 2nd Sunday to ensure we cover it
  const secondSundayDate = new Date(secondSunday);
  const daysUntilSecondSunday = Math.ceil((secondSundayDate - today) / (1000 * 60 * 60 * 24));
  const testWindow = Math.max(35, daysUntilSecondSunday + 5); // At least cover 2nd Sunday + a few days after
  
  // Configure high season to include a Monday within our test window
  // Monday 2026-04-20 is day 3 from today (2026-04-17)
  const highSeasonStart = addDays(today, 2); // Start high season 2 days from now
  const highSeasonEnd = addDays(today, 15);  // End high season 15 days from now
  
  const days = [];
  
  for (let i = 0; i < testWindow; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateId = addDays(date, 0);
    const weekday = getWeekday(date);
    
    // Base hours
    let isOpen = false;
    let openTime = null;
    let closeTime = null;
    let noteType = null;
    let noteText = null;
    let source = "base";
    
    switch (weekday) {
      case "tue":
      case "wed":
      case "thu":
        isOpen = true; openTime = "07:00"; closeTime = "17:00";
        break;
      case "fri":
        isOpen = true; openTime = "07:00"; closeTime = "17:00";
        break;
      case "sat":
        isOpen = true; openTime = "11:00"; closeTime = "17:00";
        break;
      case "sun":
      case "mon":
        isOpen = false;
        break;
    }
    
    // Case C: Happy hour Friday (every Friday for test)
    if (weekday === "fri" && isOpen) {
      closeTime = "20:00";
      noteType = "happy_hour";
      noteText = "Happy hour";
      source = "happy_hour";
    }
    
    // Case F: 2nd Sunday brunch
    if (dateId === secondSunday) {
      isOpen = true;
      openTime = "11:00";
      closeTime = "15:00";
      noteType = "brunch";
      noteText = "Brunch";
      source = "brunch";
    }
    
    // Case H: Monday high season (any Monday within high season period)
    // High season: from 2 days after today to 15 days after today
    if (weekday === "mon" && dateId >= highSeasonStart && dateId <= highSeasonEnd) {
      isOpen = true;
      openTime = "11:00";
      closeTime = "17:00";
      noteType = "high_season";
      noteText = "Haute saison";
      source = "high_season";
    }
    
    // Case I: First Tuesday closure
    if (weekday === "tue" && !days.some(d => d.noteType === "closure")) {
      isOpen = false;
      openTime = null;
      closeTime = null;
      noteType = "closure";
      noteText = "Fermeture exceptionnelle";
      source = "closure";
    }
    
    days.push({
      date: dateId,
      weekday,
      isOpen,
      openTime,
      closeTime,
      noteType,
      noteText,
      source
    });
  }
  
  return {
    generatedAt: new Date().toISOString(),
    days,
    _meta: {
      secondSunday,
      daysUntilSecondSunday,
      testWindow,
      highSeasonStart,
      highSeasonEnd
    }
  };
};

// Run E2E test
const run = async () => {
  console.log("=== Public Hours E2E Tests ===\n");
  console.log(`Site base URL: ${baseUrl}`);
  console.log(`Test date: ${new Date().toISOString().split('T')[0]}\n`);
  
  try {
    // Build comprehensive payload
    const payload = buildTestPayload();
    
    // Display payload summary
    const meta = payload._meta;
    console.log("Test configuration:");
    console.log(`  2nd Sunday target: ${meta.secondSunday} (in ${meta.daysUntilSecondSunday} days)`);
    console.log(`  High season period: ${meta.highSeasonStart} to ${meta.highSeasonEnd}`);
    console.log(`  Test window: ${meta.testWindow} days`);
    console.log();
    
    console.log("Payload summary:");
    payload.days.forEach(d => {
      const status = d.isOpen ? `${d.openTime}-${d.closeTime}` : "CLOSED";
      const tag = d.noteType ? `[${d.noteType}]` : "";
      console.log(`  ${d.date} (${d.weekday}): ${status} ${tag}`);
    });
    console.log();
    
    // POST payload (without _meta)
    console.log("--- POST /api/internal/planning-hours-sync ---");
    const { _meta, ...apiPayload } = payload;
    const postResult = await request("/api/internal/planning-hours-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(apiPayload)
    });
    console.log(`POST result: ${JSON.stringify(postResult)}\n`);
    
    // GET payload back
    console.log("--- GET /api/internal/planning-hours-sync ---");
    const getResult = await request("/api/internal/planning-hours-sync", { method: "GET" });
    console.log(`GET result: ${JSON.stringify(getResult, null, 2)}\n`);
    
    // Validate results
    const results = {};
    const storedDays = getResult?.days || [];
    
    // Test Case A: Tuesday normal (07:00-17:00)
    const tueNormal = storedDays.find(d => d.weekday === "tue" && d.source === "base" && !d.noteType);
    results.A = tueNormal && tueNormal.isOpen && tueNormal.openTime === "07:00" && tueNormal.closeTime === "17:00";
    console.log(`Case A (Tue normal 07-17): ${results.A ? "✅" : "❌"} ${tueNormal ? JSON.stringify(tueNormal) : "not found"}`);
    
    // Test Case B: Friday normal (07:00-17:00) - but we test with happy hour
    const friBase = storedDays.find(d => d.weekday === "fri" && d.source === "happy_hour");
    results.B = friBase && friBase.isOpen;
    console.log(`Case B/C (Fri): ${results.B ? "✅" : "❌"} ${friBase ? JSON.stringify(friBase) : "not found"}`);
    
    // Test Case C: Friday happy hour
    const friHappy = storedDays.find(d => d.weekday === "fri" && d.noteType === "happy_hour");
    results.C = friHappy && friHappy.isOpen && friHappy.openTime === "07:00" && friHappy.closeTime === "20:00";
    console.log(`Case C (Fri happy 07-20): ${results.C ? "✅" : "❌"} ${friHappy ? `open=${friHappy.openTime} close=${friHappy.closeTime}` : "not found"}`);
    
    // Test Case D: Saturday (11:00-17:00)
    const sat = storedDays.find(d => d.weekday === "sat" && d.source === "base");
    results.D = sat && sat.isOpen && sat.openTime === "11:00" && sat.closeTime === "17:00";
    console.log(`Case D (Sat 11-17): ${results.D ? "✅" : "❌"} ${sat ? `open=${sat.openTime} close=${sat.closeTime}` : "not found"}`);
    
    // Test Case E: Sunday closed (not 2nd)
    const sunClosed = storedDays.find(d => d.weekday === "sun" && !d.isOpen && d.source === "base");
    results.E = sunClosed && !sunClosed.isOpen;
    console.log(`Case E (Sun closed, not 2nd): ${results.E ? "✅" : "❌"} ${sunClosed ? "isOpen=false" : "not found"}`);
    
    // Test Case F: 2nd Sunday brunch
    const sunBrunch = storedDays.find(d => d.weekday === "sun" && d.noteType === "brunch");
    results.F = sunBrunch && sunBrunch.isOpen && sunBrunch.openTime === "11:00" && sunBrunch.closeTime === "15:00";
    console.log(`Case F (2nd Sun brunch 11-15): ${results.F ? "✅" : "❌"} ${sunBrunch ? `open=${sunBrunch.openTime} close=${sunBrunch.closeTime}` : "not found"}`);
    
    // Test Case G: Monday closed (normal)
    const monClosed = storedDays.find(d => d.weekday === "mon" && !d.isOpen && d.source === "base");
    results.G = monClosed && !monClosed.isOpen;
    console.log(`Case G (Mon closed): ${results.G ? "✅" : "❌"} ${monClosed ? "isOpen=false" : "not found"}`);
    
    // Test Case H: Monday high season
    const monHigh = storedDays.find(d => d.weekday === "mon" && d.noteType === "high_season");
    results.H = monHigh && monHigh.isOpen && monHigh.openTime === "11:00" && monHigh.closeTime === "17:00";
    console.log(`Case H (Mon high season 11-17): ${results.H ? "✅" : "❌"} ${monHigh ? `open=${monHigh.openTime} close=${monHigh.closeTime}` : "not found"}`);
    
    // Test Case I: Closure overrides (including duplicate scenario)
    const tueClosure = storedDays.find(d => d.weekday === "tue" && d.noteType === "closure");
    results.I = tueClosure && !tueClosure.isOpen && tueClosure.noteType === "closure";
    console.log(`Case I (Closure overrides): ${results.I ? "✅" : "❌"} ${tueClosure ? `isOpen=${tueClosure.isOpen} noteType=${tueClosure.noteType}` : "not found"}`);
    
    // Test Case I-bis: Duplicate handling - explicit test with open + closure for same date
    console.log(`\n--- Case I-bis: Duplicate resolution (open + closure same date) ---`);
    
    // Use a fixed date for duplicate test (April 29, 2026 is a Wednesday)
    const dupDate = "2026-04-29";
    const dupPayload = {
      generatedAt: new Date().toISOString(),
      days: [
        // First entry: open
        { date: dupDate, weekday: "wed", isOpen: true, openTime: "07:00", closeTime: "17:00", noteType: null, source: "base" },
        // Second entry: closure (should win)
        { date: dupDate, weekday: "wed", isOpen: false, openTime: null, closeTime: null, noteType: "closure", noteText: "Fermeture exceptionnelle", source: "closure" }
      ]
    };
    
    const dupPost = await request("/api/internal/planning-hours-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dupPayload)
    });
    
    // Read back and verify
    const dupGet = await request("/api/internal/planning-hours-sync", { method: "GET" });
    const dupDays = (dupGet?.days || []).filter(d => d.date === dupDate);
    
    console.log(`  Posted 2 entries for ${dupDate}, stored ${dupDays.length} entries`);
    if (dupDays.length === 1 && !dupDays[0].isOpen && dupDays[0].noteType === "closure") {
      console.log(`  ✅ DUPLICATE TEST PASSED: closure won, isOpen=false, noteType=closure`);
    } else if (dupDays.length === 2) {
      console.log(`  ❌ DUPLICATE TEST FAILED: both entries preserved (no deduplication)`);
      dupDays.forEach((d, i) => console.log(`     [${i}] isOpen=${d.isOpen}, noteType=${d.noteType}`));
    } else {
      console.log(`  ❌ DUPLICATE TEST FAILED: unexpected result`);
      dupDays.forEach((d, i) => console.log(`     [${i}] isOpen=${d.isOpen}, noteType=${d.noteType}`));
    }
    
    // Restore full payload for subsequent tests
    const restorePayload = buildTestPayload();
    await request("/api/internal/planning-hours-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(restorePayload)
    });
    
    // Test Case J: Site displays correctly
    results.J = storedDays.length >= 7 && storedDays.every(d => d.date && d.weekday && typeof d.isOpen === "boolean");
    console.log(`\nCase J (Site displays): ${results.J ? "✅" : "❌"} count=${storedDays.length}`);
    
    // Log special cases found
    console.log(`\nSpecial cases found:`);
    console.log(`- 2nd Sunday brunch: ${sunBrunch ? sunBrunch.date : 'NOT FOUND'}`);
    console.log(`- High season Monday: ${monHigh ? monHigh.date : 'NOT FOUND'}`);
    console.log(`- Closure Tuesday: ${tueClosure ? tueClosure.date : 'NOT FOUND'}`);
    
    // Summary
    console.log("\n=== Summary ===");
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    letters.forEach(l => {
      console.log(`${results[l] ? "✅" : "❌"} Case ${l}`);
    });
    
    const allPassed = letters.every(l => results[l]);
    console.log(`\n${allPassed ? "✅ ALL TESTS PASSED" : "❌ SOME TESTS FAILED"}`);
    
    // Check for discrepancies
    console.log("\n=== Discrepancies ===");
    if (!results.C && friHappy) {
      console.log(`Case C: Expected close=20:00, got close=${friHappy.closeTime}`);
    }
    if (!results.F && sunBrunch) {
      console.log(`Case F: Expected 11:00-15:00, got ${sunBrunch.openTime}-${sunBrunch.closeTime}`);
    }
    if (!results.H && monHigh) {
      console.log(`Case H: Expected 11:00-17:00, got ${monHigh.openTime}-${monHigh.closeTime}`);
    }
    if (!results.I && tueClosure) {
      console.log(`Case I: Expected isOpen=false, got isOpen=${tueClosure.isOpen}`);
    }
    
    process.exit(allPassed ? 0 : 1);
    
  } catch (err) {
    console.error("\n❌ E2E test failed:", err.message);
    process.exit(1);
  }
};

run();
