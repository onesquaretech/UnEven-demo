import type { HTMLAttributes, Key, ReactNode } from "react";
import { Card } from "../Card/Card";
import styles from "./DataList.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

function resolveItemKey<T>(item: T, index: number): Key {
  if (typeof item === "string" || typeof item === "number") {
    return item;
  }

  if (typeof item === "object" && item !== null) {
    const candidate = item as { id?: Key; key?: Key };

    if (candidate.id !== undefined) {
      return candidate.id;
    }

    if (candidate.key !== undefined) {
      return candidate.key;
    }
  }

  return index;
}

export interface DataListProps<T>
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  emptyState?: ReactNode;
}

export function DataList<T>(props: DataListProps<T>) {
  const { className, emptyState, items, renderItem, ...elementProps } = props;
  const hasItems = items.length > 0;

  return (
    <Card
      {...elementProps}
      className={cx(styles.dataList, className)}
      padding="none"
    >
      {hasItems ? (
        <ul className={styles.list}>
          {items.map((item, index) => (
            <li className={styles.item} key={resolveItemKey(item, index)}>
              {renderItem(item, index)}
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.emptyState}>
          {emptyState ?? (
            <p className={styles.emptyText}>No records available.</p>
          )}
        </div>
      )}
    </Card>
  );
}
