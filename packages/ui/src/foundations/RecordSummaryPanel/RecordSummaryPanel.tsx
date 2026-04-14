import type { HTMLAttributes, ReactNode } from "react";
import { Card, type CardElevation, type CardPadding } from "../Card/Card";
import { MetricCard } from "../MetricCard/MetricCard";
import {
  ProgressBar,
  type ProgressBarSize,
  type ProgressBarTone
} from "../ProgressBar/ProgressBar";
import { StatusChip, type StatusChipTone } from "../StatusChip/StatusChip";
import styles from "./RecordSummaryPanel.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export interface RecordSummaryPanelDetail {
  id?: string;
  label: ReactNode;
  value: ReactNode;
}

export interface RecordSummaryPanelMetric {
  id?: string;
  label: ReactNode;
  value: ReactNode;
  meta?: ReactNode;
  trend?: ReactNode;
  icon?: ReactNode;
}

export interface RecordSummaryPanelProgress {
  value: number;
  max?: number;
  label?: ReactNode;
  hint?: ReactNode;
  valueLabel?: ReactNode | null;
  tone?: ProgressBarTone;
  size?: ProgressBarSize;
}

export interface RecordSummaryPanelProps
  extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  title: ReactNode;
  description?: ReactNode;
  statusLabel?: string;
  statusTone?: StatusChipTone;
  actions?: ReactNode;
  details?: RecordSummaryPanelDetail[];
  metrics?: RecordSummaryPanelMetric[];
  notes?: ReactNode;
  progress?: RecordSummaryPanelProgress;
  padding?: CardPadding;
  elevation?: CardElevation;
}

export function RecordSummaryPanel(props: RecordSummaryPanelProps) {
  const {
    actions,
    className,
    description,
    details = [],
    elevation = "raised",
    metrics = [],
    notes,
    padding = "md",
    progress,
    statusLabel,
    statusTone = "neutral",
    title,
    ...cardProps
  } = props;

  const hasDetails = details.length > 0;
  const hasMetrics = metrics.length > 0;

  return (
    <Card
      {...cardProps}
      actions={
        actions || statusLabel ? (
          <div className={styles.headerActions}>
            {statusLabel ? (
              <StatusChip
                label={statusLabel}
                size="sm"
                tone={statusTone}
              />
            ) : null}
            {actions}
          </div>
        ) : undefined
      }
      className={cx(styles.recordSummaryPanel, className)}
      description={description}
      elevation={elevation}
      padding={padding}
      title={title}
    >
      <div className={styles.body}>
        {progress ? (
          <section className={styles.section}>
            <ProgressBar
              hint={progress.hint}
              label={progress.label}
              max={progress.max}
              size={progress.size ?? "sm"}
              tone={progress.tone}
              value={progress.value}
              valueLabel={progress.valueLabel ?? undefined}
            />
          </section>
        ) : null}

        {hasDetails ? (
          <section className={styles.section}>
            <dl className={styles.detailList}>
              {details.map((detail, index) => (
                <div
                  className={styles.detailItem}
                  key={detail.id ?? `${index}-${String(detail.label)}`}
                >
                  <dt className={styles.detailLabel}>{detail.label}</dt>
                  <dd className={styles.detailValue}>{detail.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {notes ? (
          <section className={styles.section}>
            <div className={styles.notes}>{notes}</div>
          </section>
        ) : null}

        {hasMetrics ? (
          <section className={styles.section}>
            <div className={styles.metricGrid}>
              {metrics.map((metric, index) => (
                <MetricCard
                  elevation="subtle"
                  icon={metric.icon}
                  key={metric.id ?? `${index}-${String(metric.label)}`}
                  label={metric.label}
                  meta={metric.meta}
                  padding="sm"
                  trend={metric.trend}
                  value={metric.value}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </Card>
  );
}
