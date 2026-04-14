import type {
  AppShellNavigationItem,
  FieldOption,
  FileUploadListItem,
  StepProgressStep,
  TenantContextInput
} from "../../ui";

export interface StudentAdmissionFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  admissionNumber: string;
  bloodGroup: string;
  guardianName: string;
  motherName: string;
  contactNumber: string;
  emailAddress: string;
  relationship: string;
  occupation: string;
  classApplyingFor: string;
  academicYear: string;
  previousSchoolName: string;
  lastClassCompleted: string;
  addressLine: string;
  addressLandmark: string;
  city: string;
  state: string;
  pincode: string;
  medicalNotes: string;
}

export interface StudentAdmissionChecklistItem {
  id: string;
  label: string;
  statusLabel: string;
  statusTone: "success" | "info" | "neutral";
}

export interface StudentAdmissionViewModel {
  tenant: TenantContextInput;
  title: string;
  description: string;
  navigation: AppShellNavigationItem[];
  steps: StepProgressStep[];
  activeStepId: string;
  form: StudentAdmissionFormData;
  genderOptions: FieldOption[];
  bloodGroupOptions: FieldOption[];
  relationshipOptions: FieldOption[];
  academicYearOptions: FieldOption[];
  classOptions: FieldOption[];
  lastClassOptions: FieldOption[];
  summaryStatusLabel: string;
  summaryStatusTone: "warning" | "success";
  completionValue: number;
  completionLabel: string;
  completionHint: string;
  documents: FileUploadListItem[];
  checklist: StudentAdmissionChecklistItem[];
  applicantSummaryLabel: string;
  footerTitle: string;
  footerDescription: string;
}
