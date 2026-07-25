import type { Metadata } from "next";

import LiveDashboard from "./live-dashboard";

export const metadata: Metadata = {
  title: "Live Dashboard",
};

export default function DashboardPage() {
  return <LiveDashboard />;
}

