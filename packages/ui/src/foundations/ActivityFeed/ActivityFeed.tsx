import type { HTMLAttributes, ReactNode } from "react";
import { DataList } from "../DataList/DataList";
import styles from "./ActivityFeed.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export interface ActivityFeedItem {
  id?: string;
  title: ReactNode;
  timestamp: ReactNode;
  description?: ReactNode;
  actor?: ReactNode;
  action?: ReactNode;
  meta?: ReactNode;
  leading?: ReactNode;
}

export interface ActivityFeedProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  items: ActivityFeedItem[];
  emptyState?: ReactNode;
  compact?: boolean;
}

export function ActivityFeed(props: ActivityFeedProps) {
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
      className={cx(styles.activityFeed, compact && styles.compact, className)}
      emptyState={emptyState}
      items={items}
      renderItem={(item) => {
        const hasMeta = Boolean(item.actor) || Boolean(item.action) || Boolean(item.meta);

        return (
          <article className={styles.entry}>
            <div aria-hidden="true" className={styles.rail}>
              {item.leading ? (
                <span className={styles.leading}>{item.leading}</span>
              ) : (
                <span className={styles.dot} />
              )}
              <span className={styles.connector} />
            </div>

            <div className={styles.content}>
              <div className={styles.header}>
                <strong className={styles.title}>{item.title}</strong>
                <span className={styles.timestamp}>{item.timestamp}</span>
              </div>

              {hasMeta ? (
                <div className={styles.metaRow}>
                  {item.actor ? <span className={styles.metaText}>{item.actor}</span> : null}
                  {item.action ? <span className={styles.metaText}>{item.action}</span> : null}
                  {item.meta ? <span className={styles.metaText}>{item.meta}</span> : null}
                </div>
              ) : null}

              {item.description ? (
                <p className={styles.description}>{item.description}</p>
              ) : null}
            </div>
          </article>
        );
      }}
    />
  );
}
