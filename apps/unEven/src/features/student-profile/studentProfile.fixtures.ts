import type { StudentProfileViewModel } from "./studentProfile.types";

export const studentProfileTenant: StudentProfileViewModel["tenant"] = {
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

const navigation: StudentProfileViewModel["navigation"] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "admissions", label: "Admissions" },
  { id: "students", label: "Students", active: true },
  { id: "attendance", label: "Attendance" },
  { id: "allocation", label: "Class Allocation" },
  { id: "transport", label: "Transport" },
  { id: "reports", label: "Reports" }
];

export const studentProfileViewModelFixture: StudentProfileViewModel = {
  tenant: studentProfileTenant,
  title: "Student Profile",
  description: "Complete student record with academic, fee, attendance, and transport details",
  navigation,
  tabs: [
    { value: "overview", label: "Overview" },
    { value: "attendance", label: "Attendance" },
    { value: "fees", label: "Fees" },
    { value: "documents", label: "Documents" },
    { value: "transport", label: "Transport" },
    { value: "activity", label: "Activity" }
  ],
  identity: {
    studentName: "Riya Sharma",
    admissionNumber: "ST-26-0142",
    rollNumber: "18",
    classLabel: "Grade 5-A",
    avatarSeed: "Riya Sharma",
    statusChips: [
      { id: "active", label: "Active", tone: "success" },
      { id: "fee-clear", label: "Fee Clear", tone: "success" },
      { id: "transport-on", label: "Transport On", tone: "info" }
    ],
    summaryMetrics: [
      { id: "attendance", label: "Attendance", value: "96%", meta: "This month" },
      { id: "outstanding", label: "Outstanding", value: "₹3,200", meta: "Due on 10 Apr" },
      { id: "activity", label: "Last Activity", value: "Today", meta: "Attendance marked" }
    ]
  },
  personalInfo: {
    title: "Personal Info",
    description: "Basic student identity and contact details",
    fields: [
      { id: "dob", label: "Date of Birth", value: "14 Aug 2015" },
      { id: "gender", label: "Gender", value: "Female" },
      { id: "blood-group", label: "Blood Group", value: "B+" },
      { id: "student-id", label: "Student ID", value: "ST-26-0142" }
    ],
    fullWidthField: {
      id: "address",
      label: "Address",
      value: "22 Lake View Road, Near City Mall, Ahmedabad, Gujarat 380015"
    }
  },
  academicInfo: {
    title: "Academic Info",
    description: "Current placement and admission details",
    fields: [
      { id: "class", label: "Class", value: "Grade 5" },
      { id: "section", label: "Section", value: "A" },
      { id: "roll", label: "Roll Number", value: "18" },
      { id: "admission-date", label: "Admission Date", value: "01 Apr 2026" }
    ],
    footerField: {
      id: "previous-school",
      label: "Previous School",
      value: "Sunrise Public School"
    }
  },
  guardianInfo: {
    title: "Parent / Guardian Details",
    description: "Primary contacts for communication and emergency coordination",
    guardians: [
      {
        id: "primary-guardian",
        label: "Primary Guardian",
        name: "Pooja Sharma",
        meta: "Mother · 98765 44021"
      },
      {
        id: "secondary-guardian",
        label: "Secondary Guardian",
        name: "Rohit Sharma",
        meta: "Father · rohit.verma@email.com"
      }
    ]
  },
  attendanceSummary: {
    percentage: 96,
    valueLabel: "96%",
    stats: [
      { id: "present", label: "Present Days", value: "22" },
      { id: "absent", label: "Absent Days", value: "1" },
      { id: "late", label: "Late", value: "1" },
      { id: "last-marked", label: "Last Marked", value: "Today" }
    ]
  },
  feeSummary: {
    title: "Fee Summary",
    description: "Simple financial status for admin reference",
    metrics: [
      { id: "outstanding", label: "Outstanding", value: "₹3,200" },
      { id: "last-payment", label: "Last Payment", value: "05 Mar" }
    ],
    footerNote: "Due heads · Tuition Apr, Transport Apr"
  },
  documents: [
    {
      id: "birth-certificate",
      name: "Birth Certificate",
      statusLabel: "Verified",
      statusTone: "success"
    },
    {
      id: "report-card",
      name: "Previous Report Card",
      statusLabel: "Verified",
      statusTone: "success"
    }
  ],
  transport: {
    title: "Transport Details",
    detail: "Route 3 · Stop 5 · 7:15 AM pickup",
    note: "Guardian contact linked to transport allocation"
  },
  activity: [
    {
      id: "activity-attendance",
      title: "Attendance marked present for today",
      timestamp: "07 Apr · 8:42 AM"
    },
    {
      id: "activity-transport",
      title: "Transport allocation updated",
      timestamp: "06 Apr · 5:10 PM"
    }
  ]
};
