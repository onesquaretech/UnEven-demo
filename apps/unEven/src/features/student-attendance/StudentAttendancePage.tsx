import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  BackOfficeShell,
  Button,
  Card,
  CircularProgress,
  DataTable,
  Field,
  FilterBar,
  PageHeader,
  SegmentedControl,
  StatusChip
} from "../../ui";
import type {
  DataTableColumn,
  ProgressBarTone,
  ThemeMode
} from "../../ui";
import { buildBackOfficeNavigation } from "../../app/navigation";
import { buildStudentAttendanceViewModel } from "./buildStudentAttendanceViewModel";
import type {
  StudentAttendanceFollowUp,
  StudentAttendanceRow,
  StudentAttendanceRowStatus
} from "./studentAttendance.types";
import styles from "./StudentAttendancePage.module.css";

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

function updateTextValue(setter: (value: string) => void) {
  return (event: ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
  };
}

function updateSelectValue(setter: (value: string) => void) {
  return (event: ChangeEvent<HTMLSelectElement>) => {
    setter(event.target.value);
  };
}

function createIcon(token: "save" | "calendar" | "chevronRight"): ReactNode {
  return <span aria-hidden="true" className={cx(styles.iconGlyph, styles[`iconGlyph${token}`])} />;
}

function mapBulkVariant(tone: ProgressBarTone | "neutral") {
  if (tone === "accent") {
    return "primary";
  }

  return "secondary";
}

function renderStudentCell(row: StudentAttendanceRow) {
  return (
    <div className={styles.studentCell}>
      <span className={cx(styles.avatarBadge, styles[`avatarBadge${row.accent}`])}>{row.initials}</span>
      <div className={styles.studentCopy}>
        <strong>{row.studentName}</strong>
        <span>{row.studentMeta}</span>
      </div>
    </div>
  );
}

function renderFollowUpCard(item: StudentAttendanceFollowUp) {
  return (
    <Card
      className={cx(
        styles.followUpCard,
        item.tone === "danger" && styles.followUpDanger,
        item.tone === "warning" && styles.followUpWarning
      )}
      elevation="subtle"
      key={item.id}
      padding="md"
    >
      <div className={styles.followUpBody}>
        <div className={styles.followUpHeader}>
          <span className={cx(styles.followUpDot, item.tone === "warning" && styles.followUpDotWarning)} />
          <strong>{item.title}</strong>
        </div>
        <span>{item.detail}</span>
        <span>{item.note}</span>
      </div>
    </Card>
  );
}

export interface StudentAttendancePageProps {
  themeMode?: ThemeMode;
  onThemeToggle?: () => void;
}

export function StudentAttendancePage(props: StudentAttendancePageProps = {}) {
  const navigate = useNavigate();
  const viewModel = buildStudentAttendanceViewModel();
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">(() => {
    if (typeof window === "undefined") {
      return "desktop";
    }

    return detectViewport(window.innerWidth);
  });
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [classValue, setClassValue] = useState(viewModel.classValue);
  const [sectionValue, setSectionValue] = useState(viewModel.sectionValue);
  const [dateValue, setDateValue] = useState(viewModel.dateValue);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [markMode, setMarkMode] = useState<"present" | "absent">(viewModel.markModeOptions[0]?.value as "present" | "absent");
  const [rows, setRows] = useState(viewModel.rows);
  const [page, setPage] = useState(1);
  const [lastSavedAt, setLastSavedAt] = useState("8:41 AM");

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

  const filteredRows = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return rows.filter((row) => {
      if (normalizedQuery.length > 0) {
        const haystack = [row.rollNumber, row.studentName, row.studentMeta].join(" ").toLowerCase();

        if (!haystack.includes(normalizedQuery)) {
          return false;
        }
      }

      if (statusFilter !== "all" && row.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [rows, searchQuery, statusFilter]);

  const summaryCounts = useMemo(() => {
    return rows.reduce(
      (accumulator, row) => {
        if (row.status === "present") {
          accumulator.present += 1;
        } else if (row.status === "absent") {
          accumulator.absent += 1;
        } else {
          accumulator.leave += 1;
        }

        if (row.flagCount > 0) {
          accumulator.flagged += row.flagCount;
        }

        return accumulator;
      },
      { present: 0, absent: 0, leave: 0, flagged: 0 }
    );
  }, [rows]);

  const presentPercentage = rows.length > 0 ? Math.round((summaryCounts.present / rows.length) * 100) : 0;
  const pendingChanges = rows.filter((row) => row.status !== "present").length;

  function updateRowStatus(rowId: string, status: string) {
    setRows((current) =>
      current.map((row) => (row.id === rowId ? { ...row, status: status as StudentAttendanceRowStatus } : row))
    );
  }

  function applyBulkStatus(status: StudentAttendanceRowStatus) {
    setRows((current) => current.map((row) => ({ ...row, status })));
  }

  function handleSaveAttendance() {
    const now = new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(new Date());

    setLastSavedAt(now);
  }

  const columns: Array<DataTableColumn<StudentAttendanceRow>> = [
    {
      key: "roll",
      header: "Roll No.",
      width: "5.5rem",
      renderCell: (row) => <span className={styles.rollText}>{row.rollNumber}</span>
    },
    {
      key: "student",
      header: "Student Name",
      width: "19rem",
      renderCell: (row) => renderStudentCell(row)
    },
    {
      key: "status",
      header: "Status",
      width: "19rem",
      renderCell: (row) => (
        <SegmentedControl
          activeValue={row.status}
          className={styles.rowStatusControl}
          items={[
            { value: "present", label: "Present" },
            { value: "absent", label: "Absent" },
            { value: "leave", label: "Leave" }
          ]}
          onValueChange={(value) => {
            updateRowStatus(row.id, value);
          }}
          size="sm"
        />
      )
    },
    {
      key: "flag",
      header: "Flag",
      width: "6rem",
      align: "center",
      renderCell: (row) =>
        row.flagCount > 0 ? (
          <StatusChip label={String(row.flagCount)} size="sm" tone="danger" />
        ) : (
          <span className={styles.flagDot} />
        )
    }
  ];

  return (
    <BackOfficeShell
      className={styles.shell}
      mobileNavigationLabel="Open attendance menu"
      mobileNavigationOpen={mobileNavigationOpen}
      navigation={buildBackOfficeNavigation(viewModel.navigation, {
        navigateToRoute: navigate,
        onBeforeNavigate: () => {
          setMobileNavigationOpen(false);
        }
      })}
      navigationLabel="Attendance navigation"
      onMobileNavigationDismiss={() => {
        setMobileNavigationOpen(false);
      }}
      onMobileNavigationToggle={() => {
        setMobileNavigationOpen((current) => !current);
      }}
      onThemeToggle={props.onThemeToggle}
      themeMode={props.themeMode}
      userInitials="RM"
      userName={viewModel.classTeacherName}
      userRole={viewModel.classTeacherRole}
      viewport={viewport}
    >
      <div className={styles.page}>
        <PageHeader
          actions={
            <div className={styles.headerActions}>
              <Button
                iconLeft={createIcon("calendar")}
                label={viewModel.actionLabels.monthlyView}
                size="lg"
                variant="secondary"
              />
              <Button
                iconLeft={createIcon("save")}
                label={viewModel.actionLabels.saveAttendance}
                onClick={handleSaveAttendance}
                size="lg"
              />
            </div>
          }
          description={viewModel.description}
          title={viewModel.title}
        />

        <Card className={styles.workspaceBody} elevation="subtle" padding="lg">
          <Card className={styles.filterCard} elevation="raised" padding="md">
            <FilterBar
              actionPlacement="inline"
              className={styles.filterBar}
              actions={
                <div className={styles.filterActions}>
                  {viewModel.markModeOptions.map((option) => (
                    <Button
                      className={styles.filterModeButton}
                      key={option.value}
                      label={option.label}
                      onClick={() => {
                        setMarkMode(option.value as "present" | "absent");
                      }}
                      size="sm"
                      variant={markMode === option.value ? "primary" : "secondary"}
                    />
                  ))}
                </div>
              }
            >
              <div className={styles.filterField}>
                <Field
                  label="Class"
                  options={viewModel.classOptions}
                  selectProps={{ onChange: updateSelectValue(setClassValue) }}
                  type="select"
                  value={classValue}
                />
              </div>
              <div className={styles.filterField}>
                <Field
                  label="Section"
                  options={viewModel.sectionOptions}
                  selectProps={{ onChange: updateSelectValue(setSectionValue) }}
                  type="select"
                  value={sectionValue}
                />
              </div>
              <div className={styles.dateField}>
                <Field
                  label="Date"
                  options={viewModel.dateOptions}
                  selectProps={{ onChange: updateSelectValue(setDateValue) }}
                  type="select"
                  value={dateValue}
                />
              </div>
              <div className={styles.searchField}>
                <Field
                  inputProps={{ onChange: updateTextValue(setSearchQuery) }}
                  label="Search"
                  placeholder={viewModel.searchPlaceholder}
                  type="text"
                  value={searchQuery}
                />
              </div>
              <div className={styles.statusField}>
                <Field
                  label="Status"
                  options={viewModel.statusFilterOptions}
                  selectProps={{ onChange: updateSelectValue(setStatusFilter) }}
                  type="select"
                  value={statusFilter}
                />
              </div>
            </FilterBar>

            <div className={styles.summaryStrip}>
              <div className={styles.summaryTrack}>
                <span className={styles.summaryPresent} style={{ width: `${(summaryCounts.present / rows.length) * 100}%` }} />
                <span className={styles.summaryLeave} style={{ width: `${(summaryCounts.leave / rows.length) * 100}%` }} />
                <span className={styles.summaryAbsent} style={{ width: `${(summaryCounts.absent / rows.length) * 100}%` }} />
              </div>
              <div className={styles.summaryMeta}>
                <span className={styles.summaryLabel}>
                  Class strength {viewModel.summary.classStrength} · Present {summaryCounts.present} · Leave {summaryCounts.leave} · Absent {summaryCounts.absent}
                </span>
                <StatusChip label={viewModel.summary.absentNotificationLabel} size="sm" tone="danger" />
              </div>
            </div>
          </Card>

          <Card className={styles.bulkCard} elevation="subtle" padding="md">
            <div className={styles.bulkBar}>
              <strong className={styles.bulkLabel}>Bulk mark</strong>
              <div className={styles.bulkActions}>
                {viewModel.bulkActions.map((action) => (
                  <Button
                    key={action.id}
                    label={action.label}
                    onClick={() => {
                      applyBulkStatus(action.id);
                    }}
                    size="md"
                    variant={mapBulkVariant(action.tone)}
                  />
                ))}
              </div>
              <span className={styles.lastSaved}>Last saved {lastSavedAt}</span>
            </div>
          </Card>

          <div className={styles.contentGrid}>
            <div className={styles.tableColumn}>
              <Card
                className={styles.tableCard}
                description={viewModel.register.description}
                elevation="raised"
                padding="md"
                title={viewModel.register.title}
              >
                <DataTable
                  className={styles.dataTable}
                  columns={columns}
                  emptyState="No students match the current attendance filters."
                  pagination={{
                    onPageChange: setPage,
                    page,
                    summary: viewModel.register.paginationSummary,
                    totalPages: 2
                  }}
                  rowKey="id"
                  rows={filteredRows}
                />
              </Card>
            </div>

            <div className={styles.sideColumn}>
              <Card
                className={styles.sidePanelCard}
                description="Today's class snapshot and follow-up flags"
                elevation="raised"
                padding="md"
                title="Attendance Summary"
              >
                <div className={styles.summaryPanelTop}>
                  <CircularProgress
                    centerLabel={`${presentPercentage}%`}
                    className={styles.summaryMeter}
                    size="md"
                    tone="accent"
                    value={presentPercentage}
                    valueLabel=""
                  />
                  <div className={styles.summaryStats}>
                    {viewModel.summary.metrics.map((metric) => (
                      <div className={styles.summaryStat} key={metric.id}>
                        <span>{metric.label}</span>
                        <strong>
                          {metric.id === "present"
                            ? summaryCounts.present
                            : metric.id === "absent"
                            ? summaryCounts.absent
                            : summaryCounts.leave}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.sideDivider} />

                <section className={styles.followUpSection}>
                  <h3>Follow-up</h3>
                  <div className={styles.followUpStack}>{viewModel.summary.followUps.map(renderFollowUpCard)}</div>
                </section>

                <div className={styles.sideDivider} />

                <section className={styles.quickLinksSection}>
                  <h3>Quick Links</h3>
                  <div className={styles.quickLinksStack}>
                    {viewModel.summary.quickLinks.map((link) => (
                      <Button
                        className={styles.quickLinkButton}
                        iconRight={createIcon("chevronRight")}
                        key={link.id}
                        label={link.label}
                        size="md"
                        variant="secondary"
                      />
                    ))}
                  </div>
                </section>

                <Card className={styles.pendingCard} elevation="subtle" padding="md">
                  <div className={styles.pendingCardBody}>
                    <span className={styles.pendingLabel}>{viewModel.summary.pendingChangesLabel}</span>
                    <strong className={styles.pendingValue}>{pendingChanges} rows updated</strong>
                    <span className={styles.pendingNote}>{viewModel.summary.pendingChangesNote}</span>
                    <Button
                      label={viewModel.actionLabels.saveAttendance}
                      onClick={handleSaveAttendance}
                      size="md"
                    />
                  </div>
                </Card>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </BackOfficeShell>
  );
}
