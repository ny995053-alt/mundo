import type { Metadata } from "next";

import { exhibits } from "../museum-data";
import ExhibitAnalytics from "./exhibit-analytics";

export const metadata: Metadata = {
  title: "Exhibit Analytics",
};

export default async function ExhibitsPage({
  searchParams,
}: {
  searchParams: Promise<{ exhibit?: string }>;
}) {
  const { exhibit } = await searchParams;
  const initialId = exhibit && exhibits.some((item) => item.id === exhibit) ? exhibit : exhibits[0].id;
  return <ExhibitAnalytics initialExhibitId={initialId} />;
}
