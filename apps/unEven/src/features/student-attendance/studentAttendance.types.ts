import type {
  AppShellNavigationItem,
  FieldOption,
  ProgressBarTone,
  StatusChipTone,
  TenantContextInput
} from "../../ui";

export type StudentAttendanceRowStatus = "present" | "absent" | "leave";

export interface StudentAttendanceRow {
  id: string;
  rollNumber: string;
  studentName: string;
  studentMeta: string;
  initials: string;
  accent: "blue" | "violet" | "amber" | "rose" | "sky" | "emerald" | "indigo" | "pink";
  status: StudentAttendanceRowStatus;
  flagCount: number;
}

export interface StudentAttendanceQuickLink {
  id: string;
  label: string;
}

export interface StudentAttendanceFollowUp {
  id: string;
  title: string;
  detail: string;
  note: string;
  tone: StatusChipTone;
}

export interface StudentAttendanceSummaryMetric {
  id: string;
  label: string;
  value: string;
}

export interface StudentAttendanceStatusOption {
  value: StudentAttendanceRowStatus | "all";
  label: string;
}

export interface StudentAttendanceViewModel {
  tenant: TenantContextInput;
  title: string;
  description: string;
  navigation: AppShellNavigationItem[];
  classTeacherName: string;
  classTeacherRole: string;
  classValue: string;
  sectionValue: string;
  dateValue: string;
  searchPlaceholder: string;
  classOptions: FieldOption[];
  sectionOptions: FieldOption[];
  dateOptions: FieldOption[];
  statusFilterOptions: FieldOption[];
  markModeOptions: StudentAttendanceStatusOption[];
  bulkActions: Array<{
    id: StudentAttendanceRowStatus;
    label: string;
    tone: ProgressBarTone | "neutral";
  }>;
  actionLabels: {
    monthlyView: string;
    saveAttendance: string;
  };
  register: {
    title: string;
    description: string;
    paginationSummary: string;
  };
  summary: {
    presentPercentage: number;
    presentCount: number;
    absentCount: number;
    leaveCount: number;
    classStrength: number;
    absentNotificationLabel: string;
    metrics: StudentAttendanceSummaryMetric[];
    followUps: StudentAttendanceFollowUp[];
    quickLinks: StudentAttendanceQuickLink[];
    pendingChangesLabel: string;
    pendingChangesValue: string;
    pendingChangesNote: string;
  };
  rows: StudentAttendanceRow[];
}
