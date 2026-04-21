import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  BackOfficeShell,
  Button,
  Card,
  Checkbox,
  DataTable,
  Field,
  FilterBar,
  PageHeader,
  ProgressBar,
  StatusChip,
  Tabs
} from "../../ui";
import type { DataTableColumn, ThemeMode } from "../../ui";
import { buildBackOfficeNavigation } from "../../app/navigation";
import { buildClassSectionAllocationViewModel } from "./buildClassSectionAllocationViewModel";
import type {
  ClassSectionAllocationRow,
  ClassSectionSeatCard
} from "./classSectionAllocation.types";
import styles from "./ClassSectionAllocationPage.module.css";

type ClassSectionAllocationMobileSection = "queue" | "capacity" | "pending" | "actions";

const mobileSections = [
  { value: "queue", label: "Queue" },
  { value: "capacity", label: "Capacity" },
  { value: "pending", label: "Pending" },
  { value: "actions", label: "Actions" }
];

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

function createIcon(token: "save" | "chevronDown" | "plus" | "menu"): ReactNode {
  return <span aria-hidden="true" className={cx(styles.iconGlyph, styles[`iconGlyph${token}`])} />;
}

function renderStudentCell(row: ClassSectionAllocationRow) {
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

function renderSeatCard(card: ClassSectionSeatCard) {
  return (
    <Card className={styles.seatCard} elevation="subtle" key={card.id} padding="md">
      <div className={styles.seatCardHeader}>
        <strong>{card.label}</strong>
        <span>{card.occupiedLabel}</span>
      </div>
      <ProgressBar
        className={styles.seatProgress}
        max={card.capacityValue}
        size="sm"
        tone={card.tone}
        value={card.occupiedValue}
        valueLabel={card.seatsLeftLabel}
      />
    </Card>
  );
}

export interface ClassSectionAllocationPageProps {
  themeMode?: ThemeMode;
  onThemeToggle?: () => void;
}

export function ClassSectionAllocationPage(props: ClassSectionAllocationPageProps = {}) {
  const navigate = useNavigate();
  const viewModel = buildClassSectionAllocationViewModel();
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">(() => {
    if (typeof window === "undefined") {
      return "desktop";
    }

    return detectViewport(window.innerWidth);
  });
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [activeMobileSection, setActiveMobileSection] =
    useState<ClassSectionAllocationMobileSection>("queue");
  const [searchQuery, setSearchQuery] = useState("");
  const [academicYear, setAcademicYear] = useState(viewModel.academicYearOptions[0]?.value ?? "");
  const [classValue, setClassValue] = useState(viewModel.classOptions[0]?.value ?? "");
  const [sectionValue, setSectionValue] = useState(viewModel.sectionOptions[0]?.value ?? "");
  const [queueFilter, setQueueFilter] = useState(viewModel.queueFilterOptions[0]?.value ?? "");
  const [bulkTarget, setBulkTarget] = useState(viewModel.bulkTargetOptions[0]?.value ?? "");
  const [helperFilter, setHelperFilter] = useState(viewModel.helperFilterOptions[0]?.value ?? "");
  const [rowState, setRowState] = useState(viewModel.rows);
  const [page, setPage] = useState(1);

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

    return rowState.filter((row) => {
      if (normalizedQuery.length > 0) {
        const haystack = [row.studentName, row.admissionNumber].join(" ").toLowerCase();

        if (!haystack.includes(normalizedQuery)) {
          return false;
        }
      }

      if (queueFilter === "unassigned" && row.currentPlacement !== "Unassigned") {
        return false;
      }

      return true;
    });
  }, [queueFilter, rowState, searchQuery]);

  const selectedRows = filteredRows.filter((row) => row.selected);
  const allRowsSelected = filteredRows.length > 0 && selectedRows.length === filteredRows.length;
  const isMobile = viewport === "mobile";

  function updateRowSelection(rowId: string, checked: boolean) {
    setRowState((current) =>
      current.map((row) => (row.id === rowId ? { ...row, selected: checked } : row))
    );
  }

  function toggleAllRows(checked: boolean) {
    const visibleRowIds = new Set(filteredRows.map((row) => row.id));

    setRowState((current) =>
      current.map((row) => (visibleRowIds.has(row.id) ? { ...row, selected: checked } : row))
    );
  }

  function updateTargetPlacement(rowId: string) {
    const options = viewModel.sectionOptions.map((option) => option.value);

    setRowState((current) =>
      current.map((row) => {
        if (row.id !== rowId) {
          return row;
        }

        const currentIndex = options.indexOf(row.targetPlacement);
        const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % options.length : 0;

        return {
          ...row,
          targetPlacement: options[nextIndex] ?? row.targetPlacement
        };
      })
    );
  }

  function applyBulkAssign() {
    if (selectedRows.length === 0) {
      return;
    }

    const selectedIds = new Set(selectedRows.map((row) => row.id));

    setRowState((current) =>
      current.map((row) =>
        selectedIds.has(row.id)
          ? {
              ...row,
              targetPlacement: bulkTarget
            }
          : row
      )
    );
  }

  const columns: Array<DataTableColumn<ClassSectionAllocationRow>> = [
    {
      key: "select",
      header: (
        <Checkbox
          checked={allRowsSelected}
          id="allocation-select-all"
          label=""
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            toggleAllRows(event.target.checked);
          }}
        />
      ),
      width: "4rem",
      renderCell: (row) => (
        <Checkbox
          checked={row.selected}
          id={`allocation-row-${row.id}`}
          label=""
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateRowSelection(row.id, event.target.checked);
          }}
        />
      )
    },
    {
      key: "student",
      header: "Student",
      width: "16rem",
      renderCell: (row) => renderStudentCell(row)
    },
    {
      key: "admission",
      header: "Adm. No.",
      width: "8rem",
      renderCell: (row) => <span className={styles.tableText}>{row.admissionNumber}</span>
    },
    {
      key: "current",
      header: "Current",
      width: "8rem",
      renderCell: (row) => <span className={styles.tableText}>{row.currentPlacement}</span>
    },
    {
      key: "target",
      header: "Target",
      width: "10rem",
      renderCell: (row) => (
        <Button
          className={styles.targetButton}
          iconRight={createIcon("chevronDown")}
          label={row.targetPlacement}
          onClick={() => {
            updateTargetPlacement(row.id);
          }}
          size="sm"
          variant="secondary"
        />
      )
    },
    {
      key: "status",
      header: "Status",
      width: "8rem",
      renderCell: (row) => <StatusChip label={row.statusLabel} size="sm" tone={row.statusTone} />
    }
  ];

  function renderFilterCard() {
    return (
      <Card className={styles.filterCard} elevation="raised" padding="md">
        <FilterBar
          actionPlacement="inline"
          className={styles.filterBar}
          overflowActions={
            <Button
              aria-label="More filter actions"
              className={styles.menuButton}
              iconLeft={createIcon("menu")}
              label=""
              size="sm"
              variant="secondary"
            />
          }
        >
          <div className={styles.filterField}>
            <Field
              label="Academic Year"
              options={viewModel.academicYearOptions}
              selectProps={{ onChange: updateSelectValue(setAcademicYear) }}
              type="select"
              value={academicYear}
            />
          </div>
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
          <div className={styles.searchField}>
            <Field
              inputProps={{ onChange: updateTextValue(setSearchQuery) }}
              label="Search"
              placeholder={viewModel.searchPlaceholder}
              type="text"
              value={searchQuery}
            />
          </div>
          <div className={styles.queueField}>
            <Field
              label="Queue Filter"
              options={viewModel.queueFilterOptions}
              selectProps={{ onChange: updateSelectValue(setQueueFilter) }}
              type="select"
              value={queueFilter}
            />
          </div>
        </FilterBar>

        <div className={styles.filterFooter}>
          <div className={styles.filterChips}>
            {viewModel.appliedFilters.map((filter) => (
              <StatusChip key={filter.id} label={filter.label} size="sm" tone={filter.tone} />
            ))}
          </div>
          <span className={styles.filterSummary}>{viewModel.listedCountLabel}</span>
        </div>
      </Card>
    );
  }

  function renderBulkCard() {
    return (
      <Card className={styles.bulkCard} elevation="subtle" padding="md">
        <div className={styles.bulkCardBody}>
          <div className={styles.bulkLead}>
            <span className={styles.bulkLeadMark}>
              <span className={styles.bulkLeadCheck} />
            </span>
            <strong>
              {selectedRows.length > 0
                ? `${selectedRows.length} students selected`
                : viewModel.bulkSummaryLabel}
            </strong>
          </div>

          <div className={styles.bulkActions}>
            <div className={styles.bulkTargetField}>
              <Field
                label="Bulk Target"
                options={viewModel.bulkTargetOptions}
                selectProps={{ onChange: updateSelectValue(setBulkTarget) }}
                type="select"
                value={bulkTarget}
              />
            </div>
            <Button
              label={viewModel.bulkAssignLabel}
              onClick={applyBulkAssign}
              size="md"
            />
          </div>

          <Button
            className={styles.clearSelectionButton}
            label={viewModel.clearSelectionLabel}
            onClick={() => {
              toggleAllRows(false);
            }}
            size="sm"
            variant="ghost"
          />
        </div>
      </Card>
    );
  }

  function renderAvailabilityCard() {
    return (
      <Card className={styles.availabilityCard} elevation="subtle" padding="md">
        <span className={styles.availabilityLabel}>Available Seats · Grade 5</span>
        <strong className={styles.availabilityValue}>{viewModel.seatAvailabilityLabel}</strong>
      </Card>
    );
  }

  function renderUtilityRow() {
    return (
      <div className={styles.utilityRow}>
        {renderBulkCard()}
        {renderAvailabilityCard()}
      </div>
    );
  }

  function renderTableCard() {
    return (
      <Card
        className={styles.tableShellCard}
        description={viewModel.tableDescription}
        elevation="raised"
        padding="md"
        title={viewModel.tableTitle}
      >
        <DataTable
          className={styles.dataTable}
          columns={columns}
          emptyState="No students match the current allocation filters."
          pagination={{
            onPageChange: setPage,
            page,
            summary: viewModel.paginationSummary,
            totalPages: 2
          }}
          rowActions={(row) => (
            <Button
              aria-label={`Open allocation actions for ${row.studentName}`}
              className={styles.rowActionButton}
              iconLeft={createIcon("plus")}
              label=""
              onClick={() => {
                updateTargetPlacement(row.id);
              }}
              size="sm"
              variant="ghost"
            />
          )}
          rowKey="id"
          rows={filteredRows}
        />
      </Card>
    );
  }

  function renderPendingSection() {
    return (
      <div className={styles.pendingSection}>
        <h3>Pending Changes</h3>
        <Card className={styles.pendingCard} elevation="subtle" padding="md">
          <div className={styles.pendingGrid}>
            <div className={styles.pendingMetric}>
              <span>{viewModel.pendingSummary.selectedStudentsLabel}</span>
              <strong>{selectedRows.length || viewModel.pendingSummary.selectedStudentsValue}</strong>
            </div>
            <div className={styles.pendingMetric}>
              <span>{viewModel.pendingSummary.targetSectionLabel}</span>
              <strong>{bulkTarget}</strong>
            </div>
          </div>
          <p>{viewModel.pendingSummary.note}</p>
        </Card>
      </div>
    );
  }

  function renderHelperSection() {
    return (
      <div className={styles.helperSection}>
        <h3>Filter Options</h3>
        <div className={styles.helperFields}>
          <Field
            label="Helper Filter"
            options={viewModel.helperFilterOptions}
            selectProps={{ onChange: updateSelectValue(setHelperFilter) }}
            type="select"
            value={helperFilter}
          />
          <Field
            label="Queue Scope"
            options={viewModel.queueFilterOptions}
            type="select"
            value={queueFilter}
          />
        </div>
      </div>
    );
  }

  function renderNoteCard() {
    return (
      <Card className={styles.noteCard} elevation="subtle" padding="md">
        <span className={styles.noteLabel}>{viewModel.operationalNoteTitle}</span>
        <strong>5-C is near capacity.</strong>
        <p>Route most new Grade 5 admissions to 5-A or 5-B unless a specific section is required.</p>
      </Card>
    );
  }

  function renderCapacityPanel() {
    return (
      <Card
        className={styles.sidePanelCard}
        description="Live capacity and assignment guidance"
        elevation="raised"
        padding="md"
        title="Seat Allocation"
      >
        <div className={styles.seatCardStack}>{viewModel.seatCards.map(renderSeatCard)}</div>

        <div className={styles.sideDivider} />

        {renderPendingSection()}

        {renderHelperSection()}

        {renderNoteCard()}

        <Button label={viewModel.saveActionLabel} size="lg" />
      </Card>
    );
  }

  function renderDesktopWorkspace() {
    return (
      <>
        {renderFilterCard()}
        {renderUtilityRow()}

        <div className={styles.contentGrid}>
          <div className={styles.tableColumn}>{renderTableCard()}</div>

          <div className={styles.sideColumn}>{renderCapacityPanel()}</div>
        </div>
      </>
    );
  }

  function renderMobileWorkspace() {
    if (activeMobileSection === "capacity") {
      return (
        <>
          {renderAvailabilityCard()}
          <Card
            className={styles.sidePanelCard}
            description="Live capacity and seat progress"
            elevation="raised"
            padding="md"
            title="Seat Allocation"
          >
            <div className={styles.seatCardStack}>{viewModel.seatCards.map(renderSeatCard)}</div>
          </Card>
        </>
      );
    }

    if (activeMobileSection === "pending") {
      return (
        <>
          {renderPendingSection()}
          {renderHelperSection()}
        </>
      );
    }

    if (activeMobileSection === "actions") {
      return (
        <div className={styles.mobileActionStack}>
          {renderBulkCard()}
          {renderNoteCard()}
          <Button label={viewModel.saveActionLabel} size="lg" />
        </div>
      );
    }

    return (
      <>
        {renderFilterCard()}
        {renderTableCard()}
      </>
    );
  }

  return (
    <BackOfficeShell
      className={styles.shell}
      mobileNavigationLabel="Open class allocation menu"
      mobileNavigationOpen={mobileNavigationOpen}
      navigation={buildBackOfficeNavigation(viewModel.navigation, {
        navigateToRoute: navigate,
        onBeforeNavigate: () => {
          setMobileNavigationOpen(false);
        }
      })}
      navigationLabel="Class allocation navigation"
      onMobileNavigationDismiss={() => {
        setMobileNavigationOpen(false);
      }}
      onMobileNavigationToggle={() => {
        setMobileNavigationOpen((current) => !current);
      }}
      onThemeToggle={props.onThemeToggle}
      themeMode={props.themeMode}
      userInitials="MI"
      userName="Meera Iyer"
      userRole="Principal"
      viewport={viewport}
    >
      <div className={styles.page}>
        <PageHeader
          actions={
            !isMobile ? (
              <Button
                iconLeft={createIcon("save")}
                label={viewModel.saveActionLabel}
                size="lg"
              />
            ) : null
          }
          description={viewModel.description}
          title={viewModel.title}
        />

        <Card className={styles.workspaceBody} elevation="subtle" padding="lg">
          {isMobile ? (
            <>
              <Tabs
                activeValue={activeMobileSection}
                aria-label="Class section allocation mobile sections"
                className={styles.mobileSectionTabs}
                items={mobileSections}
                size="sm"
                onValueChange={(value) => {
                  setActiveMobileSection(value as ClassSectionAllocationMobileSection);
                }}
              />
              {renderMobileWorkspace()}
            </>
          ) : (
            renderDesktopWorkspace()
          )}
        </Card>
      </div>
    </BackOfficeShell>
  );
}
