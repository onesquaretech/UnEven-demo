import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BackOfficeShell,
  Button,
  Card,
  CircularProgress,
  DataList,
  MetricCard,
  PageHeader,
  StatusChip,
  Tabs
} from "../../ui";
import type { ThemeMode } from "../../ui";
import { buildBackOfficeNavigation } from "../../app/navigation";
import { buildAdminDashboardViewModel } from "./buildAdminDashboardViewModel";
import type {
  AdminDashboardAdmissionRequest,
  AdminDashboardClassOccupancy,
  AdminDashboardMetric
} from "./adminDashboard.types";
import styles from "./AdminDashboardPage.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

function detectViewport(width: number): "mobile" | "tablet" | "desktop" {
  if (width <= 720) {
    return "mobile";
  }

  if (width <= 1100) {
    return "tablet";
  }

  return "desktop";
}

function metricIcon(token: string) {
  return <span aria-hidden="true" className={`${styles.metricGlyph} ${styles[`metricGlyph${token}`]}`} />;
}

function quickActionIcon(token: string) {
  return (
    <span aria-hidden="true" className={`${styles.quickActionGlyph} ${styles[`quickActionGlyph${token}`]}`} />
  );
}

function mapMetricIcon(metricId: AdminDashboardMetric["id"]) {
  switch (metricId) {
    case "students":
      return metricIcon("Students");
    case "teachers":
      return metricIcon("Teachers");
    case "attendance":
      return metricIcon("Attendance");
    case "dues":
      return metricIcon("Dues");
    default:
      return metricIcon("Admissions");
  }
}

function mapMetricTone(metric: AdminDashboardMetric) {
  switch (metric.tone) {
    case "success":
      return styles.metricCardSuccess;
    case "warning":
      return styles.metricCardWarning;
    case "danger":
      return styles.metricCardDanger;
    case "neutral":
      return styles.metricCardNeutral;
    default:
      return styles.metricCardAccent;
  }
}

function mapAdmissionTone(statusLabel: AdminDashboardAdmissionRequest["statusLabel"]) {
  if (statusLabel === "Reviewed") {
    return "success";
  }

  if (statusLabel === "Ready Review") {
    return "info";
  }

  if (statusLabel === "Pending") {
    return "warning";
  }

  return "neutral";
}

function renderOccupancyBar(item: AdminDashboardClassOccupancy) {
  const width = Math.min((item.studentCount / item.capacity) * 100, 100);

  return (
    <div className={styles.occupancyRow}>
      <span className={styles.occupancyLabel}>{item.classLabel}</span>
      <div className={styles.occupancyTrack}>
        <span className={styles.occupancyFill} style={{ width: `${width}%` }} />
      </div>
      <span className={styles.occupancyValue}>{item.studentCount}</span>
    </div>
  );
}

function renderQuickActionIcon(actionId: string) {
  switch (actionId) {
    case "admissions":
      return quickActionIcon("Admissions");
    case "fees":
      return quickActionIcon("Fees");
    case "attendance":
      return quickActionIcon("Attendance");
    case "settings":
      return quickActionIcon("Settings");
    default:
      return quickActionIcon("Students");
  }
}

type AdminDashboardMobileSection =
  | "overview"
  | "attendance"
  | "fees"
  | "actions"
  | "admissions"
  | "notices"
  | "capacity";

const mobileSections: Array<{ value: AdminDashboardMobileSection; label: string }> = [
  { value: "overview", label: "Overview" },
  { value: "attendance", label: "Attendance" },
  { value: "fees", label: "Fees" },
  { value: "actions", label: "Actions" },
  { value: "admissions", label: "Admissions" },
  { value: "notices", label: "Notices" },
  { value: "capacity", label: "Capacity" }
];

export interface AdminDashboardPageProps {
  themeMode?: ThemeMode;
  onThemeToggle?: () => void;
}

export function AdminDashboardPage(props: AdminDashboardPageProps = {}) {
  const navigate = useNavigate();
  const viewModel = buildAdminDashboardViewModel();
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">(() => {
    if (typeof window === "undefined") {
      return "desktop";
    }

    return detectViewport(window.innerWidth);
  });
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [activeMobileSection, setActiveMobileSection] =
    useState<AdminDashboardMobileSection>("overview");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    function handleResize() {
      setViewport(detectViewport(window.innerWidth));
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredAdmissions = useMemo(() => {
    if (normalizedQuery.length === 0) {
      return viewModel.recentAdmissions;
    }

    return viewModel.recentAdmissions.filter((item) =>
      [item.studentName, item.guardianName, item.classLabel, item.statusLabel]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery, viewModel.recentAdmissions]);

  const filteredNotices = useMemo(() => {
    if (normalizedQuery.length === 0) {
      return viewModel.notices;
    }

    return viewModel.notices.filter((item) =>
      [String(item.title), String(item.description ?? ""), String(item.audience ?? "")]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery, viewModel.notices]);

  const availablePendingAction = viewModel.pendingActions.find((item) => item.available);
  const pendingActionCount = viewModel.pendingActions.length;
  const isMobile = viewport === "mobile";

  function renderSearchCluster(placeholder = "Search students, fees, notices") {
    return (
      <div className={styles.searchCluster}>
        <label className={styles.searchField}>
          <span aria-hidden="true" className={styles.searchIcon} />
          <input
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder={placeholder}
            type="search"
            value={query}
          />
        </label>
        <button className={styles.yearBadge} type="button">
          <span>{viewModel.academicYearLabel}</span>
          <span aria-hidden="true" className={styles.chevronDown} />
        </button>
      </div>
    );
  }

  function renderMetricsGrid() {
    return (
      <div className={styles.metricsGrid}>
        {viewModel.metrics.map((metric) => (
          <MetricCard
            className={cx(styles.metricCard, mapMetricTone(metric))}
            elevation="raised"
            icon={mapMetricIcon(metric.id)}
            key={metric.id}
            label={metric.label}
            meta={metric.meta}
            value={metric.value}
          />
        ))}
      </div>
    );
  }

  function renderQuickActions() {
    return (
      <Card
        className={styles.quickActionsCard}
        title="Quick Actions"
      >
        <div className={styles.quickActionsBody}>
          <div className={styles.quickLinksGrid}>
            {viewModel.quickLinks.map((item) => (
              <button
                className={cx(styles.quickActionChip, item.available && styles.quickActionChipPrimary)}
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.route) {
                    navigate(item.route);
                  }
                }}
              >
                <span className={styles.quickActionIconWrap}>{renderQuickActionIcon(item.id)}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <div className={styles.priorityNote}>
            <StatusChip label={`${pendingActionCount} pending`} size="sm" tone="warning" />
            <div className={styles.priorityNoteCopy}>
              <span>Operational queue</span>
              <strong>Attendance, fee follow-up, and settings review remain open.</strong>
            </div>
            {availablePendingAction ? (
              <Button
                label={availablePendingAction.actionLabel}
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (availablePendingAction.route) {
                    navigate(availablePendingAction.route);
                  }
                }}
              />
            ) : null}
          </div>
        </div>
      </Card>
    );
  }

  function renderAdmissionsCard() {
    return (
      <Card
        actions={isMobile ? renderSearchCluster("Search admissions") : undefined}
        className={styles.admissionCard}
        description="New student applications awaiting processing."
        title="Recent Admission Requests"
      >
        {filteredAdmissions.length === 0 ? (
          <p className={styles.emptyState}>No admission requests match the current search.</p>
        ) : (
          <div className={styles.admissionTable}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Submitted</th>
                  <th>Documents</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmissions.map((row: AdminDashboardAdmissionRequest) => (
                  <tr key={row.id}>
                    <td>
                      <div className={styles.studentCell}>
                        <strong>{row.studentName}</strong>
                        <span>Parent: {row.guardianName}</span>
                      </div>
                    </td>
                    <td>{row.classLabel}</td>
                    <td>{row.submittedLabel}</td>
                    <td>{row.documentProgress}</td>
                    <td>
                      <StatusChip
                        label={row.statusLabel}
                        size="sm"
                        tone={mapAdmissionTone(row.statusLabel)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    );
  }

  function renderOccupancyCard() {
    return (
      <Card
        className={styles.occupancyCard}
        description="Current occupancy across active classes."
        title="Class-wise Student Count"
      >
        <div className={styles.occupancyList}>
          {viewModel.classOccupancy.map((item) => (
            <div key={item.id}>{renderOccupancyBar(item)}</div>
          ))}
        </div>
      </Card>
    );
  }

  function renderNoticesCard() {
    return (
      <Card
        actions={isMobile ? renderSearchCluster("Search notices") : undefined}
        className={styles.noticeCard}
        description="Latest updates shared across the school."
        title="Recent Notices"
      >
        {filteredNotices.length === 0 ? (
          <p className={styles.emptyState}>No notices match the current search.</p>
        ) : (
          <div className={styles.noticeRows}>
            {filteredNotices.slice(0, 2).map((item) => (
              <article className={styles.noticeRow} key={item.id}>
                <span
                  aria-hidden="true"
                  className={cx(
                    styles.noticeDot,
                    item.stateTone === "warning" && styles.noticeDotWarning
                  )}
                />
                <div className={styles.noticeCopy}>
                  <strong>{item.title}</strong>
                  <span>
                    {item.publishTiming} · {item.audience}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>
    );
  }

  function renderAttendanceSummaryCard() {
    return (
      <Card
        className={styles.summaryCard}
        description="Daily attendance completion and status."
        title="Attendance Summary"
      >
        <div className={styles.attendanceBody}>
          <CircularProgress
            centerLabel={`${viewModel.attendanceOverview.presentPercentage}%`}
            hint={viewModel.attendanceOverview.hint}
            size="md"
            tone="accent"
            value={viewModel.attendanceOverview.presentPercentage}
            valueLabel={viewModel.attendanceOverview.presentLabel}
          />
          <DataList
            className={styles.summaryList}
            items={viewModel.attendanceOverview.metrics}
            renderItem={(item) => (
              <div className={styles.summaryListRow}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            )}
          />
        </div>
      </Card>
    );
  }

  function renderFeeCollectionCard() {
    return (
      <Card
        className={styles.summaryCard}
        description={viewModel.feeCollectionOverview.changeLabel}
        title="Fee Collection"
      >
        <div className={styles.feeCollectionBody}>
          <div className={styles.collectionHeadline}>
            <span>{viewModel.feeCollectionOverview.subtitle}</span>
            <strong>{viewModel.feeCollectionOverview.collectedToday}</strong>
          </div>
          <div className={styles.collectionBars}>
            {viewModel.feeCollectionOverview.bars.map((bar) => (
              <div className={styles.collectionBarItem} key={bar.id}>
                <div className={styles.collectionBarTrack}>
                  <span
                    className={styles.collectionBarFill}
                    style={{ height: `${bar.value}%` }}
                  />
                </div>
                <span>{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  function renderSummaryPair() {
    return (
      <div className={styles.summaryPair}>
        {renderAttendanceSummaryCard()}
        {renderFeeCollectionCard()}
      </div>
    );
  }

  function renderDesktopWorkspace() {
    return (
      <>
        {renderMetricsGrid()}
        {renderQuickActions()}

        <section className={styles.workspaceGrid}>
          <div className={styles.primaryColumn}>
            {renderAdmissionsCard()}
            {renderOccupancyCard()}
          </div>

          <div className={styles.secondaryColumn}>
            {renderNoticesCard()}
            {renderSummaryPair()}
          </div>
        </section>
      </>
    );
  }

  function renderMobileWorkspace() {
    switch (activeMobileSection) {
      case "attendance":
        return renderAttendanceSummaryCard();
      case "fees":
        return renderFeeCollectionCard();
      case "actions":
        return renderQuickActions();
      case "admissions":
        return renderAdmissionsCard();
      case "notices":
        return renderNoticesCard();
      case "capacity":
        return renderOccupancyCard();
      case "overview":
      default:
        return renderMetricsGrid();
    }
  }

  return (
    <BackOfficeShell
      className={styles.shell}
      mobileNavigationLabel="Open admin menu"
      mobileNavigationOpen={mobileNavigationOpen}
      navigation={buildBackOfficeNavigation(viewModel.navigation, {
        navigateToRoute: navigate,
        onBeforeNavigate: () => {
          setMobileNavigationOpen(false);
        }
      })}
      navigationLabel="Admin navigation"
      onMobileNavigationDismiss={() => {
        setMobileNavigationOpen(false);
      }}
      onMobileNavigationToggle={() => {
        setMobileNavigationOpen((current) => !current);
      }}
      onThemeToggle={props.onThemeToggle}
      themeMode={props.themeMode}
      viewport={viewport}
    >
      <div className={styles.page}>
        <PageHeader
          actions={
            <div className={styles.headerActions}>
              <button aria-label="Notifications" className={styles.iconButton} type="button">
                <span aria-hidden="true" className={styles.notificationGlyph} />
                <span className={styles.notificationBadge}>5</span>
              </button>
              <div aria-label="Signed in as Meera Iyer" className={styles.userAvatar}>
                MI
              </div>
            </div>
          }
          description={`${viewModel.tenant.display.displayName} · Academic Year ${viewModel.academicYearLabel}`}
          search={isMobile ? undefined : renderSearchCluster()}
          title={viewModel.title}
        />

        <section className={styles.workspaceBody}>
          {isMobile ? (
            <>
              <Tabs
                activeValue={activeMobileSection}
                aria-label="Dashboard mobile sections"
                className={styles.mobileSectionTabs}
                items={mobileSections}
                size="sm"
                onValueChange={(value) => {
                  setActiveMobileSection(value as AdminDashboardMobileSection);
                }}
              />
              {renderMobileWorkspace()}
            </>
          ) : (
            renderDesktopWorkspace()
          )}
        </section>
      </div>
    </BackOfficeShell>
  );
}
