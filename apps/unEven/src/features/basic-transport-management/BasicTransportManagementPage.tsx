import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  BackOfficeShell,
  Button,
  Card,
  DataTable,
  Field,
  FilterBar,
  PageHeader,
  ProgressBar,
  StatusChip
} from "../../ui";
import type { DataTableColumn, ThemeMode } from "../../ui";
import { buildBackOfficeNavigation } from "../../app/navigation";
import { buildBasicTransportManagementViewModel } from "./buildBasicTransportManagementViewModel";
import type { BasicTransportAssignmentRow } from "./basicTransportManagement.types";
import styles from "./BasicTransportManagementPage.module.css";

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

function createIcon(token: "plus"): ReactNode {
  return <span aria-hidden="true" className={cx(styles.iconGlyph, styles[`iconGlyph${token}`])} />;
}

function renderStudentCell(row: BasicTransportAssignmentRow) {
  return (
    <div className={styles.studentCell}>
      <span className={cx(styles.avatarBadge, styles[`avatarBadge${row.accent}`])}>{row.initials}</span>
      <div className={styles.studentCopy}>
        <strong>{row.studentName}</strong>
        <span>{row.studentCode}</span>
      </div>
    </div>
  );
}

function resolveAction(row: BasicTransportAssignmentRow) {
  if (row.action === "pending") {
    return <StatusChip label="Pending" size="sm" tone="warning" />;
  }

  return (
    <Button
      label={row.action === "save" ? "Save" : "Edit"}
      size="sm"
      variant={row.action === "save" ? "primary" : "secondary"}
    />
  );
}

export interface BasicTransportManagementPageProps {
  themeMode?: ThemeMode;
  onThemeToggle?: () => void;
}

export function BasicTransportManagementPage(props: BasicTransportManagementPageProps = {}) {
  const navigate = useNavigate();
  const viewModel = buildBasicTransportManagementViewModel();
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">(() => {
    if (typeof window === "undefined") {
      return "desktop";
    }

    return detectViewport(window.innerWidth);
  });
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(viewModel.filters.searchValue);
  const [routeFilter, setRouteFilter] = useState(viewModel.filters.routeValue);
  const [classValue, setClassValue] = useState(viewModel.filters.classValue);
  const [pickupPointValue, setPickupPointValue] = useState(viewModel.filters.pickupPointValue);
  const [feeValue, setFeeValue] = useState(viewModel.filters.feeValue);
  const [activeRouteId, setActiveRouteId] = useState(viewModel.routeDetails[0]?.id ?? "");
  const [routeDetails, setRouteDetails] = useState(viewModel.routeDetails);

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

  useEffect(() => {
    if (routeFilter !== "all") {
      setActiveRouteId(routeFilter);
    }
  }, [routeFilter]);

  const displayedRouteId = routeFilter === "all" ? activeRouteId : routeFilter;

  const activeRoute = useMemo(() => {
    return routeDetails.find((route) => route.id === displayedRouteId) ?? routeDetails[0];
  }, [displayedRouteId, routeDetails]);

  const routeCards = useMemo(() => {
    return viewModel.routeRail.routes.filter((route) => {
      if (routeFilter === "all") {
        return true;
      }

      return route.id === routeFilter;
    });
  }, [routeFilter, viewModel.routeRail.routes]);

  const filteredRows = useMemo(() => {
    if (!activeRoute) {
      return [];
    }

    const normalizedQuery = searchQuery.trim().toLowerCase();

    return activeRoute.assignments.filter((row) => {
      if (normalizedQuery.length > 0) {
        const haystack = [row.studentName, row.studentCode, row.classLabel, row.pickupPoint]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(normalizedQuery)) {
          return false;
        }
      }

      if (classValue !== "all" && !row.classLabel.startsWith(classValue)) {
        return false;
      }

      if (pickupPointValue !== "all" && row.pickupPoint !== pickupPointValue) {
        return false;
      }

      if (feeValue !== "all" && row.feeMode !== feeValue) {
        return false;
      }

      return true;
    });
  }, [activeRoute, classValue, feeValue, pickupPointValue, searchQuery]);

  function updatePickupPoint(rowId: string, value: string) {
    if (!activeRoute) {
      return;
    }

    setRouteDetails((current) =>
      current.map((route) => {
        if (route.id !== activeRoute.id) {
          return route;
        }

        return {
          ...route,
          assignments: route.assignments.map((row) => {
            if (row.id !== rowId) {
              return row;
            }

            if (value === "Not assigned") {
              return {
                ...row,
                pickupPoint: value,
                feeLabel: "—",
                feeMode: "pending",
                action: "pending"
              };
            }

            return {
              ...row,
              pickupPoint: value,
              feeLabel: row.feeMode === "custom" ? row.feeLabel : route.feeLabel.split(" ")[0],
              feeMode: row.feeMode === "pending" ? "included" : row.feeMode,
              action: "save"
            };
          })
        };
      })
    );
  }

  const columns: Array<DataTableColumn<BasicTransportAssignmentRow>> = [
    {
      key: "student",
      header: "Student",
      renderCell: (row) => renderStudentCell(row),
      width: "34%"
    },
    {
      key: "class",
      header: "Class",
      renderCell: (row) => <span className={styles.bodyValue}>{row.classLabel}</span>,
      width: "12%"
    },
    {
      key: "pickup",
      header: "Pickup Point",
      renderCell: (row) => (
        <div className={styles.tableField}>
          <Field
            label=""
            options={row.pickupPointOptions}
            type="select"
            value={row.pickupPoint}
            selectProps={{
              "aria-label": `Pickup point for ${row.studentName}`,
              onChange: (event: ChangeEvent<HTMLSelectElement>) => {
                updatePickupPoint(row.id, event.target.value);
              }
            }}
          />
        </div>
      ),
      width: "27%"
    },
    {
      key: "fee",
      header: "Fee",
      renderCell: (row) => <span className={styles.feePill}>{row.feeLabel}</span>,
      width: "13%"
    },
    {
      key: "action",
      header: "Action",
      renderCell: (row) => resolveAction(row),
      width: "14%",
      align: "right"
    }
  ];

  if (!activeRoute) {
    return null;
  }

  return (
    <BackOfficeShell
      className={styles.shell}
      mobileNavigationLabel="Open transport menu"
      mobileNavigationOpen={mobileNavigationOpen}
      navigation={buildBackOfficeNavigation(viewModel.navigation, {
        navigateToRoute: navigate,
        onBeforeNavigate: () => {
          setMobileNavigationOpen(false);
        }
      })}
      navigationLabel="Transport navigation"
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
      userRole="Admin"
      viewport={viewport}
    >
      <div className={styles.page}>
        <PageHeader
          actions={<Button iconLeft={createIcon("plus")} label={viewModel.primaryActionLabel} />}
          description={viewModel.description}
          title={viewModel.title}
        />

        <section className={styles.workspaceBody}>
          <Card className={styles.filterCard} padding="lg">
            <FilterBar className={styles.filterBar}>
              <div className={styles.searchField}>
                <Field
                  label="Search"
                  placeholder={viewModel.filters.searchPlaceholder}
                  value={searchQuery}
                  inputProps={{
                    onChange: updateTextValue(setSearchQuery)
                  }}
                />
              </div>
              <div className={styles.filterField}>
                <Field
                  label="Route"
                  options={viewModel.filters.routeOptions}
                  type="select"
                  value={routeFilter}
                  selectProps={{
                    onChange: updateSelectValue(setRouteFilter)
                  }}
                />
              </div>
              <div className={styles.filterField}>
                <Field
                  label="Class"
                  options={viewModel.filters.classOptions}
                  type="select"
                  value={classValue}
                  selectProps={{
                    onChange: updateSelectValue(setClassValue)
                  }}
                />
              </div>
              <div className={styles.filterField}>
                <Field
                  label="Pickup Point"
                  options={viewModel.filters.pickupPointOptions}
                  type="select"
                  value={pickupPointValue}
                  selectProps={{
                    onChange: updateSelectValue(setPickupPointValue)
                  }}
                />
              </div>
              <div className={styles.filterField}>
                <Field
                  label="Fee Mapping"
                  options={viewModel.filters.feeOptions}
                  type="select"
                  value={feeValue}
                  selectProps={{
                    onChange: updateSelectValue(setFeeValue)
                  }}
                />
              </div>
            </FilterBar>
            <p className={styles.filterSummary}>{viewModel.filters.summaryLabel}</p>
          </Card>

          <div className={styles.contentGrid}>
            <Card
              className={styles.routeRail}
              description={viewModel.routeRail.description}
              padding="lg"
              title={viewModel.routeRail.title}
            >
              <div className={styles.routeStack}>
                {routeCards.map((route) => (
                  <button
                    className={cx(styles.routeCard, route.id === activeRoute.id && styles.routeCardActive)}
                    key={route.id}
                    type="button"
                    onClick={() => {
                      setActiveRouteId(route.id);
                    }}
                  >
                    <div className={styles.routeCardCopy}>
                      <strong>{route.label}</strong>
                      <span>{route.vehicleLabel}</span>
                    </div>
                    <div className={styles.routeProgressWrap}>
                      <ProgressBar
                        className={styles.routeProgress}
                        max={route.capacityValue}
                        size="sm"
                        tone={route.tone}
                        value={route.occupiedValue}
                      />
                      <span className={styles.routeProgressValue}>
                        {route.occupiedValue} / {route.capacityValue}
                      </span>
                    </div>
                  </button>
                ))}

                <Card className={styles.routeStatusCard} elevation="subtle" padding="md">
                  <div className={styles.routeStatusBody}>
                    <span>{viewModel.routeRail.statusCardTitle}</span>
                    <strong>{viewModel.routeRail.statusCardValue}</strong>
                    <p>{viewModel.routeRail.statusCardNote}</p>
                  </div>
                </Card>
              </div>
            </Card>

            <Card
              className={styles.tableCard}
              description={viewModel.assignmentTable.description}
              padding="lg"
              title={viewModel.assignmentTable.title}
            >
              <div className={styles.tableStack}>
                <DataTable
                  className={styles.dataTable}
                  columns={columns}
                  rowKey="id"
                  rows={filteredRows}
                />

                <Card className={styles.feeMappingCard} elevation="subtle" padding="md">
                  <div className={styles.feeMappingBody}>
                    <div>
                      <span>{viewModel.assignmentTable.feeMappingTitle}</span>
                      <strong>{viewModel.assignmentTable.feeMappingValue}</strong>
                      <p>{viewModel.assignmentTable.feeMappingNote}</p>
                    </div>
                    <Button label={viewModel.assignmentTable.feeMappingActionLabel} variant="secondary" />
                  </div>
                </Card>
              </div>
            </Card>

            <Card
              className={styles.detailCard}
              description={viewModel.detailsPanel.description}
              padding="lg"
              title={viewModel.detailsPanel.title}
            >
              <div className={styles.detailStack}>
                <Card className={styles.vehicleCard} elevation="subtle" padding="md">
                  <div className={styles.vehicleBody}>
                    <span>{viewModel.detailsPanel.vehicleCardTitle}</span>
                    <strong>{activeRoute.vehicleNumber}</strong>
                    <p>{activeRoute.vehicleMeta}</p>
                    <p>Capacity: {activeRoute.capacityValue} seats</p>
                  </div>
                </Card>

                <div className={styles.sectionLabel}>{viewModel.detailsPanel.capacityTitle}</div>
                <Card className={styles.capacityCard} elevation="subtle" padding="md">
                  <div className={styles.capacityBody}>
                    <span>Assigned students</span>
                    <strong>
                      {activeRoute.assignedValue} / {activeRoute.capacityValue}
                    </strong>
                    <div className={styles.capacityProgressWrap}>
                      <ProgressBar
                        className={styles.capacityProgress}
                        max={activeRoute.capacityValue}
                        size="sm"
                        tone={activeRoute.capacityTone}
                        value={activeRoute.assignedValue}
                      />
                      <span>{activeRoute.seatsLeftLabel}</span>
                    </div>
                  </div>
                </Card>

                <div className={styles.sectionLabel}>{viewModel.detailsPanel.stopsTitle}</div>
                <div className={styles.stopStack}>
                  {activeRoute.stops.map((stop) => (
                    <Card
                      className={cx(styles.stopCard, stop.active && styles.stopCardActive)}
                      elevation="subtle"
                      key={stop.id}
                      padding="md"
                    >
                      <div className={styles.stopBody}>
                        <strong>{stop.label}</strong>
                        <span>
                          {stop.timeLabel} · {stop.studentCountLabel}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className={styles.sectionLabel}>{viewModel.detailsPanel.feeTitle}</div>
                <Card className={styles.routeFeeCard} elevation="subtle" padding="md">
                  <div className={styles.routeFeeBody}>
                    <span>Monthly transport fee</span>
                    <strong>{activeRoute.feeLabel}</strong>
                  </div>
                </Card>

                <div className={styles.detailActions}>
                  <Button label={viewModel.detailsPanel.editActionLabel} variant="secondary" />
                  <Button label={viewModel.detailsPanel.saveActionLabel} />
                </div>

                <Card className={styles.conflictCard} elevation="subtle" padding="md">
                  <div className={styles.conflictBody}>
                    <StatusChip
                      label={viewModel.conflictNote.label}
                      size="sm"
                      tone={viewModel.conflictNote.tone}
                    />
                    <p>{viewModel.conflictNote.message}</p>
                  </div>
                </Card>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </BackOfficeShell>
  );
}
