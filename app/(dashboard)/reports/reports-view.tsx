"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  exhibits,
  formatNumber,
  initialReports,
  type ReportRecord,
  zones,
} from "../museum-data";
import { PageIcon, type PageIconName } from "../page-icons";
import { Card, PageHeading } from "../museum-ui";
import styles from "../dashboard.module.css";

type ReportType = "visitor-flow" | "exhibit-performance" | "zone-heatmap" | "executive-summary";
type OutputFormat = ReportRecord["format"];

const reportTypes: Array<{
  id: ReportType;
  name: string;
  description: string;
  icon: PageIconName;
}> = [
  {
    id: "visitor-flow",
    name: "Visitor Flow",
    description: "Attendance, dwell and movement patterns",
    icon: "visitorReport",
  },
  {
    id: "exhibit-performance",
    name: "Exhibit Performance",
    description: "Rankings, engagement and completion",
    icon: "artifactReport",
  },
  {
    id: "zone-heatmap",
    name: "Zone Heatmap",
    description: "Hourly occupancy and capacity pressure",
    icon: "matrixReport",
  },
  {
    id: "executive-summary",
    name: "Executive Summary",
    description: "A concise cross-museum overview",
    icon: "executiveReport",
  },
];

const totalVisitors = zones.reduce((total, zone) => total + zone.visitors, 0);
const totalCapacity = zones.reduce((total, zone) => total + zone.capacity, 0);
const averageOccupancy = Math.round((totalVisitors / totalCapacity) * 100);
const totalExhibitViews = exhibits.reduce((total, exhibit) => total + exhibit.views, 0);
const averageExhibitScore = Math.round(
  exhibits.reduce((total, exhibit) => total + exhibit.score, 0) / exhibits.length,
);

function getReportName(reportType: ReportType) {
  return reportTypes.find((report) => report.id === reportType)?.name ?? "Museum Report";
}

function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-GB", options ?? { day: "numeric", month: "short", year: "numeric" })
    .format(new Date(`${date}T12:00:00`));
}

function formatRange(from: string, to: string) {
  if (!from || !to) return "Select a date range";
  const fromDate = new Date(`${from}T12:00:00`);
  const toDate = new Date(`${to}T12:00:00`);
  const sameYear = fromDate.getFullYear() === toDate.getFullYear();
  const fromLabel = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: sameYear ? undefined : "numeric",
  }).format(fromDate);
  const toLabel = formatDate(to);
  return `${fromLabel}–${toLabel}`;
}

function safeFileName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function quoteCsv(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function buildCsv(name: string, range: string, zoneId: string) {
  const filteredZones = zoneId === "all" ? zones : zones.filter((zone) => zone.id === zoneId);
  const zoneNames = new Set(filteredZones.map((zone) => zone.name));
  const filteredExhibits = zoneId === "all"
    ? exhibits
    : exhibits.filter((exhibit) => zoneNames.has(exhibit.zone));
  const rows: Array<Array<string | number>> = [
    ["Mundo Museum Visitor Intelligence"],
    ["Report", name],
    ["Date range", range],
    ["Scope", zoneId === "all" ? "All museum zones" : filteredZones[0]?.name ?? "Selected zone"],
    [],
    ["ZONE PERFORMANCE"],
    ["Zone", "Current visitors", "Capacity", "Occupancy %", "Average dwell", "Status"],
    ...filteredZones.map((zone) => [
      zone.name,
      zone.visitors,
      zone.capacity,
      zone.occupancy,
      zone.dwell,
      zone.status,
    ]),
    [],
    ["EXHIBIT PERFORMANCE"],
    ["Exhibit", "Code", "Zone", "Views", "Average dwell", "Completion %", "Score"],
    ...filteredExhibits.map((exhibit) => [
      exhibit.name,
      exhibit.code,
      exhibit.zone,
      exhibit.views,
      exhibit.dwell,
      exhibit.completion,
      exhibit.score,
    ]),
  ];

  return rows.map((row) => row.map(quoteCsv).join(",")).join("\n");
}

function ascii(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[–—]/g, "-")
    .replace(/[^\x20-\x7E]/g, "");
}

function escapePdf(value: string) {
  return ascii(value).replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function buildPdf(name: string, range: string, scope: string) {
  const lines = [
    { text: "MUNDO MUSEUM", size: 11, gap: 27 },
    { text: name, size: 23, gap: 31 },
    { text: `Reporting period: ${range}`, size: 10, gap: 17 },
    { text: `Scope: ${scope}`, size: 10, gap: 33 },
    { text: "VISITOR INTELLIGENCE SNAPSHOT", size: 11, gap: 22 },
    { text: `Visitors in live model: ${formatNumber(totalVisitors)}`, size: 10, gap: 17 },
    { text: `Museum occupancy: ${averageOccupancy}%`, size: 10, gap: 17 },
    { text: `Tracked exhibit views: ${formatNumber(totalExhibitViews)}`, size: 10, gap: 17 },
    { text: `Average exhibit score: ${averageExhibitScore}/100`, size: 10, gap: 31 },
    { text: "ZONE PERFORMANCE", size: 11, gap: 22 },
    ...zones.slice(0, 7).map((zone) => ({
      text: `${zone.name}: ${zone.visitors} visitors | ${zone.occupancy}% occupied | ${zone.status}`,
      size: 9,
      gap: 16,
    })),
    { text: "Generated by Mundo Visitor Intelligence", size: 8, gap: 25 },
  ];

  let content = "BT\n50 792 Td\n";
  lines.forEach((line, index) => {
    content += `/F1 ${line.size} Tf\n(${escapePdf(line.text)}) Tj\n`;
    if (index < lines.length - 1) content += `0 -${line.gap} Td\n`;
  });
  content += "ET";

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  let document = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(document.length);
    document += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = document.length;
  document += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    document += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  });
  document += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return document;
}

function downloadBlob(contents: BlobPart, type: string, fileName: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export default function ReportsView() {
  const [fromDate, setFromDate] = useState("2026-07-01");
  const [toDate, setToDate] = useState("2026-07-24");
  const [reportType, setReportType] = useState<ReportType>("visitor-flow");
  const [zoneId, setZoneId] = useState("all");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("PDF");
  const [reports, setReports] = useState<ReportRecord[]>(initialReports);
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [notice, setNotice] = useState("Configure a report and preview it before exporting.");
  const generationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (generationTimer.current) clearTimeout(generationTimer.current);
  }, []);

  const activeReport = reportTypes.find((report) => report.id === reportType) ?? reportTypes[0];
  const selectedZone = zones.find((zone) => zone.id === zoneId);
  const dateRange = formatRange(fromDate, toDate);
  const invalidRange = !fromDate || !toDate || fromDate > toDate;
  const readyReports = reports.filter((report) => report.status === "Ready");
  const previewZones = useMemo(
    () => zoneId === "all" ? zones.slice().sort((a, b) => b.occupancy - a.occupancy).slice(0, 4) : zones.filter((zone) => zone.id === zoneId),
    [zoneId],
  );

  const download = (report: ReportRecord, format: "PDF" | "CSV") => {
    const fileName = `${safeFileName(report.name)}-${new Date().toISOString().slice(0, 10)}`;
    const scope = selectedZone?.name ?? "All museum zones";
    if (format === "CSV") {
      downloadBlob(buildCsv(report.name, report.range, zoneId), "text/csv;charset=utf-8", `${fileName}.csv`);
    } else {
      downloadBlob(buildPdf(report.name, report.range, scope), "application/pdf", `${fileName}.pdf`);
    }
    setNotice(`${report.name} ${format} downloaded.`);
  };

  const generateReport = () => {
    if (invalidRange || generatingId !== null) return;
    const id = Date.now();
    const report: ReportRecord = {
      id,
      name: getReportName(reportType),
      range: dateRange,
      format: outputFormat,
      generated: "Preparing now",
      status: "Generating",
    };
    setReports((current) => [report, ...current]);
    setGeneratingId(id);
    setNotice(`Generating ${report.name}…`);

    generationTimer.current = setTimeout(() => {
      const completedAt = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date());
      setReports((current) => current.map((item) => item.id === id
        ? { ...item, generated: completedAt, status: "Ready" }
        : item));
      setGeneratingId(null);
      setNotice(`${report.name} is ready to download.`);
    }, 1200);
  };

  const latestReady = readyReports[0];

  return (
    <div className={styles.dashboardPage}>
      <PageHeading
        title="Reports"
        description="Turn visitor flow, occupancy and exhibit engagement into export-ready insight."
        actions={
          <>
            <span className={styles.reportReadyCount}><PageIcon name="verified" size={13} /> {readyReports.length} reports ready</span>
            {latestReady && (
              <button className={styles.secondaryButton} type="button" onClick={() => download(latestReady, "CSV")}>
                <PageIcon name="export" size={15} /> Latest CSV
              </button>
            )}
          </>
        }
      />

      <div className={styles.reportSummaryGrid}>
        <article><span><PageIcon name="reportDocument" size={18} /></span><div><small>Reports generated</small><strong>{reports.length}</strong><em>4 in the last 30 days</em></div></article>
        <article><span><PageIcon name="dateRange" size={18} /></span><div><small>Current reporting period</small><strong>{dateRange}</strong><em>{selectedZone?.name ?? "All museum zones"}</em></div></article>
        <article><span><PageIcon name="sensorCoverage" size={18} /></span><div><small>Data coverage</small><strong>98.7%</strong><em>Live sensors reporting normally</em></div></article>
      </div>

      <div className={styles.reportWorkspaceGrid}>
        <Card
          title="Report Builder"
          description="Choose the evidence and output you need"
          className={styles.reportBuilderCard}
          action={<span className={styles.builderStep}>01 · Configure</span>}
        >
          <div className={styles.reportSectionLabel}>Report type</div>
          <div className={styles.reportTypeGrid}>
            {reportTypes.map((report) => (
              <button
                key={report.id}
                className={`${styles.reportTypeOption} ${reportType === report.id ? styles.reportTypeOptionActive : ""}`}
                type="button"
                onClick={() => setReportType(report.id)}
                aria-pressed={reportType === report.id}
              >
                <span><PageIcon name={report.icon} size={17} /></span>
                <div><strong>{report.name}</strong><small>{report.description}</small></div>
                <i>{reportType === report.id && <PageIcon name="verified" size={11} />}</i>
              </button>
            ))}
          </div>

          <div className={styles.reportDivider} />
          <div className={styles.reportBuilderFields}>
            <label className={styles.reportField}>
              <span>From</span>
              <div><PageIcon name="dateRange" size={14} /><input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} /></div>
            </label>
            <label className={styles.reportField}>
              <span>To</span>
              <div><PageIcon name="dateRange" size={14} /><input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} /></div>
            </label>
            <label className={styles.reportField}>
              <span>Museum zone</span>
              <div>
                <PageIcon name="zoneCapacity" size={14} />
                <select value={zoneId} onChange={(event) => setZoneId(event.target.value)}>
                  <option value="all">All museum zones</option>
                  {zones.map((zone) => <option key={zone.id} value={zone.id}>{zone.name}</option>)}
                </select>
                <PageIcon name="selector" size={12} />
              </div>
            </label>
          </div>
          {invalidRange && <p className={styles.reportFieldError}>The end date must be on or after the start date.</p>}

          <div className={styles.reportSectionLabel}>Output format</div>
          <div className={styles.formatSelector}>
            {(["PDF", "CSV", "PDF + CSV"] as OutputFormat[]).map((format) => (
              <button
                key={format}
                className={outputFormat === format ? styles.formatSelectorActive : ""}
                type="button"
                onClick={() => setOutputFormat(format)}
                aria-pressed={outputFormat === format}
              >
                <PageIcon name={format === "CSV" ? "dataTable" : "reportDocument"} size={13} /> {format}
              </button>
            ))}
          </div>

          <div className={styles.generateReportRow}>
            <p><PageIcon name="reportReadiness" size={15} /><span><strong>Ready for generation</strong><small>{notice}</small></span></p>
            <button
              className={`${styles.primaryButton} ${generatingId !== null ? styles.reportGenerating : ""}`}
              type="button"
              onClick={generateReport}
              disabled={invalidRange || generatingId !== null}
            >
              <PageIcon name={generatingId !== null ? "sync" : "documentAdd"} size={15} />
              {generatingId !== null ? "Generating…" : "Generate report"}
            </button>
          </div>
        </Card>

        <Card
          title="Report Preview"
          description="A live preview of your selected scope"
          className={styles.reportPreviewCard}
          action={<span className={styles.builderStep}>02 · Review</span>}
        >
          <div className={styles.reportPreviewPaper}>
            <div className={styles.previewBrand}><span>M</span><div><strong>MUNDO</strong><small>MUSEUM · VISITOR INTELLIGENCE</small></div></div>
            <div className={styles.previewTitle}><span>INSIGHT REPORT</span><h3>{activeReport.name}</h3><p>{dateRange} · {selectedZone?.name ?? "All museum zones"}</p></div>
            <div className={styles.previewKpis}>
              <div><small>Visitors</small><strong>{formatNumber(selectedZone?.visitors ?? totalVisitors)}</strong><em>+8.4%</em></div>
              <div><small>Occupancy</small><strong>{selectedZone?.occupancy ?? averageOccupancy}%</strong><em>Healthy</em></div>
              <div><small>Engagement</small><strong>{averageExhibitScore}</strong><em>/ 100</em></div>
            </div>
            <div className={styles.previewChartHeader}><strong>Zone occupancy</strong><span>Live model</span></div>
            <div className={styles.previewBars}>
              {previewZones.map((zone) => (
                <div key={zone.id}>
                  <span>{zone.shortName}</span>
                  <i><b style={{ width: `${zone.occupancy}%` }} /></i>
                  <strong>{zone.occupancy}%</strong>
                </div>
              ))}
            </div>
            <div className={styles.previewFooter}><span>Mundo Museum · Confidential</span><span>Page 1 of 1</span></div>
          </div>
          <div className={styles.previewDownloadRow}>
            <span><PageIcon name="verified" size={13} /> Preview updated</span>
            <div>
              {outputFormat !== "CSV" && <button type="button" onClick={() => download({ id: 0, name: activeReport.name, range: dateRange, format: outputFormat, generated: "Preview", status: "Ready" }, "PDF")}><PageIcon name="export" size={13} /> PDF</button>}
              {outputFormat !== "PDF" && <button type="button" onClick={() => download({ id: 0, name: activeReport.name, range: dateRange, format: outputFormat, generated: "Preview", status: "Ready" }, "CSV")}><PageIcon name="export" size={13} /> CSV</button>}
            </div>
          </div>
        </Card>
      </div>

      <Card
        title="Report History"
        description="Previously generated files remain available for export"
        className={styles.reportHistoryCard}
        action={<span className={styles.historyTotal}>{reports.length} total</span>}
      >
        <div className={`${styles.tableScroll} ${styles.reportTableScroll}`}>
          <table className={styles.reportTable}>
            <thead><tr><th>Report</th><th>Date range</th><th>Format</th><th>Generated</th><th>Status</th><th><span className={styles.srOnly}>Downloads</span></th></tr></thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td><span className={styles.reportFileIcon}><PageIcon name="reportDocument" size={15} /></span><div><strong>{report.name}</strong><small>Visitor Intelligence report</small></div></td>
                  <td>{report.range}</td>
                  <td><span className={styles.reportFormatTag}>{report.format}</span></td>
                  <td>{report.generated}</td>
                  <td><span className={`${styles.reportStatus} ${report.status === "Generating" ? styles.reportStatusGenerating : ""}`}><i />{report.status}</span></td>
                  <td>
                    <div className={styles.reportDownloads}>
                      {(report.format === "PDF" || report.format === "PDF + CSV") && <button type="button" disabled={report.status !== "Ready"} onClick={() => download(report, "PDF")} aria-label={`Download ${report.name} PDF`}><PageIcon name="reportDocument" size={13} /><span>PDF</span></button>}
                      {(report.format === "CSV" || report.format === "PDF + CSV") && <button type="button" disabled={report.status !== "Ready"} onClick={() => download(report, "CSV")} aria-label={`Download ${report.name} CSV`}><PageIcon name="export" size={13} /><span>CSV</span></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
