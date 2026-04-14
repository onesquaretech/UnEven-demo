import type {
  AppShellNavigationItem,
  FieldOption,
  StatusChipTone,
  TenantContextInput
} from "../../ui";

export interface ClassSectionAllocationRow {
  id: string;
  studentName: string;
  studentMeta: string;
  initials: string;
  accent: "blue" | "violet" | "amber" | "rose" | "sky" | "emerald";
  admissionNumber: string;
  currentPlacement: string;
  targetPlacement: string;
  statusLabel: string;
  statusTone: StatusChipTone;
  selected: boolean;
}

export interface ClassSectionSeatCard {
  id: string;
  label: string;
  occupiedLabel: string;
  seatsLeftLabel: string;
  occupiedValue: number;
  capacityValue: number;
  tone: "accent" | "success" | "warning";
}

export interface ClassSectionPendingSummary {
  selectedStudentsLabel: string;
  selectedStudentsValue: string;
  targetSectionLabel: string;
  targetSectionValue: string;
  note: string;
}

export interface ClassSectionAllocationViewModel {
  tenant: TenantContextInput;
  title: string;
  description: string;
  navigation: AppShellNavigationItem[];
  saveActionLabel: string;
  searchPlaceholder: string;
  academicYearOptions: FieldOption[];
  classOptions: FieldOption[];
  sectionOptions: FieldOption[];
  queueFilterOptions: FieldOption[];
  bulkTargetOptions: FieldOption[];
  helperFilterOptions: FieldOption[];
  appliedFilters: Array<{
    id: string;
    label: string;
    tone: StatusChipTone;
  }>;
  listedCountLabel: string;
  bulkSummaryLabel: string;
  bulkAssignLabel: string;
  clearSelectionLabel: string;
  seatAvailabilityLabel: string;
  tableTitle: string;
  tableDescription: string;
  paginationSummary: string;
  rows: ClassSectionAllocationRow[];
  seatCards: ClassSectionSeatCard[];
  pendingSummary: ClassSectionPendingSummary;
  operationalNoteTitle: string;
  operationalNoteBody: string;
}
