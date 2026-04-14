import type { ElementType, HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export type CardPadding = "none" | "sm" | "md" | "lg";
export type CardElevation = "subtle" | "raised";

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  as?: ElementType;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  padding?: CardPadding;
  elevation?: CardElevation;
  children?: ReactNode;
}

export function Card(props: CardProps) {
  const {
    actions,
    as,
    children,
    className,
    description,
    elevation = "raised",
    padding = "md",
    title,
    ...elementProps
  } = props;

  const Component = as ?? "section";
  const hasHeader = Boolean(title) || Boolean(description) || Boolean(actions);

  return (
    <Component
      {...elementProps}
      className={cx(
        styles.card,
        padding === "none" && styles.paddingNone,
        padding === "sm" && styles.paddingSm,
        padding === "md" && styles.paddingMd,
        padding === "lg" && styles.paddingLg,
        elevation === "subtle" && styles.elevationSubtle,
        elevation === "raised" && styles.elevationRaised,
        className
      )}
    >
      {hasHeader ? (
        <header className={styles.header}>
          <div className={styles.headerBody}>
            {title ? <h3 className={styles.title}>{title}</h3> : null}
            {description ? <p className={styles.description}>{description}</p> : null}
          </div>
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </header>
      ) : null}
      {children ? <div className={styles.content}>{children}</div> : null}
    </Component>
  );
}
