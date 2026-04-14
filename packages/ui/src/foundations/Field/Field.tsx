import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";
import styles from "./Field.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export type FieldType = "text" | "select" | "date" | "textarea" | "readOnly";

export interface FieldOption {
  label: string;
  value: string;
}

interface FieldInputProps {
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  value?: string;
}

export interface FieldProps extends FieldInputProps {
  label: string;
  type?: FieldType;
  options?: FieldOption[];
  helperText?: string;
  errorText?: string;
  readOnly?: boolean;
  id?: string;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "placeholder">;
  selectProps?: Omit<SelectHTMLAttributes<HTMLSelectElement>, "value">;
  textareaProps?: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "placeholder">;
  readOnlyContent?: ReactNode;
}

export function Field(props: FieldProps) {
  const {
    disabled = false,
    errorText,
    helperText,
    id,
    inputProps,
    label,
    options = [],
    placeholder,
    readOnly = false,
    readOnlyContent,
    required = false,
    selectProps,
    textareaProps,
    type = "text",
    value,
  } = props;

  const fieldId = id ?? `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const isReadOnly = readOnly || type === "readOnly";
  const hasError = Boolean(errorText);
  const describedBy = [
    helperText ? `${fieldId}-helper` : null,
    errorText ? `${fieldId}-error` : null
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <label className={styles.field} htmlFor={isReadOnly ? undefined : fieldId}>
      <span className={styles.labelRow}>
        <span className={styles.label}>{label}</span>
        {required ? <span className={styles.requiredMark}>Required</span> : null}
      </span>
      {isReadOnly ? (
        <div
          aria-live="polite"
          className={cx(styles.control, styles.readOnlyValue, hasError && styles.controlError)}
        >
          {readOnlyContent ?? value ?? "—"}
        </div>
      ) : null}
      {!isReadOnly && type === "text" ? (
        <input
          {...inputProps}
          aria-describedby={describedBy}
          aria-invalid={hasError || undefined}
          className={cx(styles.control, hasError && styles.controlError)}
          disabled={disabled}
          id={fieldId}
          placeholder={placeholder}
          required={required}
          type="text"
          value={value}
          onChange={inputProps?.onChange}
        />
      ) : null}
      {!isReadOnly && type === "date" ? (
        <input
          {...inputProps}
          aria-describedby={describedBy}
          aria-invalid={hasError || undefined}
          className={cx(styles.control, hasError && styles.controlError)}
          disabled={disabled}
          id={fieldId}
          required={required}
          type="date"
          value={value}
          onChange={inputProps?.onChange}
        />
      ) : null}
      {!isReadOnly && type === "select" ? (
        <select
          {...selectProps}
          aria-describedby={describedBy}
          aria-invalid={hasError || undefined}
          className={cx(styles.control, styles.select, hasError && styles.controlError)}
          disabled={disabled}
          id={fieldId}
          required={required}
          value={value}
          onChange={selectProps?.onChange}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
      {!isReadOnly && type === "textarea" ? (
        <textarea
          {...textareaProps}
          aria-describedby={describedBy}
          aria-invalid={hasError || undefined}
          className={cx(styles.control, styles.textarea, hasError && styles.controlError)}
          disabled={disabled}
          id={fieldId}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={textareaProps?.onChange}
        />
      ) : null}
      {helperText ? (
        <span className={styles.helperText} id={`${fieldId}-helper`}>
          {helperText}
        </span>
      ) : null}
      {errorText ? (
        <span className={styles.errorText} id={`${fieldId}-error`}>
          {errorText}
        </span>
      ) : null}
    </label>
  );
}
