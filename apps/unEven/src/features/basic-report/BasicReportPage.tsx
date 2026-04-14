import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  BackOfficeShell,
  Button,
  Card,
  Field,
  FilterBar,
  MetricCard,
  PageHeader,
  StatusChip
} from "../../ui";
import type { ThemeMode } from "../../ui";
import { buildBackOfficeNavigation } from "../../app/navigation";
import { buildBasicReportViewModel } from "./buildBasicReportViewModel";
import type { BasicReportHistoryItem, BasicReportMetric, BasicReportTile } from "./basicReport.types";
import styles from "./BasicReportPage.module.css";

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

function iconGlyph(token: string) {
  return <span aria-hidden="true" className={cx(styles.iconGlyph, styles[`iconGlyph${token}`])} />;
}

function metricGlyph(metric: BasicReportMetric) {
  switch (metric.id) {
    case "avg-attendance":
      return iconGlyph("Attendance");
    case "fee-collection":
      return iconGlyph("Collection");
    case "pending-dues":
      return iconGlyph("Dues");
    default:
      return iconGlyph("Students");
  }
}

function tileGlyph(tile: BasicReportTile) {
  switch (tile.accent) {
    case "amber":
      return iconGlyph("Dues");
    case "violet":
      return iconGlyph("Admissions");
    case "blue":
      return iconGlyph("Transport");
    default:
      return tile.id === "attendance" ? iconGlyph("Attendance") : iconGlyph("Report");
  }
}

function historyTone(item: BasicReportHistoryItem) {
  switch (item.accent) {
    case "amber":
      return "warning";
    case "violet":
      return "info";
    case "blue":
      return "info";
    default:
      return "success";
  }
}

export interface BasicReportPageProps {
  themeMode?: ThemeMode;
  onThemeToggle?: () => void;
}

export function BasicReportPage(props: BasicReportPageProps = {}) {
  const navigate = useNavigate();
  const viewModel = buildBasicReportViewModel();
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">(() => {
    if (typeof window === "undefined") {
      return "desktop";
    }

    return detectViewport(window.innerWidth);
  });
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [startDate, setStartDate] = useState(viewModel.filters.startDate);
  const [endDate, setEndDate] = useState(viewModel.filters.endDate);
  const [classValue, setClassValue] = useState(viewModel.filters.classValue);
  const [periodValue, setPeriodValue] = useState(viewModel.filters.periodValue);
  const [searchQuery, setSearchQuery] = useState(viewModel.filters.searchValue);
  const [recentReports, setRecentReports] = useState(viewModel.historyPanel.items);
  const [queuedReportId, setQueuedReportId] = useState<string | null>(null);

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

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredTiles = useMemo(() => {
    return viewModel.reportHub.tiles.filter((tile) => {
      if (!normalizedQuery) {
        return true;
      }

      return [tile.title, tile.description].join(" ").toLowerCase().includes(normalizedQuery);
    });
  }, [normalizedQuery, viewModel.reportHub.tiles]);

  const filteredHistory = useMemo(() => {
    return recentReports.filter((item) => {
      if (!normalizedQuery) {
        return true;
      }

      return [item.title, item.meta, item.format].join(" ").toLowerCase().includes(normalizedQuery);
    });
  }, [normalizedQuery, recentReports]);

  function handleGenerate(tile: BasicReportTile) {
    setQueuedReportId(tile.id);

    setRecentReports((current) => {
      const nextItem: BasicReportHistoryItem = {
        id: `generated-${tile.id}`,
        title: tile.title,
        meta: `Generated just now · ${tile.generatedFileType}`,
        format: tile.generatedFileType,
        accent: tile.accent
      };

      return [nextItem, ...current.filter((item) => item.title !== tile.title)].slice(0, 4);
    });
  }

  return (
    <BackOfficeShell
      className={styles.shell}
      mobileNavigationLabel="Open reports menu"
      mobileNavigationOpen={mobileNavigationOpen}
      navigation={buildBackOfficeNavigation(viewModel.navigation, {
        navigateToRoute: navigate,
        onBeforeNavigate: () => {
          setMobileNavigationOpen(false);
        }
      })}
      navigationLabel="Reports navigation"
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
            <div className={styles.headerActions}>
              <Button
                iconLeft={iconGlyph("Download")}
                label={viewModel.exportActions.pdf}
                variant="secondary"
              />
              <Button iconLeft={iconGlyph("Download")} label={viewModel.exportActions.csv} />
            </div>
          }
          description={viewModel.description}
          title={viewModel.title}
        />

        <section className={styles.workspaceBody}>
          <Card className={styles.filterCard} padding="lg">
            <FilterBar className={styles.filterBar}>
              <div className={styles.filterField}>
                <Field
                  label="Start Date"
                  type="date"
                  value={startDate}
                  inputProps={{
                    onChange: updateTextValue(setStartDate)
                  }}
                />
              </div>
              <div className={styles.filterField}>
                <Field
                  label="End Date"
                  type="date"
                  value={endDate}
                  inputProps={{
                    onChange: updateTextValue(setEndDate)
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
                  label="Range"
                  options={viewModel.filters.periodOptions}
                  type="select"
                  value={periodValue}
                  selectProps={{
                    onChange: updateSelectValue(setPeriodValue)
                  }}
                />
              </div>
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
            </FilterBar>
          </Card>

          <div className={styles.metricsGrid}>
            {viewModel.metrics.map((metric) => (
              <MetricCard
                className={cx(styles.metricCard, styles[`metricCard${metric.tone}`])}
                icon={metricGlyph(metric)}
                key={metric.id}
                label={<span className={styles.metricLabel}>{metric.label}</span>}
                meta={metric.meta}
                value={metric.value}
              />
            ))}
          </div>

          <div className={styles.contentGrid}>
            <Card
              className={styles.reportHubCard}
              description={viewModel.reportHub.description}
              padding="lg"
              title={viewModel.reportHub.title}
            >
              <div className={styles.tileGrid}>
                {filteredTiles.map((tile) => (
                  <Card className={styles.tileCard} elevation="subtle" key={tile.id} padding="md">
                    <div className={styles.tileTop}>
                      <span
                        aria-hidden="true"
                        className={cx(styles.tileIcon, styles[`tileIcon${tile.accent}`])}
                      >
                        {tileGlyph(tile)}
                      </span>
                    </div>
                    <div className={styles.tileCopy}>
                      <h3>{tile.title}</h3>
                      <p>{tile.description}</p>
                    </div>
                    <div className={styles.tileActions}>
                      <Button
                        label={queuedReportId === tile.id ? "Queued" : "Generate"}
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          handleGenerate(tile);
                        }}
                      />
                    </div>
                  </Card>
                ))}
              </div>

              <Card className={styles.summaryCard} elevation="subtle" padding="md">
                <div className={styles.summaryCardBody}>
                  <h3>Summary Insights</h3>
                  <div className={styles.summaryItems}>
                    {viewModel.reportHub.summaryInsights.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>
              </Card>
            </Card>

            <Card
              className={styles.historyCard}
              description={viewModel.historyPanel.description}
              padding="lg"
              title={viewModel.historyPanel.title}
            >
              <div className={styles.historyStack}>
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <Card className={styles.historyItem} elevation="subtle" key={item.id} padding="md">
                      <div className={styles.historyRow}>
                        <div className={styles.historyLead}>
                          <span
                            aria-hidden="true"
                            className={cx(styles.historyDot, styles[`historyDot${item.accent}`])}
                          />
                          <div className={styles.historyCopy}>
                            <strong>{item.title}</strong>
                            <span>{item.meta}</span>
                          </div>
                        </div>
                        <Button label="Open" size="sm" variant="secondary" />
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className={styles.emptyState}>{viewModel.historyPanel.emptyLabel}</p>
                )}

                <Card className={styles.reportingNote} elevation="subtle" padding="md">
                  <div className={styles.reportingNoteBody}>
                    <StatusChip label={viewModel.historyPanel.noteTitle} size="sm" tone={historyTone({
                      id: "reporting-note",
                      title: "",
                      meta: "",
                      format: "PDF",
                      accent: "teal"
                    })} />
                    <p>{viewModel.historyPanel.noteBody}</p>
                    <span>{viewModel.historyPanel.noteCaption}</span>
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
