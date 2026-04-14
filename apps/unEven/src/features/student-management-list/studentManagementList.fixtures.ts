import type { StudentManagementListViewModel } from "./studentManagementList.types";

export const studentManagementListTenant: StudentManagementListViewModel["tenant"] = {
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
    email: "info@greenfield.edu",
    phone: "+91 98765 44120",
    address: "Rose Avenue Campus, Jaipur"
  },
  documents: {
    headerTitle: "Greenfield Senior Secondary School",
    footerText: "Managed centrally by the school administration."
  }
};

const navigation: StudentManagementListViewModel["navigation"] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "admissions", label: "Admissions" },
  { id: "students", label: "Students", active: true },
  { id: "attendance", label: "Attendance" },
  { id: "allocation", label: "Class Allocation" },
  { id: "transport", label: "Transport" },
  { id: "reports", label: "Reports" }
];

export const studentManagementListViewModelFixture: StudentManagementListViewModel = {
  tenant: studentManagementListTenant,
  title: "Student Management",
  description: "Search, filter, and manage student records across all active classes",
  navigation,
  bulkActionLabel: "Bulk Actions",
  primaryActionLabel: "Add Student",
  searchPlaceholder: "Search by student name or admission number",
  classOptions: [
    { label: "Class", value: "" },
    { label: "5", value: "5" },
    { label: "7", value: "7" },
    { label: "10", value: "10" }
  ],
  sectionOptions: [
    { label: "Section", value: "" },
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" }
  ],
  statusOptions: [
    { label: "Status", value: "" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
    { label: "Transfer Req.", value: "Transfer Req." }
  ],
  yearOptions: [
    { label: "Admission Year", value: "" },
    { label: "2026", value: "2026" },
    { label: "2025", value: "2025" }
  ],
  appliedFilterLabels: ["Class · 5", "Section · A", "Active only"],
  summaryLabel: "1,248 students · 3 selected",
  selectedSummaryLabel: "3 students selected",
  bulkActions: [
    { id: "view", label: "View" },
    { id: "edit", label: "Edit" },
    { id: "transfer", label: "Transfer" },
    { id: "archive", label: "Archive" }
  ],
  tableTitle: "Students",
  tableDescription: "Active and recently updated student records",
  rows: [
    {
      id: "riya-sharma",
      studentName: "Riya Sharma",
      emailAddress: "riya.sharma@school.local",
      initials: "RS",
      accent: "blue",
      admissionNumber: "ST-26-0142",
      classLabel: "5",
      sectionLabel: "A",
      parentName: "Pooja Sharma",
      feeStatusLabel: "Paid",
      feeStatusTone: "success",
      statusLabel: "Active",
      statusTone: "info",
      actions: [{ id: "edit", label: "Edit" }]
    },
    {
      id: "aarav-mehta",
      studentName: "Aarav Mehta",
      emailAddress: "aarav.mehta@school.local",
      initials: "AM",
      accent: "violet",
      admissionNumber: "ST-26-0137",
      classLabel: "7",
      sectionLabel: "B",
      parentName: "Kunal Mehta",
      feeStatusLabel: "Partial",
      feeStatusTone: "warning",
      statusLabel: "Active",
      statusTone: "info",
      actions: [{ id: "edit", label: "Edit" }]
    },
    {
      id: "fatima-khan",
      studentName: "Fatima Khan",
      emailAddress: "fatima.khan@school.local",
      initials: "FK",
      accent: "amber",
      admissionNumber: "ST-26-0121",
      classLabel: "2",
      sectionLabel: "C",
      parentName: "Naved Khan",
      feeStatusLabel: "Due",
      feeStatusTone: "danger",
      statusLabel: "Active",
      statusTone: "info",
      actions: [{ id: "edit", label: "Edit" }]
    },
    {
      id: "vihaan-rao",
      studentName: "Vihaan Rao",
      emailAddress: "vihaan.rao@school.local",
      initials: "VR",
      accent: "rose",
      admissionNumber: "ST-26-0088",
      classLabel: "10",
      sectionLabel: "A",
      parentName: "Rekha Rao",
      feeStatusLabel: "Overdue",
      feeStatusTone: "danger",
      statusLabel: "Transfer Req.",
      statusTone: "warning",
      actions: [{ id: "edit", label: "Edit" }]
    },
    {
      id: "siya-nair",
      studentName: "Siya Nair",
      emailAddress: "siya.nair@school.local",
      initials: "SN",
      accent: "sky",
      admissionNumber: "ST-26-0158",
      classLabel: "7",
      sectionLabel: "A",
      parentName: "Anil Nair",
      feeStatusLabel: "Paid",
      feeStatusTone: "success",
      statusLabel: "Active",
      statusTone: "info",
      actions: [{ id: "edit", label: "Edit" }]
    },
    {
      id: "diya-patel",
      studentName: "Diya Patel",
      emailAddress: "diya.patel@school.local",
      initials: "DP",
      accent: "emerald",
      admissionNumber: "ST-25-0972",
      classLabel: "4",
      sectionLabel: "B",
      parentName: "Nirav Patel",
      feeStatusLabel: "Due",
      feeStatusTone: "warning",
      statusLabel: "Inactive",
      statusTone: "neutral",
      actions: [{ id: "edit", label: "Edit" }]
    },
    {
      id: "yuvan-kapoor",
      studentName: "Yuvan Kapoor",
      emailAddress: "yuvan.kapoor@school.local",
      initials: "YK",
      accent: "indigo",
      admissionNumber: "ST-26-0176",
      classLabel: "6",
      sectionLabel: "C",
      parentName: "Ritu Kapoor",
      feeStatusLabel: "Partial",
      feeStatusTone: "warning",
      statusLabel: "Active",
      statusTone: "info",
      actions: [{ id: "edit", label: "Edit" }]
    }
  ],
  summaryMetrics: [
    {
      id: "active-students",
      label: "Active Students",
      value: "1,214",
      deltaLabel: "+18",
      deltaTone: "info"
    },
    {
      id: "fee-dues",
      label: "Fee Dues Flagged",
      value: "73",
      deltaLabel: "Review",
      deltaTone: "warning"
    },
    {
      id: "transfer-requests",
      label: "Transfer Requests",
      value: "9",
      deltaLabel: "Pending",
      deltaTone: "danger"
    }
  ],
  notes: [
    {
      id: "note-records-updated",
      title: "Class 5-A records updated",
      description: "12 profiles verified and fees synced",
      timestamp: "Today · 9:12 AM",
      tone: "accent"
    },
    {
      id: "note-transfer-review",
      title: "3 transfer cases need review",
      description: "Pending class reassignment approval",
      timestamp: "Yesterday · 4:40 PM",
      tone: "warning"
    }
  ],
  pagination: {
    page: 1,
    totalPages: 3,
    summary: "Showing 1–7 of 1,248 students"
  }
};
