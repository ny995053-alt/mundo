"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

import {
  bottlenecks,
  flowHours,
  formatNumber,
  previousVisitorFlow,
  visitorFlow,
  zones,
  type MuseumZone,
} from "../museum-data";
import { PageIcon } from "../page-icons";
import { Card, KpiCard, LineChart, PageHeading, StatusPill } from "../museum-ui";
import styles from "../dashboard.module.css";

const jitterZone = (zone: MuseumZone, iteration: number): MuseumZone => {
  const offset = ((iteration * 3 + zone.name.length) % 5) - 2;
  const occupancy = Math.max(20, Math.min(96, zone.occupancy + offset));
  const visitors = Math.round((zone.capacity * occupancy) / 100);
  return {
    ...zone,
    occupancy,
    visitors,
    netFlow: zone.netFlow + ((iteration + zone.id.length) % 3) - 1,
    status: occupancy >= 85 ? "Critical" : occupancy >= 70 ? "Busy" : "Normal",
  };
};

function downloadLiveCsv(liveZones: MuseumZone[]) {
  const headers = ["Zone", "Current visitors", "Capacity", "Occupancy percent", "Average dwell", "Net flow", "Status"];
  const rows = liveZones.map((zone) => [
    zone.name,
    zone.visitors,
    zone.capacity,
    zone.occupancy,
    zone.dwell,
    zone.netFlow,
    zone.status,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "mundo-live-visitor-flow.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function LiveDashboard() {
  const iterationRef = useRef(0);
  const [liveZones, setLiveZones] = useState(zones);
  const [flow, setFlow] = useState(visitorFlow);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visitors, setVisitors] = useState(1842);
  const [interactions, setInteractions] = useState(8694);

  const refreshSnapshot = useCallback(() => {
    iterationRef.current += 1;
    const iteration = iterationRef.current;
    setIsRefreshing(true);
    setLiveZones(zones.map((zone) => jitterZone(zone, iteration)));
    setFlow(visitorFlow.map((value, index) => value + (((iteration + index * 2) % 7) - 3) * 3));
    setVisitors(1842 + ((iteration * 17) % 63));
    setInteractions(8694 + ((iteration * 41) % 170));
    setSecondsUntilRefresh(30);
    window.setTimeout(() => setIsRefreshing(false), 320);
  }, []);

  useEffect(() => {
    const poller = window.setInterval(() => {
      if (!document.hidden) refreshSnapshot();
    }, 30_000);
    const ticker = window.setInterval(() => {
      if (!document.hidden) {
        setSecondsUntilRefresh((seconds) => (seconds <= 1 ? 30 : seconds - 1));
      }
    }, 1_000);

    const handleVisibility = () => {
      if (!document.hidden) refreshSnapshot();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearInterval(poller);
      window.clearInterval(ticker);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [refreshSnapshot]);

  const currentVisitors = liveZones.reduce((sum, zone) => sum + zone.visitors, 0);
  const averageOccupancy = Math.round(liveZones.reduce((sum, zone) => sum + zone.occupancy, 0) / liveZones.length);

  return (
    <div className={styles.dashboardPage}>
      <PageHeading
        title="Visitor Flow Dashboard"
        description="A real-time view of movement, engagement, and capacity across Mundo Museum."
        actions={
          <>
            <div className={styles.controlGroup}>
              <button className={styles.control} type="button">
                <PageIcon name="dateRange" size={15} /> Jul 24, 2026
              </button>
              <button className={styles.control} type="button">Today <PageIcon name="selector" size={14} /></button>
            </div>
            <button
              className={`${styles.secondaryButton} ${isRefreshing ? styles.refreshing : ""}`}
              type="button"
              onClick={refreshSnapshot}
            >
              <PageIcon name="sync" size={15} /> Refresh in {secondsUntilRefresh}s
            </button>
            <button className={styles.primaryButton} type="button" onClick={() => downloadLiveCsv(liveZones)}>
              <PageIcon name="export" size={15} /> Export
            </button>
          </>
        }
      />

      <div className={styles.kpiGrid}>
        <KpiCard
          label="Total visitors"
          value={formatNumber(visitors)}
          detail="vs. 1,638 this time yesterday"
          trend={{ value: "12.4%", direction: "up" }}
          icon="visitorVolume"
          sparkline={[22, 31, 28, 39, 47, 44, 58, 63]}
        />
        <KpiCard
          label="Avg. engagement"
          value="18m 42s"
          detail="Museum-wide average dwell"
          trend={{ value: "7.8%", direction: "up" }}
          icon="dwellTime"
          tone="green"
          sparkline={[21, 26, 29, 27, 34, 38, 41, 45]}
        />
        <KpiCard
          label="Active bottlenecks"
          value="3"
          detail="2 fewer than yesterday"
          trend={{ value: "Action", direction: "neutral" }}
          icon="flowConstraint"
          tone="amber"
          sparkline={[52, 45, 48, 39, 34, 31, 27, 24]}
        />
        <KpiCard
          label="Exhibit interactions"
          value={formatNumber(interactions)}
          detail="Across 42 tracked exhibits"
          trend={{ value: "9.1%", direction: "up" }}
          icon="interactionDepth"
          tone="ink"
          sparkline={[26, 33, 29, 41, 43, 52, 49, 61]}
        />
      </div>

      <div className={styles.dashboardBodyGrid}>
        <div className={styles.dashboardLeftColumn}>
          <Card
            title="Visitor Flow"
            description="Hourly movement through all monitored entrances"
            className={styles.visitorFlowCard}
            action={
              <div className={styles.chartLegend}>
                <span><i className={styles.legendCurrent} />Today</span>
                <span><i className={styles.legendPrevious} />Yesterday</span>
              </div>
            }
          >
            <div className={styles.visitorFlowOverview}>
              <div className={styles.heroMetric}>
                <span>Visitors today</span>
                <strong>{formatNumber(visitors)}</strong>
                <em><PageIcon name="trendUp" size={12} /> 12.4% <small>vs. yesterday</small></em>
              </div>
              <div className={styles.visitorChart}>
                <LineChart
                  values={flow}
                  comparison={previousVisitorFlow}
                  labels={flowHours}
                  gradientId="visitor-flow-gradient"
                  compact
                />
              </div>
            </div>
            <div className={styles.flowSummaryStrip}>
              <div><span className={styles.summaryIconRed}><PageIcon name="insideCount" size={16} /></span><p><small>Current inside</small><strong>{formatNumber(currentVisitors)}</strong></p></div>
              <div><span className={styles.summaryIconGreen}><PageIcon name="entryFlow" size={16} /></span><p><small>Entries this hour</small><strong>384</strong></p></div>
              <div><span className={styles.summaryIconAmber}><PageIcon name="flowBalance" size={16} /></span><p><small>Net flow</small><strong>+27</strong></p></div>
            </div>
          </Card>

          <Card title="Zone Status" description="Live occupancy and visitor-flow indicators" className={styles.zoneTableCard}>
            <div className={styles.tableScroll}>
              <table className={styles.dataTable}>
                <thead><tr><th>Zone</th><th>Visitors</th><th>Occupancy</th><th>Avg. dwell</th><th>Net flow</th><th>Status</th></tr></thead>
                <tbody>
                  {liveZones.map((zone) => (
                    <tr key={zone.id}>
                      <td><span className={styles.zoneAvatar}>{zone.name.charAt(0)}</span><div><strong>{zone.name}</strong><small>{zone.capacity} capacity</small></div></td>
                      <td>{zone.visitors}</td>
                      <td><div className={styles.inlineOccupancy}><span><i style={{ width: `${zone.occupancy}%` }} /></span><b>{zone.occupancy}%</b></div></td>
                      <td>{zone.dwell}</td>
                      <td className={zone.netFlow >= 0 ? styles.positiveValue : styles.negativeValue}>{zone.netFlow >= 0 ? "+" : ""}{zone.netFlow}</td>
                      <td><StatusPill status={zone.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className={styles.dashboardRightColumn}>
          <Card title="Zone Occupancy" description={`${currentVisitors} visitors currently inside`} className={styles.occupancyCard}>
            <div className={styles.occupancyBars}>
              {liveZones.map((zone) => (
                <div className={styles.occupancyBarItem} key={zone.id} title={`${zone.name}: ${zone.occupancy}%`}>
                  <b>{zone.occupancy}%</b>
                  <div className={styles.occupancyBarTrack}>
                    <span className={styles[`bar_${zone.status.toLowerCase()}`]} style={{ height: `${zone.occupancy}%` }} />
                  </div>
                  <small>{zone.shortName}</small>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Capacity Utilization" description="Museum-wide live capacity" className={styles.capacityCard}>
            <div className={styles.gaugeLayout}>
              <div className={styles.gaugeRing} style={{ "--gauge-value": `${averageOccupancy * 3.6}deg` } as CSSProperties}>
                <div><strong>{averageOccupancy}%</strong><span>utilized</span></div>
              </div>
              <div className={styles.gaugeStats}>
                <div><span>Current visitors</span><strong>{formatNumber(currentVisitors)}</strong></div>
                <div><span>Total capacity</span><strong>1,340</strong></div>
                <div><span>Available space</span><strong>{formatNumber(1340 - currentVisitors)}</strong></div>
              </div>
            </div>
          </Card>

          <Card title="Active Bottlenecks" description="Areas requiring operational attention" className={styles.bottleneckCard}>
            <div id="bottlenecks" className={styles.bottleneckList}>
              {bottlenecks.map((item, index) => (
                <div key={item.location}>
                  <span className={index === 0 ? styles.bottleneckCritical : styles.bottleneckWarning}><PageIcon name="flowConstraint" size={15} /></span>
                  <p><strong>{item.zone} · {item.location}</strong><small>{item.note}</small></p>
                  <div><StatusPill status={item.severity} /><em>{item.duration}</em></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
