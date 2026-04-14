import type { ClassSectionAllocationViewModel } from "./classSectionAllocation.types";

export const classSectionAllocationTenant: ClassSectionAllocationViewModel["tenant"] = {
  tenantId: "tenant_scholr_main",
  display: {
    displayName: "Scholr Demonstration School",
    shortName: "Scholr",
    legalName: "Scholr Demonstration School Trust"
  },
  locale: "en-IN",
  timezone: "Asia/Kolkata",
  currency: "INR",
  themePreference: "light",
  enabledModules: [
    "dashboard",
    "admissions",
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
    email: "ops@scholr.school",
    phone: "+91 99888 44221",
    address: "Riverfront Campus, Jaipur"
  },
  documents: {
    headerTitle: "Scholr Demonstration School",
    footerText: "Allocation changes remain in draft until saved by the administrator."
  }
};

const navigation: ClassSectionAllocationViewModel["navigation"] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "admissions", label: "Admissions" },
  { id: "students", label: "Students" },
  { id: "attendance", label: "Attendance" },
  { id: "allocation", label: "Class Allocation", active: true },
  { id: "transport", label: "Transport" },
  { id: "reports", label: "Reports" }
];

export const classSectionAllocationViewModelFixture: ClassSectionAllocationViewModel = {
  tenant: classSectionAllocationTenant,
  title: "Class & Section Allocation",
  description: "Assign and reassign students to sections with seat visibility and bulk actions",
  navigation,
  saveActionLabel: "Save Changes",
  searchPlaceholder: "Search student name or admission number",
  academicYearOptions: [
    { label: "2026-27", value: "2026-27" },
    { label: "2025-26", value: "2025-26" }
  ],
  classOptions: [
    { label: "Grade 5", value: "grade-5" },
    { label: "Grade 4", value: "grade-4" },
    { label: "Grade 6", value: "grade-6" }
  ],
  sectionOptions: [
    { label: "Section A", value: "5-A" },
    { label: "Section B", value: "5-B" },
    { label: "Section C", value: "5-C" }
  ],
  queueFilterOptions: [
    { label: "Unassigned Only", value: "unassigned" },
    { label: "All Eligible", value: "all" }
  ],
  bulkTargetOptions: [
    { label: "Assign to 5-A", value: "5-A" },
    { label: "Assign to 5-B", value: "5-B" },
    { label: "Assign to 5-C", value: "5-C" }
  ],
  helperFilterOptions: [
    { label: "Admission Status", value: "admission-status" },
    { label: "Unassigned Students", value: "unassigned-only" }
  ],
  appliedFilters: [
    { id: "target", label: "Target: 5-A", tone: "info" },
    { id: "unassigned", label: "Unassigned", tone: "neutral" },
    { id: "approved", label: "Admission: Approved", tone: "neutral" }
  ],
  listedCountLabel: "28 students listed",
  bulkSummaryLabel: "4 students selected",
  bulkAssignLabel: "Bulk Assign",
  clearSelectionLabel: "Clear selection",
  seatAvailabilityLabel: "5-A: 3 · 5-B: 6 · 5-C: 1",
  tableTitle: "Student Reassignment",
  tableDescription: "Select students and update target class and section before saving changes",
  paginationSummary: "Showing 6 of 28 students",
  rows: [
    {
      id: "ibrahim-khan",
      studentName: "Ibrahim Khan",
      studentMeta: "New admission",
      initials: "IK",
      accent: "blue",
      admissionNumber: "ST-26-0137",
      currentPlacement: "Unassigned",
      targetPlacement: "5-A",
      statusLabel: "Approved",
      statusTone: "info",
      selected: true
    },
    {
      id: "siya-nair",
      studentName: "Siya Nair",
      studentMeta: "Sibling in school",
      initials: "SN",
      accent: "violet",
      admissionNumber: "ST-26-0158",
      currentPlacement: "5-B",
      targetPlacement: "5-A",
      statusLabel: "Reassign",
      statusTone: "neutral",
      selected: true
    },
    {
      id: "aditya-joshi",
      studentName: "Aditya Joshi",
      studentMeta: "Transfer case",
      initials: "AJ",
      accent: "amber",
      admissionNumber: "ST-26-0162",
      currentPlacement: "Unassigned",
      targetPlacement: "5-B",
      statusLabel: "Pending",
      statusTone: "warning",
      selected: false
    },
    {
      id: "maira-khan",
      studentName: "Maira Khan",
      studentMeta: "Document verified",
      initials: "MK",
      accent: "rose",
      admissionNumber: "ST-26-0168",
      currentPlacement: "Unassigned",
      targetPlacement: "5-C",
      statusLabel: "Approved",
      statusTone: "info",
      selected: false
    },
    {
      id: "diya-patel",
      studentName: "Diya Patel",
      studentMeta: "Admission approved",
      initials: "DP",
      accent: "sky",
      admissionNumber: "ST-26-0171",
      currentPlacement: "Unassigned",
      targetPlacement: "5-A",
      statusLabel: "Approved",
      statusTone: "info",
      selected: false
    },
    {
      id: "ritu-sharma",
      studentName: "Ritu Sharma",
      studentMeta: "Waiting section assign",
      initials: "RS",
      accent: "emerald",
      admissionNumber: "ST-26-0174",
      currentPlacement: "5-A",
      targetPlacement: "5-B",
      statusLabel: "Reassign",
      statusTone: "neutral",
      selected: false
    }
  ],
  seatCards: [
    {
      id: "5-a",
      label: "Grade 5-A",
      occupiedLabel: "Occupied 37 / 40",
      seatsLeftLabel: "3 left",
      occupiedValue: 37,
      capacityValue: 40,
      tone: "accent"
    },
    {
      id: "5-b",
      label: "Grade 5-B",
      occupiedLabel: "Occupied 34 / 40",
      seatsLeftLabel: "6 left",
      occupiedValue: 34,
      capacityValue: 40,
      tone: "success"
    },
    {
      id: "5-c",
      label: "Grade 5-C",
      occupiedLabel: "Occupied 39 / 40",
      seatsLeftLabel: "1 left",
      occupiedValue: 39,
      capacityValue: 40,
      tone: "warning"
    }
  ],
  pendingSummary: {
    selectedStudentsLabel: "Selected Students",
    selectedStudentsValue: "4",
    targetSectionLabel: "Target Section",
    targetSectionValue: "5-A",
    note: "Will remain seats after assign: 1"
  },
  operationalNoteTitle: "Operational Note",
  operationalNoteBody:
    "5-C is near capacity. Route most new Grade 5 admissions to 5-A or 5-B unless a specific section is required."
};
