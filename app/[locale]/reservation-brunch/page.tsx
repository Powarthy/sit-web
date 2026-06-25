import { redirect } from "next/navigation";
import type { Locale } from "../../../data/site-content";
import { localizedRoutes } from "../../../data/site-content";

export default function LegacyBrunchReservationPage({ params }: { params: { locale: Locale } }) {
  redirect(`/${params.locale}/${localizedRoutes.brunch[params.locale]}`);
}
