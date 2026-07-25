"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import mundoLogo from "@/public/mundo.png";

import { exhibits, zones } from "./museum-data";
import { Icon, type IconName } from "./museum-icons";
import styles from "./dashboard.module.css";

const navigation: { href: string; label: string; mobileLabel: string; icon: IconName; badge?: string }[] = [
  { href: "/dashboard", label: "Live Dashboard", mobileLabel: "Dashboard", icon: "dashboard", badge: "Live" },
  { href: "/heatmap", label: "Heatmap", mobileLabel: "Heatmap", icon: "heatmap" },
  { href: "/exhibits", label: "Exhibit Analytics", mobileLabel: "Exhibits", icon: "exhibit" },
  { href: "/reports", label: "Reports", mobileLabel: "Reports", icon: "reports" },
];

const bottomNavigation = [
  ...navigation,
  { href: "/settings", label: "Settings", mobileLabel: "Settings", icon: "settings" as IconName },
];

function applyDocumentTheme(theme: "light" | "dark") {
  const background = theme === "dark" ? "#0c0e11" : "#f5f7f9";
  document.documentElement.style.colorScheme = theme;
  document.documentElement.style.backgroundColor = background;
  document.body.style.backgroundColor = background;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", background);
}

const searchEntries = [
  ...navigation.map((item) => ({
    label: item.label,
    detail: "Workspace",
    href: item.href,
    icon: item.icon,
  })),
  ...zones.map((zone) => ({
    label: zone.name,
    detail: `${zone.occupancy}% occupied · Zone`,
    href: `/heatmap?zone=${zone.id}`,
    icon: "zones" as IconName,
  })),
  ...exhibits.map((exhibit) => ({
    label: exhibit.name,
    detail: `${exhibit.zone} · Exhibit`,
    href: `/exhibits?exhibit=${exhibit.id}`,
    icon: "exhibit" as IconName,
  })),
];

export default function MuseumShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const themeLoadedRef = useRef(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    let savedTheme: string | null = null;
    try {
      savedTheme = window.localStorage.getItem("mundo-dashboard-theme");
    } catch {
      savedTheme = null;
    }
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const nextTheme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : preferredTheme;
    const frame = window.requestAnimationFrame(() => {
      themeLoadedRef.current = true;
      setTheme(nextTheme);
      applyDocumentTheme(nextTheme);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.documentElement.style.removeProperty("color-scheme");
      document.documentElement.style.removeProperty("background-color");
      document.body.style.removeProperty("background-color");
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#f80703");
    };
  }, []);

  useEffect(() => {
    if (!themeLoadedRef.current) return;
    try {
      window.localStorage.setItem("mundo-dashboard-theme", theme);
    } catch {
      // Theme switching still works when storage is unavailable.
    }
    applyDocumentTheme(theme);
  }, [theme]);

  const closePanels = () => {
    setSearchOpen(false);
    setNotificationsOpen(false);
  };

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return searchEntries
      .filter((entry) => !normalized || `${entry.label} ${entry.detail}`.toLowerCase().includes(normalized))
      .slice(0, 6);
  }, [query]);

  const navigateToFirstResult = () => {
    const first = results[0];
    if (first) {
      closePanels();
      router.push(first.href);
    }
  };

  return (
    <div className={styles.dashboardShell} data-theme={theme}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrandRow}>
          <Link className={styles.logoLink} href="/dashboard" onClick={closePanels} aria-label="Mundo Museum dashboard">
            <span className={styles.logoCrop}>
              <Image className={styles.logoImage} src={mundoLogo} alt="Mundo" unoptimized sizes="110px" />
            </span>
          </Link>
        </div>

        <nav className={styles.sidebarNav} aria-label="Museum analytics navigation">
          <span className={styles.navLabel}>Workspace</span>
          {navigation.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                href={item.href}
                onClick={closePanels}
                aria-current={active ? "page" : undefined}
              >
                <Icon name={item.icon} size={19} />
                <span>{item.label}</span>
                {item.badge && <em>{item.badge}</em>}
              </Link>
            );
          })}

          <span className={styles.navLabel}>Operations</span>
          <Link className={styles.navItem} href="/heatmap?view=zones" onClick={closePanels}>
            <Icon name="zones" size={19} />
            <span>Zone Monitor</span>
            <b>7</b>
          </Link>
          <Link className={styles.navItem} href="/dashboard#bottlenecks" onClick={closePanels}>
            <Icon name="alert" size={19} />
            <span>Flow Alerts</span>
            <b className={styles.alertBadge}>3</b>
          </Link>
        </nav>

        <div className={styles.sidebarBottom}>
          <Link className={`${styles.navItem} ${pathname === "/settings" ? styles.navItemActive : ""}`} href="/settings" onClick={closePanels}>
            <Icon name="settings" size={19} />
            <span>Settings</span>
          </Link>
          <Link className={styles.navItem} href="/dashboard?panel=help" onClick={closePanels}>
            <Icon name="help" size={19} />
            <span>Help & Support</span>
          </Link>
        </div>
      </aside>

      <header className={styles.topbar}>
        <div className={styles.searchWrap}>
          <form
            className={`${styles.searchBox} ${searchOpen ? styles.searchBoxActive : ""}`}
            onSubmit={(event) => {
              event.preventDefault();
              navigateToFirstResult();
            }}
          >
            <Icon name="search" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search zones, exhibits, reports..."
              aria-label="Search museum analytics"
            />
            <kbd>⌘ K</kbd>
          </form>
          {searchOpen && (
            <div className={styles.searchResults}>
              <div className={styles.searchResultsHeader}>
                <span>{query ? "Search results" : "Quick navigation"}</span>
                <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search"><Icon name="close" size={16} /></button>
              </div>
              {results.length ? results.map((entry) => (
                <button
                  key={`${entry.href}-${entry.label}`}
                  type="button"
                  onClick={() => {
                    closePanels();
                    router.push(entry.href);
                  }}
                >
                  <span><Icon name={entry.icon} size={17} /></span>
                  <div><strong>{entry.label}</strong><small>{entry.detail}</small></div>
                  <Icon name="arrowRight" size={15} />
                </button>
              )) : <p className={styles.emptySearch}>No museum data matches “{query}”.</p>}
            </div>
          )}
        </div>

        <div className={styles.topbarActions}>
          <button
            className={styles.topbarIconButton}
            type="button"
            onClick={() => setTheme((current) => current === "light" ? "dark" : "light")}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            aria-pressed={theme === "dark"}
            title={`Use ${theme === "light" ? "dark" : "light"} mode`}
          >
            <Icon name={theme === "light" ? "moon" : "sun"} size={19} />
          </button>
          <div className={styles.notificationWrap}>
            <button
              className={styles.topbarIconButton}
              onClick={() => setNotificationsOpen((open) => !open)}
              type="button"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <Icon name="bell" size={19} />
              <span />
            </button>
            {notificationsOpen && (
              <div className={styles.notificationPanel}>
                <header><strong>Flow notifications</strong><span>3 new</span></header>
                <div><i className={styles.notificationCritical}><Icon name="alert" size={16} /></i><p><strong>Ancient Worlds at 90%</strong><small>Capacity threshold crossed 2 min ago</small></p></div>
                <div><i><Icon name="activity" size={16} /></i><p><strong>Special Exhibition queue rising</strong><small>Wait time is now approximately 8 minutes</small></p></div>
                <div><i className={styles.notificationSuccess}><Icon name="check" size={16} /></i><p><strong>Morning report is ready</strong><small>Visitor Flow Overview · PDF</small></p></div>
                <Link href="/dashboard#bottlenecks" onClick={closePanels}>View all activity</Link>
              </div>
            )}
          </div>
          <button className={styles.profileButton} type="button" aria-label="Open profile menu">
            <span>AM</span>
            <div><strong>Ama Mensah</strong><small>Curator Admin</small></div>
            <Icon name="chevronDown" size={15} />
          </button>
        </div>
      </header>

      <main className={styles.dashboardMain}>{children}</main>

      <nav className={styles.bottomNav} aria-label="Mobile museum analytics navigation">
        {bottomNavigation.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              className={`${styles.bottomNavLink} ${active ? styles.bottomNavLinkActive : ""}`}
              href={item.href}
              onClick={closePanels}
              aria-current={active ? "page" : undefined}
            >
              <span><Icon name={item.icon} size={20} /></span>
              <small>{item.mobileLabel}</small>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
