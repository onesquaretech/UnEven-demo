import type { CSSProperties, HTMLAttributes } from "react";
import styles from "./AvatarBadge.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export type AvatarBadgeSize = "sm" | "md" | "lg";

export interface AvatarBadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  name: string;
  imageUrl?: string;
  size?: AvatarBadgeSize;
  colorSeed?: string;
  imageAlt?: string;
}

const fallbackPalette = [
  ["#1f6feb", "#0c9784"],
  ["#8a5cf6", "#2563eb"],
  ["#ea580c", "#d97706"],
  ["#0f766e", "#0891b2"],
  ["#be185d", "#7c3aed"],
  ["#2f855a", "#2b6cb0"]
] as const;

function normalizeInitials(name: string) {
  const tokens = name.trim().split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return "?";
  }

  if (tokens.length === 1) {
    return tokens[0].slice(0, 2).toUpperCase();
  }

  return `${tokens[0][0] ?? ""}${tokens[tokens.length - 1][0] ?? ""}`.toUpperCase();
}

function pickPalette(colorSeed: string) {
  let total = 0;

  for (const char of colorSeed) {
    total += char.charCodeAt(0);
  }

  return fallbackPalette[total % fallbackPalette.length];
}

export function AvatarBadge(props: AvatarBadgeProps) {
  const {
    className,
    colorSeed,
    imageAlt,
    imageUrl,
    name,
    size = "md",
    style,
    ...spanProps
  } = props;

  const initials = normalizeInitials(name);
  const [colorStart, colorEnd] = pickPalette(colorSeed ?? name);
  const mergedStyle: CSSProperties & {
    "--avatar-color-start": string;
    "--avatar-color-end": string;
  } = {
    ...(style ?? {}),
    "--avatar-color-start": colorStart,
    "--avatar-color-end": colorEnd
  };

  return (
    <span
      {...spanProps}
      aria-label={name}
      className={cx(
        styles.avatar,
        size === "sm" && styles.sizeSm,
        size === "md" && styles.sizeMd,
        size === "lg" && styles.sizeLg,
        className
      )}
      style={mergedStyle}
      title={name}
    >
      {imageUrl ? (
        <img
          alt={imageAlt ?? `${name} avatar`}
          className={styles.image}
          draggable={false}
          src={imageUrl}
        />
      ) : (
        <span aria-hidden="true" className={styles.initials}>
          {initials}
        </span>
      )}
    </span>
  );
}
