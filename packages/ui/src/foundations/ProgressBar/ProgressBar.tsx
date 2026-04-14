import type { HTMLAttributes, ReactNode } from "react";
import styles from "./ProgressBar.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export type ProgressBarTone = "accent" | "success" | "warning" | "danger" | "neutral";
export type ProgressBarSize = "sm" | "md" | "lg";

export interface ProgressBarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  value: number;
  max?: number;
  label?: ReactNode;
  hint?: ReactNode;
  valueLabel?: ReactNode;
  tone?: ProgressBarTone;
  size?: ProgressBarSize;
}

function clampProgress(value: number, max: number) {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) {
    return 0;
  }

  return Math.min(Math.max(value, 0), max);
}

export function ProgressBar(props: ProgressBarProps) {
  const {
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
  const resolvedValueLabel = valueLabel ?? `${Math.round(percent)}%`;
  const hasHeader = Boolean(label) || Boolean(hint) || Boolean(resolvedValueLabel);

  return (
    <div
      {...elementProps}
      className={cx(
        styles.progress,
        size === "sm" && styles.sizeSm,
        size === "md" && styles.sizeMd,
        size === "lg" && styles.sizeLg,
        tone === "accent" && styles.toneAccent,
        tone === "success" && styles.toneSuccess,
        tone === "warning" && styles.toneWarning,
        tone === "danger" && styles.toneDanger,
        tone === "neutral" && styles.toneNeutral,
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

      <div
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={safeValue}
        className={styles.track}
        role="progressbar"
      >
        <span className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
