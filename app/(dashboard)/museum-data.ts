export type ZoneStatus = "Normal" | "Busy" | "Critical";

export type MuseumZone = {
  id: string;
  name: string;
  shortName: string;
  visitors: number;
  capacity: number;
  occupancy: number;
  dwell: string;
  netFlow: number;
  status: ZoneStatus;
};

export type Exhibit = {
  id: string;
  name: string;
  code: string;
  zone: string;
  views: number;
  dwell: string;
  completion: number;
  score: number;
  trend: number;
  status: "Excellent" | "Strong" | "Watch";
  hourly: number[];
  previousHourly: number[];
};

export const zones: MuseumZone[] = [
  {
    id: "grand-atrium",
    name: "Grand Atrium",
    shortName: "Atrium",
    visitors: 268,
    capacity: 320,
    occupancy: 84,
    dwell: "8m 14s",
    netFlow: 18,
    status: "Busy",
  },
  {
    id: "ancient-worlds",
    name: "Ancient Worlds",
    shortName: "Ancient",
    visitors: 162,
    capacity: 180,
    occupancy: 90,
    dwell: "21m 06s",
    netFlow: -7,
    status: "Critical",
  },
  {
    id: "modern-gallery",
    name: "Modern Gallery",
    shortName: "Modern",
    visitors: 137,
    capacity: 220,
    occupancy: 62,
    dwell: "16m 32s",
    netFlow: 9,
    status: "Normal",
  },
  {
    id: "west-african-heritage",
    name: "West African Heritage",
    shortName: "Heritage",
    visitors: 117,
    capacity: 160,
    occupancy: 73,
    dwell: "24m 18s",
    netFlow: 5,
    status: "Busy",
  },
  {
    id: "sculpture-court",
    name: "Sculpture Court",
    shortName: "Sculpture",
    visitors: 49,
    capacity: 140,
    occupancy: 35,
    dwell: "10m 45s",
    netFlow: 3,
    status: "Normal",
  },
  {
    id: "special-exhibition",
    name: "Special Exhibition",
    shortName: "Special",
    visitors: 176,
    capacity: 200,
    occupancy: 88,
    dwell: "27m 12s",
    netFlow: -12,
    status: "Critical",
  },
  {
    id: "cafe-retail",
    name: "Café & Retail",
    shortName: "Café",
    visitors: 68,
    capacity: 120,
    occupancy: 57,
    dwell: "12m 08s",
    netFlow: 11,
    status: "Normal",
  },
];

export const visitorFlow = [
  84, 112, 156, 218, 286, 354, 431, 498, 462, 529, 584, 548, 612,
];

export const previousVisitorFlow = [
  72, 98, 141, 184, 245, 309, 384, 426, 410, 452, 501, 488, 536,
];

export const flowHours = [
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
];

export const heatmapHours = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

export const heatmapData: Record<string, number[]> = {
  "grand-atrium": [18, 31, 46, 62, 74, 81, 84, 78, 69, 72, 66, 51, 29],
  "ancient-worlds": [12, 27, 44, 68, 82, 90, 87, 80, 75, 70, 59, 41, 22],
  "modern-gallery": [8, 19, 32, 48, 57, 62, 59, 64, 61, 54, 46, 34, 17],
  "west-african-heritage": [10, 23, 38, 56, 67, 73, 79, 76, 68, 64, 52, 37, 18],
  "sculpture-court": [5, 11, 19, 28, 33, 35, 31, 39, 42, 37, 29, 21, 10],
  "special-exhibition": [14, 35, 58, 77, 85, 88, 86, 91, 89, 80, 65, 43, 24],
  "cafe-retail": [4, 8, 14, 26, 49, 57, 43, 31, 38, 62, 55, 30, 12],
};

export const exhibits: Exhibit[] = [
  {
    id: "benin-bronze-head",
    name: "Benin Bronze Head",
    code: "EX-1042",
    zone: "West African Heritage",
    views: 1384,
    dwell: "8m 42s",
    completion: 83,
    score: 92,
    trend: 12.8,
    status: "Excellent",
    hourly: [22, 38, 51, 68, 84, 91, 88, 97, 92, 81, 69, 47, 28],
    previousHourly: [18, 31, 43, 58, 71, 77, 75, 83, 78, 72, 58, 39, 24],
  },
  {
    id: "diaspora-soundscape",
    name: "Diaspora Soundscape",
    code: "EX-2087",
    zone: "Special Exhibition",
    views: 1217,
    dwell: "9m 18s",
    completion: 78,
    score: 89,
    trend: 8.1,
    status: "Excellent",
    hourly: [16, 29, 44, 63, 76, 86, 83, 90, 88, 79, 62, 41, 21],
    previousHourly: [14, 25, 39, 54, 66, 73, 72, 79, 76, 68, 53, 36, 19],
  },
  {
    id: "nok-terracotta",
    name: "Nok Terracotta Figure",
    code: "EX-1164",
    zone: "Ancient Worlds",
    views: 1052,
    dwell: "7m 55s",
    completion: 74,
    score: 85,
    trend: 5.6,
    status: "Strong",
    hourly: [12, 24, 39, 57, 72, 80, 78, 82, 76, 68, 55, 35, 17],
    previousHourly: [11, 22, 35, 51, 64, 72, 70, 75, 69, 61, 48, 31, 15],
  },
  {
    id: "kente-histories",
    name: "Kente: Woven Histories",
    code: "EX-1058",
    zone: "West African Heritage",
    views: 946,
    dwell: "6m 38s",
    completion: 71,
    score: 79,
    trend: -1.9,
    status: "Strong",
    hourly: [10, 21, 34, 48, 61, 67, 65, 71, 66, 59, 44, 28, 14],
    previousHourly: [12, 23, 36, 51, 63, 69, 68, 73, 69, 61, 46, 30, 15],
  },
  {
    id: "guardian-statue",
    name: "Guardian Statue",
    code: "EX-1199",
    zone: "Ancient Worlds",
    views: 828,
    dwell: "5m 49s",
    completion: 69,
    score: 74,
    trend: -4.3,
    status: "Watch",
    hourly: [9, 18, 29, 42, 52, 58, 55, 61, 57, 49, 38, 24, 12],
    previousHourly: [11, 21, 32, 45, 56, 62, 60, 65, 61, 53, 41, 27, 14],
  },
  {
    id: "contemporary-futures",
    name: "Contemporary Futures",
    code: "EX-3041",
    zone: "Modern Gallery",
    views: 711,
    dwell: "4m 58s",
    completion: 61,
    score: 68,
    trend: 2.4,
    status: "Watch",
    hourly: [7, 15, 24, 35, 44, 49, 47, 53, 50, 43, 33, 21, 10],
    previousHourly: [7, 14, 23, 33, 42, 47, 45, 50, 48, 41, 31, 20, 9],
  },
];

export const bottlenecks = [
  {
    zone: "Ancient Worlds",
    location: "East entrance",
    severity: "Critical",
    duration: "11 min",
    note: "Queue is restricting cross-gallery flow",
  },
  {
    zone: "Special Exhibition",
    location: "Ticket checkpoint",
    severity: "High",
    duration: "8 min",
    note: "Arrival rate exceeds current admission pace",
  },
  {
    zone: "Grand Atrium",
    location: "Heritage corridor",
    severity: "Moderate",
    duration: "5 min",
    note: "Two-way visitor traffic is converging",
  },
];

export type ReportRecord = {
  id: number;
  name: string;
  range: string;
  format: "PDF" | "CSV" | "PDF + CSV";
  generated: string;
  status: "Ready" | "Generating";
};

export const initialReports: ReportRecord[] = [
  {
    id: 1,
    name: "Visitor Flow Overview",
    range: "Jul 1–24, 2026",
    format: "PDF",
    generated: "Jul 24, 9:03 PM",
    status: "Ready",
  },
  {
    id: 2,
    name: "Exhibit Performance",
    range: "Jul 14–20, 2026",
    format: "CSV",
    generated: "Jul 21, 8:15 AM",
    status: "Ready",
  },
  {
    id: 3,
    name: "Zone Heatmap",
    range: "Jul 7–13, 2026",
    format: "PDF + CSV",
    generated: "Jul 14, 10:42 AM",
    status: "Ready",
  },
  {
    id: 4,
    name: "Monthly Executive Summary",
    range: "Jun 1–30, 2026",
    format: "PDF",
    generated: "Jun 30, 6:10 PM",
    status: "Ready",
  },
];

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-GB").format(value);

