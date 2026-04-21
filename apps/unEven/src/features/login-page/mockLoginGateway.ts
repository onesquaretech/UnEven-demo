import { loginFixtureRecords } from "./loginPage.fixtures";
import type { LoginAttemptResult, LoginFormCommand } from "./loginPage.types";

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export async function submitMockLogin(command: LoginFormCommand): Promise<LoginAttemptResult> {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 750);
  });

  if (normalizeText(command.schoolCode) !== "uneven-ess") {
    return {
      ok: false,
      code: "INVALID_CREDENTIALS",
      error: {
        code: "INVALID_CREDENTIALS",
        title: "Invalid school code",
        message: "The school code does not match."
      }
    };
  }

  const identifier = normalizeText(command.identifier);
  const record = loginFixtureRecords.find(
    (entry) => normalizeText(entry.identifier) === identifier && entry.password === command.password
  );

  if (!record) {
    return {
      ok: false,
      code: "INVALID_CREDENTIALS",
      error: {
        code: "INVALID_CREDENTIALS",
        title: "Invalid credentials",
        message: "The identifier or password did not match any active demo account."
      }
    };
  }

  if (record.role !== command.requestedRole) {
    return {
      ok: false,
      code: "ROLE_NOT_ALLOWED",
      error: {
        code: "ROLE_NOT_ALLOWED",
        title: "Role mismatch",
        message: "This account exists, but it is not allowed to sign in under the selected role."
      }
    };
  }

  return record.result;
}
