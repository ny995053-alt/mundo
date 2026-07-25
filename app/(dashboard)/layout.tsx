import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import MuseumShell from "./museum-shell";

const openSans = localFont({
  src: "../../public/fonts/open-sans-latin-variable.woff2",
  variable: "--font-open-sans",
  weight: "300 800",
  style: "normal",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Visitor Intelligence | Mundo Museum",
    template: "%s | Mundo Museum",
  },
  description: "Mundo Museum visitor-flow intelligence and exhibit analytics workspace.",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className={openSans.variable}><MuseumShell>{children}</MuseumShell></div>;
}
