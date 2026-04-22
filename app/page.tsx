import { redirect } from "next/navigation";
import { defaultLocale } from "../data/site-content";

export default function IndexPage() {
  redirect(`/${defaultLocale}`);
}
