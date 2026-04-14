import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  ActivityFeed,
  AvatarBadge,
  BackOfficeShell,
  Button,
  Card,
  CircularProgress,
  FileUploadList,
  PageHeader,
  StatusChip
} from "../../ui";
import type { ThemeMode } from "../../ui";
import { buildBackOfficeNavigation } from "../../app/navigation";
import { buildStudentProfileViewModel } from "./buildStudentProfileViewModel";
import type {
  StudentProfileGuardianCard,
  StudentProfileInfoField,
  StudentProfileSummaryMetric
} from "./studentProfile.types";
import styles from "./StudentProfilePage.module.css";

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

function detectViewport(width: number): "mobile" | "tablet" | "desktop" {
  if (width <= 720) {
    return "mobile";
  }

  if (width <= 1100) {
    return "tablet";
  }

  return "desktop";
}

function createActionIcon(token: "transfer" | "edit"): ReactNode {
  return <span aria-hidden="true" className={cx(styles.actionGlyph, styles[`actionGlyph${token}`])} />;
}

function renderField(field: StudentProfileInfoField) {
  return (
    <div className={styles.detailItem} key={field.id}>
      <span className={styles.detailLabel}>{field.label}</span>
      <strong className={styles.detailValue}>{field.value}</strong>
    </div>
  );
}

function renderMetric(metric: StudentProfileSummaryMetric) {
  return (
    <Card className={styles.metricCard} elevation="subtle" key={metric.id} padding="md">
      <div className={styles.metricCardBody}>
        <span className={styles.metricLabel}>{metric.label}</span>
        <strong className={styles.metricValue}>{metric.value}</strong>
        <span className={styles.metricMeta}>{metric.meta}</span>
      </div>
    </Card>
  );
}

function renderGuardianCard(guardian: StudentProfileGuardianCard) {
  return (
    <Card className={styles.guardianCard} elevation="subtle" key={guardian.id} padding="md">
      <div className={styles.guardianBody}>
        <span className={styles.detailLabel}>{guardian.label}</span>
        <strong className={styles.guardianName}>{guardian.name}</strong>
        <span className={styles.guardianMeta}>{guardian.meta}</span>
      </div>
    </Card>
  );
}

export interface StudentProfilePageProps {
  themeMode?: ThemeMode;
  onThemeToggle?: () => void;
}

export function StudentProfilePage(props: StudentProfilePageProps = {}) {
  const navigate = useNavigate();
  const viewModel = buildStudentProfileViewModel();
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">(() => {
    if (typeof window === "undefined") {
      return "desktop";
    }

    return detectViewport(window.innerWidth);
  });
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

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

  return (
    <BackOfficeShell
      className={styles.shell}
      mobileNavigationLabel="Open student profile menu"
      mobileNavigationOpen={mobileNavigationOpen}
      navigation={buildBackOfficeNavigation(viewModel.navigation, {
        navigateToRoute: navigate,
        onBeforeNavigate: () => {
          setMobileNavigationOpen(false);
        }
      })}
      navigationLabel="Student profile navigation"
      onMobileNavigationDismiss={() => {
        setMobileNavigationOpen(false);
      }}
      onMobileNavigationToggle={() => {
        setMobileNavigationOpen((current) => !current);
      }}
      onThemeToggle={props.onThemeToggle}
      themeMode={props.themeMode}
      userInitials="NS"
      userName="Nisha Sethi"
      userRole="School Admin"
      viewport={viewport}
    >
      <div className={styles.page}>
        <PageHeader
          actions={
            <div className={styles.headerActions}>
              <Button
                iconLeft={createActionIcon("transfer")}
                label="Transfer"
                size="lg"
                variant="secondary"
              />
              <Button
                iconLeft={createActionIcon("edit")}
                label="Edit Profile"
                size="lg"
              />
            </div>
          }
          description={viewModel.description}
          title={viewModel.title}
        />

        <Card className={styles.workspaceBody} elevation="subtle" padding="lg">
          <Card className={styles.summaryCard} elevation="raised" padding="lg">
            <div className={styles.summaryContent}>
              <div className={styles.identityBlock}>
                <AvatarBadge
                  className={styles.identityAvatar}
                  colorSeed={viewModel.identity.avatarSeed}
                  name={viewModel.identity.studentName}
                  size="lg"
                />

                <div className={styles.identityCopy}>
                  <div className={styles.identityHeading}>
                    <h2>{viewModel.identity.studentName}</h2>
                    <p>
                      Admission No. {viewModel.identity.admissionNumber} · Roll No.{" "}
                      {viewModel.identity.rollNumber} · {viewModel.identity.classLabel}
                    </p>
                  </div>

                  <div className={styles.identityChips}>
                    {viewModel.identity.statusChips.map((chip) => (
                      <StatusChip key={chip.id} label={chip.label} size="sm" tone={chip.tone} />
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.metricGrid}>
                {viewModel.identity.summaryMetrics.map(renderMetric)}
              </div>
            </div>
          </Card>

          <div className={styles.contentGrid}>
            <div className={styles.primaryColumn}>
              <Card
                className={styles.infoCard}
                description={viewModel.personalInfo.description}
                title={viewModel.personalInfo.title}
              >
                <div className={styles.infoFieldsGrid}>
                  {viewModel.personalInfo.fields.map(renderField)}
                </div>
                <div className={styles.infoDivider} />
                <div className={styles.fullWidthField}>{renderField(viewModel.personalInfo.fullWidthField)}</div>
              </Card>

              <Card
                className={styles.infoCard}
                description={viewModel.academicInfo.description}
                title={viewModel.academicInfo.title}
              >
                <div className={styles.infoFieldsGrid}>
                  {viewModel.academicInfo.fields.map(renderField)}
                </div>
                <div className={styles.infoDivider} />
                <div className={styles.footerFieldRow}>
                  <span className={styles.detailLabel}>{viewModel.academicInfo.footerField.label}</span>
                  <strong className={styles.footerFieldValue}>
                    {viewModel.academicInfo.footerField.value}
                  </strong>
                </div>
              </Card>

              <Card
                className={styles.infoCard}
                description={viewModel.guardianInfo.description}
                title={viewModel.guardianInfo.title}
              >
                <div className={styles.guardianGrid}>
                  {viewModel.guardianInfo.guardians.map(renderGuardianCard)}
                </div>
              </Card>
            </div>

            <div className={styles.secondaryColumn}>
              <Card
                className={styles.sideCard}
                description="Current month attendance view"
                title="Attendance Summary"
              >
                <div className={styles.attendanceBody}>
                  <CircularProgress
                    centerLabel={viewModel.attendanceSummary.valueLabel}
                    className={styles.attendanceMeter}
                    size="lg"
                    tone="accent"
                    value={viewModel.attendanceSummary.percentage}
                  />

                  <div className={styles.attendanceStats}>
                    {viewModel.attendanceSummary.stats.map((item) => (
                      <div className={styles.attendanceStat} key={item.id}>
                        <span className={styles.detailLabel}>{item.label}</span>
                        <strong className={styles.attendanceValue}>{item.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card
                className={styles.sideCard}
                description={viewModel.feeSummary.description}
                title={viewModel.feeSummary.title}
              >
                <div className={styles.feeMetricGrid}>
                  {viewModel.feeSummary.metrics.map((metric) => (
                    <Card className={styles.feeMetricCard} elevation="subtle" key={metric.id} padding="md">
                      <div className={styles.feeMetricBody}>
                        <span className={styles.detailLabel}>{metric.label}</span>
                        <strong className={styles.feeMetricValue}>{metric.value}</strong>
                      </div>
                    </Card>
                  ))}
                </div>
                <p className={styles.sideNote}>{viewModel.feeSummary.footerNote}</p>
              </Card>

              <Card className={styles.sideCard} title="Uploaded Documents">
                <FileUploadList className={styles.documentsList} items={viewModel.documents} />
              </Card>
            </div>
          </div>

          <div className={styles.footerGrid}>
            <Card className={styles.transportCard} title={viewModel.transport.title}>
              <div className={styles.transportBody}>
                <strong className={styles.transportValue}>{viewModel.transport.detail}</strong>
                <p className={styles.transportNote}>{viewModel.transport.note}</p>
              </div>
            </Card>

            <Card className={styles.activityCard} title="Recent Activity">
              <ActivityFeed
                className={styles.activityFeed}
                compact
                items={viewModel.activity.map((item, index) => ({
                  ...item,
                  leading: (
                    <span
                      aria-hidden="true"
                      className={cx(
                        styles.activityDot,
                        index === 1 && styles.activityDotAlt
                      )}
                    />
                  )
                }))}
              />
            </Card>
          </div>
        </Card>
      </div>
    </BackOfficeShell>
  );
}
