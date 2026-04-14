import type { HTMLAttributes, ReactNode } from "react";
import styles from "./PageHeader.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export interface PageHeaderProps
  extends Omit<HTMLAttributes<HTMLElement>, "children" | "title"> {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  search?: ReactNode;
}

export function PageHeader(props: PageHeaderProps) {
  const { actions, className, description, meta, search, title, ...elementProps } = props;
  const hasSecondaryRow = Boolean(meta) || Boolean(search);

  return (
    <header {...elementProps} className={cx(styles.header, className)}>
      <div className={styles.primaryRow}>
        <div className={styles.copy}>
          <h1 className={styles.title}>{title}</h1>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>

      {hasSecondaryRow ? (
        <div className={styles.secondaryRow}>
          {meta ? <div className={styles.meta}>{meta}</div> : null}
          {search ? <div className={styles.search}>{search}</div> : null}
        </div>
      ) : null}
    </header>
  );
}
