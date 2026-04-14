import type { ReactNode } from "react";
import styles from "./AppShell.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export interface AppShellNavigationItem {
  id: string;
  label: string;
  icon?: ReactNode;
  meta?: string;
  active?: boolean;
  onSelect?: () => void;
}

export interface AppShellProps {
  brand: ReactNode;
  navigation: AppShellNavigationItem[];
  children: ReactNode;
  navigationLabel?: string;
  sidebarFooter?: ReactNode;
  topBar?: ReactNode;
  mobileNavigationOpen?: boolean;
  onMobileNavigationToggle?: () => void;
  onMobileNavigationDismiss?: () => void;
  mobileNavigationLabel?: string;
  className?: string;
  viewport?: "mobile" | "tablet" | "desktop";
}

export function AppShell(props: AppShellProps) {
  const showToggle = Boolean(props.onMobileNavigationToggle);
  const sidebarLabel = props.navigationLabel ?? "Primary navigation";
  const mobileNavigationLabel = props.mobileNavigationLabel ?? "Toggle navigation";

  return (
    <div
      className={cx(
        styles.shell,
        props.viewport === "tablet" && styles.viewportTablet,
        props.viewport === "mobile" && styles.viewportMobile,
        props.className
      )}
    >
      <button
        aria-hidden={!props.mobileNavigationOpen}
        className={
          props.mobileNavigationOpen ? styles.backdropVisible : styles.backdrop
        }
        onClick={props.onMobileNavigationDismiss ?? props.onMobileNavigationToggle}
        tabIndex={props.mobileNavigationOpen ? 0 : -1}
        type="button"
      />

      <aside
        aria-label={sidebarLabel}
        className={
          props.mobileNavigationOpen
            ? `${styles.sidebar} ${styles.sidebarOpen}`
            : styles.sidebar
        }
      >
        <div className={styles.sidebarPanel}>
          <div className={styles.brand}>{props.brand}</div>

          <nav className={styles.navigation}>
            {props.navigation.map((item) => (
              <button
                aria-current={item.active ? "page" : undefined}
                className={
                  item.active
                    ? `${styles.navItem} ${styles.navItemActive}`
                    : styles.navItem
                }
                key={item.id}
                onClick={item.onSelect}
                type="button"
              >
                {item.icon ? <span className={styles.navIcon}>{item.icon}</span> : null}
                <span className={styles.navTextGroup}>
                  <span className={styles.navLabel}>{item.label}</span>
                  {item.meta ? <span className={styles.navMeta}>{item.meta}</span> : null}
                </span>
              </button>
            ))}
          </nav>

          {props.sidebarFooter ? (
            <div className={styles.sidebarFooter}>{props.sidebarFooter}</div>
          ) : null}
        </div>
      </aside>

      <div className={styles.main}>
        {showToggle ? (
          <div className={styles.mobileChrome}>
            <button
              aria-expanded={props.mobileNavigationOpen}
              className={styles.mobileMenuButton}
              onClick={props.onMobileNavigationToggle}
              type="button"
            >
              <span className={styles.menuBars} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span>{mobileNavigationLabel}</span>
            </button>
          </div>
        ) : null}

        {props.topBar ? <header className={styles.topBar}>{props.topBar}</header> : null}

        <main className={styles.content}>{props.children}</main>
      </div>
    </div>
  );
}
