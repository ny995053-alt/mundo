"use client";

import { useState } from "react";

import { PageIcon } from "../page-icons";
import { Card, PageHeading } from "../museum-ui";
import styles from "../dashboard.module.css";

const defaults = {
  autoRefresh: true,
  bottleneckAlerts: true,
  reportAlerts: true,
  warningThreshold: 70,
  criticalThreshold: 85,
};

export default function SettingsView() {
  const [preferences, setPreferences] = useState(defaults);
  const [saved, setSaved] = useState(false);

  const toggle = (key: "autoRefresh" | "bottleneckAlerts" | "reportAlerts") => {
    setSaved(false);
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div className={styles.dashboardPage}>
      <PageHeading
        title="Settings"
        description="Configure how Mundo monitors visitor flow and keeps your team informed."
        actions={
          <>
            {saved && <span className={styles.settingsSaved}><PageIcon name="verified" size={13} /> Changes saved</span>}
            <button className={styles.secondaryButton} type="button" onClick={() => { setPreferences(defaults); setSaved(false); }}>Reset</button>
            <button className={styles.primaryButton} type="button" onClick={() => setSaved(true)}><PageIcon name="verified" size={15} /> Save changes</button>
          </>
        }
      />

      <div className={styles.settingsGrid}>
        <Card title="Workspace" description="Museum identity and default workspace behavior" className={styles.settingsCard}>
          <div className={styles.settingsFields}>
            <label><span>Museum name</span><input defaultValue="Mundo Museum" /></label>
            <label><span>Timezone</span><select defaultValue="Africa/Accra"><option>Africa/Accra</option><option>Europe/London</option><option>America/New_York</option></select></label>
            <label><span>Default landing page</span><select defaultValue="Live Dashboard"><option>Live Dashboard</option><option>Heatmap</option><option>Exhibit Analytics</option></select></label>
          </div>
        </Card>

        <Card title="Live Data" description="Control how frequently operational data updates" className={styles.settingsCard}>
          <div className={styles.settingsRows}>
            <div><span className={styles.settingsRowIcon}><PageIcon name="dataRefresh" size={17} /></span><p><strong>Automatic refresh</strong><small>Poll the latest visitor snapshot every 30 seconds.</small></p><button className={`${styles.toggleSwitch} ${preferences.autoRefresh ? styles.toggleSwitchOn : ""}`} onClick={() => toggle("autoRefresh")} type="button" role="switch" aria-checked={preferences.autoRefresh}><span /></button></div>
            <div><span className={styles.settingsRowIcon}><PageIcon name="refreshInterval" size={17} /></span><p><strong>Refresh interval</strong><small>Applied when automatic refresh is enabled.</small></p><select defaultValue="30 seconds"><option>15 seconds</option><option>30 seconds</option><option>60 seconds</option></select></div>
          </div>
        </Card>

        <Card title="Capacity Thresholds" description="Set the points that trigger busy and critical states" className={styles.settingsCard}>
          <div className={styles.thresholdList}>
            <label><span><strong>Busy warning</strong><small>Show an early capacity warning.</small></span><b>{preferences.warningThreshold}%</b><input type="range" min="50" max="80" value={preferences.warningThreshold} onChange={(event) => { setSaved(false); setPreferences((current) => ({ ...current, warningThreshold: Number(event.target.value) })); }} /></label>
            <label><span><strong>Critical alert</strong><small>Trigger an immediate flow alert.</small></span><b>{preferences.criticalThreshold}%</b><input type="range" min="75" max="100" value={preferences.criticalThreshold} onChange={(event) => { setSaved(false); setPreferences((current) => ({ ...current, criticalThreshold: Number(event.target.value) })); }} /></label>
          </div>
        </Card>

        <Card title="Notifications" description="Choose which operational events reach your team" className={styles.settingsCard}>
          <div className={styles.settingsRows}>
            <div><span className={styles.settingsRowIcon}><PageIcon name="capacityAlert" size={17} /></span><p><strong>Bottleneck alerts</strong><small>Notify when a monitored route becomes constrained.</small></p><button className={`${styles.toggleSwitch} ${preferences.bottleneckAlerts ? styles.toggleSwitchOn : ""}`} onClick={() => toggle("bottleneckAlerts")} type="button" role="switch" aria-checked={preferences.bottleneckAlerts}><span /></button></div>
            <div><span className={styles.settingsRowIcon}><PageIcon name="reportNotification" size={17} /></span><p><strong>Report-ready alerts</strong><small>Notify when generated PDF or CSV files are ready.</small></p><button className={`${styles.toggleSwitch} ${preferences.reportAlerts ? styles.toggleSwitchOn : ""}`} onClick={() => toggle("reportAlerts")} type="button" role="switch" aria-checked={preferences.reportAlerts}><span /></button></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
