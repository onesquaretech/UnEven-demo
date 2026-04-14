import type { HTMLAttributes, ReactNode } from "react";
import styles from "./StatusChip.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export type StatusChipTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

export type StatusChipSize = "sm" | "md";

export interface StatusChipProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  tone?: StatusChipTone;
  label: string;
  size?: StatusChipSize;
  selected?: boolean;
  icon?: ReactNode;
}

const toneDictionary: Record<string, StatusChipTone> = {
  active: "success",
  approved: "success",
  clear: "success",
  completed: "success",
  connected: "success",
  delivered: "success",
  enabled: "success",
  feeclear: "success",
  online: "success",
  paid: "success",
  pass: "success",
  present: "success",
  published: "success",
  ready: "success",
  success: "success",
  transporton: "success",
  verified: "success",
  absent: "danger",
  blocked: "danger",
  danger: "danger",
  disabled: "danger",
  due: "danger",
  error: "danger",
  failed: "danger",
  overdue: "danger",
  rejected: "danger",
  offline: "danger",
  delayed: "warning",
  hold: "warning",
  late: "warning",
  leave: "warning",
  partial: "warning",
  paused: "warning",
  pending: "warning",
  review: "warning",
  scheduled: "warning",
  waiting: "warning",
  assigned: "info",
  draft: "info",
  info: "info",
  inprogress: "info",
  processing: "info",
  unassigned: "neutral",
  inactive: "neutral",
  neutral: "neutral"
};

function normalizeStatus(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function mapStatusChipTone(
  status: string,
  fallback: StatusChipTone = "neutral"
): StatusChipTone {
  return toneDictionary[normalizeStatus(status)] ?? fallback;
}

export function StatusChip(props: StatusChipProps) {
  const {
    className,
    icon,
    label,
    selected = false,
    size = "md",
    tone = mapStatusChipTone(label),
    ...spanProps
  } = props;

  return (
    <span
      {...spanProps}
      className={cx(
        styles.chip,
        size === "sm" && styles.sizeSm,
        size === "md" && styles.sizeMd,
        tone === "success" && styles.toneSuccess,
        tone === "warning" && styles.toneWarning,
        tone === "danger" && styles.toneDanger,
        tone === "info" && styles.toneInfo,
        tone === "neutral" && styles.toneNeutral,
        selected && styles.selected,
        className
      )}
    >
      {icon ? (
        <span aria-hidden="true" className={styles.icon}>
          {icon}
        </span>
      ) : null}
      <span className={styles.label}>{label}</span>
    </span>
  );
}
