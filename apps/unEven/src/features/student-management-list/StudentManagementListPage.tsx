import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode
} from "react";
import { useNavigate } from "react-router-dom";
import {
  ActivityFeed,
  BackOfficeShell,
  Button,
  Card,
  DataTable,
  Field,
  FilterBar,
  PageHeader,
  StatusChip
} from "../../ui";
import type { DataTableColumn, ThemeMode } from "../../ui";
import { buildBackOfficeNavigation } from "../../app/navigation";
import { buildStudentManagementListViewModel } from "./buildStudentManagementListViewModel";
import type { StudentManagementListRow, StudentManagementListSummaryMetric } from "./studentManagementList.types";
import styles from "./StudentManagementListPage.module.css";

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

function createButtonIcon(token: "plus" | "chevronDown" | "edit" | "close"): ReactNode {
  return <span aria-hidden="true" className={cx(styles.iconGlyph, styles[`iconGlyph${token}`])} />;
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

function renderSummaryMetric(metric: StudentManagementListSummaryMetric) {
  return (
    <Card className={styles.summaryMetricCard} elevation="subtle" key={metric.id} padding="md">
      <div className={styles.summaryMetricContent}>
        <span className={styles.summaryMetricLabel}>{metric.label}</span>
        <strong className={styles.summaryMetricValue}>{metric.value}</strong>
      </div>
      <StatusChip label={metric.deltaLabel} size="sm" tone={metric.deltaTone} />
    </Card>
  );
}

function renderStudentCell(row: StudentManagementListRow) {
  return (
    <div className={styles.studentCell}>
      <span className={cx(styles.avatarBadge, styles[`avatarBadge${row.accent}`])}>{row.initials}</span>
      <div className={styles.studentCopy}>
        <strong>{row.studentName}</strong>
        <span>{row.emailAddress}</span>
      </div>
    </div>
  );
}

function renderActionButton(
  row: StudentManagementListRow,
  onNavigate: (route: "/students/profile") => void
) {
  return (
    <Button
      aria-label={`Edit ${row.studentName}`}
      className={styles.rowActionButton}
      iconLeft={createButtonIcon("edit")}
      label=""
      onClick={() => {
        onNavigate("/students/profile");
      }}
      size="sm"
      variant="ghost"
    />
  );
}

export interface StudentManagementListPageProps {
  themeMode?: ThemeMode;
  onThemeToggle?: () => void;
}

export function StudentManagementListPage(props: StudentManagementListPageProps = {}) {
  const navigate = useNavigate();
  const viewModel = buildStudentManagementListViewModel();
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">(() => {
    if (typeof window === "undefined") {
      return "desktop";
    }

    return detectViewport(window.innerWidth);
  });
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("5");
  const [sectionFilter, setSectionFilter] = useState("A");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [yearFilter, setYearFilter] = useState("");
  const [page, setPage] = useState(viewModel.pagination.page);

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

    return viewModel.rows.filter((row) => {
      if (normalizedQuery.length > 0) {
        const haystack = [
          row.studentName,
          row.emailAddress,
          row.admissionNumber,
          row.parentName
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(normalizedQuery)) {
          return false;
        }
      }

      if (classFilter && row.classLabel !== classFilter) {
        return false;
      }

      if (sectionFilter && row.sectionLabel !== sectionFilter) {
        return false;
      }

      if (statusFilter && row.statusLabel !== statusFilter) {
        return false;
      }

      if (yearFilter && !row.admissionNumber.includes(`ST-${yearFilter.slice(-2)}-`)) {
        return false;
      }

      return true;
    });
  }, [classFilter, searchQuery, sectionFilter, statusFilter, viewModel.rows, yearFilter]);

  const columns: Array<DataTableColumn<StudentManagementListRow>> = [
    {
      key: "student",
      header: "Student Name",
      width: "18rem",
      renderCell: (row) => renderStudentCell(row)
    },
    {
      key: "admission",
      header: "Admission No.",
      width: "10rem",
      renderCell: (row) => <span className={styles.tableText}>{row.admissionNumber}</span>
    },
    {
      key: "class",
      header: "Class",
      width: "5rem",
      renderCell: (row) => <span className={styles.tableText}>{row.classLabel}</span>
    },
    {
      key: "section",
      header: "Section",
      width: "6rem",
      renderCell: (row) => <span className={styles.tableText}>{row.sectionLabel}</span>
    },
    {
      key: "parent",
      header: "Parent Name",
      width: "13rem",
      renderCell: (row) => <span className={styles.tableText}>{row.parentName}</span>
    },
    {
      key: "fee-status",
      header: "Fee Status",
      width: "8rem",
      renderCell: (row) => <StatusChip label={row.feeStatusLabel} size="sm" tone={row.feeStatusTone} />
    },
    {
      key: "status",
      header: "Status",
      width: "9rem",
      renderCell: (row) => <StatusChip label={row.statusLabel} size="sm" tone={row.statusTone} />
    }
  ];

  return (
    <BackOfficeShell
      className={styles.shell}
      mobileNavigationLabel="Open students menu"
      mobileNavigationOpen={mobileNavigationOpen}
      navigation={buildBackOfficeNavigation(viewModel.navigation, {
        navigateToRoute: navigate,
        onBeforeNavigate: () => {
          setMobileNavigationOpen(false);
        }
      })}
      navigationLabel="Student navigation"
      onMobileNavigationDismiss={() => {
        setMobileNavigationOpen(false);
      }}
      onMobileNavigationToggle={() => {
        setMobileNavigationOpen((current) => !current);
      }}
      onThemeToggle={props.onThemeToggle}
      themeMode={props.themeMode}
      userInitials="NS"
      userName="Nisha Sethi"
      userRole="School Admin"
      viewport={viewport}
    >
      <div className={styles.page}>
        <PageHeader
          actions={
            <div className={styles.headerActions}>
              <Button
                iconRight={createButtonIcon("chevronDown")}
                label={viewModel.bulkActionLabel}
                variant="secondary"
              />
              <Button iconLeft={createButtonIcon("plus")} label={viewModel.primaryActionLabel} />
            </div>
          }
          description={viewModel.description}
          title={viewModel.title}
        />

        <section className={styles.workspaceBody}>
          <Card className={styles.filterCard} padding="lg">
            <FilterBar
              actionPlacement="stacked"
              actions={
                <Button
                  className={styles.clearFiltersButton}
                  label="Reset"
                  onClick={() => {
                    setSearchQuery("");
                    setClassFilter("5");
                    setSectionFilter("A");
                    setStatusFilter("Active");
                    setYearFilter("");
                  }}
                  size="sm"
                  variant="ghost"
                />
              }
              className={styles.filterBar}
            >
              <div className={styles.filterFieldWide}>
                <Field
                  label="Search"
                  placeholder={viewModel.searchPlaceholder}
                  value={searchQuery}
                  inputProps={{
                    onChange: updateTextValue(setSearchQuery)
                  }}
                />
              </div>
              <div className={styles.filterField}>
                <Field
                  label="Class"
                  options={viewModel.classOptions}
                  type="select"
                  value={classFilter}
                  selectProps={{
                    onChange: updateSelectValue(setClassFilter)
                  }}
                />
              </div>
              <div className={styles.filterField}>
                <Field
                  label="Section"
                  options={viewModel.sectionOptions}
                  type="select"
                  value={sectionFilter}
                  selectProps={{
                    onChange: updateSelectValue(setSectionFilter)
                  }}
                />
              </div>
              <div className={styles.filterField}>
                <Field
                  label="Status"
                  options={viewModel.statusOptions}
                  type="select"
                  value={statusFilter}
                  selectProps={{
                    onChange: updateSelectValue(setStatusFilter)
                  }}
                />
              </div>
              <div className={styles.filterField}>
                <Field
                  label="Admission Year"
                  options={viewModel.yearOptions}
                  type="select"
                  value={yearFilter}
                  selectProps={{
                    onChange: updateSelectValue(setYearFilter)
                  }}
                />
              </div>
            </FilterBar>

            <div className={styles.filterFooter}>
              <div className={styles.filterChips}>
                {viewModel.appliedFilterLabels.map((label, index) => (
                  <StatusChip
                    key={label}
                    label={label}
                    size="sm"
                    tone={index < 2 ? "info" : "neutral"}
                  />
                ))}
              </div>
              <span className={styles.filterSummary}>{viewModel.summaryLabel}</span>
            </div>
          </Card>

          <Card className={styles.bulkCard} elevation="subtle" padding="md">
            <div className={styles.bulkCardContent}>
              <div className={styles.bulkLead}>
                <span aria-hidden="true" className={styles.bulkLeadIcon}>
                  <span className={styles.bulkLeadCheck} />
                </span>
                <strong>{viewModel.selectedSummaryLabel}</strong>
              </div>
              <div className={styles.bulkActions}>
                {viewModel.bulkActions.map((action) => (
                  <Button key={action.id} label={action.label} size="sm" variant="secondary" />
                ))}
              </div>
              <Button className={styles.clearSelectionButton} label="Clear selection" size="sm" variant="ghost" />
            </div>
          </Card>

          <div className={styles.contentGrid}>
            <div className={styles.tableColumn}>
              <Card className={styles.tableShellCard} padding="none">
                <div className={styles.tableHeading}>
                  <div>
                    <h2>{viewModel.tableTitle}</h2>
                    <p>{viewModel.tableDescription}</p>
                  </div>
                </div>
                <DataTable
                  className={styles.tableCard}
                  columns={columns}
                  emptyState={<p className={styles.emptyState}>No students match the current filters.</p>}
                  pagination={{
                    page,
                    totalPages: viewModel.pagination.totalPages,
                    summary: viewModel.pagination.summary,
                    onPageChange: setPage
                  }}
                  rowActions={(row) => renderActionButton(row, navigate)}
                  rowKey="id"
                  rows={filteredRows}
                  selectable
                  stickyHeader
                />
              </Card>
            </div>

            <Card className={styles.summaryCard} padding="lg" title="Record Summary" description="Operational view for quick admin decisions">
              <div className={styles.summaryStack}>
                {viewModel.summaryMetrics.map((metric) => renderSummaryMetric(metric))}
                <section className={styles.notesSection}>
                  <h3>Recent Admin Notes</h3>
                  <ActivityFeed
                    compact
                    items={viewModel.notes.map((note) => ({
                      id: note.id,
                      title: note.title,
                      description: note.description,
                      timestamp: note.timestamp,
                      leading: (
                        <span
                          className={cx(
                            styles.noteDot,
                            note.tone === "warning" && styles.noteDotWarning
                          )}
                        />
                      )
                    }))}
                  />
                </section>
              </div>
            </Card>
          </div>
        </section>
      </div>

    </BackOfficeShell>
  );
}
