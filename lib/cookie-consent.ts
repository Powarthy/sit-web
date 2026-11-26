export type AnalyticsChoice = "accepted" | "refused";
const storageKey = "tfc.analytics-consent";
const changed = "tfc:analytics-consent";
const lifetime = 180 * 24 * 60 * 60 * 1000;
let temporaryChoice: AnalyticsChoice | null = null;

export function getAnalyticsChoice(): AnalyticsChoice | null {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return temporaryChoice;
    const { choice, expiresAt } = JSON.parse(stored);
    return expiresAt > Date.now() && (choice === "accepted" || choice === "refused") ? choice : null;
  } catch {
    return temporaryChoice;
  }
}

export function setAnalyticsChoice(choice: AnalyticsChoice) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify({ choice, expiresAt: Date.now() + lifetime }));
  } catch {
    temporaryChoice = choice;
  }
  window.dispatchEvent(new Event(changed));
}

export function subscribeToAnalyticsChoice(listener: () => void) {
  window.addEventListener(changed, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(changed, listener);
    window.removeEventListener("storage", listener);
  };
}
