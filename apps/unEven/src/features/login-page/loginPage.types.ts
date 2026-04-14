import type { TenantContextInput } from "../../ui";

export type LoginRoleCode =
  | "school_admin"
  | "accountant"
  | "teacher"
  | "parent";

export type LoginResultCode =
  | "SUCCESS"
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_INACTIVE"
  | "PASSWORD_RESET_REQUIRED"
  | "ROLE_NOT_ALLOWED";

export interface LoginRoleOption {
  code: LoginRoleCode;
  label: string;
  description: string;
}

export interface LoginMetric {
  id: string;
  label: string;
  value: string;
  meta: string;
}

export interface LoginFeature {
  id: string;
  title: string;
  description: string;
}

export interface LoginSecurityNote {
  id: string;
  label: string;
  description: string;
}

export interface DemoLoginScenario {
  id: string;
  title: string;
  description: string;
  role: LoginRoleCode;
  schoolCode: string;
  identifier: string;
  password: string;
  expectedResult: LoginResultCode;
}

export interface LoginFormCommand {
  schoolCode: string;
  identifier: string;
  password: string;
  requestedRole: LoginRoleCode;
  rememberMe: boolean;
}

export interface LoginSessionPreview {
  sessionId: string;
  userId: string;
  displayName: string;
  activeRole: LoginRoleCode;
  nextRoute: string;
  permissionCodes: string[];
}

export interface LoginFailure {
  code: Exclude<LoginResultCode, "SUCCESS">;
  title: string;
  message: string;
}

export type LoginAttemptResult =
  | {
      ok: true;
      code: "SUCCESS";
      session: LoginSessionPreview;
    }
  | {
      ok: false;
      code: Exclude<LoginResultCode, "SUCCESS">;
      error: LoginFailure;
    };

export interface LoginFixtureRecord {
  role: LoginRoleCode;
  identifier: string;
  password: string;
  result: LoginAttemptResult;
}

export interface LoginPageViewModel {
  tenant: TenantContextInput;
  tenantSlug: string;
  schoolCode: string;
  planLabel: string;
  title: string;
  description: string;
  roleOptions: LoginRoleOption[];
  features: LoginFeature[];
  metrics: LoginMetric[];
  securityNotes: LoginSecurityNote[];
  demoScenarios: DemoLoginScenario[];
  footerNote: string;
}
