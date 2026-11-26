// Netlify enforces the configured limit before continuing to the Next.js route.
export default function handleReservation() {
  return undefined;
}

export const config = {
  path: ["/api/brunch/reservations", "/api/brunch/email-code"],
  rateLimit: {
    windowLimit: 10,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
