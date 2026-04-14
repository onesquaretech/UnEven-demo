import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  ThemeTokens,
  type ThemeBrandingInput,
  type ThemeDensity,
  type ThemeMode
} from "../ThemeTokens/ThemeTokens";

export interface TenantDisplayInfo {
  legalName?: string;
  displayName: string;
  shortName?: string;
}

export interface TenantBrandingAssets {
  logoSrc?: string;
  iconSrc?: string;
}

export interface TenantDocumentMetadata {
  headerTitle?: string;
  headerSubtitle?: string;
  footerText?: string;
  verificationNote?: string;
}

export interface TenantContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

export interface TenantContextInput {
  tenantId: string;
  display: TenantDisplayInfo;
  branding?: ThemeBrandingInput & TenantBrandingAssets;
  locale: string;
  timezone: string;
  currency: string;
  enabledModules?: readonly string[];
  themePreference?: ThemeMode;
  density?: ThemeDensity;
  documents?: TenantDocumentMetadata;
  contact?: TenantContactInfo;
}

export interface TenantContextValue {
  tenantId: string;
  display: Readonly<Required<TenantDisplayInfo>>;
  branding: Readonly<Required<ThemeBrandingInput> & TenantBrandingAssets>;
  locale: string;
  timezone: string;
  currency: string;
  enabledModules: readonly string[];
  themePreference: ThemeMode;
  density: ThemeDensity;
  documents: Readonly<TenantDocumentMetadata>;
  contact: Readonly<TenantContactInfo>;
}

export interface TenantContextProviderProps {
  children: ReactNode;
  className?: string;
  value: TenantContextInput;
}

function normalizeText(value: string | undefined, fallback = ""): string {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

function normalizeModules(modules: readonly string[] | undefined): readonly string[] {
  if (!modules) {
    return [];
  }

  return Array.from(
    new Set(
      modules
        .map((moduleName) => normalizeText(moduleName).toLowerCase())
        .filter((moduleName) => moduleName.length > 0)
    )
  );
}

export function normalizeTenantContext(input: TenantContextInput): TenantContextValue {
  const displayName = normalizeText(input.display.displayName, "Unnamed School");
  const shortName = normalizeText(input.display.shortName, displayName);

  return {
    tenantId: normalizeText(input.tenantId, "unknown-tenant"),
    display: {
      displayName,
      legalName: normalizeText(input.display.legalName, displayName),
      shortName
    },
    branding: {
      primaryColor: normalizeText(input.branding?.primaryColor),
      accentColor: normalizeText(input.branding?.accentColor),
      logoSrc: normalizeText(input.branding?.logoSrc),
      iconSrc: normalizeText(input.branding?.iconSrc)
    },
    locale: normalizeText(input.locale, "en-US"),
    timezone: normalizeText(input.timezone, "UTC"),
    currency: normalizeText(input.currency, "USD").toUpperCase(),
    enabledModules: normalizeModules(input.enabledModules),
    themePreference: input.themePreference ?? "light",
    density: input.density ?? "comfortable",
    documents: {
      headerTitle: normalizeText(input.documents?.headerTitle),
      headerSubtitle: normalizeText(input.documents?.headerSubtitle),
      footerText: normalizeText(input.documents?.footerText),
      verificationNote: normalizeText(input.documents?.verificationNote)
    },
    contact: {
      email: normalizeText(input.contact?.email),
      phone: normalizeText(input.contact?.phone),
      address: normalizeText(input.contact?.address)
    }
  };
}

const defaultTenantContext = normalizeTenantContext({
  tenantId: "demo-tenant",
  display: {
    displayName: "Greenfield Public School"
  },
  locale: "en-IN",
  timezone: "Asia/Kolkata",
  currency: "INR",
  enabledModules: ["dashboard", "fees", "attendance"],
  themePreference: "light",
  documents: {
    headerTitle: "Greenfield Public School",
    footerText: "This document is system-generated."
  }
});

const TenantContext = createContext<TenantContextValue>(defaultTenantContext);

export function TenantContextProvider({
  children,
  className,
  value
}: TenantContextProviderProps) {
  const normalizedValue = useMemo(() => normalizeTenantContext(value), [value]);

  return (
    <TenantContext.Provider value={normalizedValue}>
      <ThemeTokens
        branding={{
          accentColor: normalizedValue.branding.accentColor,
          primaryColor: normalizedValue.branding.primaryColor
        }}
        className={className}
        density={normalizedValue.density}
        mode={normalizedValue.themePreference}
      >
        {children}
      </ThemeTokens>
    </TenantContext.Provider>
  );
}

export function useTenantContext() {
  return useContext(TenantContext);
}

export function useTenantIdentity() {
  const { display, tenantId } = useTenantContext();
  return { display, tenantId };
}

export function useTenantBranding() {
  return useTenantContext().branding;
}

export function useTenantLocalization() {
  const { currency, locale, timezone } = useTenantContext();
  return { currency, locale, timezone };
}

export function useTenantModules() {
  return useTenantContext().enabledModules;
}

export function useTenantDocuments() {
  return useTenantContext().documents;
}

export function useTenantModuleEnabled(moduleName: string) {
  return useTenantContext().enabledModules.includes(moduleName.trim().toLowerCase());
}
