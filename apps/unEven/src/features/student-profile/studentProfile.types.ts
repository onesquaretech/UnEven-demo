import type {
  ActivityFeedItem,
  AppShellNavigationItem,
  FileUploadListItem,
  StatusChipTone,
  TenantContextInput,
  TabsItem
} from "../../ui";

export interface StudentProfileSummaryMetric {
  id: string;
  label: string;
  value: string;
  meta: string;
}

export interface StudentProfileIdentity {
  studentName: string;
  admissionNumber: string;
  rollNumber: string;
  classLabel: string;
  avatarSeed: string;
  statusChips: Array<{
    id: string;
    label: string;
    tone: StatusChipTone;
  }>;
  summaryMetrics: StudentProfileSummaryMetric[];
}

export interface StudentProfileInfoField {
  id: string;
  label: string;
  value: string;
}

export interface StudentProfileGuardianCard {
  id: string;
  label: string;
  name: string;
  meta: string;
}

export interface StudentProfileAttendanceSummary {
  percentage: number;
  valueLabel: string;
  stats: Array<{
    id: string;
    label: string;
    value: string;
  }>;
}

export interface StudentProfileFeeMetric {
  id: string;
  label: string;
  value: string;
}

export interface StudentProfileViewModel {
  tenant: TenantContextInput;
  title: string;
  description: string;
  navigation: AppShellNavigationItem[];
  tabs: TabsItem[];
  identity: StudentProfileIdentity;
  personalInfo: {
    title: string;
    description: string;
    fields: StudentProfileInfoField[];
    fullWidthField: StudentProfileInfoField;
  };
  academicInfo: {
    title: string;
    description: string;
    fields: StudentProfileInfoField[];
    footerField: StudentProfileInfoField;
  };
  guardianInfo: {
    title: string;
    description: string;
    guardians: StudentProfileGuardianCard[];
  };
  attendanceSummary: StudentProfileAttendanceSummary;
  feeSummary: {
    title: string;
    description: string;
    metrics: StudentProfileFeeMetric[];
    footerNote: string;
  };
  documents: FileUploadListItem[];
  transport: {
    title: string;
    detail: string;
    note: string;
  };
  activity: ActivityFeedItem[];
}
