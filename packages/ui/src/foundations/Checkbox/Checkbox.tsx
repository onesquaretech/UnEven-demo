import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./Checkbox.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "type"> {
  label: string;
  description?: ReactNode;
}

export function Checkbox(props: CheckboxProps) {
  const {
    checked,
    className,
    description,
    disabled = false,
    id,
    label,
    ...inputProps
  } = props;

  const checkboxId = id ?? `checkbox-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <label className={cx(styles.wrapper, disabled && styles.wrapperDisabled, className)} htmlFor={checkboxId}>
      <span className={styles.controlWrap}>
        <input
          {...inputProps}
          checked={checked}
          className={styles.input}
          disabled={disabled}
          id={checkboxId}
          type="checkbox"
        />
        <span aria-hidden="true" className={styles.control}>
          <svg className={styles.icon} fill="none" viewBox="0 0 16 16">
            <path
              d="M3.5 8.5L6.5 11.5L12.5 4.75"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </span>
      </span>
      <span className={styles.content}>
        <span className={styles.label}>{label}</span>
        {description ? <span className={styles.description}>{description}</span> : null}
      </span>
    </label>
  );
}
