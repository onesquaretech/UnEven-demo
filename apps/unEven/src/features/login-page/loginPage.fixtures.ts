import type {
  LoginFixtureRecord,
  LoginPageViewModel,
  LoginResultCode,
  LoginRoleCode
} from "./loginPage.types";

export const loginPageTenant: LoginPageViewModel["tenant"] = {
  tenantId: "tenant_uneven_demo",
  display: {
    displayName: "UnEven Academy Network",
    shortName: "UnEven",
    legalName: "UnEven Academy Network Pvt. Ltd."
  },
  locale: "en-IN",
  timezone: "Asia/Kolkata",
  currency: "INR",
  themePreference: "light",
  enabledModules: ["dashboard", "students", "attendance", "fees", "notices"],
  branding: {
    primaryColor: "#0f7a6c",
    accentColor: "#d76534",
    logoSrc: "/brand/app_logo.png",
    iconSrc: "/favicon.svg"
  },
  contact: {
    email: "access@uneven.school",
    phone: "+91 98765 43210"
  },
  documents: {
    headerTitle: "UnEven Academy Network",
    footerText: "Internal access only"
  }
};

export const loginPageViewModelFixture: LoginPageViewModel = {
  tenant: loginPageTenant,
  tenantSlug: "uneven-demo",
  schoolCode: "UNEVEN-ESS",
  planLabel: "Essential Plan",
  title: "Sign in",
  description: "Access your school workspace securely",
  roleOptions: [
    {
      code: "school_admin",
      label: "Admin",
      description: "Admissions, student operations, settings, and reporting"
    },
    {
      code: "teacher",
      label: "Teacher",
      description: "Attendance, notices, and class-facing daily work"
    },
    {
      code: "parent",
      label: "Parent",
      description: "Student-linked notices, attendance, and fee visibility"
    },
    {
      code: "accountant",
      label: "Accountant",
      description: "Fees, dues, payment posting, and receipts"
    }
  ],
  features: [
    {
      id: "access",
      title: "Fast role-based access for admins, teachers, parents, and students",
      description: "One shared entry point with role-aware session bootstrap behavior."
    },
    {
      id: "adoption",
      title: "Low training effort for school staff",
      description: "Designed for quick adoption across administration, academics, and finance."
    },
    {
      id: "security",
      title: "Secure, modern, web-based school ERP",
      description: "Aligned with future token-backed access and backend authorization."
    }
  ],
  metrics: [
    {
      id: "attendance-today",
      label: "Attendance today",
      value: "94.2%",
      meta: "3 classes pending"
    },
    {
      id: "fee-collection",
      label: "Fee collection",
      value: "₹1,84,500",
      meta: "Collected today"
    },
    {
      id: "pending-admissions",
      label: "Pending admissions",
      value: "12",
      meta: "Ready for review"
    }
  ],
  securityNotes: [
    {
      id: "token-authority",
      label: "Token-aware UI",
      description: "Role and route visibility comes from claims after authentication."
    },
    {
      id: "server-authorization",
      label: "Backend enforcement",
      description: "The ERP backend remains the final authority for every protected request."
    },
    {
      id: "mock-swap",
      label: "Safe mock removal",
      description: "Static data lives only in this feature and can be replaced without UI regression."
    }
  ],
  demoScenarios: [
    {
      id: "admin-success",
      title: "Admin happy path",
      description: "Returns a valid session preview and next route.",
      role: "school_admin",
      schoolCode: "UNEVEN-ESS",
      identifier: "admin.demo@uneven.local",
      password: "Admin@123",
      expectedResult: "SUCCESS"
    },
    {
      id: "finance-success",
      title: "Finance happy path",
      description: "Bootstraps the accountant role and receipt access.",
      role: "accountant",
      schoolCode: "UNEVEN-ESS",
      identifier: "accounts.demo@uneven.local",
      password: "Fees@123",
      expectedResult: "SUCCESS"
    },
    {
      id: "teacher-inactive",
      title: "Inactive teacher account",
      description: "Mimics a suspended or not-yet-activated login.",
      role: "teacher",
      schoolCode: "UNEVEN-ESS",
      identifier: "teacher.locked@uneven.local",
      password: "Teacher@123",
      expectedResult: "ACCOUNT_INACTIVE"
    },
    {
      id: "parent-reset",
      title: "Parent forced reset",
      description: "Mimics a login that must go through password reset first.",
      role: "parent",
      schoolCode: "UNEVEN-ESS",
      identifier: "parent.reset@uneven.local",
      password: "Reset@123",
      expectedResult: "PASSWORD_RESET_REQUIRED"
    }
  ],
  footerNote: "Modern School Management System · Essential Plan"
};

function successSession(
  role: LoginRoleCode,
  displayName: string,
  nextRoute: string,
  permissionCodes: string[]
) {
  return {
    ok: true as const,
    code: "SUCCESS" as const,
    session: {
      sessionId: `sess_${role}_demo`,
      userId: `usr_${role}_001`,
      displayName,
      activeRole: role,
      nextRoute,
      permissionCodes
    }
  };
}

function failureResult(code: Exclude<LoginResultCode, "SUCCESS">, title: string, message: string) {
  return {
    ok: false as const,
    code,
    error: {
      code,
      title,
      message
    }
  };
}

export const loginFixtureRecords: LoginFixtureRecord[] = [
  {
    role: "school_admin",
    identifier: "admin.demo@uneven.local",
    password: "Admin@123",
    result: successSession("school_admin", "Aarav Sharma", "/admin", [
      "dashboard.read",
      "students.read",
      "students.write",
      "settings.read",
      "settings.write",
      "reports.read"
    ])
  },
  {
    role: "accountant",
    identifier: "accounts.demo@uneven.local",
    password: "Fees@123",
    result: successSession("accountant", "Meera Iyer", "/fees", [
      "fees.read",
      "fees.write",
      "payments.write",
      "receipts.read"
    ])
  },
  {
    role: "teacher",
    identifier: "teacher.locked@uneven.local",
    password: "Teacher@123",
    result: failureResult(
      "ACCOUNT_INACTIVE",
      "Account inactive",
      "This teacher account is not active for the selected tenant. Contact the school administrator."
    )
  },
  {
    role: "parent",
    identifier: "parent.reset@uneven.local",
    password: "Reset@123",
    result: failureResult(
      "PASSWORD_RESET_REQUIRED",
      "Password reset required",
      "This account must complete password reset before a new ERP session can be created."
    )
  }
];
