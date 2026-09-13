import { redirect } from "next/navigation";
import type { Locale } from "../../../data/site-content";
import { localizedRoutes } from "../../../data/site-content";

export default async function LegacyBrunchReservationPage(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  redirect(`/${params.locale}/${localizedRoutes.brunch[params.locale]}`);
}
