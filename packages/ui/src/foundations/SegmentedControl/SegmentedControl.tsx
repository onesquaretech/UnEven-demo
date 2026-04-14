import {
  useEffect,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode
} from "react";
import styles from "./SegmentedControl.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export interface SegmentedControlItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export type SegmentedControlSize = "sm" | "md";

export interface SegmentedControlProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
  items: SegmentedControlItem[];
  activeValue?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  size?: SegmentedControlSize;
  stretch?: boolean;
}

function getFirstEnabledValue(items: SegmentedControlItem[]) {
  return items.find((item) => !item.disabled)?.value;
}

export function SegmentedControl(props: SegmentedControlProps) {
  const {
    activeValue,
    className,
    defaultValue,
    items,
    name,
    onValueChange,
    size = "md",
    stretch = false,
    ...groupProps
  } = props;

  const generatedId = useId();
  const groupName = name ?? `segmented-control-${generatedId.replace(/:/g, "")}`;
  const enabledFallback = useMemo(() => getFirstEnabledValue(items), [items]);
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? enabledFallback ?? items[0]?.value
  );
  const selectedValue = activeValue ?? uncontrolledValue ?? enabledFallback ?? items[0]?.value;

  useEffect(() => {
    if (!activeValue && !items.some((item) => item.value === uncontrolledValue && !item.disabled)) {
      setUncontrolledValue(enabledFallback ?? items[0]?.value);
    }
  }, [activeValue, enabledFallback, items, uncontrolledValue]);

  function commitValue(nextValue: string) {
    if (activeValue === undefined) {
      setUncontrolledValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  return (
    <div
      {...groupProps}
      className={cx(
        styles.group,
        size === "sm" && styles.sizeSm,
        size === "md" && styles.sizeMd,
        stretch && styles.stretch,
        className
      )}
      role="radiogroup"
    >
      {items.map((item) => {
        const optionId = `${groupName}-${item.value}`;

        return (
          <label
            className={cx(styles.item, item.disabled && styles.itemDisabled)}
            htmlFor={optionId}
            key={item.value}
          >
            <input
              checked={item.value === selectedValue}
              className={styles.input}
              disabled={item.disabled}
              id={optionId}
              name={groupName}
              onChange={() => {
                if (!item.disabled) {
                  commitValue(item.value);
                }
              }}
              type="radio"
              value={item.value}
            />
            <span className={styles.label}>{item.label}</span>
          </label>
        );
      })}
    </div>
  );
}
