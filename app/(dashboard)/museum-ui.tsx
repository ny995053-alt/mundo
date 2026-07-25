import type { ReactNode } from "react";

import { PageIcon, type PageIconName } from "./page-icons";
import styles from "./dashboard.module.css";

type Trend = {
  value: string;
  direction: "up" | "down" | "neutral";
};

export function KpiCard({
  label,
  value,
  detail,
  trend,
  icon,
  tone = "red",
  sparkline,
}: {
  label: string;
  value: string;
  detail: string;
  trend: Trend;
  icon: PageIconName;
  tone?: "red" | "green" | "amber" | "ink";
  sparkline: number[];
}) {
  return (
    <article className={styles.kpiCard}>
      <div className={styles.kpiTopline}>
        <span>{label}</span>
        <span className={`${styles.kpiIcon} ${styles[`tone_${tone}`]}`}>
          <PageIcon name={icon} size={18} />
        </span>
      </div>
      <div className={styles.kpiValueRow}>
        <strong>{value}</strong>
        <span
          className={`${styles.trendPill} ${
            trend.direction === "down" ? styles.trendDown : trend.direction === "neutral" ? styles.trendNeutral : styles.trendUp
          }`}
        >
          {trend.direction !== "neutral" && (
            <PageIcon name={trend.direction === "up" ? "trendUp" : "trendDown"} size={12} />
          )}
          {trend.value}
        </span>
      </div>
      <div className={styles.kpiBottomline}>
        <span>{detail}</span>
        <MiniSparkline values={sparkline} tone={tone} />
      </div>
    </article>
  );
}

export function MiniSparkline({
  values,
  tone = "red",
}: {
  values: number[];
  tone?: "red" | "green" | "amber" | "ink";
}) {
  const width = 94;
  const height = 30;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 1);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - 3 - ((value - min) / span) * (height - 8);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className={styles.miniSparkline} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline className={styles[`spark_${tone}`]} points={points} />
    </svg>
  );
}

function chartPoints(values: number[], width: number, height: number, padding: number) {
  const max = Math.max(...values) * 1.08;
  const min = 0;
  return values.map((value, index) => ({
    x: padding + (index / (values.length - 1)) * (width - padding * 2),
    y: height - padding - ((value - min) / Math.max(max - min, 1)) * (height - padding * 2),
  }));
}

function smoothPath(points: { x: number; y: number }[]) {
  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const controlX = (previous.x + point.x) / 2;
    return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }, "");
}

export function LineChart({
  values,
  comparison,
  labels,
  gradientId,
  compact = false,
}: {
  values: number[];
  comparison?: number[];
  labels: string[];
  gradientId: string;
  compact?: boolean;
}) {
  const width = 760;
  const height = compact ? 210 : 260;
  const padding = compact ? 26 : 34;
  const points = chartPoints(values, width, height, padding);
  const comparisonPoints = comparison ? chartPoints(comparison, width, height, padding) : [];
  const path = smoothPath(points);
  const comparisonPath = comparison ? smoothPath(comparisonPoints) : "";
  const areaPath = `${path} L ${points.at(-1)?.x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  const visibleLabelIndexes = labels.length > 8 ? [0, 3, 6, 9, 12] : labels.map((_, index) => index);

  return (
    <div className={styles.lineChartWrap}>
      <svg
        className={styles.lineChart}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Line chart. Values range from ${Math.min(...values)} to ${Math.max(...values)}.`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e31b23" stopOpacity="0.23" />
            <stop offset="1" stopColor="#e31b23" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.18, 0.42, 0.66, 0.9].map((position) => (
          <line
            key={position}
            className={styles.chartGridLine}
            x1={padding}
            x2={width - padding}
            y1={height * position}
            y2={height * position}
          />
        ))}
        {comparison && <path className={styles.comparisonLine} d={comparisonPath} />}
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path className={styles.primaryLine} d={path} />
        {points.map((point, index) => (
          <circle
            key={`${point.x}-${point.y}`}
            className={index === points.length - 1 ? styles.chartPointActive : styles.chartPoint}
            cx={point.x}
            cy={point.y}
            r={index === points.length - 1 ? 4.5 : 2.25}
          />
        ))}
      </svg>
      <div className={styles.chartLabels}>
        {visibleLabelIndexes.map((index) => (
          <span key={labels[index]}>{labels[index]}</span>
        ))}
      </div>
    </div>
  );
}

export function Card({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`${styles.card} ${className}`}>
      <header className={styles.cardHeader}>
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {action ?? (
          <button className={styles.iconButtonBare} type="button" aria-label={`More ${title} options`}>
            <PageIcon name="overflow" size={18} />
          </button>
        )}
      </header>
      {children}
    </section>
  );
}

export function StatusPill({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const tone = normalized.includes("critical") || normalized.includes("high")
    ? styles.statusCritical
    : normalized.includes("busy") || normalized.includes("moderate") || normalized.includes("watch")
      ? styles.statusBusy
      : styles.statusNormal;

  return <span className={`${styles.statusPill} ${tone}`}><span />{status}</span>;
}

export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode;
  title: string;
  description: string;
  actions: ReactNode;
}) {
  return (
    <div className={styles.pageHeading}>
      <div>
        {eyebrow}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className={styles.pageActions}>{actions}</div>
    </div>
  );
}
