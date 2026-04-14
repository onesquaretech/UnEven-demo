import {
  createContext,
  useContext,
  useMemo,
  type CSSProperties,
  type ReactNode
} from "react";

export type ThemeMode = "light" | "dark";
export type ThemeDensity = "compact" | "comfortable";

export interface ThemeBrandingInput {
  primaryColor?: string;
  accentColor?: string;
}

export interface ThemeTokensConfig {
  mode?: ThemeMode;
  density?: ThemeDensity;
  branding?: ThemeBrandingInput;
}

export interface ThemeSemanticColorScale {
  strong: string;
  soft: string;
}

export interface ThemeTextTokens {
  title: string;
  subtitle: string;
  body: string;
  caption: string;
  label: string;
  strong: string;
  muted: string;
}

export interface ThemeSpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export interface ThemeRadiusTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  pill: string;
}

export interface ThemeSizingTokens {
  controlSm: string;
  controlMd: string;
  controlLg: string;
  iconSm: string;
  iconMd: string;
  iconLg: string;
}

export interface ThemeLayoutTokens {
  gapSm: string;
  gapMd: string;
  gapLg: string;
  shellSidebarWidth: string;
  contentMaxWidth: string;
}

export interface ThemeResponsiveTokens {
  compactGap: string;
  comfortableGap: string;
  sectionSpacing: string;
  cardRadius: string;
}

export interface ThemeSurfaceTokens {
  page: string;
  panel: string;
  card: string;
  cardSubtle: string;
}

export interface ThemeBorderTokens {
  subtle: string;
  strong: string;
  focusRing: string;
  chipSelectedRing: string;
}

export interface ThemeShadowTokens {
  soft: string;
  strong: string;
}

export interface ThemeTokensValue {
  mode: ThemeMode;
  density: ThemeDensity;
  branding: Required<ThemeBrandingInput>;
  colors: {
    primary: ThemeSemanticColorScale;
    neutral: ThemeSemanticColorScale;
    success: ThemeSemanticColorScale;
    warning: ThemeSemanticColorScale;
    danger: ThemeSemanticColorScale;
    info: ThemeSemanticColorScale;
  };
  surfaces: ThemeSurfaceTokens;
  text: ThemeTextTokens;
  spacing: ThemeSpacingTokens;
  radius: ThemeRadiusTokens;
  sizing: ThemeSizingTokens;
  layout: ThemeLayoutTokens;
  responsive: ThemeResponsiveTokens;
  borders: ThemeBorderTokens;
  shadows: ThemeShadowTokens;
  cssVariables: Record<`--${string}`, string>;
}

export interface ThemeTokensProps extends ThemeTokensConfig {
  children: ReactNode;
  className?: string;
}

const LIGHT_DEFAULTS = {
  primaryColor: "#1f6feb",
  accentColor: "#0c9784",
  surfaces: {
    page: "#f4f7fb",
    panel: "rgba(255, 255, 255, 0.84)",
    card: "#ffffff",
    cardSubtle: "#edf3fb"
  },
  text: {
    title: "1.75rem",
    subtitle: "1.125rem",
    body: "1rem",
    caption: "0.875rem",
    label: "0.8125rem",
    strong: "#162033",
    muted: "#5f6980"
  },
  neutral: {
    soft: "#e7edf5",
    strong: "#4b5870"
  },
  success: {
    soft: "#dff6ea",
    strong: "#1d7a48"
  },
  warning: {
    soft: "#fff1d9",
    strong: "#9a6112"
  },
  danger: {
    soft: "#fde5e7",
    strong: "#aa3045"
  },
  info: {
    soft: "#e1efff",
    strong: "#205cb7"
  },
  borderSubtle: "rgba(25, 39, 58, 0.12)",
  borderStrong: "rgba(25, 39, 58, 0.2)",
  shadowSoft: "0 20px 45px rgba(23, 37, 63, 0.08)",
  shadowStrong: "0 24px 56px rgba(23, 37, 63, 0.14)"
} as const;

const DARK_DEFAULTS = {
  primaryColor: "#69a7ff",
  accentColor: "#3fd0b9",
  surfaces: {
    page: "#0e1625",
    panel: "rgba(20, 31, 48, 0.82)",
    card: "#172133",
    cardSubtle: "#111b2b"
  },
  text: {
    title: "1.75rem",
    subtitle: "1.125rem",
    body: "1rem",
    caption: "0.875rem",
    label: "0.8125rem",
    strong: "#f5f8ff",
    muted: "#98a4be"
  },
  neutral: {
    soft: "rgba(152, 164, 190, 0.18)",
    strong: "#c1cde2"
  },
  success: {
    soft: "rgba(56, 161, 105, 0.16)",
    strong: "#7fe2ae"
  },
  warning: {
    soft: "rgba(214, 158, 46, 0.16)",
    strong: "#f4c768"
  },
  danger: {
    soft: "rgba(229, 62, 62, 0.16)",
    strong: "#ff98a4"
  },
  info: {
    soft: "rgba(66, 153, 225, 0.16)",
    strong: "#88c6ff"
  },
  borderSubtle: "rgba(217, 230, 255, 0.1)",
  borderStrong: "rgba(217, 230, 255, 0.2)",
  shadowSoft: "0 24px 48px rgba(0, 0, 0, 0.28)",
  shadowStrong: "0 30px 60px rgba(0, 0, 0, 0.38)"
} as const;

const DENSITY_TOKENS: Record<
  ThemeDensity,
  {
    spacing: ThemeSpacingTokens;
    radius: ThemeRadiusTokens;
    sizing: ThemeSizingTokens;
    layout: ThemeLayoutTokens;
  }
> = {
  compact: {
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "0.75rem",
      lg: "1rem",
      xl: "1.25rem",
      xxl: "1.75rem"
    },
    radius: {
      sm: "0.5rem",
      md: "0.75rem",
      lg: "1rem",
      xl: "1.25rem",
      pill: "999px"
    },
    sizing: {
      controlSm: "2rem",
      controlMd: "2.5rem",
      controlLg: "3rem",
      iconSm: "0.875rem",
      iconMd: "1rem",
      iconLg: "1.25rem"
    },
    layout: {
      gapSm: "0.5rem",
      gapMd: "0.75rem",
      gapLg: "1rem",
      shellSidebarWidth: "15.5rem",
      contentMaxWidth: "80rem"
    }
  },
  comfortable: {
    spacing: {
      xs: "0.25rem",
      sm: "0.625rem",
      md: "0.875rem",
      lg: "1.125rem",
      xl: "1.5rem",
      xxl: "2rem"
    },
    radius: {
      sm: "0.625rem",
      md: "0.875rem",
      lg: "1.125rem",
      xl: "1.5rem",
      pill: "999px"
    },
    sizing: {
      controlSm: "2.25rem",
      controlMd: "2.75rem",
      controlLg: "3.25rem",
      iconSm: "1rem",
      iconMd: "1.125rem",
      iconLg: "1.375rem"
    },
    layout: {
      gapSm: "0.625rem",
      gapMd: "0.875rem",
      gapLg: "1.25rem",
      shellSidebarWidth: "17.5rem",
      contentMaxWidth: "84rem"
    }
  }
};

function normalizeHexColor(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  const shortHex = /^#([0-9a-f]{3})$/i;
  const fullHex = /^#([0-9a-f]{6})$/i;

  if (fullHex.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  const shortMatch = trimmed.match(shortHex);

  if (!shortMatch) {
    return null;
  }

  const [r, g, b] = shortMatch[1].split("");
  return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  return {
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16)
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  return `#${[r, g, b]
    .map((channel) =>
      Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, "0")
    )
    .join("")}`;
}

function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) {
    return { h: 0, s: 0, l: lightness };
  }

  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  let hue = 0;

  switch (max) {
    case red:
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
      break;
    case green:
      hue = (blue - red) / delta + 2;
      break;
    default:
      hue = (red - green) / delta + 4;
      break;
  }

  return { h: hue / 6, s: saturation, l: lightness };
}

function hslToRgb({ h, s, l }: { h: number; s: number; l: number }) {
  if (s === 0) {
    const channel = l * 255;
    return { r: channel, g: channel, b: channel };
  }

  const hueToRgb = (p: number, q: number, t: number) => {
    let wrapped = t;

    if (wrapped < 0) {
      wrapped += 1;
    }

    if (wrapped > 1) {
      wrapped -= 1;
    }

    if (wrapped < 1 / 6) {
      return p + (q - p) * 6 * wrapped;
    }

    if (wrapped < 1 / 2) {
      return q;
    }

    if (wrapped < 2 / 3) {
      return p + (q - p) * (2 / 3 - wrapped) * 6;
    }

    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: hueToRgb(p, q, h + 1 / 3) * 255,
    g: hueToRgb(p, q, h) * 255,
    b: hueToRgb(p, q, h - 1 / 3) * 255
  };
}

function shiftHexColor(
  hex: string,
  options: { saturationDelta?: number; lightnessDelta?: number }
): string {
  const hsl = rgbToHsl(hexToRgb(hex));

  return rgbToHex(
    hslToRgb({
      h: hsl.h,
      s: Math.max(0, Math.min(1, hsl.s + (options.saturationDelta ?? 0))),
      l: Math.max(0, Math.min(1, hsl.l + (options.lightnessDelta ?? 0)))
    })
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function createThemeTokens(config: ThemeTokensConfig = {}): ThemeTokensValue {
  const mode = config.mode ?? "light";
  const density = config.density ?? "comfortable";
  const defaults = mode === "dark" ? DARK_DEFAULTS : LIGHT_DEFAULTS;
  const densityTokens = DENSITY_TOKENS[density];
  const primaryColor = normalizeHexColor(config.branding?.primaryColor) ?? defaults.primaryColor;
  const accentColor = normalizeHexColor(config.branding?.accentColor) ?? defaults.accentColor;
  const accentStrong =
    mode === "dark"
      ? shiftHexColor(primaryColor, { saturationDelta: -0.04, lightnessDelta: 0.08 })
      : shiftHexColor(primaryColor, { saturationDelta: 0.02, lightnessDelta: -0.1 });
  const accentSoft = hexToRgba(primaryColor, mode === "dark" ? 0.16 : 0.12);
  const focusRing = hexToRgba(primaryColor, mode === "dark" ? 0.28 : 0.22);
  const chipSelectedRing = hexToRgba(primaryColor, mode === "dark" ? 0.24 : 0.18);

  const cssVariables: ThemeTokensValue["cssVariables"] = {
    "--accent": primaryColor,
    "--accent-strong": accentStrong,
    "--accent-2": accentColor,
    "--accent-soft": accentSoft,
    "--surface-page": defaults.surfaces.page,
    "--surface-panel": defaults.surfaces.panel,
    "--surface-raised": defaults.surfaces.card,
    "--surface-card": defaults.surfaces.card,
    "--surface-card-subtle": defaults.surfaces.cardSubtle,
    "--border-subtle": defaults.borderSubtle,
    "--border-strong": defaults.borderStrong,
    "--text-title": defaults.text.title,
    "--text-subtitle": defaults.text.subtitle,
    "--text-body": defaults.text.body,
    "--text-caption": defaults.text.caption,
    "--text-label": defaults.text.label,
    "--text-strong": defaults.text.strong,
    "--text-muted": defaults.text.muted,
    "--focus-ring": focusRing,
    "--success-soft": defaults.success.soft,
    "--success-strong": defaults.success.strong,
    "--warning-soft": defaults.warning.soft,
    "--warning-strong": defaults.warning.strong,
    "--danger-soft": defaults.danger.soft,
    "--danger-soft-strong":
      mode === "dark" ? hexToRgba(defaults.danger.strong, 0.24) : "#f7d1d6",
    "--danger-strong": defaults.danger.strong,
    "--info-soft": defaults.info.soft,
    "--info-strong": defaults.info.strong,
    "--neutral-soft": defaults.neutral.soft,
    "--neutral-strong": defaults.neutral.strong,
    "--chip-selected-ring": chipSelectedRing,
    "--shadow-soft": defaults.shadowSoft,
    "--shadow-strong": defaults.shadowStrong,
    "--space-1": densityTokens.spacing.xs,
    "--space-2": densityTokens.spacing.sm,
    "--space-3": densityTokens.spacing.md,
    "--space-4": densityTokens.spacing.lg,
    "--space-5": densityTokens.spacing.xl,
    "--space-6": densityTokens.spacing.xxl,
    "--radius-sm": densityTokens.radius.sm,
    "--radius-md": densityTokens.radius.md,
    "--radius-lg": densityTokens.radius.lg,
    "--radius-xl": densityTokens.radius.xl,
    "--radius-pill": densityTokens.radius.pill,
    "--size-control-sm": densityTokens.sizing.controlSm,
    "--size-control-md": densityTokens.sizing.controlMd,
    "--size-control-lg": densityTokens.sizing.controlLg,
    "--size-icon-sm": densityTokens.sizing.iconSm,
    "--size-icon-md": densityTokens.sizing.iconMd,
    "--size-icon-lg": densityTokens.sizing.iconLg,
    "--layout-gap-sm": densityTokens.layout.gapSm,
    "--layout-gap-md": densityTokens.layout.gapMd,
    "--layout-gap-lg": densityTokens.layout.gapLg,
    "--layout-shell-sidebar-width": densityTokens.layout.shellSidebarWidth,
    "--layout-content-max-width": densityTokens.layout.contentMaxWidth,
    "--responsive-gap": "clamp(0.75rem, 1vw + 0.5rem, 1.25rem)",
    "--responsive-section-space": "clamp(1rem, 1.4vw + 0.75rem, 2rem)",
    "--responsive-card-radius": "clamp(0.875rem, 0.5vw + 0.75rem, 1.25rem)"
  };

  return {
    mode,
    density,
    branding: {
      primaryColor,
      accentColor
    },
    colors: {
      primary: {
        strong: primaryColor,
        soft: accentSoft
      },
      neutral: defaults.neutral,
      success: defaults.success,
      warning: defaults.warning,
      danger: defaults.danger,
      info: defaults.info
    },
    surfaces: defaults.surfaces,
    text: defaults.text,
    spacing: densityTokens.spacing,
    radius: densityTokens.radius,
    sizing: densityTokens.sizing,
    layout: densityTokens.layout,
    responsive: {
      compactGap: "0.75rem",
      comfortableGap: "1.25rem",
      sectionSpacing: "clamp(1rem, 1.4vw + 0.75rem, 2rem)",
      cardRadius: "clamp(0.875rem, 0.5vw + 0.75rem, 1.25rem)"
    },
    borders: {
      subtle: defaults.borderSubtle,
      strong: defaults.borderStrong,
      focusRing,
      chipSelectedRing
    },
    shadows: {
      soft: defaults.shadowSoft,
      strong: defaults.shadowStrong
    },
    cssVariables
  };
}

const defaultThemeTokens = createThemeTokens();

const ThemeTokensContext = createContext<ThemeTokensValue>(defaultThemeTokens);

export function ThemeTokens({
  children,
  className,
  density,
  branding,
  mode
}: ThemeTokensProps) {
  const value = useMemo(
    () =>
      createThemeTokens({
        density,
        branding,
        mode
      }),
    [branding?.accentColor, branding?.primaryColor, density, mode]
  );

  return (
    <ThemeTokensContext.Provider value={value}>
      <div
        className={className}
        data-density={value.density}
        data-theme={value.mode}
        style={value.cssVariables as CSSProperties}
      >
        {children}
      </div>
    </ThemeTokensContext.Provider>
  );
}

export function useThemeTokens() {
  return useContext(ThemeTokensContext);
}
