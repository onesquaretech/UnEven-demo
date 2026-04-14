import { useState } from "react";
import type { HTMLAttributes, Key, ReactNode } from "react";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";
import { Checkbox } from "../Checkbox/Checkbox";
import styles from "./DataTable.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export type DataTableColumnAlign = "left" | "center" | "right";

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  renderCell: (row: T, index: number) => ReactNode;
  width?: string;
  align?: DataTableColumnAlign;
}

export interface DataTablePagination {
  page: number;
  totalPages: number;
  summary?: ReactNode;
  onPageChange?: (page: number) => void;
}

export type DataTableRowKey<T> = keyof T | ((row: T, index: number) => Key);

export interface DataTableProps<T>
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  columns: Array<DataTableColumn<T>>;
  rows: T[];
  rowKey: DataTableRowKey<T>;
  selectable?: boolean;
  stickyHeader?: boolean;
  rowActions?: (row: T, index: number) => ReactNode;
  pagination?: DataTablePagination;
  emptyState?: ReactNode;
}

function resolveRowKey<T>(row: T, index: number, rowKey: DataTableRowKey<T>): Key {
  if (typeof rowKey === "function") {
    return rowKey(row, index);
  }

  const value = row[rowKey];
  return typeof value === "string" || typeof value === "number" ? value : index;
}

export function DataTable<T>(props: DataTableProps<T>) {
  const {
    className,
    columns,
    emptyState,
    pagination,
    rowActions,
    rowKey,
    rows,
    selectable = false,
    stickyHeader = false,
    ...elementProps
  } = props;

  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

  const rowKeys = rows.map((row, index) => resolveRowKey(row, index, rowKey));
  const selectedKeySet = new Set(selectedKeys);
  const selectedCount = rowKeys.filter((key) => selectedKeySet.has(key)).length;
  const allSelected = rows.length > 0 && selectedCount === rows.length;

  function toggleRowSelection(key: Key, checked: boolean) {
    setSelectedKeys((current) => {
      const next = new Set(current);

      if (checked) {
        next.add(key);
      } else {
        next.delete(key);
      }

      return Array.from(next);
    });
  }

  function toggleAllSelection(checked: boolean) {
    setSelectedKeys(checked ? rowKeys : []);
  }

  const hasRows = rows.length > 0;

  return (
    <Card
      {...elementProps}
      className={cx(styles.dataTable, className)}
      padding="none"
    >
      {hasRows ? (
        <>
          <div className={styles.viewport}>
            <table className={styles.table}>
              <thead className={cx(stickyHeader && styles.stickyHeader)}>
                <tr>
                  {selectable ? (
                    <th className={cx(styles.headCell, styles.selectionCell)} scope="col">
                      <Checkbox
                        aria-label="Select all rows"
                        checked={allSelected}
                        id="datatable-select-all"
                        label=""
                        onChange={(event) => toggleAllSelection(event.target.checked)}
                      />
                    </th>
                  ) : null}
                  {columns.map((column) => (
                    <th
                      className={cx(
                        styles.headCell,
                        column.align === "center" && styles.alignCenter,
                        column.align === "right" && styles.alignRight
                      )}
                      key={column.key}
                      scope="col"
                      style={column.width ? { width: column.width } : undefined}
                    >
                      {column.header}
                    </th>
                  ))}
                  {rowActions ? (
                    <th className={cx(styles.headCell, styles.actionsCell)} scope="col">
                      Actions
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const key = rowKeys[index];
                  const isSelected = selectedKeySet.has(key);

                  return (
                    <tr className={cx(isSelected && styles.rowSelected)} key={key}>
                      {selectable ? (
                        <td className={cx(styles.bodyCell, styles.selectionCell)}>
                          <Checkbox
                            aria-label={`Select row ${index + 1}`}
                            checked={isSelected}
                            id={`datatable-row-${String(key)}`}
                            label=""
                            onChange={(event) => toggleRowSelection(key, event.target.checked)}
                          />
                        </td>
                      ) : null}
                      {columns.map((column) => (
                        <td
                          className={cx(
                            styles.bodyCell,
                            column.align === "center" && styles.alignCenter,
                            column.align === "right" && styles.alignRight
                          )}
                          key={column.key}
                        >
                          {column.renderCell(row, index)}
                        </td>
                      ))}
                      {rowActions ? (
                        <td className={cx(styles.bodyCell, styles.actionsCell)}>
                          <div className={styles.actions}>{rowActions(row, index)}</div>
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {pagination ? (
            <div className={styles.pagination}>
              <span className={styles.paginationSummary}>
                {pagination.summary ?? `Page ${pagination.page} of ${pagination.totalPages}`}
              </span>
              <div className={styles.paginationActions}>
                <Button
                  disabled={pagination.page <= 1}
                  label="Previous"
                  size="sm"
                  variant="ghost"
                  onClick={() => pagination.onPageChange?.(pagination.page - 1)}
                />
                <Button
                  disabled={pagination.page >= pagination.totalPages}
                  label="Next"
                  size="sm"
                  variant="ghost"
                  onClick={() => pagination.onPageChange?.(pagination.page + 1)}
                />
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <div className={styles.emptyState}>
          {emptyState ?? <p className={styles.emptyText}>No records available.</p>}
        </div>
      )}
    </Card>
  );
}
