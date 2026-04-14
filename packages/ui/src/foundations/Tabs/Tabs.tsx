import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent
} from "react";
import styles from "./Tabs.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export interface TabsItem {
  value: string;
  label: string;
  disabled?: boolean;
  metaLabel?: string;
}

export type TabsSize = "sm" | "md";

export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
  items: TabsItem[];
  activeValue?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: TabsSize;
  stretch?: boolean;
}

function getFirstEnabledValue(items: TabsItem[]) {
  return items.find((item) => !item.disabled)?.value;
}

export function Tabs(props: TabsProps) {
  const {
    activeValue,
    className,
    defaultValue,
    items,
    onValueChange,
    size = "md",
    stretch = false,
    ...tabListProps
  } = props;

  const generatedId = useId();
  const tabsId = generatedId.replace(/:/g, "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
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

  function moveSelection(currentIndex: number, direction: "next" | "previous" | "first" | "last") {
    if (items.length === 0) {
      return;
    }

    const enabledIndexes = items
      .map((item, index) => (item.disabled ? -1 : index))
      .filter((index) => index >= 0);

    if (enabledIndexes.length === 0) {
      return;
    }

    let targetIndex = enabledIndexes[0];

    if (direction === "first") {
      targetIndex = enabledIndexes[0];
    } else if (direction === "last") {
      targetIndex = enabledIndexes[enabledIndexes.length - 1];
    } else {
      const currentEnabledPosition = enabledIndexes.indexOf(currentIndex);
      const fallbackPosition = enabledIndexes.indexOf(
        items.findIndex((item) => item.value === selectedValue)
      );
      const startPosition = currentEnabledPosition >= 0 ? currentEnabledPosition : Math.max(fallbackPosition, 0);
      const offset = direction === "next" ? 1 : -1;
      const nextPosition =
        (startPosition + offset + enabledIndexes.length) % enabledIndexes.length;
      targetIndex = enabledIndexes[nextPosition];
    }

    const nextItem = items[targetIndex];
    if (!nextItem) {
      return;
    }

    commitValue(nextItem.value);
    tabRefs.current[targetIndex]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        moveSelection(index, "next");
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        moveSelection(index, "previous");
        break;
      case "Home":
        event.preventDefault();
        moveSelection(index, "first");
        break;
      case "End":
        event.preventDefault();
        moveSelection(index, "last");
        break;
      default:
        break;
    }
  }

  return (
    <div
      {...tabListProps}
      className={cx(
        styles.tabList,
        size === "sm" && styles.sizeSm,
        size === "md" && styles.sizeMd,
        stretch && styles.stretch,
        className
      )}
      role="tablist"
    >
      {items.map((item, index) => {
        const isSelected = item.value === selectedValue;

        return (
          <button
            key={item.value}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            aria-disabled={item.disabled || undefined}
            aria-selected={isSelected}
            className={cx(
              styles.tab,
              isSelected && styles.tabSelected,
              item.disabled && styles.tabDisabled
            )}
            disabled={item.disabled}
            id={`${tabsId}-${item.value}-tab`}
            onClick={() => {
              if (!item.disabled) {
                commitValue(item.value);
              }
            }}
            onKeyDown={(event) => {
              handleKeyDown(event, index);
            }}
            role="tab"
            tabIndex={isSelected ? 0 : -1}
            type="button"
          >
            <span className={styles.label}>{item.label}</span>
            {item.metaLabel ? <span className={styles.metaLabel}>{item.metaLabel}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
