import type { AppShellNavigationItem, StatusChipTone, TenantContextInput } from "../../ui";

export interface StudentManagementListFilterOption {
  label: string;
  value: string;
}

export interface StudentManagementListRowAction {
  id: string;
  label: string;
}

export interface StudentManagementListRow {
  id: string;
  studentName: string;
  emailAddress: string;
  initials: string;
  accent: "blue" | "violet" | "amber" | "rose" | "sky" | "emerald" | "indigo";
  admissionNumber: string;
  classLabel: string;
  sectionLabel: string;
  parentName: string;
  feeStatusLabel: string;
  feeStatusTone: StatusChipTone;
  statusLabel: string;
  statusTone: StatusChipTone;
  actions: StudentManagementListRowAction[];
}

export interface StudentManagementListSummaryMetric {
  id: string;
  label: string;
  value: string;
  deltaLabel: string;
  deltaTone: StatusChipTone;
}

export interface StudentManagementListNote {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  tone: "accent" | "warning";
}

export interface StudentManagementListViewModel {
  tenant: TenantContextInput;
  title: string;
  description: string;
  navigation: AppShellNavigationItem[];
  bulkActionLabel: string;
  primaryActionLabel: string;
  searchPlaceholder: string;
  classOptions: StudentManagementListFilterOption[];
  sectionOptions: StudentManagementListFilterOption[];
  statusOptions: StudentManagementListFilterOption[];
  yearOptions: StudentManagementListFilterOption[];
  appliedFilterLabels: string[];
  summaryLabel: string;
  selectedSummaryLabel: string;
  bulkActions: Array<{ id: string; label: string }>;
  tableTitle: string;
  tableDescription: string;
  rows: StudentManagementListRow[];
  summaryMetrics: StudentManagementListSummaryMetric[];
  notes: StudentManagementListNote[];
  pagination: {
    page: number;
    totalPages: number;
    summary: string;
  };
}
