import type { ReactNode } from "react";
import {
  Card,
  type CardElevation,
  type CardPadding,
  useTenantContext
} from "../../foundations/index";
import styles from "./AuthShell.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export interface AuthShellProps {
  children: ReactNode;
  marketingPanel?: ReactNode;
  marketingFooter?: ReactNode;
  brand?: ReactNode;
  authTitle?: ReactNode;
  authDescription?: ReactNode;
  authActions?: ReactNode;
  authFooter?: ReactNode;
  authCardPadding?: CardPadding;
  authCardElevation?: CardElevation;
  className?: string;
  viewport?: "mobile" | "tablet" | "desktop";
  stackedSectionOrder?: "marketing-first" | "auth-first";
  shellSurface?: "default" | "plain";
  marketingSurface?: "default" | "plain";
}

function DefaultBrand() {
  const tenant = useTenantContext();
  const brandLabel = tenant.display.shortName || tenant.display.displayName;
  const showLogo = Boolean(tenant.branding.logoSrc);

  return (
    <div className={styles.brandBlock}>
      <div className={styles.brandIdentity}>
        {showLogo ? (
          <img
            alt={`${brandLabel} logo`}
            className={styles.brandLogo}
            src={tenant.branding.logoSrc}
          />
        ) : (
          <div aria-hidden="true" className={styles.brandMonogram}>
            {brandLabel.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className={styles.brandText}>
          <span className={styles.brandEyebrow}>Tenant Access</span>
          <strong className={styles.brandName}>{tenant.display.displayName}</strong>
        </div>
      </div>
      {tenant.contact.email ? (
        <span className={styles.brandMeta}>{tenant.contact.email}</span>
      ) : null}
    </div>
  );
}

export function AuthShell(props: AuthShellProps) {
  const sections =
    props.viewport !== "desktop" && props.stackedSectionOrder === "auth-first"
      ? [
          <section key="auth" className={styles.authPanel}>
            <div className={styles.authPanelInner}>
              <Card
                actions={props.authActions}
                className={styles.authCard}
                description={props.authDescription}
                elevation={props.authCardElevation ?? "raised"}
                padding={props.authCardPadding ?? "lg"}
                title={props.authTitle}
              >
                <div className={styles.authCardContent}>{props.children}</div>
              </Card>
              {props.authFooter ? (
                <div className={styles.authFooter}>{props.authFooter}</div>
              ) : null}
            </div>
          </section>,
          <section key="marketing" className={styles.marketingPanel}>
            <div
              className={cx(
                styles.marketingInner,
                props.marketingSurface === "plain" && styles.marketingInnerPlain
              )}
            >
              <div className={styles.brand}>{props.brand ?? <DefaultBrand />}</div>
              {props.marketingPanel ? (
                <div className={styles.marketingContent}>{props.marketingPanel}</div>
              ) : null}
              {props.marketingFooter ? (
                <div className={styles.marketingFooter}>{props.marketingFooter}</div>
              ) : null}
            </div>
          </section>
        ]
      : [
          <section key="marketing" className={styles.marketingPanel}>
            <div
              className={cx(
                styles.marketingInner,
                props.marketingSurface === "plain" && styles.marketingInnerPlain
              )}
            >
              <div className={styles.brand}>{props.brand ?? <DefaultBrand />}</div>
              {props.marketingPanel ? (
                <div className={styles.marketingContent}>{props.marketingPanel}</div>
              ) : null}
              {props.marketingFooter ? (
                <div className={styles.marketingFooter}>{props.marketingFooter}</div>
              ) : null}
            </div>
          </section>,
          <section key="auth" className={styles.authPanel}>
            <div className={styles.authPanelInner}>
              <Card
                actions={props.authActions}
                className={styles.authCard}
                description={props.authDescription}
                elevation={props.authCardElevation ?? "raised"}
                padding={props.authCardPadding ?? "lg"}
                title={props.authTitle}
              >
                <div className={styles.authCardContent}>{props.children}</div>
              </Card>
              {props.authFooter ? (
                <div className={styles.authFooter}>{props.authFooter}</div>
              ) : null}
            </div>
          </section>
        ];

  return (
    <div
      className={cx(
        styles.shell,
        props.shellSurface === "plain" && styles.shellPlain,
        props.viewport === "tablet" && styles.viewportTablet,
        props.viewport === "mobile" && styles.viewportMobile,
        props.className
      )}
    >
      {sections}
    </div>
  );
}
