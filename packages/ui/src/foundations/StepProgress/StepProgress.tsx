import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import { StatusChip, mapStatusChipTone } from "../StatusChip/StatusChip";
import styles from "./StepProgress.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export type StepProgressStepStatus =
  | "complete"
  | "current"
  | "upcoming"
  | "warning"
  | "error";

export interface StepProgressStep {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  status?: StepProgressStepStatus;
}

export interface StepProgressProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  steps: StepProgressStep[];
  activeStepId?: string;
  label?: ReactNode;
  hint?: ReactNode;
  valueLabel?: ReactNode | null;
  showProgressBar?: boolean;
  orientation?: "vertical" | "horizontal";
  showStatusChips?: boolean;
}

function getFallbackActiveIndex(steps: StepProgressStep[], activeStepId?: string) {
  if (steps.length === 0) {
    return -1;
  }

  const activeIndex = activeStepId
    ? steps.findIndex((step) => step.id === activeStepId)
    : -1;

  if (activeIndex >= 0) {
    return activeIndex;
  }

  const explicitCurrentIndex = steps.findIndex((step) => step.status === "current");

  if (explicitCurrentIndex >= 0) {
    return explicitCurrentIndex;
  }

  const explicitUpcomingIndex = steps.findIndex((step) => !step.status || step.status === "upcoming");

  return explicitUpcomingIndex >= 0 ? explicitUpcomingIndex : steps.length - 1;
}

function resolveStepStatus(
  step: StepProgressStep,
  index: number,
  activeIndex: number
): StepProgressStepStatus {
  if (step.status) {
    return step.status;
  }

  if (activeIndex < 0) {
    return index === 0 ? "current" : "upcoming";
  }

  if (index < activeIndex) {
    return "complete";
  }

  if (index === activeIndex) {
    return "current";
  }

  return "upcoming";
}

function getStatusLabel(status: StepProgressStepStatus) {
  if (status === "complete") {
    return "Completed";
  }

  if (status === "current") {
    return "Current";
  }

  if (status === "warning") {
    return "Attention";
  }

  if (status === "error") {
    return "Blocked";
  }

  return "Upcoming";
}

function getMarkerLabel(status: StepProgressStepStatus, index: number) {
  if (status === "complete") {
    return "✓";
  }

  if (status === "warning") {
    return "!";
  }

  if (status === "error") {
    return "×";
  }

  return String(index + 1);
}

export function StepProgress(props: StepProgressProps) {
  const {
    activeStepId,
    className,
    hint,
    label,
    orientation = "vertical",
    showStatusChips = true,
    showProgressBar = true,
    steps,
    valueLabel,
    ...elementProps
  } = props;

  const activeIndex = getFallbackActiveIndex(steps, activeStepId);
  const resolvedSteps = steps.map((step, index) => {
    const status = resolveStepStatus(step, index, activeIndex);

    return {
      ...step,
      status
    };
  });
  const completeCount = resolvedSteps.filter((step) => step.status === "complete").length;
  const currentCount = resolvedSteps.some((step) => step.status === "current") ? 1 : 0;
  const progressValue = completeCount + currentCount;
  const resolvedValueLabel =
    valueLabel === null
      ? null
      : valueLabel ?? `${Math.min(progressValue, steps.length)} of ${steps.length}`;
  const hasHeader = Boolean(label) || Boolean(hint) || Boolean(resolvedValueLabel);

  return (
    <div
      {...elementProps}
      className={cx(
        styles.stepProgress,
        orientation === "horizontal" && styles.stepProgressHorizontal,
        className
      )}
    >
      {hasHeader ? (
        <div className={styles.header}>
          <div className={styles.copy}>
            {label ? <span className={styles.label}>{label}</span> : null}
            {hint ? <span className={styles.hint}>{hint}</span> : null}
          </div>
          {resolvedValueLabel ? <span className={styles.valueLabel}>{resolvedValueLabel}</span> : null}
        </div>
      ) : null}

      {showProgressBar && steps.length > 0 ? (
        <ProgressBar
          label={undefined}
          max={steps.length}
          size="sm"
          value={progressValue}
          valueLabel={null}
        />
      ) : null}

      <ol
        className={cx(styles.list, orientation === "horizontal" && styles.listHorizontal)}
        style={
          orientation === "horizontal"
            ? ({ "--step-count": String(Math.max(steps.length, 1)) } as CSSProperties)
            : undefined
        }
      >
        {resolvedSteps.map((step, index) => {
          const isLast = index === resolvedSteps.length - 1;
          const chipTone =
            step.status === "current"
              ? "info"
              : step.status === "upcoming"
                ? "neutral"
                : step.status === "warning"
                  ? "warning"
                  : step.status === "error"
                    ? "danger"
                    : mapStatusChipTone(step.status);

          return (
            <li
              className={cx(styles.item, orientation === "horizontal" && styles.itemHorizontal)}
              key={step.id}
            >
              <div
                className={cx(styles.rail, orientation === "horizontal" && styles.railHorizontal)}
                aria-hidden="true"
              >
                <span
                  className={cx(
                    styles.marker,
                    step.status === "complete" && styles.markerComplete,
                    step.status === "current" && styles.markerCurrent,
                    step.status === "upcoming" && styles.markerUpcoming,
                    step.status === "warning" && styles.markerWarning,
                    step.status === "error" && styles.markerError
                  )}
                >
                  {getMarkerLabel(step.status, index)}
                </span>
                {!isLast ? (
                  <span
                    className={cx(
                      styles.connector,
                      orientation === "horizontal" && styles.connectorHorizontal
                    )}
                  />
                ) : null}
              </div>

              <div
                className={cx(
                  styles.content,
                  orientation === "horizontal" && styles.contentHorizontal
                )}
              >
                <div className={cx(styles.row, orientation === "horizontal" && styles.rowHorizontal)}>
                  <div className={styles.primary}>
                    <span className={styles.stepLabel}>{step.label}</span>
                    {step.description ? (
                      <span className={styles.description}>{step.description}</span>
                    ) : null}
                  </div>
                  {showStatusChips || step.meta ? (
                    <div className={styles.meta}>
                      {showStatusChips ? (
                        <StatusChip
                          label={getStatusLabel(step.status)}
                          size="sm"
                          tone={chipTone}
                        />
                      ) : null}
                      {step.meta ? <span className={styles.metaText}>{step.meta}</span> : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
