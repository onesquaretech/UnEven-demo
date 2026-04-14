import { useId, type HTMLAttributes, type ReactNode } from "react";
import styles from "./CircularProgress.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

function clampProgress(value: number, max: number) {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) {
    return 0;
  }

  return Math.min(Math.max(value, 0), max);
}

export type CircularProgressTone = "accent" | "success" | "warning" | "danger" | "neutral";
export type CircularProgressSize = "sm" | "md" | "lg";

export interface CircularProgressProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  value: number;
  max?: number;
  label?: ReactNode;
  hint?: ReactNode;
  valueLabel?: ReactNode;
  centerLabel?: ReactNode;
  tone?: CircularProgressTone;
  size?: CircularProgressSize;
}

function getGradientStops(tone: CircularProgressTone) {
  if (tone === "success") {
    return {
      start: "var(--success-strong)",
      end: "color-mix(in srgb, var(--success-strong) 68%, white)"
    };
  }

  if (tone === "warning") {
    return {
      start: "var(--warning-strong)",
      end: "color-mix(in srgb, var(--warning-strong) 68%, white)"
    };
  }

  if (tone === "danger") {
    return {
      start: "var(--danger-strong)",
      end: "color-mix(in srgb, var(--danger-strong) 68%, white)"
    };
  }

  if (tone === "neutral") {
    return {
      start: "var(--neutral-strong)",
      end: "color-mix(in srgb, var(--neutral-strong) 68%, white)"
    };
  }

  return {
    start: "var(--accent)",
    end: "var(--accent-2)"
  };
}

export function CircularProgress(props: CircularProgressProps) {
  const {
    centerLabel,
    className,
    hint,
    label,
    max = 100,
    size = "md",
    tone = "accent",
    value,
    valueLabel,
    ...elementProps
  } = props;

  const safeValue = clampProgress(value, max);
  const percent = max > 0 ? (safeValue / max) * 100 : 0;
  const hasExplicitValueLabel = Object.prototype.hasOwnProperty.call(props, "valueLabel");
  const hasExplicitCenterLabel = Object.prototype.hasOwnProperty.call(props, "centerLabel");
  const resolvedValueLabel = hasExplicitValueLabel ? valueLabel : `${Math.round(percent)}%`;
  const resolvedCenterLabel = hasExplicitCenterLabel ? centerLabel : resolvedValueLabel;
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (circumference * percent) / 100;
  const hasHeader = Boolean(label) || Boolean(hint);
  const gradientId = `circular-progress-${useId().replace(/:/g, "")}`;
  const gradientStops = getGradientStops(tone);

  return (
    <div
      {...elementProps}
      className={cx(
        styles.progress,
        size === "sm" && styles.sizeSm,
        size === "md" && styles.sizeMd,
        size === "lg" && styles.sizeLg,
        className
      )}
    >
      {hasHeader ? (
        <div className={styles.header}>
          {label ? <span className={styles.label}>{label}</span> : null}
          {hint ? <span className={styles.hint}>{hint}</span> : null}
        </div>
      ) : null}

      <div className={styles.meter}>
        <svg
          aria-label={typeof label === "string" ? label : undefined}
          aria-valuemax={max}
          aria-valuemin={0}
          aria-valuenow={safeValue}
          className={styles.graphic}
          role="progressbar"
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id={gradientId} x1="6" x2="94" y1="50" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={gradientStops.start} />
              <stop offset="100%" stopColor={gradientStops.end} />
            </linearGradient>
          </defs>
          <circle className={styles.track} cx="50" cy="50" r={radius} />
          <circle
            className={styles.fill}
            cx="50"
            cy="50"
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        {resolvedCenterLabel ? <span className={styles.centerLabel}>{resolvedCenterLabel}</span> : null}
      </div>

      {resolvedValueLabel ? <span className={styles.valueLabel}>{resolvedValueLabel}</span> : null}
    </div>
  );
}
