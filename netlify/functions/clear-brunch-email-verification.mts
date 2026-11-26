import { getStore } from "@netlify/blobs";
import {
  brunchEmailStoreName,
  termsAcceptanceRetentionDays,
  verificationRetentionDays,
} from "../../lib/brunch-verification-retention";

export const config = { schedule: "@daily" };

export default async function clearExpiredRecords() {
  const store = getStore({ name: brunchEmailStoreName, consistency: "strong" });
  const today = Date.now();
  const cutoff = (days: number) => new Date(today - days * 86400000).toISOString().slice(0, 10);
  const verificationCutoff = cutoff(verificationRetentionDays);
  const acceptanceCutoff = cutoff(termsAcceptanceRetentionDays);

  for await (const page of store.list({ paginate: true })) {
    const expired = page.blobs.filter(({ key }) => {
      const accepted = key.startsWith("acceptance/");
      const date = key.split("/")[accepted ? 1 : 0];
      return /^\d{4}-\d{2}-\d{2}$/.test(date) &&
        date < (accepted ? acceptanceCutoff : verificationCutoff);
    });
    for (let i = 0; i < expired.length; i += 10) {
      await Promise.all(expired.slice(i, i + 10).map(({ key }) => store.delete(key)));
    }
  }
}
