import type { HTMLAttributes, Key, ReactNode } from "react";
import {
  StatusChip,
  mapStatusChipTone,
  type StatusChipTone
} from "../StatusChip/StatusChip";
import { DataList } from "../DataList/DataList";
import styles from "./NoticeList.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

function resolveItemKey(item: NoticeListItem, index: number): Key {
  return item.id ?? index;
}

export interface NoticeListItem {
  id?: Key;
  title: ReactNode;
  description?: ReactNode;
  audience?: ReactNode;
  stateLabel?: string;
  stateTone?: StatusChipTone;
  publishTiming?: ReactNode;
  pinnedLabel?: string;
  scheduledLabel?: string;
  meta?: ReactNode;
  leading?: ReactNode;
  action?: ReactNode;
}

export interface NoticeListProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  items: NoticeListItem[];
  emptyState?: ReactNode;
  compact?: boolean;
}

export function NoticeList(props: NoticeListProps) {
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
      className={cx(styles.noticeList, compact && styles.compact, className)}
      emptyState={emptyState}
      items={items}
      renderItem={(item, index) => {
        const metadata = [
          item.audience ? <span key="audience">{item.audience}</span> : null,
          item.publishTiming ? <span key="timing">{item.publishTiming}</span> : null,
          item.meta ? <span key="meta">{item.meta}</span> : null
        ].filter(Boolean);

        const supportChips = [
          item.pinnedLabel ? (
            <StatusChip key="pinned" label={item.pinnedLabel} size="sm" tone="info" />
          ) : null,
          item.scheduledLabel ? (
            <StatusChip key="scheduled" label={item.scheduledLabel} size="sm" tone="warning" />
          ) : null
        ].filter(Boolean);

        return (
          <article className={styles.entry} data-compact={compact ? "true" : "false"}>
            <div aria-hidden="true" className={styles.leadingColumn}>
              {item.leading ? <span className={styles.leading}>{item.leading}</span> : <span className={styles.marker} />}
            </div>

            <div className={styles.content}>
              <div className={styles.header}>
                <div className={styles.titleGroup}>
                  <strong className={styles.title}>{item.title}</strong>
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
                  {item.stateLabel ? (
                    <StatusChip
                      label={item.stateLabel}
                      size="sm"
                      tone={item.stateTone ?? mapStatusChipTone(item.stateLabel)}
                    />
                  ) : null}
                  {item.action ? <div className={styles.action}>{item.action}</div> : null}
                </div>
              </div>

              {!compact && item.description ? (
                <p className={styles.description}>{item.description}</p>
              ) : null}

              {supportChips.length > 0 ? (
                <div className={styles.supportRow}>{supportChips}</div>
              ) : null}
            </div>
          </article>
        );
      }}
    />
  );
}
