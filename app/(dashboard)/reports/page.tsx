import type { Metadata } from "next";

import ReportsView from "./reports-view";

export const metadata: Metadata = {
  title: "Reports",
  description: "Build and export visitor intelligence reports for Mundo Museum.",
};

export default function ReportsPage() {
  return <ReportsView />;
}
