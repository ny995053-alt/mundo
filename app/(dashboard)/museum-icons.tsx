import type { SVGProps } from "react";

export type IconName =
  | "activity"
  | "alert"
  | "arrowDown"
  | "arrowRight"
  | "arrowUp"
  | "bell"
  | "calendar"
  | "check"
  | "chevronDown"
  | "clock"
  | "close"
  | "dashboard"
  | "download"
  | "engagement"
  | "exhibit"
  | "file"
  | "filter"
  | "heatmap"
  | "help"
  | "live"
  | "menu"
  | "more"
  | "moon"
  | "insight"
  | "peak"
  | "plus"
  | "refresh"
  | "reports"
  | "search"
  | "settings"
  | "sun"
  | "table"
  | "telemetry"
  | "users"
  | "zones";

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
};

export function Icon({ name, size = 18, ...props }: IconProps) {
  const content = (() => {
    switch (name) {
      case "dashboard":
        return <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>;
      case "live":
        return <><path d="M4 13h3l2.2-7 4 12 2.1-7H20" /><circle cx="4" cy="13" r="1" /><circle cx="20" cy="11" r="1" /></>;
      case "heatmap":
        return <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><path d="M6.5 6.5h.01M17.5 6.5h.01M6.5 17.5h.01M17.5 17.5h.01" /></>;
      case "exhibit":
        return <><path d="M4 20h16M6 17h12M8 17V8m4 9V8m4 9V8M5 8h14l-7-4-7 4Z" /></>;
      case "reports":
      case "file":
        return <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>;
      case "zones":
        return <><path d="m4 7 8-4 8 4-8 4-8-4Z" /><path d="m4 12 8 4 8-4M4 17l8 4 8-4" /></>;
      case "settings":
        return <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.1A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.15.36.36.7.6 1 .3.3.7.46 1.1.46h.1v4h-.1c-.4 0-.8.16-1.1.46-.25.3-.45.64-.6 1.08Z" /></>;
      case "help":
        return <><circle cx="12" cy="12" r="9" /><path d="M9.6 9a2.5 2.5 0 1 1 3.2 2.4c-.8.3-.8 1-.8 1.6M12 17h.01" /></>;
      case "search":
        return <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>;
      case "sun":
        return <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" /></>;
      case "moon":
        return <path d="M20.3 15.4A8.5 8.5 0 0 1 8.6 3.7 8.5 8.5 0 1 0 20.3 15.4Z" />;
      case "bell":
        return <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>;
      case "menu":
        return <path d="M4 7h16M4 12h16M4 17h16" />;
      case "close":
        return <path d="m6 6 12 12M18 6 6 18" />;
      case "calendar":
        return <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M16 3v4M8 3v4M3 10h18" /></>;
      case "download":
        return <><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" /></>;
      case "plus":
        return <path d="M12 5v14M5 12h14" />;
      case "refresh":
        return <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M18.5 9A7 7 0 0 0 6 6.5L4 9m2 6a7 7 0 0 0 12.5 2.5L20 15" /></>;
      case "users":
        return <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>;
      case "clock":
        return <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>;
      case "alert":
        return <><path d="M10.3 4.2 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>;
      case "activity":
        return <path d="M3 12h4l2-7 4 14 2-7h6" />;
      case "engagement":
        return <><circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.5" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22" /></>;
      case "insight":
        return <><path d="M9 18h6M10 21h4" /><path d="M8.2 15.2A7 7 0 1 1 15.8 15c-.9.7-1.3 1.4-1.3 3h-5c0-1.5-.4-2.2-1.3-2.8Z" /><path d="M9.5 10.5 11.3 12l3.2-3" /></>;
      case "peak":
        return <><path d="M4 20V10M10 20V6M16 20V3M22 20H2" /><path d="m4 7 5-4 5 2 6-3" /></>;
      case "table":
        return <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M9 9v11M15 9v11" /></>;
      case "telemetry":
        return <><path d="M5 17a9 9 0 0 1 14 0M8 14a5 5 0 0 1 8 0" /><circle cx="12" cy="18" r="1.5" /><path d="M4 6h4M16 6h4M7 3v6M17 3v6" /></>;
      case "filter":
        return <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" />;
      case "check":
        return <path d="m5 12 4 4L19 6" />;
      case "arrowUp":
        return <path d="m7 14 5-5 5 5M12 9v10" />;
      case "arrowDown":
        return <path d="m7 10 5 5 5-5M12 5v10" />;
      case "arrowRight":
        return <path d="M5 12h14m-5-5 5 5-5 5" />;
      case "chevronDown":
        return <path d="m7 10 5 5 5-5" />;
      case "more":
        return <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>;
    }
  })();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {content}
    </svg>
  );
}
