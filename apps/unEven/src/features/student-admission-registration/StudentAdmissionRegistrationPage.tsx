import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ChangeEventHandler,
  type ReactNode
} from "react";
import { useNavigate } from "react-router-dom";
import {
  BackOfficeShell,
  Button,
  Card,
  DataList,
  Field,
  FileUploadList,
  PageHeader,
  ProgressBar,
  StatusChip,
  StepProgress,
  Tabs
} from "../../ui";
import type {
  FileUploadListItem,
  ThemeMode
} from "../../ui";
import { buildBackOfficeNavigation } from "../../app/navigation";
import { buildStudentAdmissionRegistrationViewModel } from "./buildStudentAdmissionRegistrationViewModel";
import type { StudentAdmissionFormData } from "./studentAdmissionRegistration.types";
import styles from "./StudentAdmissionRegistrationPage.module.css";

function detectViewport(width: number): "mobile" | "tablet" | "desktop" {
  if (width <= 720) {
    return "mobile";
  }

  if (width <= 1100) {
    return "tablet";
  }

  return "desktop";
}

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

function createIcon(token: "save" | "submit"): ReactNode {
  return <span aria-hidden="true" className={cx(styles.buttonGlyph, styles[`buttonGlyph${token}`])} />;
}

type AdmissionMobileSection = "student" | "guardian" | "academic" | "address" | "documents" | "review";

const mobileSections: Array<{ value: AdmissionMobileSection; label: string }> = [
  { value: "student", label: "Student" },
  { value: "guardian", label: "Guardian" },
  { value: "academic", label: "Academic" },
  { value: "address", label: "Address" },
  { value: "documents", label: "Documents" },
  { value: "review", label: "Review" }
];

export interface StudentAdmissionRegistrationPageProps {
  themeMode?: ThemeMode;
  onThemeToggle?: () => void;
}

export function StudentAdmissionRegistrationPage(
  props: StudentAdmissionRegistrationPageProps = {}
) {
  const navigate = useNavigate();
  const viewModel = buildStudentAdmissionRegistrationViewModel();
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">(() => {
    if (typeof window === "undefined") {
      return "desktop";
    }

    return detectViewport(window.innerWidth);
  });
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [activeMobileSection, setActiveMobileSection] =
    useState<AdmissionMobileSection>("academic");
  const [form, setForm] = useState<StudentAdmissionFormData>(viewModel.form);
  const [documents, setDocuments] = useState<FileUploadListItem[]>(viewModel.documents);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "warning" | "danger";
    label: string;
    message: string;
  } | null>(null);

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

  function updateField(
    key: keyof StudentAdmissionFormData,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFeedback(null);
    setForm((current) => ({
      ...current,
      [key]: event.target.value
    }));
  }

  function textFieldHandler(
    key: keyof StudentAdmissionFormData
  ): ChangeEventHandler<HTMLInputElement> {
    return (event) => {
      updateField(key, event);
    };
  }

  function selectFieldHandler(
    key: keyof StudentAdmissionFormData
  ): ChangeEventHandler<HTMLSelectElement> {
    return (event) => {
      updateField(key, event);
    };
  }

  const applicantName = `${form.firstName} ${form.lastName}`.trim() || "Unnamed applicant";
  const primaryContact = form.guardianName.trim() || "Primary contact pending";
  const selectedClassLabel =
    viewModel.classOptions.find((option) => option.value === form.classApplyingFor)?.label ??
    "Class pending";
  const requiredDocumentsPending = documents.filter((item) => item.statusLabel !== "Uploaded").length;
  const isMobile = viewport === "mobile";
  const activeStepIndex = Math.max(
    viewModel.steps.findIndex((step) => step.id === viewModel.activeStepId),
    0
  );
  const activeStep = viewModel.steps[activeStepIndex] ?? viewModel.steps[0];

  const requiredMissing = useMemo(() => {
    return [
      form.firstName,
      form.lastName,
      form.dateOfBirth,
      form.gender,
      form.guardianName,
      form.contactNumber,
      form.emailAddress,
      form.classApplyingFor,
      form.academicYear
    ].some((value) => value.trim().length === 0);
  }, [
    form.academicYear,
    form.classApplyingFor,
    form.contactNumber,
    form.dateOfBirth,
    form.emailAddress,
    form.firstName,
    form.gender,
    form.guardianName,
    form.lastName
  ]);

  function handleSaveDraft() {
    setFeedback({
      tone: "success",
      label: "Draft saved",
      message: "Admission progress is saved locally and can be resumed before submission."
    });
  }

  function handleSubmit() {
    if (requiredMissing) {
      setFeedback({
        tone: "danger",
        label: "Required fields missing",
        message: "Complete the required student, guardian, and academic details before submission."
      });
      return;
    }

    if (requiredDocumentsPending > 0) {
      setFeedback({
        tone: "warning",
        label: "Documents pending",
        message: "Upload the remaining required admission documents before final submission."
      });
      return;
    }

    setFeedback({
      tone: "success",
      label: "Registration submitted",
      message: "The admission profile is ready for review and approval."
    });
  }

  function handleCancel() {
    navigate("/dashboard/admin");
  }

  function handleDocumentAction(item: FileUploadListItem) {
    setFeedback(null);
    setDocuments((current) =>
      current.map((document) =>
        document.id === item.id
          ? {
            ...document,
            statusLabel: "Uploaded",
            statusTone: "success",
            actionLabel: "Replace",
            actionVariant: "ghost"
          }
          : document
      )
    );
  }

  function renderStudentSection() {
    return (
      <section className={styles.formSection}>
        <div className={styles.sectionCopy}>
          <h2>Student Personal Details</h2>
          <p>Basic information for admission profile creation.</p>
        </div>
        <div className={styles.fieldGrid}>
          <Field
            label="First Name"
            required
            value={form.firstName}
            inputProps={{ onChange: textFieldHandler("firstName") }}
          />
          <Field
            label="Last Name"
            required
            value={form.lastName}
            inputProps={{ onChange: textFieldHandler("lastName") }}
          />
          <Field
            label="Date of Birth"
            required
            value={form.dateOfBirth}
            inputProps={{ onChange: textFieldHandler("dateOfBirth") }}
          />
          <Field
            label="Gender"
            options={viewModel.genderOptions}
            required
            type="select"
            value={form.gender}
            selectProps={{ onChange: selectFieldHandler("gender") }}
          />
          <Field
            helperText="Auto-generated after approval."
            label="Admission Number"
            placeholder="Auto-generated after approval"
            readOnly
            type="readOnly"
            value={form.admissionNumber || "Auto-generated after approval"}
          />
          <Field
            label="Blood Group (optional)"
            options={viewModel.bloodGroupOptions}
            placeholder="Select blood group"
            type="select"
            value={form.bloodGroup}
            selectProps={{ onChange: selectFieldHandler("bloodGroup") }}
          />
        </div>
      </section>
    );
  }

  function renderGuardianSection() {
    return (
      <section className={styles.formSection}>
        <div className={styles.sectionCopy}>
          <h2>Parent / Guardian Details</h2>
          <p>Primary contact details for communication and emergencies.</p>
        </div>
        <div className={styles.fieldGrid}>
          <Field
            label="Father / Guardian Name"
            required
            value={form.guardianName}
            inputProps={{ onChange: textFieldHandler("guardianName") }}
          />
          <Field
            label="Mother Name"
            value={form.motherName}
            inputProps={{ onChange: textFieldHandler("motherName") }}
          />
          <Field
            label="Primary Contact Number"
            required
            value={form.contactNumber}
            inputProps={{ onChange: textFieldHandler("contactNumber") }}
          />
          <Field
            label="Email Address"
            required
            value={form.emailAddress}
            inputProps={{ onChange: textFieldHandler("emailAddress") }}
          />
          <Field
            label="Relationship"
            options={viewModel.relationshipOptions}
            required
            type="select"
            value={form.relationship}
            selectProps={{ onChange: selectFieldHandler("relationship") }}
          />
          <Field
            label="Occupation"
            value={form.occupation}
            inputProps={{ onChange: textFieldHandler("occupation") }}
          />
        </div>
      </section>
    );
  }

  function renderAcademicSection() {
    return (
      <section className={styles.formSection}>
        <div className={styles.sectionCopy}>
          <h2>Academic Details</h2>
          <p>Application preferences and previous school information.</p>
        </div>
        <div className={styles.fieldGrid}>
          <Field
            errorText={feedback?.tone === "danger" && form.classApplyingFor.length === 0 ? "Required" : undefined}
            label="Class Applying For"
            options={viewModel.classOptions}
            required
            type="select"
            value={form.classApplyingFor}
            selectProps={{ onChange: selectFieldHandler("classApplyingFor") }}
          />
          <Field
            errorText={feedback?.tone === "danger" && form.academicYear.length === 0 ? "Required" : undefined}
            label="Academic Year"
            options={viewModel.academicYearOptions}
            required
            type="select"
            value={form.academicYear}
            selectProps={{ onChange: selectFieldHandler("academicYear") }}
          />
          <Field
            label="Previous School Name"
            value={form.previousSchoolName}
            inputProps={{ onChange: textFieldHandler("previousSchoolName") }}
          />
          <Field
            label="Last Class Completed"
            options={viewModel.lastClassOptions}
            type="select"
            value={form.lastClassCompleted}
            selectProps={{ onChange: selectFieldHandler("lastClassCompleted") }}
          />
        </div>
      </section>
    );
  }

  function renderSummaryPanel() {
    return (
      <Card
        actions={
          <StatusChip
            label={viewModel.summaryStatusLabel}
            size="sm"
            tone={feedback?.tone === "success" ? "success" : viewModel.summaryStatusTone}
          />
        }
        className={styles.summaryPanel}
        description="Current registration status and required items."
        padding="lg"
        title="Application Summary"
      >
        <div className={styles.summaryPanelBody}>
          <div className={styles.applicantSnapshot}>
            <span className={styles.applicantLabel}>Applicant</span>
            <strong className={styles.applicantName}>{applicantName}</strong>
            <p className={styles.applicantMeta}>{viewModel.applicantSummaryLabel}</p>
            <p className={styles.applicantMeta}>Primary contact · {primaryContact}</p>
          </div>

          <div className={styles.summaryProgressSection}>
            <h4>Completion Progress</h4>
            <ProgressBar
              className={styles.summaryProgressBar}
              label={null}
              size="md"
              tone="accent"
              value={viewModel.completionValue}
              valueLabel={null}
            />
            <p className={styles.summaryProgressHint}>
              {viewModel.completionLabel} · {viewModel.completionHint}
            </p>
          </div>

          <div className={styles.summaryNotes}>
            <DataList
              className={styles.checklistList}
              items={viewModel.checklist}
              renderItem={(item, index) => (
                <div className={styles.checklistRow}>
                  <span
                    aria-hidden="true"
                    className={cx(
                      styles.checklistMarker,
                      item.statusTone === "success" && styles.checklistMarkerComplete,
                      item.statusTone === "info" && styles.checklistMarkerCurrent,
                      item.statusTone === "neutral" && styles.checklistMarkerPending
                    )}
                  >
                    {item.statusTone === "success" ? "✓" : String(index + 1)}
                  </span>
                  <div className={styles.checklistCopy}>
                    <strong>{item.label}</strong>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </Card>
    );
  }

  function renderAddressCard() {
    return (
      <Card
        className={styles.addressCard}
        description="Address and medical context used during admissions review."
        padding="lg"
        title="Address Details"
      >
        <div className={styles.summaryFieldGrid}>
          <div className={styles.fullSpan}>
            <Field
              label="Address Line"
              readOnly
              type="readOnly"
              value={`${form.addressLine}\n${form.addressLandmark}`}
            />
          </div>
          <Field label="City" readOnly type="readOnly" value={form.city} />
          <Field label="State" readOnly type="readOnly" value={form.state} />
          <div className={styles.fullSpan}>
            <Field label="Pincode" readOnly type="readOnly" value={form.pincode} />
          </div>
          <div className={styles.fullSpan}>
            <Field
              label="Medical Notes (optional)"
              readOnly
              type="readOnly"
              value={form.medicalNotes}
            />
          </div>
        </div>
      </Card>
    );
  }

  function renderDocumentsCard() {
    return (
      <Card
        className={styles.documentsCard}
        description="Required uploads remain editable without stretching the summary column."
        padding="lg"
        title="Document Uploads"
      >
        <FileUploadList
          className={styles.uploadList}
          items={documents}
          onAction={handleDocumentAction}
        />
      </Card>
    );
  }

  function renderFooterCard() {
    return (
      <Card
        actions={
          <div className={styles.footerActions}>
            <Button label="Cancel" onClick={handleCancel} variant="secondary" />
            <Button label="Save Draft" onClick={handleSaveDraft} variant="secondary" />
            <Button
              iconRight={createIcon("submit")}
              label="Submit Registration"
              onClick={handleSubmit}
            />
          </div>
        }
        className={styles.footerCard}
        description={viewModel.footerDescription}
        title={viewModel.footerTitle}
      />
    );
  }

  function renderFormCard(section: ReactNode) {
    return (
      <Card className={styles.formCard} padding="lg">
        <div className={styles.formSections}>{section}</div>
      </Card>
    );
  }

  function renderDesktopWorkspace() {
    return (
      <>
        <div className={styles.contentGrid}>
          {renderFormCard(
            <>
              {renderStudentSection()}
              {renderGuardianSection()}
              {renderAcademicSection()}
            </>
          )}
          {renderSummaryPanel()}
          {renderAddressCard()}
          {renderDocumentsCard()}
        </div>
        {renderFooterCard()}
      </>
    );
  }

  function renderMobileWorkspace() {
    switch (activeMobileSection) {
      case "student":
        return renderFormCard(renderStudentSection());
      case "guardian":
        return renderFormCard(renderGuardianSection());
      case "address":
        return renderAddressCard();
      case "documents":
        return renderDocumentsCard();
      case "review":
        return (
          <>
            {renderSummaryPanel()}
            {renderFooterCard()}
          </>
        );
      case "academic":
      default:
        return renderFormCard(renderAcademicSection());
    }
  }

  function renderProgressHeader() {
    if (isMobile) {
      return (
        <div className={styles.mobileProgressStrip}>
          <span>{activeStep?.label ?? "In progress"}</span>
          <span aria-hidden="true" className={styles.mobileProgressDivider} />
          <strong>Step {activeStepIndex + 1} of {viewModel.steps.length}</strong>
          <span aria-hidden="true" className={styles.mobileProgressDivider} />
          <span>{activeStep?.description ?? "In progress"}</span>
        </div>
      );
    }

    return (
      <Card className={styles.stepCard} padding="lg">
        <StepProgress
          activeStepId={viewModel.activeStepId}
          className={styles.stepProgress}
          orientation="horizontal"
          showStatusChips={false}
          showProgressBar={false}
          steps={viewModel.steps}
          valueLabel={null}
        />
      </Card>
    );
  }

  return (
    <BackOfficeShell
      brandName="Greenfield"
      brandSubtitle="School Management System"
      className={styles.shell}
      mobileNavigationLabel="Open admissions menu"
      mobileNavigationOpen={mobileNavigationOpen}
      navigation={buildBackOfficeNavigation(viewModel.navigation, {
        navigateToRoute: navigate,
        onBeforeNavigate: () => {
          setMobileNavigationOpen(false);
        }
      })}
      navigationLabel="Admissions navigation"
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
      userRole="Admin"
      viewport={viewport}
    >
      <div className={styles.page}>
        <PageHeader
          actions={
            <div className={styles.headerActions}>
              <div className={styles.headerActionButtons}>
                <Button
                  iconLeft={createIcon("save")}
                  label="Save Draft"
                  onClick={handleSaveDraft}
                  variant="secondary"
                />
                {!isMobile ? (
                  <Button
                    iconRight={createIcon("submit")}
                    label="Submit Registration"
                    onClick={handleSubmit}
                  />
                ) : null}
              </div>
              {feedback ? (
                <div className={styles.inlineStatus}>
                  <StatusChip label={feedback.label} size="sm" tone={feedback.tone} />
                  <p>{feedback.message}</p>
                </div>
              ) : null}
            </div>
          }
          description={viewModel.description}
          title={viewModel.title}
        />

        <section className={styles.workspaceBody}>
          {renderProgressHeader()}

          {isMobile ? (
            <>
              <Tabs
                activeValue={activeMobileSection}
                aria-label="Admission mobile sections"
                className={styles.mobileSectionTabs}
                items={mobileSections}
                size="sm"
                onValueChange={(value) => {
                  setActiveMobileSection(value as AdmissionMobileSection);
                }}
              />
              {renderMobileWorkspace()}
            </>
          ) : (
            renderDesktopWorkspace()
          )}
        </section>
      </div>
    </BackOfficeShell>
  );
}
