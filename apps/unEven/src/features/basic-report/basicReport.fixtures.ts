import type { BasicReportViewModel } from "./basicReport.types";

export const basicReportTenant: BasicReportViewModel["tenant"] = {
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

const navigation: BasicReportViewModel["navigation"] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "admissions", label: "Admissions" },
  { id: "students", label: "Students" },
  { id: "attendance", label: "Attendance" },
  { id: "allocation", label: "Class Allocation" },
  { id: "transport", label: "Transport" },
  { id: "reports", label: "Reports", active: true }
];

export const basicReportViewModelFixture: BasicReportViewModel = {
  tenant: basicReportTenant,
  title: "Reports",
  description: "Access essential school reports without advanced analytics complexity",
  navigation,
  exportActions: {
    pdf: "Export PDF",
    csv: "Export CSV"
  },
  filters: {
    startDate: "2026-04-01",
    endDate: "2026-04-30",
    classValue: "all",
    periodValue: "month",
    searchValue: "",
    classOptions: [
      { label: "All Classes", value: "all" },
      { label: "Grade 2", value: "grade-2" },
      { label: "Grade 5", value: "grade-5" },
      { label: "Grade 10", value: "grade-10" }
    ],
    periodOptions: [
      { label: "This Month", value: "month" },
      { label: "This Quarter", value: "quarter" },
      { label: "This Session", value: "session" }
    ],
    searchPlaceholder: "Search generated reports or report type"
  },
  metrics: [
    {
      id: "student-records",
      label: "STUDENT RECORDS",
      value: "1,248",
      meta: "Active student records in current year",
      tone: "neutral"
    },
    {
      id: "avg-attendance",
      label: "AVG ATTENDANCE",
      value: "93.8%",
      meta: "Monthly student attendance summary",
      tone: "info"
    },
    {
      id: "fee-collection",
      label: "FEE COLLECTION",
      value: "₹8.6L",
      meta: "Collected in selected date range",
      tone: "accent"
    },
    {
      id: "pending-dues",
      label: "PENDING DUES",
      value: "₹3.1L",
      meta: "Outstanding fee amount to review",
      tone: "warning"
    }
  ],
  reportHub: {
    title: "Report Hub",
    description: "Quick access to essential operational reports",
    tiles: [
      {
        id: "student-list",
        title: "Student List Report",
        description: "Export current student master records",
        accent: "teal",
        generatedFileType: "PDF"
      },
      {
        id: "attendance",
        title: "Attendance Report",
        description: "Class-wise and date-range attendance export",
        accent: "teal",
        generatedFileType: "PDF"
      },
      {
        id: "fee-collection",
        title: "Fee Collection Report",
        description: "Collected fees and payment mode summary",
        accent: "teal",
        generatedFileType: "CSV"
      },
      {
        id: "pending-dues",
        title: "Pending Dues Report",
        description: "Review students with active outstanding fees",
        accent: "amber",
        generatedFileType: "CSV"
      },
      {
        id: "admissions",
        title: "Admission Report",
        description: "Track new admissions and pending cases",
        accent: "violet",
        generatedFileType: "PDF"
      },
      {
        id: "transport",
        title: "Transport Allocation Report",
        description: "Route-wise student transport assignments",
        accent: "blue",
        generatedFileType: "PDF"
      }
    ],
    summaryInsights: [
      "Best attendance class this month: Grade 2-A · 97.1%",
      "Highest fee outstanding class: Grade 10-A · ₹82,400",
      "Transport allocation coverage: 418 students across 12 active routes"
    ]
  },
  historyPanel: {
    title: "Recent Generated Reports",
    description: "Latest report exports for quick reuse",
    emptyLabel: "No generated reports match the current filters.",
    noteTitle: "Reporting note",
    noteBody: "This module is intentionally lean for Tier 1 workflows.",
    noteCaption: "Focus is on exportable operational summaries, not BI dashboards.",
    items: [
      {
        id: "history-attendance",
        title: "Attendance Report · Grade 5",
        meta: "Generated today · PDF",
        format: "PDF",
        accent: "teal"
      },
      {
        id: "history-fees",
        title: "Fee Collection Report · Apr",
        meta: "Yesterday · CSV",
        format: "CSV",
        accent: "blue"
      },
      {
        id: "history-admissions",
        title: "Admission Report · Session 2026",
        meta: "05 Apr · PDF",
        format: "PDF",
        accent: "violet"
      },
      {
        id: "history-dues",
        title: "Pending Dues Report",
        meta: "03 Apr · CSV",
        format: "CSV",
        accent: "amber"
      }
    ]
  }
};
