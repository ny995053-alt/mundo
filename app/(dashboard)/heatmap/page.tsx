import type { Metadata } from "next";

import { zones } from "../museum-data";
import HeatmapView from "./heatmap-view";

export const metadata: Metadata = {
  title: "Visitor Heatmap",
};

export default async function HeatmapPage({
  searchParams,
}: {
  searchParams: Promise<{ zone?: string }>;
}) {
  const { zone } = await searchParams;
  const initialZone = zone && zones.some((item) => item.id === zone) ? zone : "all";
  return <HeatmapView initialZone={initialZone} />;
}
