import type { HTMLAttributes, Key, ReactNode } from "react";
import { Button, type ButtonVariant } from "../Button/Button";
import { StatusChip, type StatusChipTone } from "../StatusChip/StatusChip";
import styles from "./FileUploadList.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

function resolveItemKey(item: FileUploadListItem, index: number): Key {
  return item.id ?? index;
}

export interface FileUploadListItem {
  id?: Key;
  name: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  statusLabel: string;
  statusTone?: StatusChipTone;
  actionLabel?: string;
  actionVariant?: ButtonVariant;
  actionDisabled?: boolean;
  actionLoading?: boolean;
  secondaryActionLabel?: string;
  secondaryActionVariant?: ButtonVariant;
  secondaryActionDisabled?: boolean;
  secondaryActionLoading?: boolean;
}

export interface FileUploadListProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  items: FileUploadListItem[];
  emptyState?: ReactNode;
  onAction?: (item: FileUploadListItem, index: number) => void;
  onSecondaryAction?: (item: FileUploadListItem, index: number) => void;
}

export function FileUploadList(props: FileUploadListProps) {
  const {
    className,
    emptyState,
    items,
    onAction,
    onSecondaryAction,
    ...elementProps
  } = props;

  return (
    <div {...elementProps} className={cx(styles.fileUploadList, className)}>
      {items.length > 0 ? (
        <ul className={styles.list}>
          {items.map((item, index) => (
            <li className={styles.item} key={resolveItemKey(item, index)}>
              <div className={styles.row}>
                <div className={styles.primary}>
                  <div className={styles.titleRow}>
                    <span className={styles.name}>{item.name}</span>
                    {item.meta ? <span className={styles.meta}>{item.meta}</span> : null}
                  </div>
                  {item.description ? (
                    <span className={styles.description}>{item.description}</span>
                  ) : null}
                </div>

                <div className={styles.trailing}>
                  <StatusChip
                    label={item.statusLabel}
                    size="sm"
                    tone={item.statusTone}
                  />

                  {item.secondaryActionLabel ? (
                    <Button
                      disabled={item.secondaryActionDisabled}
                      label={item.secondaryActionLabel}
                      loading={item.secondaryActionLoading}
                      onClick={() => onSecondaryAction?.(item, index)}
                      size="sm"
                      variant={item.secondaryActionVariant ?? "ghost"}
                    />
                  ) : null}

                  {item.actionLabel ? (
                    <Button
                      disabled={item.actionDisabled}
                      label={item.actionLabel}
                      loading={item.actionLoading}
                      onClick={() => onAction?.(item, index)}
                      size="sm"
                      variant={item.actionVariant ?? "secondary"}
                    />
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.emptyState}>
          {emptyState ?? (
            <p className={styles.emptyText}>No files available.</p>
          )}
        </div>
      )}
    </div>
  );
}
