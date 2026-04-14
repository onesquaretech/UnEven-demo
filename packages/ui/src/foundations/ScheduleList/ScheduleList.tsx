import type { HTMLAttributes, Key, ReactNode } from "react";
import {
  StatusChip,
  mapStatusChipTone,
  type StatusChipTone
} from "../StatusChip/StatusChip";
import { DataList } from "../DataList/DataList";
import styles from "./ScheduleList.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

function resolveItemKey(item: ScheduleListItem, index: number): Key {
  return item.id ?? index;
}

export interface ScheduleListItem {
  id?: Key;
  title: ReactNode;
  description?: ReactNode;
  startTime?: ReactNode;
  endTime?: ReactNode;
  timingLabel?: ReactNode;
  currentLabel?: string;
  currentTone?: StatusChipTone;
  nextLabel?: string;
  nextTone?: StatusChipTone;
  location?: ReactNode;
  meta?: ReactNode;
  leading?: ReactNode;
  action?: ReactNode;
}

export interface ScheduleListProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  items: ScheduleListItem[];
  emptyState?: ReactNode;
  compact?: boolean;
}

export function ScheduleList(props: ScheduleListProps) {
  const {
    className,
    compact = false,
    emptyState,
    items,
    ...elementProps
  } = props;

  return (
    <DataList
      {...elementProps}
      className={cx(styles.scheduleList, compact && styles.compact, className)}
      emptyState={emptyState}
      items={items}
      renderItem={(item, index) => {
        const metadata = [
          item.timingLabel ? <span key="timing">{item.timingLabel}</span> : null,
          item.location ? <span key="location">{item.location}</span> : null,
          item.meta ? <span key="meta">{item.meta}</span> : null
        ].filter(Boolean);

        return (
          <article className={styles.entry}>
            <div aria-hidden="true" className={styles.leadingColumn}>
              {item.leading ? <span className={styles.leading}>{item.leading}</span> : <span className={styles.marker} />}
            </div>

            <div className={styles.content}>
              <div className={styles.header}>
                <div className={styles.titleGroup}>
                  <div className={styles.titleRow}>
                    <strong className={styles.title}>{item.title}</strong>
                    {item.startTime || item.endTime ? (
                      <span className={styles.timeRange}>
                        {item.startTime}
                        {item.startTime && item.endTime ? " - " : null}
                        {item.endTime}
                      </span>
                    ) : null}
                  </div>

                  {metadata.length > 0 ? (
                    <div className={styles.metaRow}>
                      {metadata.map((value, metaIndex) => (
                        <span className={styles.metaText} key={metaIndex}>
                          {value}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className={styles.headerAside}>
                  {item.currentLabel ? (
                    <StatusChip
                      label={item.currentLabel}
                      size="sm"
                      tone={item.currentTone ?? mapStatusChipTone(item.currentLabel)}
                    />
                  ) : null}
                  {item.nextLabel ? (
                    <StatusChip
                      label={item.nextLabel}
                      size="sm"
                      tone={item.nextTone ?? mapStatusChipTone(item.nextLabel, "info")}
                    />
                  ) : null}
                  {item.action ? <div className={styles.action}>{item.action}</div> : null}
                </div>
              </div>

              {!compact && item.description ? (
                <p className={styles.description}>{item.description}</p>
              ) : null}
            </div>
          </article>
        );
      }}
    />
  );
}
