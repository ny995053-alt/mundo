"use client";

import { useMemo, useState } from "react";

import { exhibits, flowHours, formatNumber, zones } from "../museum-data";
import { PageIcon } from "../page-icons";
import { Card, KpiCard, LineChart, PageHeading, StatusPill } from "../museum-ui";
import styles from "../dashboard.module.css";

type SortKey = "score" | "views" | "completion" | "trend";

export default function ExhibitAnalytics({ initialExhibitId }: { initialExhibitId: string }) {
  const [selectedId, setSelectedId] = useState(initialExhibitId);
  const [zoneFilter, setZoneFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const selected = exhibits.find((exhibit) => exhibit.id === selectedId) ?? exhibits[0];

  const filteredExhibits = useMemo(() => {
    return [...exhibits]
      .filter((exhibit) => zoneFilter === "all" || exhibit.zone === zoneFilter)
      .filter((exhibit) => exhibit.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b[sortKey] - a[sortKey]);
  }, [query, sortKey, zoneFilter]);

  const downloadExhibits = () => {
    const csv = [
      ["Rank", "Exhibit", "Zone", "Views", "Average dwell", "Completion percent", "Engagement score", "Trend percent"],
      ...filteredExhibits.map((exhibit, index) => [index + 1, exhibit.name, exhibit.zone, exhibit.views, exhibit.dwell, exhibit.completion, exhibit.score, exhibit.trend]),
    ].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "mundo-exhibit-performance.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.dashboardPage}>
      <PageHeading
        title="Exhibit Analytics"
        description="Understand which objects hold attention, inspire interaction, and complete the visitor story."
        actions={
          <>
            <div className={styles.controlGroup}>
              <button className={styles.control} type="button"><PageIcon name="dateRange" size={15} /> Jul 1–24, 2026</button>
              <button className={styles.control} type="button">Last 30 days <PageIcon name="selector" size={13} /></button>
            </div>
            <label className={styles.selectControl}>
              <PageIcon name="zoneCapacity" size={15} />
              <select value={zoneFilter} onChange={(event) => setZoneFilter(event.target.value)}>
                <option value="all">All zones</option>
                {zones.map((zone) => <option key={zone.id} value={zone.name}>{zone.name}</option>)}
              </select>
              <PageIcon name="selector" size={13} />
            </label>
            <button className={styles.primaryButton} type="button" onClick={downloadExhibits}><PageIcon name="export" size={15} />Export</button>
          </>
        }
      />

      <div className={styles.kpiGrid}>
        <KpiCard label="Total interactions" value="8,694" detail="Across 42 tracked exhibits" trend={{ value: "9.1%", direction: "up" }} icon="interactionDepth" sparkline={[28, 32, 30, 41, 45, 52, 50, 62]} />
        <KpiCard label="Avg. exhibit dwell" value="6m 12s" detail="38 seconds above benchmark" trend={{ value: "7.2%", direction: "up" }} icon="dwellTime" tone="green" sparkline={[26, 28, 31, 29, 36, 39, 42, 45]} />
        <KpiCard label="Completion rate" value="72%" detail="Visitors reaching final interaction" trend={{ value: "4.6%", direction: "up" }} icon="verified" tone="ink" sparkline={[42, 45, 43, 48, 51, 54, 57, 60]} />
        <KpiCard label="Top exhibit" value="92" detail="Benin Bronze Head score" trend={{ value: "12.8%", direction: "up" }} icon="artifact" tone="amber" sparkline={[36, 38, 44, 47, 52, 55, 61, 66]} />
      </div>

      <div className={styles.exhibitOverviewGrid}>
        <Card
          title={`${selected.name} engagement`}
          description={`${selected.zone} · ${selected.code}`}
          className={styles.exhibitChartCard}
          action={<div className={styles.chartLegend}><span><i className={styles.legendCurrent} />Current period</span><span><i className={styles.legendPrevious} />Previous</span></div>}
        >
          <div className={styles.exhibitChartSummary}>
            <div><small>Engagement score</small><strong>{selected.score}</strong><span className={selected.trend >= 0 ? styles.positiveValue : styles.negativeValue}>{selected.trend >= 0 ? "+" : ""}{selected.trend}%</span></div>
            <div><small>Total views</small><strong>{formatNumber(selected.views)}</strong><span>during selected period</span></div>
            <div><small>Avg. dwell</small><strong>{selected.dwell}</strong><span>{selected.completion}% completion</span></div>
          </div>
          <LineChart values={selected.hourly} comparison={selected.previousHourly} labels={flowHours} gradientId={`exhibit-${selected.id}`} compact />
        </Card>

        <Card title="Visitor Engagement Funnel" description="How visitors move from passing to completion" className={styles.funnelCard}>
          <div className={styles.funnelVisual}>
            <div style={{ width: "100%" }}><span>Passersby</span><strong>2,418</strong></div>
            <div style={{ width: "83%" }}><span>Viewed</span><strong>{formatNumber(selected.views)}</strong></div>
            <div style={{ width: "65%" }}><span>Interacted</span><strong>{Math.round(selected.views * 0.68)}</strong></div>
            <div style={{ width: "48%" }}><span>Completed</span><strong>{Math.round(selected.views * (selected.completion / 100))}</strong></div>
          </div>
          <div className={styles.funnelFooter}><span><PageIcon name="conversion" size={15} />Strongest step</span><p><strong>View → interaction</strong><small>68% conversion</small></p></div>
        </Card>
      </div>

      <div className={styles.exhibitLowerGrid}>
        <Card
          title="Exhibit Ranking"
          description={`${filteredExhibits.length} exhibits ordered by ${sortKey}`}
          className={styles.exhibitRankingCard}
          action={
            <div className={styles.tableTools}>
              <label><PageIcon name="dataSearch" size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search exhibit..." /></label>
              <label><select value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}><option value="score">Score</option><option value="views">Views</option><option value="completion">Completion</option><option value="trend">Trend</option></select><PageIcon name="selector" size={12} /></label>
            </div>
          }
        >
          <div className={styles.tableScroll}>
            <table className={`${styles.dataTable} ${styles.exhibitTable}`}>
              <thead><tr><th>Rank</th><th>Exhibit</th><th>Views</th><th>Avg. dwell</th><th>Completion</th><th>Score</th><th>Trend</th><th>Status</th></tr></thead>
              <tbody>
                {filteredExhibits.map((exhibit, index) => (
                  <tr className={selected.id === exhibit.id ? styles.selectedTableRow : ""} key={exhibit.id} onClick={() => setSelectedId(exhibit.id)}>
                    <td><span className={styles.rankBadge}>{index + 1}</span></td>
                    <td><span className={styles.exhibitAvatar}><PageIcon name="artifact" size={15} /></span><div><strong>{exhibit.name}</strong><small>{exhibit.zone}</small></div></td>
                    <td>{formatNumber(exhibit.views)}</td>
                    <td>{exhibit.dwell}</td>
                    <td><div className={styles.completionCell}><span><i style={{ width: `${exhibit.completion}%` }} /></span><b>{exhibit.completion}%</b></div></td>
                    <td><strong className={styles.scoreValue}>{exhibit.score}</strong></td>
                    <td className={exhibit.trend >= 0 ? styles.positiveValue : styles.negativeValue}>{exhibit.trend >= 0 ? "+" : ""}{exhibit.trend}%</td>
                    <td><StatusPill status={exhibit.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Selected Exhibit" description="Focused performance profile" className={styles.exhibitProfileCard}>
          <div className={styles.exhibitProfileHead}>
            <span><PageIcon name="artifact" size={22} /></span>
            <div><strong>{selected.name}</strong><small>{selected.zone}</small></div>
            <StatusPill status={selected.status} />
          </div>
          <div className={styles.profileMetricRows}>
            <div><span>Peak engagement</span><strong>3:00 PM</strong></div>
            <div><span>Passerby capture</span><strong>57.2%</strong></div>
            <div><span>Return interactions</span><strong>14.8%</strong></div>
            <div><span>Congestion risk</span><strong className={styles.positiveValue}>Low</strong></div>
          </div>
          <div className={styles.insightCallout}>
            <span><PageIcon name="curatorialNote" size={18} /></span>
            <p><strong>Curatorial insight</strong><small>Audio-led interpretation is associated with 22% longer dwell at this exhibit.</small></p>
          </div>
          <button className={styles.secondaryButton} type="button">Open full exhibit profile <PageIcon name="navigate" size={14} /></button>
        </Card>
      </div>
    </div>
  );
}
