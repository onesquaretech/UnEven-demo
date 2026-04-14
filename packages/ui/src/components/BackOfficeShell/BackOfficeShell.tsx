import type { ReactNode } from "react";
import {
  AppShell,
  type AppShellNavigationItem,
  type AppShellProps
} from "../AppShell/AppShell";
import type { ThemeMode } from "../../foundations";
import styles from "./BackOfficeShell.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export interface BackOfficeShellProps
  extends Omit<AppShellProps, "brand" | "sidebarFooter" | "navigation"> {
  navigation: AppShellNavigationItem[];
  brandName?: string;
  brandSubtitle?: string;
  userInitials?: string;
  userName?: string;
  userRole?: string;
  themeMode?: ThemeMode;
  onThemeToggle?: () => void;
}

function navIcon(token: string) {
  return <span aria-hidden="true" className={cx(styles.navGlyph, styles[`navGlyph${token}`])} />;
}

function BrandBlock(props: { brandName: string; brandSubtitle: string }) {
  return (
    <div className={styles.brandBlock}>
      <div aria-hidden="true" className={styles.brandMark}>
        <span className={styles.brandMarkPrimary} />
        <span className={styles.brandMarkSecondary} />
      </div>
      <div className={styles.brandText}>
        <strong>{props.brandName}</strong>
        <span>{props.brandSubtitle}</span>
      </div>
    </div>
  );
}

function SidebarFooter(props: {
  userInitials: string;
  userName: string;
  userRole: string;
  themeMode?: ThemeMode;
  onThemeToggle?: () => void;
}) {
  return (
    <div className={styles.sidebarFooterStack}>
      <div className={styles.sidebarFooterCard}>
        <div className={styles.sidebarFooterAvatar}>{props.userInitials}</div>
        <div className={styles.sidebarFooterCopy}>
          <strong>{props.userName}</strong>
          <span>{props.userRole}</span>
        </div>
        <span aria-hidden="true" className={styles.sidebarFooterStatus} />
      </div>

      {props.onThemeToggle ? (
        <button
          aria-label={`Switch to ${props.themeMode === "dark" ? "light" : "dark"} theme`}
          className={styles.themeToggle}
          onClick={props.onThemeToggle}
          type="button"
        >
          <span className={styles.themeToggleCopy}>
            <strong>Theme</strong>
            <span>{props.themeMode === "dark" ? "Dark mode" : "Light mode"}</span>
          </span>
          <span className={styles.themeToggleTrack}>
            <span className={styles.themeToggleLabel}>L</span>
            <span className={styles.themeToggleLabel}>D</span>
            <span
              className={
                props.themeMode === "dark"
                  ? `${styles.themeToggleThumb} ${styles.themeToggleThumbDark}`
                  : styles.themeToggleThumb
              }
            />
          </span>
        </button>
      ) : null}
    </div>
  );
}

function resolveNavigationIcon(id: string) {
  switch (id) {
    case "dashboard":
      return navIcon("Dashboard");
    case "admissions":
      return navIcon("Admissions");
    case "students":
      return navIcon("Students");
    case "allocation":
      return navIcon("Notices");
    case "attendance":
      return navIcon("Attendance");
    case "fees":
      return navIcon("Fees");
    case "notices":
      return navIcon("Notices");
    case "transport":
      return navIcon("Transport");
    case "reports":
      return navIcon("Reports");
    case "settings":
      return navIcon("Settings");
    default:
      return navIcon("Dashboard");
  }
}

export function BackOfficeShell(props: BackOfficeShellProps) {
  const {
    brandName = "Greenfield",
    brandSubtitle = "School Management System",
    navigation,
    onThemeToggle,
    userInitials = "MI",
    userName = "Meera Iyer",
    userRole = "Principal",
    themeMode = "light",
    ...shellProps
  } = props;

  return (
    <AppShell
      {...shellProps}
      brand={<BrandBlock brandName={brandName} brandSubtitle={brandSubtitle} />}
      navigation={navigation.map((item) => ({
        ...item,
        icon: item.icon ?? resolveNavigationIcon(item.id)
      }))}
      sidebarFooter={
        <SidebarFooter
          onThemeToggle={onThemeToggle}
          themeMode={themeMode}
          userInitials={userInitials}
          userName={userName}
          userRole={userRole}
        />
      }
    />
  );
}
