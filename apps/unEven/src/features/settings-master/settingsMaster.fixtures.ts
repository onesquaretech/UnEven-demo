import type {
  SettingsAcademicYearRecord,
  SettingsBrandingProfile,
  SettingsMasterSection,
  SettingsPageViewModel,
  SettingsRoleRecord,
  SettingsShellNavigationItem,
  SettingsSimpleMasterRecord,
  SettingsTransportRouteRecord
} from "./settingsMaster.types";

export const settingsMasterTenant: SettingsPageViewModel["tenant"] = {
  tenantId: "tenant_greenfield_main",
  display: {
    displayName: "Greenfield Senior Secondary School",
    shortName: "Greenfield",
    legalName: "Greenfield Senior Secondary School Trust"
  },
  locale: "en-IN",
  timezone: "Asia/Kolkata",
  currency: "INR",
  themePreference: "light",
  enabledModules: [
    "dashboard",
    "students",
    "attendance",
    "fees",
    "notices",
    "transport",
    "reports",
    "settings"
  ],
  branding: {
    primaryColor: "#0ea5a4",
    accentColor: "#14b8a6"
  },
  contact: {
    email: "info@greenfield.edu",
    phone: "+91 98765 44120",
    address: "Rose Avenue Campus, Jaipur"
  },
  documents: {
    headerTitle: "Greenfield Senior Secondary School",
    footerText: "Managed centrally by the school administration."
  }
};

const navigation: SettingsShellNavigationItem[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "admissions", label: "Admissions" },
  { id: "students", label: "Students" },
  { id: "attendance", label: "Attendance" },
  { id: "allocation", label: "Class Allocation" },
  { id: "transport", label: "Transport" },
  { id: "reports", label: "Reports" }
];

const setupSections: SettingsMasterSection[] = [
  {
    id: "school-profile",
    label: "School Profile",
    description: "Identity and contact details",
    itemCountLabel: "Core"
  },
  {
    id: "branding",
    label: "Branding",
    description: "Documents, locale, and tenant defaults",
    itemCountLabel: "Locale"
  },
  {
    id: "academic-year",
    label: "Academic Year",
    description: "Active and closed sessions",
    itemCountLabel: "2 years"
  },
  {
    id: "class-master",
    label: "Class Master",
    description: "Operational class labels",
    itemCountLabel: "6 classes"
  },
  {
    id: "section-master",
    label: "Section Master",
    description: "Reusable section labels",
    itemCountLabel: "4 sections"
  },
  {
    id: "fee-heads",
    label: "Fee Heads",
    description: "Charge categories and defaults",
    itemCountLabel: "5 heads"
  },
  {
    id: "user-roles",
    label: "User Roles",
    description: "Role templates and access intent",
    itemCountLabel: "4 roles"
  },
  {
    id: "notice-categories",
    label: "Notice Categories",
    description: "Reusable publishing tags",
    itemCountLabel: "4 tags"
  },
  {
    id: "transport-routes",
    label: "Transport Routes",
    description: "Route master records",
    itemCountLabel: "3 routes"
  }
];

const academicYears: SettingsAcademicYearRecord[] = [
  {
    id: "ay-2026",
    label: "2026-27",
    status: "active",
    startDate: "2026-04-01",
    endDate: "2027-03-31"
  },
  {
    id: "ay-2025",
    label: "2025-26",
    status: "closed",
    startDate: "2025-04-01",
    endDate: "2026-03-31"
  }
];

const classes: SettingsSimpleMasterRecord[] = [
  { id: "class-grade1", label: "Grade 1", helper: "Primary foundation" },
  { id: "class-grade2", label: "Grade 2", helper: "Primary progression" },
  { id: "class-grade5", label: "Grade 5", helper: "Upper primary" },
  { id: "class-grade8", label: "Grade 8", helper: "Middle school" },
  { id: "class-grade10", label: "Grade 10", helper: "Board preparation" },
  { id: "class-grade12", label: "Grade 12", helper: "Senior secondary" }
];

const sectionsMaster: SettingsSimpleMasterRecord[] = [
  { id: "section-a", label: "Section A", helper: "General allocation" },
  { id: "section-b", label: "Section B", helper: "General allocation" },
  { id: "section-c", label: "Section C", helper: "Overflow / balancing" },
  { id: "section-d", label: "Section D", helper: "Senior batches only" }
];

const feeHeads: SettingsSimpleMasterRecord[] = [
  { id: "fee-tuition", label: "Tuition Fee", helper: "Recurring monthly charge" },
  { id: "fee-transport", label: "Transport Fee", helper: "Linked to route assignment" },
  { id: "fee-annual", label: "Annual Charge", helper: "Once per academic year" },
  { id: "fee-exam", label: "Examination Fee", helper: "Assessment cycle charge" },
  { id: "fee-activity", label: "Activity Fee", helper: "Optional enrichment programs" }
];

const userRoles: SettingsRoleRecord[] = [
  { id: "role-admin", label: "Admin", summary: "Full school configuration and operations access", status: "active" },
  { id: "role-principal", label: "Principal", summary: "Approvals, visibility, and publishing oversight", status: "active" },
  { id: "role-teacher", label: "Teacher", summary: "Attendance, notices, and classroom-facing work", status: "active" },
  { id: "role-accountant", label: "Accountant", summary: "Fees, payment posting, and receipts", status: "draft" }
];

const noticeCategories: SettingsSimpleMasterRecord[] = [
  { id: "notice-general", label: "General", helper: "Whole-school announcements" },
  { id: "notice-fee", label: "Fee", helper: "Dues and payment communication" },
  { id: "notice-transport", label: "Transport", helper: "Route and pickup updates" },
  { id: "notice-exam", label: "Exam", helper: "Assessments and timetable notices" }
];

const transportRoutes: SettingsTransportRouteRecord[] = [
  { id: "route-1", label: "Route 1", summary: "North corridor · 3 stops · 42 seats", status: "active" },
  { id: "route-2", label: "Route 2", summary: "Central corridor · 4 stops · 38 seats", status: "active" },
  { id: "route-3", label: "Route 3", summary: "South corridor · draft planning route", status: "draft" }
];

const brandingProfile: SettingsBrandingProfile = {
  shortName: "Greenfield",
  documentHeaderTitle: "Greenfield Senior Secondary School",
  documentFooterText: "System-generated document valid without manual signature.",
  locale: "en-IN",
  timezone: "Asia/Kolkata",
  currency: "INR"
};

export const settingsMasterViewModelFixture: SettingsPageViewModel = {
  tenant: settingsMasterTenant,
  title: "Settings & Masters",
  description:
    "Manage essential school setup, master data, and reusable configuration from one structured workspace.",
  navigation,
  sections: setupSections,
  schoolProfile: {
    schoolName: "Greenfield Senior Secondary School",
    schoolCode: "GFSS-MAIN",
    contactEmail: "info@greenfield.edu",
    phone: "+91 98765 44120",
    campusAddress: "Rose Avenue Campus, Jaipur, Rajasthan"
  },
  brandingProfile,
  academicYears,
  classes,
  sectionsMaster,
  feeHeads,
  userRoles,
  noticeCategories,
  transportRoutes
};
