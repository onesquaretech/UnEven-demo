import type { ReactNode } from "react";
import styles from "./PortalShell.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export interface PortalShellNavigationItem {
  id: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
}

export interface PortalShellProps {
  brand: ReactNode;
  navigation: PortalShellNavigationItem[];
  children: ReactNode;
  topBar?: ReactNode;
  mobileNavigationOpen?: boolean;
  onMobileNavigationToggle?: () => void;
  onMobileNavigationDismiss?: () => void;
  mobileNavigationLabel?: string;
  navigationLabel?: string;
  className?: string;
  viewport?: "mobile" | "tablet" | "desktop";
}

export function PortalShell(props: PortalShellProps) {
  const showToggle = Boolean(props.onMobileNavigationToggle);
  const navigationLabel = props.navigationLabel ?? "Portal navigation";
  const mobileNavigationLabel = props.mobileNavigationLabel ?? "Open portal navigation";

  function renderNavigation() {
    return props.navigation.map((item) => (
      <button
        key={item.id}
        aria-current={item.active ? "page" : undefined}
        className={cx(
          styles.navItem,
          item.active && styles.navItemActive,
          item.disabled && styles.navItemDisabled
        )}
        disabled={item.disabled}
        type="button"
      >
        {item.label}
      </button>
    ));
  }

  return (
    <div
      className={cx(
        styles.shell,
        props.viewport === "tablet" && styles.viewportTablet,
        props.viewport === "mobile" && styles.viewportMobile,
        props.className
      )}
    >
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.brand}>{props.brand}</div>
          {showToggle ? (
            <button
              aria-expanded={props.mobileNavigationOpen}
              className={styles.mobileMenuButton}
              onClick={props.onMobileNavigationToggle}
              type="button"
            >
              <span aria-hidden="true" className={styles.menuBars}>
                <span />
                <span />
                <span />
              </span>
              <span>{mobileNavigationLabel}</span>
            </button>
          ) : null}
          {props.topBar ? <div className={styles.topBar}>{props.topBar}</div> : null}
        </div>

        <nav aria-label={navigationLabel} className={cx(styles.nav, styles.navDesktop)}>
          {renderNavigation()}
        </nav>

        <nav
          aria-label={`${navigationLabel} mobile`}
          className={cx(
            styles.nav,
            styles.navMobile,
            props.mobileNavigationOpen && styles.navMobileOpen
          )}
        >
          {renderNavigation()}
        </nav>
      </header>

      <main className={styles.content} onClick={props.onMobileNavigationDismiss}>
        {props.children}
      </main>
    </div>
  );
}
