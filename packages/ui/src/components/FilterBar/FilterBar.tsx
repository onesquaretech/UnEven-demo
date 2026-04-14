import { Children, type HTMLAttributes, type ReactNode } from "react";
import styles from "./FilterBar.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export type FilterBarWrapMode = "wrap" | "scroll";
export type FilterBarActionPlacement = "inline" | "stacked";

export interface FilterBarProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  children: ReactNode;
  actions?: ReactNode;
  overflowActions?: ReactNode;
  wrapMode?: FilterBarWrapMode;
  actionPlacement?: FilterBarActionPlacement;
}

export function FilterBar(props: FilterBarProps) {
  const {
    actionPlacement = "inline",
    actions,
    children,
    className,
    overflowActions,
    wrapMode = "wrap",
    ...elementProps
  } = props;

  const controlItems = Children.toArray(children);
  const hasActions = Boolean(actions) || Boolean(overflowActions);

  return (
    <section
      {...elementProps}
      className={cx(
        styles.bar,
        wrapMode === "scroll" && styles.wrapModeScroll,
        actionPlacement === "stacked" && styles.actionPlacementStacked,
        className
      )}
    >
      <div className={styles.inner}>
        <div className={styles.controls}>
          {controlItems.map((child, index) => (
            <div className={styles.item} key={index}>
              {child}
            </div>
          ))}
        </div>

        {hasActions ? (
          <div className={styles.actionsArea}>
            {overflowActions ? <div className={styles.overflow}>{overflowActions}</div> : null}
            {actions ? <div className={styles.actions}>{actions}</div> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
