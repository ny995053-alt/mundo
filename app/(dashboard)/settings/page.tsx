import type { Metadata } from "next";

import SettingsView from "./settings-view";

export const metadata: Metadata = {
  title: "Settings",
  description: "Configure the Mundo Museum visitor-intelligence workspace.",
};

export default function SettingsPage() {
  return <SettingsView />;
}
