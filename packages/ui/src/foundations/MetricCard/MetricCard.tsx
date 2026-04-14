import type { ReactNode } from "react";
import { Card, type CardElevation, type CardPadding, type CardProps } from "../Card/Card";
import styles from "./MetricCard.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export interface MetricCardProps
  extends Omit<CardProps, "title" | "description" | "actions" | "children"> {
  label: ReactNode;
  value: ReactNode;
  meta?: ReactNode;
  trend?: ReactNode;
  icon?: ReactNode;
  padding?: CardPadding;
  elevation?: CardElevation;
}

export function MetricCard(props: MetricCardProps) {
  const {
    className,
    elevation = "raised",
    icon,
    label,
    meta,
    padding = "md",
    trend,
    value,
    ...cardProps
  } = props;

  return (
    <Card
      {...cardProps}
      className={cx(styles.metricCard, className)}
      elevation={elevation}
      padding={padding}
    >
      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={styles.label}>{label}</span>
          {icon ? (
            <span aria-hidden="true" className={styles.icon}>
              {icon}
            </span>
          ) : null}
        </div>
        <p className={styles.value}>{value}</p>
        {meta || trend ? (
          <div className={styles.footer}>
            {meta ? <span className={styles.meta}>{meta}</span> : null}
            {trend ? <span className={styles.trend}>{trend}</span> : null}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
