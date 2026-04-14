import type { StudentAttendanceViewModel } from "./studentAttendance.types";

export const studentAttendanceTenant: StudentAttendanceViewModel["tenant"] = {
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
    footerText: "Attendance remains in draft until the daily register is saved."
  }
};

const navigation: StudentAttendanceViewModel["navigation"] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "admissions", label: "Admissions" },
  { id: "students", label: "Students" },
  { id: "attendance", label: "Attendance", active: true },
  { id: "allocation", label: "Class Allocation" },
  { id: "transport", label: "Transport" },
  { id: "reports", label: "Reports" }
];

export const studentAttendanceViewModelFixture: StudentAttendanceViewModel = {
  tenant: studentAttendanceTenant,
  title: "Student Attendance",
  description: "Fast daily attendance marking by class, section, and date",
  navigation,
  classTeacherName: "Rahul Menon",
  classTeacherRole: "Class Teacher",
  classValue: "grade-5",
  sectionValue: "section-a",
  dateValue: "2026-04-07",
  searchPlaceholder: "Search student",
  classOptions: [
    { label: "Grade 5", value: "grade-5" },
    { label: "Grade 4", value: "grade-4" },
    { label: "Grade 6", value: "grade-6" }
  ],
  sectionOptions: [
    { label: "Section A", value: "section-a" },
    { label: "Section B", value: "section-b" },
    { label: "Section C", value: "section-c" }
  ],
  dateOptions: [
    { label: "07 Apr 2026", value: "2026-04-07" },
    { label: "06 Apr 2026", value: "2026-04-06" },
    { label: "05 Apr 2026", value: "2026-04-05" }
  ],
  statusFilterOptions: [
    { label: "All", value: "all" },
    { label: "Present", value: "present" },
    { label: "Absent", value: "absent" },
    { label: "Leave", value: "leave" }
  ],
  markModeOptions: [
    { value: "present", label: "P" },
    { value: "absent", label: "A" }
  ],
  bulkActions: [
    { id: "present", label: "All Present", tone: "accent" },
    { id: "absent", label: "All Absent", tone: "danger" },
    { id: "leave", label: "All Leave", tone: "warning" }
  ],
  actionLabels: {
    monthlyView: "Monthly View",
    saveAttendance: "Save Attendance"
  },
  register: {
    title: "Daily Attendance Register",
    description: "Mark attendance quickly and review notification flags before saving",
    paginationSummary: "Showing 8 of 42 students"
  },
  summary: {
    presentPercentage: 86,
    presentCount: 36,
    absentCount: 2,
    leaveCount: 4,
    classStrength: 42,
    absentNotificationLabel: "2 absent notifications pending",
    metrics: [
      { id: "present", label: "Present", value: "36" },
      { id: "absent", label: "Absent", value: "2" },
      { id: "leave", label: "Leave", value: "4" }
    ],
    followUps: [
      {
        id: "absent-follow-up",
        title: "2 absent notifications pending",
        detail: "Maira Khan, Nitya Verma",
        note: "Parent outreach not completed",
        tone: "danger"
      },
      {
        id: "leave-follow-up",
        title: "4 leave entries recorded",
        detail: "1 medical note attached",
        note: "Verify approval after saving",
        tone: "warning"
      }
    ],
    quickLinks: [
      { id: "monthly", label: "Open Monthly Attendance" },
      { id: "export", label: "Export Daily Register" },
      { id: "history", label: "View Attendance History" }
    ],
    pendingChangesLabel: "Pending Changes",
    pendingChangesValue: "6 rows updated",
    pendingChangesNote: "Changes are not saved yet"
  },
  rows: [
    {
      id: "aarush-jain",
      rollNumber: "01",
      studentName: "Aarush Jain",
      studentMeta: "No alerts",
      initials: "AJ",
      accent: "blue",
      status: "present",
      flagCount: 0
    },
    {
      id: "riya-sharma",
      rollNumber: "02",
      studentName: "Riya Sharma",
      studentMeta: "No alerts",
      initials: "RS",
      accent: "violet",
      status: "present",
      flagCount: 0
    },
    {
      id: "dev-patel",
      rollNumber: "03",
      studentName: "Dev Patel",
      studentMeta: "Bus late yesterday",
      initials: "DP",
      accent: "amber",
      status: "present",
      flagCount: 0
    },
    {
      id: "maira-khan",
      rollNumber: "04",
      studentName: "Maira Khan",
      studentMeta: "Parent informed",
      initials: "MK",
      accent: "rose",
      status: "absent",
      flagCount: 1
    },
    {
      id: "yuvan-shah",
      rollNumber: "05",
      studentName: "Yuvan Shah",
      studentMeta: "No alerts",
      initials: "YS",
      accent: "sky",
      status: "present",
      flagCount: 0
    },
    {
      id: "anika-sethi",
      rollNumber: "06",
      studentName: "Anika Sethi",
      studentMeta: "Medical leave note",
      initials: "AS",
      accent: "emerald",
      status: "leave",
      flagCount: 0
    },
    {
      id: "farhan-shaikh",
      rollNumber: "07",
      studentName: "Farhan Shaikh",
      studentMeta: "No alerts",
      initials: "FS",
      accent: "indigo",
      status: "present",
      flagCount: 0
    },
    {
      id: "nitya-verma",
      rollNumber: "08",
      studentName: "Nitya Verma",
      studentMeta: "Parent not reached",
      initials: "NV",
      accent: "pink",
      status: "absent",
      flagCount: 1
    }
  ]
};
