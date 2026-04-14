import type { FileUploadListItem } from "../../ui";
import type { StudentAdmissionViewModel } from "./studentAdmissionRegistration.types";

export const studentAdmissionRegistrationTenant: StudentAdmissionViewModel["tenant"] = {
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

const navigation: StudentAdmissionViewModel["navigation"] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "admissions", label: "Admissions", active: true },
  { id: "students", label: "Students" },
  { id: "attendance", label: "Attendance" },
  { id: "allocation", label: "Class Allocation" },
  { id: "transport", label: "Transport" },
  { id: "reports", label: "Reports" }
];

const documents: FileUploadListItem[] = [
  {
    id: "birth-certificate",
    name: "Birth Certificate",
    description: "Verified PDF copy",
    statusLabel: "Uploaded",
    statusTone: "success",
    actionLabel: "Replace",
    actionVariant: "ghost"
  },
  {
    id: "student-photo",
    name: "Student Photo",
    description: "Passport-size image",
    statusLabel: "Uploaded",
    statusTone: "success",
    actionLabel: "Replace",
    actionVariant: "ghost"
  }
];

export const studentAdmissionRegistrationViewModel: StudentAdmissionViewModel = {
  tenant: studentAdmissionRegistrationTenant,
  title: "Student Admission & Registration",
  description: "Create and review a complete admission profile before approval",
  navigation,
  activeStepId: "academic-details",
  steps: [
    {
      id: "student-details",
      label: "Student Details",
      description: "Completed",
      status: "complete"
    },
    {
      id: "guardian-details",
      label: "Parent & Guardian",
      description: "Completed",
      status: "complete"
    },
    {
      id: "academic-details",
      label: "Academic Details",
      description: "In progress",
      status: "current"
    },
    {
      id: "documents-review",
      label: "Documents & Review",
      description: "Pending",
      status: "upcoming"
    }
  ],
  form: {
    firstName: "Aanya",
    lastName: "Verma",
    dateOfBirth: "14 Jun 2016",
    gender: "female",
    admissionNumber: "",
    bloodGroup: "",
    guardianName: "Rohit Verma",
    motherName: "Pooja Verma",
    contactNumber: "98765 44021",
    emailAddress: "rohit.verma@email.com",
    relationship: "father",
    occupation: "Business Owner",
    classApplyingFor: "grade-3",
    academicYear: "2026-27",
    previousSchoolName: "Sunrise Public School",
    lastClassCompleted: "grade-2",
    addressLine: "22 Lake View Road",
    addressLandmark: "Near City Mall, Ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380015",
    medicalNotes: "Mild dust allergy. Inhaler not required at school."
  },
  genderOptions: [
    { label: "Female", value: "female" },
    { label: "Male", value: "male" },
    { label: "Prefer not to say", value: "na" }
  ],
  bloodGroupOptions: [
    { label: "A+", value: "a-positive" },
    { label: "A-", value: "a-negative" },
    { label: "B+", value: "b-positive" },
    { label: "B-", value: "b-negative" },
    { label: "O+", value: "o-positive" },
    { label: "O-", value: "o-negative" },
    { label: "AB+", value: "ab-positive" },
    { label: "AB-", value: "ab-negative" }
  ],
  relationshipOptions: [
    { label: "Father", value: "father" },
    { label: "Mother", value: "mother" },
    { label: "Guardian", value: "guardian" }
  ],
  academicYearOptions: [
    { label: "2026–27", value: "2026-27" },
    { label: "2025–26", value: "2025-26" }
  ],
  classOptions: [
    { label: "Grade 1", value: "grade-1" },
    { label: "Grade 2", value: "grade-2" },
    { label: "Grade 3", value: "grade-3" },
    { label: "Grade 4", value: "grade-4" }
  ],
  lastClassOptions: [
    { label: "Grade 1", value: "grade-1" },
    { label: "Grade 2", value: "grade-2" },
    { label: "Grade 3", value: "grade-3" }
  ],
  summaryStatusLabel: "Draft",
  summaryStatusTone: "warning",
  completionValue: 63,
  completionLabel: "63% complete",
  completionHint: "Documents pending",
  documents,
  checklist: [
    {
      id: "check-student",
      label: "Student details completed",
      statusLabel: "Done",
      statusTone: "success"
    },
    {
      id: "check-guardian",
      label: "Parent details completed",
      statusLabel: "Done",
      statusTone: "success"
    },
    {
      id: "check-academic",
      label: "Academic details in progress",
      statusLabel: "In progress",
      statusTone: "info"
    },
    {
      id: "check-review",
      label: "Review and submit",
      statusLabel: "Pending",
      statusTone: "neutral"
    }
  ],
  applicantSummaryLabel: "Applying for Grade 3",
  footerTitle: "Low-friction admission workflow",
  footerDescription: "Save progress at any time and submit after documents are attached"
};
