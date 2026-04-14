import type { TenantContextInput } from "../../ui";

export type SettingsMasterSectionId =
  | "school-profile"
  | "branding"
  | "academic-year"
  | "class-master"
  | "section-master"
  | "fee-heads"
  | "user-roles"
  | "notice-categories"
  | "transport-routes";

export interface SettingsShellNavigationItem {
  id: string;
  label: string;
  meta?: string;
  active?: boolean;
}

export interface SettingsMasterSection {
  id: SettingsMasterSectionId;
  label: string;
  description: string;
  itemCountLabel?: string;
}

export interface SettingsSchoolProfile {
  schoolName: string;
  schoolCode: string;
  contactEmail: string;
  phone: string;
  campusAddress: string;
}

export interface SettingsBrandingProfile {
  shortName: string;
  documentHeaderTitle: string;
  documentFooterText: string;
  locale: string;
  timezone: string;
  currency: string;
}

export interface SettingsAcademicYearRecord {
  id: string;
  label: string;
  status: "active" | "closed" | "draft";
  startDate: string;
  endDate: string;
}

export interface SettingsSimpleMasterRecord {
  id: string;
  label: string;
  helper?: string;
}

export interface SettingsRoleRecord {
  id: string;
  label: string;
  summary: string;
  status: "active" | "draft";
}

export interface SettingsTransportRouteRecord {
  id: string;
  label: string;
  summary: string;
  status: "active" | "draft";
}

export interface SettingsPageViewModel {
  tenant: TenantContextInput;
  title: string;
  description: string;
  navigation: SettingsShellNavigationItem[];
  sections: SettingsMasterSection[];
  schoolProfile: SettingsSchoolProfile;
  brandingProfile: SettingsBrandingProfile;
  academicYears: SettingsAcademicYearRecord[];
  classes: SettingsSimpleMasterRecord[];
  sectionsMaster: SettingsSimpleMasterRecord[];
  feeHeads: SettingsSimpleMasterRecord[];
  userRoles: SettingsRoleRecord[];
  noticeCategories: SettingsSimpleMasterRecord[];
  transportRoutes: SettingsTransportRouteRecord[];
}
