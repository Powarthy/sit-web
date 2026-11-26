const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
const timeFormat = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const emailFormat = /^[^\s@]+@[^\s@]+$/;

export function isBrunchEmail(email: string) {
  return email.length <= 254 && emailFormat.test(email);
}

export function parseBrunchReservation(input: unknown) {
  if (typeof input !== "object" || input === null) return null;
  const body = input as Record<string, unknown>;
  if (body.companyWebsite != null && body.companyWebsite !== "") return null;

  const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
  const fullName = text(body.fullName);
  const email = text(body.email);
  const phone = text(body.phone);
  const allergies = text(body.allergies);
  const date = text(body.date);
  const time = text(body.time);
  const alternateTime = text(body.alternateTime);
  const peopleCount = typeof body.partySize === "number" ? body.partySize : Number(text(body.partySize));

  if (!fullName || fullName.length > 120 || !isBrunchEmail(email)) return null;
  if (!/^[+\d\s()./-]{5,40}$/.test(phone) || phone.replace(/\D/g, "").length < 5) return null;
  if (!Number.isInteger(peopleCount) || peopleCount < 1 || peopleCount > 20) return null;
  if (!dateFormat.test(date) || !timeFormat.test(time)) return null;
  if (allergies.length > 1000 || (allergies && body.allergyConsent !== true)) return null;
  if (body.locale !== "fr" && body.locale !== "en" && body.locale !== "fi") return null;

  const choice = body.availabilityChoice;
  if (choice !== undefined && choice !== "waitlist" && choice !== "alternate") return null;
  if (choice === "alternate" && !timeFormat.test(alternateTime)) return null;

  const [firstName, ...lastName] = fullName.split(/\s+/);
  return {
    offerSlug: "brunch",
    date,
    time,
    firstName,
    lastName: lastName.join(" "),
    email,
    phone,
    allergies,
    peopleCount,
    customerLocale: body.locale,
    availabilityChoice: choice,
    alternateTime: choice === "alternate" ? alternateTime : undefined,
  };
}
