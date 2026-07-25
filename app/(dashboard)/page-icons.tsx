import type { SVGProps } from "react";

export type PageIconName =
  | "artifact"
  | "artifactReport"
  | "capacityAlert"
  | "conversion"
  | "criticalWindow"
  | "curatorialNote"
  | "dataRefresh"
  | "dataSearch"
  | "dataTable"
  | "dateRange"
  | "documentAdd"
  | "dwellTime"
  | "entryFlow"
  | "executiveReport"
  | "export"
  | "flowBalance"
  | "flowConstraint"
  | "insideCount"
  | "interactionDepth"
  | "matrixReport"
  | "navigate"
  | "operationalNote"
  | "overflow"
  | "peakWindow"
  | "refreshInterval"
  | "reportDocument"
  | "reportNotification"
  | "reportReadiness"
  | "selector"
  | "sensorCoverage"
  | "sync"
  | "trendDown"
  | "trendUp"
  | "verified"
  | "visitorReport"
  | "visitorVolume"
  | "zoneCapacity"
  | "zoneMatrix";

type PageIconProps = SVGProps<SVGSVGElement> & {
  name: PageIconName;
  size?: number;
};

export function PageIcon({ name, size = 18, ...props }: PageIconProps) {
  const content = (() => {
    switch (name) {
      case "dateRange":
        return <><rect x="3.5" y="5" width="17" height="15.5" rx="3" /><path d="M8 3.5v3M16 3.5v3M3.5 9.5h17" /><path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" /></>;
      case "selector":
        return <path d="m7 9.5 5 5 5-5" />;
      case "export":
        return <><path d="M12 3.5v11M8.5 11l3.5 3.5 3.5-3.5" /><path d="M5 17v2.5h14V17" /></>;
      case "sync":
      case "dataRefresh":
        return <><path d="M19.5 8.5A8 8 0 0 0 6 5.8L4 8" /><path d="M4 4.5V8h3.5M4.5 15.5A8 8 0 0 0 18 18.2l2-2.2" /><path d="M20 19.5V16h-3.5" /></>;
      case "overflow":
        return <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>;
      case "navigate":
        return <><path d="M5 12h13" /><path d="m14 8 4 4-4 4" /></>;
      case "trendUp":
        return <><path d="m5 15 4.5-4.5 3 3L19 7" /><path d="M14.5 7H19v4.5" /></>;
      case "trendDown":
        return <><path d="m5 9 4.5 4.5 3-3L19 17" /><path d="M14.5 17H19v-4.5" /></>;
      case "dataSearch":
        return <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 4.5 4.5" /><path d="M7.5 8.5h6M7.5 11h5M7.5 13.5h3.5" /></>;
      case "documentAdd":
        return <><path d="M6 3.5h8l4 4V20.5H6z" /><path d="M14 3.5v4h4M9 14h6M12 11v6" /></>;
      case "verified":
        return <><circle cx="12" cy="12" r="8.5" /><path d="m8.2 12.2 2.5 2.5 5.2-5.4" /></>;
      case "visitorVolume":
      case "insideCount":
        return <><circle cx="9" cy="8" r="3" /><path d="M3.8 19c.4-4 2.2-6 5.2-6s4.8 2 5.2 6" /><circle cx="17" cy="9" r="2.2" /><path d="M15.5 14.2c2.9-.7 4.6.9 4.8 3.8" /></>;
      case "visitorReport":
        return <><path d="M6 3.5h8l4 4v13H6zM14 3.5v4h4" /><circle cx="10.5" cy="11" r="2" /><path d="M7.8 17c.3-2.4 1.2-3.6 2.7-3.6s2.4 1.2 2.7 3.6M15 11.5h1" /></>;
      case "dwellTime":
      case "refreshInterval":
        return <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3.2 2" /><path d="M5.7 5.7 4.3 4.3M18.3 5.7l1.4-1.4" /></>;
      case "flowConstraint":
      case "criticalWindow":
      case "capacityAlert":
        return <><path d="M12 3.5 21 12l-9 8.5L3 12z" /><path d="M12 8v5M12 16.5h.01" /></>;
      case "interactionDepth":
      case "conversion":
        return <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><path d="M18.5 5.5 21 3M18.5 5.5l-.2-3M18.5 5.5l3 .2" /></>;
      case "entryFlow":
        return <><path d="M4 5h7v14H4" /><path d="M8 12h12M16 8l4 4-4 4" /></>;
      case "flowBalance":
        return <><path d="M5 8h13M15 5l3 3-3 3M19 16H6M9 13l-3 3 3 3" /></>;
      case "peakWindow":
        return <><path d="M4 19.5V14h4v5.5M10 19.5V9h4v10.5M16 19.5V5h4v14.5" /><path d="M3 20h18" /><circle cx="18" cy="3.5" r="1.2" fill="currentColor" stroke="none" /></>;
      case "zoneCapacity":
        return <><path d="M4 4h7v6H4zM13 4h7v10h-7zM4 12h7v8H4zM13 16h7v4h-7z" /><path d="M7.5 7h.01M16.5 9h.01" /></>;
      case "zoneMatrix":
        return <><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M9 3.5v17M15 3.5v17M3.5 9h17M3.5 15h17" /><path d="M10.5 10.5h3v3h-3z" fill="currentColor" stroke="none" /></>;
      case "matrixReport":
        return <><path d="M6 3.5h8l4 4v13H6zM14 3.5v4h4" /><path d="M9 11h6v6H9zM12 11v6M9 14h6" /></>;
      case "artifact":
        return <><path d="M5 20h14M7 17h10M9 17v-5.5h6V17" /><path d="M10 8.5c0-2.8 1-5 2-5s2 2.2 2 5c0 1.5-.8 3-2 3s-2-1.5-2-3Z" /></>;
      case "artifactReport":
        return <><path d="M6 3.5h8l4 4v13H6zM14 3.5v4h4" /><path d="M8.5 17h7M9.5 15h5M10.5 15v-2.5h3V15M11 10c0-1.2.4-2.1 1-2.1s1 1 1 2.1-.4 2-1 2-1-.9-1-2Z" /></>;
      case "operationalNote":
      case "curatorialNote":
      case "reportReadiness":
        return <><path d="M5 4h14v16H5z" /><path d="M8 8h8M8 12h5" /><path d="m12.5 16 1.8 1.8 3.2-3.5" /></>;
      case "reportDocument":
        return <><path d="M6 3.5h8l4 4v13H6z" /><path d="M14 3.5v4h4M9 16v-3M12 16V9M15 16v-5" /></>;
      case "executiveReport":
        return <><rect x="3.5" y="4" width="17" height="16" rx="3" /><path d="M7 8h4M7 12h4M7 16h4" /><circle cx="16" cy="12" r="2.8" /><path d="M16 9.2V12h2.8" /></>;
      case "reportNotification":
        return <><path d="M5.5 3.5h8l4 4V12M13.5 3.5v4h4M5.5 20.5V3.5" /><path d="M10 11H8.5M10 15H8.5" /><path d="M14.5 18.5h5M15.5 18.5v-2a1.5 1.5 0 0 1 3 0v2M15 18.5c0 1.2.8 2 2 2s2-.8 2-2" /></>;
      case "sensorCoverage":
        return <><circle cx="12" cy="18" r="1.3" fill="currentColor" stroke="none" /><path d="M8.5 15a5 5 0 0 1 7 0M5.5 12a9 9 0 0 1 13 0" /><path d="M4 5h4M16 5h4M6 3v4M18 3v4" /></>;
      case "dataTable":
        return <><rect x="3.5" y="4" width="17" height="16" rx="2.5" /><path d="M3.5 9h17M9 9v11M15 9v11" /></>;
    }
  })();

  return (
    <svg
      data-page-icon=""
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      {...props}
    >
      {content}
    </svg>
  );
}
