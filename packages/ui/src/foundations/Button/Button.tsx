import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button(props: ButtonProps) {
  const {
    className,
    disabled = false,
    fullWidth = false,
    iconLeft,
    iconRight,
    label,
    loading = false,
    size = "md",
    type = "button",
    variant = "primary",
    ...buttonProps
  } = props;

  const isDisabled = disabled || loading;

  return (
    <button
      {...buttonProps}
      aria-busy={loading || undefined}
      className={cx(
        styles.button,
        size === "sm" && styles.sizeSm,
        size === "md" && styles.sizeMd,
        size === "lg" && styles.sizeLg,
        variant === "primary" && styles.variantPrimary,
        variant === "secondary" && styles.variantSecondary,
        variant === "ghost" && styles.variantGhost,
        variant === "danger" && styles.variantDanger,
        fullWidth && styles.fullWidth,
        className
      )}
      disabled={isDisabled}
      type={type}
    >
      {loading ? (
        <span aria-hidden="true" className={styles.spinner} />
      ) : iconLeft ? (
        <span aria-hidden="true" className={styles.icon}>
          {iconLeft}
        </span>
      ) : null}
      <span className={cx(styles.label, loading && styles.labelLoading)}>{label}</span>
      {!loading && iconRight ? (
        <span aria-hidden="true" className={styles.icon}>
          {iconRight}
        </span>
      ) : null}
    </button>
  );
}
