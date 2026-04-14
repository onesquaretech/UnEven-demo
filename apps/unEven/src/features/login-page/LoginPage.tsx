import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { AuthShell, Button, Card, Checkbox, MetricCard, StatusChip } from "../../ui";
import { buildLoginPageViewModel } from "./buildLoginPageViewModel";
import { submitMockLogin } from "./mockLoginGateway";
import type {
  LoginFailure,
  LoginFormCommand,
  LoginRoleCode,
  LoginSessionPreview
} from "./loginPage.types";
import styles from "./LoginPage.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

function roleLabel(role: LoginRoleCode) {
  switch (role) {
    case "school_admin":
      return "School Admin";
    case "accountant":
      return "Accountant";
    case "teacher":
      return "Teacher";
    case "parent":
      return "Parent";
    default:
      return role;
  }
}

function featureIcon(index: number) {
  if (index === 0) {
    return "grid";
  }
  if (index === 1) {
    return "trend";
  }
  return "shield";
}

const initialForm: LoginFormCommand = {
  schoolCode: "",
  identifier: "",
  password: "",
  requestedRole: "school_admin",
  rememberMe: true
};

function detectViewport(width: number): "mobile" | "tablet" | "desktop" {
  if (width <= 720) {
    return "mobile";
  }

  if (width <= 1100) {
    return "tablet";
  }

  return "desktop";
}

function renderMetricValue(metric: { id: string; value: string }) {
  if (metric.id !== "fee-collection" || !metric.value.startsWith("₹")) {
    return metric.value;
  }

  return (
    <span className={styles.metricValueCurrency}>
      <span className={styles.metricValueSymbol}>₹</span>
      <span className={styles.metricValueAmount}>{metric.value.slice(1)}</span>
    </span>
  );
}

export function LoginPage() {
  const viewModel = buildLoginPageViewModel();
  const [form, setForm] = useState<LoginFormCommand>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<LoginFailure | null>(null);
  const [session, setSession] = useState<LoginSessionPreview | null>(null);
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">(() => {
    if (typeof window === "undefined") {
      return "desktop";
    }

    return detectViewport(window.innerWidth);
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    function handleResize() {
      setViewport(detectViewport(window.innerWidth));
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setError(null);
    setSession(null);

    const result = await submitMockLogin(form);

    setIsSubmitting(false);

    if (result.ok) {
      setSession(result.session);
      return;
    }

    setError(result.error);
  }

  const marketingPanel = (
    <div className={styles.marketingPanel}>
      <div className={styles.brandRibbon}>
        <div aria-hidden="true" className={styles.brandMark}>
          <span className={styles.brandMarkPrimary} />
          <span className={styles.brandMarkSecondary} />
        </div>
        <div className={styles.brandTitleRow}>
          <strong className={styles.brandTitle}>{viewModel.tenant.display.displayName}</strong>
          <span className={styles.planChip}>{viewModel.planLabel}</span>
        </div>
      </div>

      <div className={styles.heroBlock}>
        <h1 className={styles.heroTitle}>
          <span>Run daily school</span>
          <span>operations with clarity.</span>
        </h1>
        <p className={styles.heroBody}>
          Admissions, attendance, fees, notices, and records in one simple system.
        </p>
      </div>

      <div className={styles.featureList}>
        {viewModel.features.map((feature, index) => (
          <div key={feature.id} className={styles.featureRow}>
            <div className={styles.featureIconWrap}>
              <span
                aria-hidden="true"
                className={cx(
                  styles.featureIcon,
                  featureIcon(index) === "grid" && styles.featureIconGrid,
                  featureIcon(index) === "trend" && styles.featureIconTrend,
                  featureIcon(index) === "shield" && styles.featureIconShield
                )}
              />
            </div>
            <div className={styles.featureText}>
              <strong>{feature.title}</strong>
              <span>{feature.description}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.previewDeck}>
        <MetricCard
          className={styles.previewCardAttendance}
          elevation="raised"
          label={viewModel.metrics[0].label}
          meta={viewModel.metrics[0].meta}
          value={renderMetricValue(viewModel.metrics[0])}
        />
        <MetricCard
          className={styles.previewCardFinance}
          elevation="raised"
          label={viewModel.metrics[1].label}
          meta={viewModel.metrics[1].meta}
          value={renderMetricValue(viewModel.metrics[1])}
        />
        <MetricCard
          className={styles.previewCardAdmissions}
          elevation="raised"
          label={viewModel.metrics[2].label}
          meta={viewModel.metrics[2].meta}
          value={renderMetricValue(viewModel.metrics[2])}
        />
      </div>
    </div>
  );

  return (
    <AuthShell
      authDescription={viewModel.description}
      authFooter={<p className={styles.footerNote}>{viewModel.footerNote}</p>}
      brand={<span className={styles.brandSpacer} aria-hidden="true" />}
      className={styles.shell}
      authTitle={viewModel.title}
      marketingFooter={
        <p className={styles.marketingFooter}>
          Modern School Management System · {viewModel.planLabel}
        </p>
      }
      marketingPanel={marketingPanel}
      marketingSurface="plain"
      shellSurface="plain"
      stackedSectionOrder="auth-first"
      viewport={viewport}
    >
      <div className={styles.content}>
        <section className={styles.formSection}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>School Code</span>
                <input
                  className={styles.control}
                  placeholder="Enter school code"
                  type="text"
                  value={form.schoolCode}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      schoolCode: event.target.value
                    }));
                  }}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Email or Username</span>
                <input
                  autoComplete="username"
                  className={styles.control}
                  placeholder="Enter email or username"
                  type="text"
                  value={form.identifier}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      identifier: event.target.value
                    }));
                  }}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Password</span>
                <div className={styles.passwordWrap}>
                  <input
                    autoComplete="current-password"
                    className={cx(styles.control, styles.passwordControl)}
                    placeholder="Enter password"
                    type="password"
                    value={form.password}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        password: event.target.value
                      }));
                    }}
                  />
                  <span aria-hidden="true" className={styles.passwordEye} />
                </div>
              </label>
            </div>

            <div className={styles.roleGroup}>
              <span className={styles.fieldLabel}>Access as</span>
              <div className={styles.rolePills}>
                {viewModel.roleOptions.map((role) => {
                  const selected = role.code === form.requestedRole;

                  return (
                    <button
                      key={role.code}
                      className={cx(styles.rolePill, selected && styles.rolePillSelected)}
                      type="button"
                      onClick={() => {
                        setForm((current) => ({
                          ...current,
                          requestedRole: role.code
                        }));
                      }}
                    >
                      {role.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.formActions}>
                <Checkbox
                checked={form.rememberMe}
                label="Keep me signed in"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setForm((current) => ({
                    ...current,
                    rememberMe: event.target.checked
                  }));
                }}
              />
              <button className={styles.linkButton} type="button">
                Forgot password?
              </button>
            </div>

            {error ? (
              <Card className={cx(styles.feedbackCard, styles.feedbackDanger)} elevation="subtle">
                <div className={styles.feedbackHeader}>
                  <StatusChip label={error.code} tone="danger" />
                  <strong>{error.title}</strong>
                </div>
                <p className={styles.feedbackText}>{error.message}</p>
              </Card>
            ) : null}

            {session ? (
              <Card className={cx(styles.feedbackCard, styles.feedbackSuccess)} elevation="subtle">
                <div className={styles.feedbackHeader}>
                  <StatusChip label="SESSION_READY" tone="success" />
                  <strong>{session.displayName}</strong>
                </div>
                <p className={styles.feedbackText}>
                  Role <strong>{roleLabel(session.activeRole)}</strong> resolved successfully. The
                  ERP bootstrap would continue to <strong>{session.nextRoute}</strong>.
                </p>
                <div className={styles.permissionList}>
                  {session.permissionCodes.map((permission) => (
                    <span key={permission} className={styles.permissionPill}>
                      {permission}
                    </span>
                  ))}
                </div>
              </Card>
            ) : null}

            <Button
              fullWidth
              label={isSubmitting ? "Validating access..." : "Sign in"}
              loading={isSubmitting}
              size="lg"
              type="submit"
            />

            <div className={styles.inlineDivider}>
              <span />
              <p>Secure role-based login</p>
              <span />
            </div>

            <p className={styles.helpText}>
              Need help signing in? Contact your school administrator.
            </p>
          </form>
        </section>
      </div>
    </AuthShell>
  );
}
