import type { NoticeListItem } from "../../ui";
import type {
  AdminDashboardAdmissionRequest,
  AdminDashboardClassOccupancy,
  AdminDashboardFeeCollectionOverview,
  AdminDashboardMetric,
  AdminDashboardPendingAction,
  AdminDashboardQuickLink,
  AdminDashboardViewModel
} from "./adminDashboard.types";

export const adminDashboardTenant: AdminDashboardViewModel["tenant"] = {
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

const navigation: AdminDashboardViewModel["navigation"] = [
  { id: "dashboard", label: "Dashboard", active: true },
  { id: "admissions", label: "Admissions" },
  { id: "students", label: "Students" },
  { id: "attendance", label: "Attendance" },
  { id: "allocation", label: "Class Allocation" },
  { id: "transport", label: "Transport" },
  { id: "reports", label: "Reports" }
];

const metrics: AdminDashboardMetric[] = [
  {
    id: "students",
    label: "Total students",
    value: "1,248",
    meta: "+28 this session",
    tone: "accent"
  },
  {
    id: "teachers",
    label: "Total teachers",
    value: "64",
    meta: "2 on leave today",
    tone: "success"
  },
  {
    id: "attendance",
    label: "Today attendance",
    value: "94.2%",
    meta: "3 classes pending update",
    tone: "accent"
  },
  {
    id: "dues",
    label: "Pending fee dues",
    value: "₹6.4L",
    meta: "73 accounts overdue",
    tone: "warning"
  },
  {
    id: "admissions",
    label: "New admissions",
    value: "12",
    meta: "5 awaiting review",
    tone: "neutral"
  }
];

const quickLinks: AdminDashboardQuickLink[] = [
  {
    id: "admissions",
    label: "Admissions",
    description: "Review new student applications and move them into allocation.",
    actionLabel: "Coming next",
    available: false
  },
  {
    id: "students",
    label: "Students",
    description: "Open the canonical student register and recent profile changes.",
    actionLabel: "Queue",
    available: false
  },
  {
    id: "fees",
    label: "Fees",
    description: "Record collections and inspect overdue accounts by class.",
    actionLabel: "Queue",
    available: false
  },
  {
    id: "attendance",
    label: "Attendance",
    description: "Resolve pending sections and review class-level completion.",
    actionLabel: "Queue",
    available: false
  },
  {
    id: "settings",
    label: "Settings",
    description: "Adjust master data, branding, and tenant-wide defaults.",
    route: "/settings",
    actionLabel: "Open settings",
    available: true
  }
];

const notices: NoticeListItem[] = [
  {
    id: "notice-fees",
    title: "Fee submission deadline for April",
    audience: "Parents",
    publishTiming: "Published today",
    stateLabel: "Live",
    stateTone: "success",
    description: "Reminder sent across all active classes for the April collection cycle.",
    leading: "₹"
  },
  {
    id: "notice-transport",
    title: "Bus route adjustment on Friday",
    audience: "Parents, Admin",
    publishTiming: "Yesterday",
    stateLabel: "Scheduled",
    stateTone: "warning",
    description: "Northern route pickup windows were adjusted because of roadwork near the main gate.",
    leading: "R"
  },
  {
    id: "notice-exam",
    title: "Grade 10 revision timetable published",
    audience: "Students, Teachers",
    publishTiming: "Yesterday",
    stateLabel: "Live",
    stateTone: "info",
    description: "Exam preparation timetable is now available for board classes.",
    leading: "T"
  }
];

const pendingActions: AdminDashboardPendingAction[] = [
  {
    id: "attendance-sync",
    title: "Attendance sync pending for 3 classes",
    description: "Sections 6-B, 8-A, and 10-C have not posted the final morning attendance snapshot yet.",
    owner: "Attendance desk",
    priority: "critical",
    actionLabel: "Queue",
    available: false
  },
  {
    id: "fee-followup",
    title: "Overdue fee follow-up due today",
    description: "73 accounts crossed the grace window and need the next parent reminder batch.",
    owner: "Accounts team",
    priority: "warning",
    actionLabel: "Queue",
    available: false
  },
  {
    id: "settings-check",
    title: "Verify notice categories before term launch",
    description: "The settings workspace has the latest category draft and needs a final review before bulk publishing starts.",
    owner: "School admin",
    priority: "info",
    actionLabel: "Open settings",
    route: "/settings",
    available: true
  }
];

const recentAdmissions: AdminDashboardAdmissionRequest[] = [
  {
    id: "admission-aanya",
    studentName: "Aanya Verma",
    guardianName: "Rohit Verma",
    classLabel: "Grade 3",
    submittedLabel: "06 Apr",
    documentProgress: "4 / 5",
    statusLabel: "Pending"
  },
  {
    id: "admission-ibrahim",
    studentName: "Ibrahim Khan",
    guardianName: "Sana Khan",
    classLabel: "Grade 7",
    submittedLabel: "06 Apr",
    documentProgress: "5 / 5",
    statusLabel: "Ready Review"
  },
  {
    id: "admission-saanvi",
    studentName: "Saanvi Patel",
    guardianName: "Kunal Patel",
    classLabel: "Grade 1",
    submittedLabel: "05 Apr",
    documentProgress: "3 / 5",
    statusLabel: "Pending"
  },
  {
    id: "admission-reyansh",
    studentName: "Reyansh Das",
    guardianName: "Mitali Das",
    classLabel: "KG II",
    submittedLabel: "05 Apr",
    documentProgress: "5 / 5",
    statusLabel: "Reviewed"
  },
  {
    id: "admission-diya",
    studentName: "Diya Nair",
    guardianName: "Rakesh Nair",
    classLabel: "Grade 5",
    submittedLabel: "04 Apr",
    documentProgress: "2 / 5",
    statusLabel: "Draft"
  }
];

const classOccupancy: AdminDashboardClassOccupancy[] = [
  { id: "grade-1", classLabel: "Grade 1", studentCount: 74, capacity: 96 },
  { id: "grade-3", classLabel: "Grade 3", studentCount: 80, capacity: 98 },
  { id: "grade-5", classLabel: "Grade 5", studentCount: 89, capacity: 101 },
  { id: "grade-7", classLabel: "Grade 7", studentCount: 77, capacity: 95 }
];

const feeCollectionOverview: AdminDashboardFeeCollectionOverview = {
  collectedToday: "₹1.84L",
  subtitle: "Collected today",
  changeLabel: "Strongest collection day this week",
  bars: [
    { id: "mon", label: "Mon", value: 44 },
    { id: "tue", label: "Tue", value: 62 },
    { id: "wed", label: "Wed", value: 74 },
    { id: "thu", label: "Thu", value: 88 },
    { id: "fri", label: "Fri", value: 68 }
  ]
};

export const adminDashboardViewModelFixture: AdminDashboardViewModel = {
  tenant: adminDashboardTenant,
  title: "Admin Dashboard",
  description: "Summarize school health and move quickly into the operational modules that need attention first.",
  academicYearLabel: "2026-27",
  updatedAtLabel: "Updated 9:24 AM",
  navigation,
  metrics,
  quickLinks,
  notices,
  attendanceOverview: {
    presentPercentage: 94,
    presentLabel: "Present today",
    hint: "3 classes pending update",
    metrics: [
      { id: "present", label: "Present", value: "1,176" },
      { id: "absent", label: "Absent", value: "58" },
      { id: "pending", label: "Pending", value: "14" }
    ]
  },
  feeCollectionOverview,
  pendingActions,
  recentAdmissions,
  classOccupancy
};
