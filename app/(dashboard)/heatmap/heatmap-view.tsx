"use client";

import { useMemo, useState, type CSSProperties } from "react";

import { heatmapData, heatmapHours, zones } from "../museum-data";
import { PageIcon } from "../page-icons";
import { Card, PageHeading, StatusPill } from "../museum-ui";
import styles from "../dashboard.module.css";

type Metric = "occupancy" | "visitors" | "dwell" | "entries" | "exits";

const metricLabels: Record<Metric, string> = {
  occupancy: "Occupancy %",
  visitors: "Visitor count",
  dwell: "Avg. dwell",
  entries: "Entries",
  exits: "Exits",
};

function metricValue(metric: Metric, occupancy: number, capacity: number, index: number) {
  switch (metric) {
    case "visitors": return Math.round((occupancy / 100) * capacity);
    case "dwell": return Math.round(occupancy / 5 + 3);
    case "entries": return Math.round((occupancy / 100) * capacity * (index < 7 ? 0.32 : 0.19));
    case "exits": return Math.round((occupancy / 100) * capacity * (index < 6 ? 0.15 : 0.29));
    default: return occupancy;
  }
}

function displayValue(metric: Metric, value: number) {
  if (metric === "occupancy") return `${value}%`;
  if (metric === "dwell") return `${value}m`;
  return value.toString();
}

export default function HeatmapView({ initialZone }: { initialZone: string }) {
  const [date, setDate] = useState("2026-07-24");
  const [metric, setMetric] = useState<Metric>("occupancy");
  const [zoneFilter, setZoneFilter] = useState(initialZone);
  const [selectedCell, setSelectedCell] = useState({ zoneId: "special-exhibition", hourIndex: 7 });

  const filteredZones = useMemo(
    () => zones.filter((zone) => zoneFilter === "all" || zone.id === zoneFilter),
    [zoneFilter],
  );

  const selectedZone = zones.find((zone) => zone.id === selectedCell.zoneId) ?? zones[0];
  const selectedOccupancy = heatmapData[selectedZone.id][selectedCell.hourIndex];
  const selectedVisitors = Math.round((selectedOccupancy / 100) * selectedZone.capacity);

  const exportHeatmap = () => {
    const rows = filteredZones.flatMap((zone) =>
      heatmapHours.map((hour, index) => [
        date,
        zone.name,
        hour,
        heatmapData[zone.id][index],
        Math.round((heatmapData[zone.id][index] / 100) * zone.capacity),
      ]),
    );
    const csv = [["Date", "Zone", "Hour", "Occupancy percent", "Estimated visitors"], ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `mundo-zone-heatmap-${date}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.dashboardPage}>
      <PageHeading
        title="Visitor Heatmap"
        description="Explore how occupancy and movement change across every zone and hour."
        actions={
          <>
            <label className={styles.fieldControl}>
              <PageIcon name="dateRange" size={15} />
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </label>
            <label className={styles.selectControl}>
              <PageIcon name="zoneCapacity" size={15} />
              <select value={zoneFilter} onChange={(event) => setZoneFilter(event.target.value)}>
                <option value="all">All zones</option>
                {zones.map((zone) => <option key={zone.id} value={zone.id}>{zone.name}</option>)}
              </select>
              <PageIcon name="selector" size={13} />
            </label>
            <button className={styles.primaryButton} type="button" onClick={exportHeatmap}>
              <PageIcon name="export" size={15} /> Export
            </button>
          </>
        }
      />

      <div className={styles.heatmapSummaryGrid}>
        <article><span><PageIcon name="peakWindow" size={17} /></span><div><small>Peak hour</small><strong>3:00 PM</strong><em>91% max occupancy</em></div></article>
        <article><span><PageIcon name="zoneCapacity" size={17} /></span><div><small>Busiest zone</small><strong>Special Exhibition</strong><em>88% daily average</em></div></article>
        <article><span><PageIcon name="dwellTime" size={17} /></span><div><small>Longest dwell</small><strong>27m 12s</strong><em>Special Exhibition</em></div></article>
        <article><span><PageIcon name="criticalWindow" size={17} /></span><div><small>Critical periods</small><strong>6 cells</strong><em>Across 2 zones</em></div></article>
      </div>

      <Card
        title="Zone × Hour Matrix"
        description={`Showing ${metricLabels[metric].toLowerCase()} for ${new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`}
        className={styles.heatmapCard}
        action={
          <label className={styles.compactSelect}>
            <select value={metric} onChange={(event) => setMetric(event.target.value as Metric)}>
              {Object.entries(metricLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <PageIcon name="selector" size={13} />
          </label>
        }
      >
        <div className={styles.heatmapLegend}>
          <span>Low</span>
          {[0.08, 0.18, 0.3, 0.46, 0.64, 0.82, 1].map((opacity) => <i key={opacity} style={{ background: `rgb(231 8 0 / ${opacity})` }} />)}
          <span>Critical</span>
          <em>Click any cell for details</em>
        </div>

        <div className={styles.heatmapScroll}>
          <div className={styles.heatmapMatrix} style={{ "--heatmap-columns": heatmapHours.length } as CSSProperties}>
            <div className={styles.heatmapCorner}>Museum zone</div>
            {heatmapHours.map((hour) => <div className={styles.heatmapHour} key={hour}>{hour}</div>)}

            {filteredZones.map((zone) => (
              <div className={styles.heatmapRow} key={zone.id}>
                <div className={styles.heatmapZoneLabel}><span>{zone.name.charAt(0)}</span><div><strong>{zone.name}</strong><small>{zone.capacity} capacity</small></div></div>
                {heatmapData[zone.id].map((occupancy, hourIndex) => {
                  const selected = selectedCell.zoneId === zone.id && selectedCell.hourIndex === hourIndex;
                  const value = metricValue(metric, occupancy, zone.capacity, hourIndex);
                  return (
                    <button
                      key={`${zone.id}-${heatmapHours[hourIndex]}`}
                      className={`${styles.heatmapCell} ${selected ? styles.heatmapCellSelected : ""}`}
                      style={{
                        background: `rgb(231 8 0 / ${Math.max(0.06, occupancy / 100)})`,
                        color: occupancy >= 55 ? "#fff" : "var(--heatmap-low-text)",
                      }}
                      onClick={() => setSelectedCell({ zoneId: zone.id, hourIndex })}
                      type="button"
                      aria-label={`${zone.name}, ${heatmapHours[hourIndex]}, ${displayValue(metric, value)}`}
                    >
                      {displayValue(metric, value)}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className={styles.heatmapDetailGrid}>
        <Card title="Selected Period" description="Detailed zone reading" className={styles.selectedPeriodCard}>
          <div className={styles.selectedPeriodHeading}>
            <span className={styles.selectedPeriodIcon}><PageIcon name="zoneMatrix" size={20} /></span>
            <div><strong>{selectedZone.name}</strong><span>{heatmapHours[selectedCell.hourIndex]}–{heatmapHours[Math.min(selectedCell.hourIndex + 1, heatmapHours.length - 1)]}</span></div>
            <StatusPill status={selectedOccupancy >= 85 ? "Critical" : selectedOccupancy >= 70 ? "Busy" : "Normal"} />
          </div>
          <div className={styles.selectedMetrics}>
            <div><small>Occupancy</small><strong>{selectedOccupancy}%</strong><span>{selectedVisitors} of {selectedZone.capacity}</span></div>
            <div><small>Avg. dwell</small><strong>{Math.round(selectedOccupancy / 5 + 3)}m</strong><span>+2m vs. daily avg.</span></div>
            <div><small>Entries</small><strong>{Math.round(selectedVisitors * 0.24)}</strong><span>during selected hour</span></div>
            <div><small>Exits</small><strong>{Math.round(selectedVisitors * 0.19)}</strong><span>during selected hour</span></div>
          </div>
        </Card>

        <Card title="Flow Insight" description="Model-generated operational note" className={styles.flowInsightCard}>
          <div className={styles.insightCallout}>
            <span><PageIcon name="operationalNote" size={19} /></span>
            <p><strong>{selectedOccupancy >= 85 ? "Capacity intervention recommended" : "Flow remains manageable"}</strong><small>{selectedOccupancy >= 85 ? `Redirect arrivals toward ${zones.find((zone) => zone.status === "Normal")?.name} for the next 30 minutes.` : "No immediate routing change is required for this period."}</small></p>
          </div>
          <ul className={styles.insightList}>
            <li><span /> Peak arrivals begin 18 minutes before this interval.</li>
            <li><span /> 34% of visitors arrived from the Grand Atrium.</li>
            <li><span /> Nearby exhibits average 76% engagement completion.</li>
          </ul>
          <a className={styles.textLinkButton} href="/exhibits">View related exhibit analytics <PageIcon name="navigate" size={14} /></a>
        </Card>
      </div>
    </div>
  );
}
