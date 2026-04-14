import {
  useEffect,
  useState,
  type ChangeEvent,
  type ReactNode
} from "react";
import { useNavigate } from "react-router-dom";
import type { ThemeMode } from "../../ui";
import {
  BackOfficeShell,
  Button,
  Card,
  DataList,
  Field,
  PageHeader,
  SegmentedControl,
  StatusChip,
  Tabs,
  mapStatusChipTone
} from "../../ui";
import { buildBackOfficeNavigation } from "../../app/navigation";
import { buildSettingsMasterViewModel } from "./buildSettingsMasterViewModel";
import type {
  SettingsBrandingProfile,
  SettingsMasterSection,
  SettingsMasterSectionId,
  SettingsSchoolProfile,
  SettingsSimpleMasterRecord
} from "./settingsMaster.types";
import styles from "./SettingsMasterPage.module.css";

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

function deepEqualStringShape<T extends object>(recordA: T, recordB: T) {
  const shapeA = recordA as Record<string, string>;
  const shapeB = recordB as Record<string, string>;
  const keysA = Object.keys(shapeA);
  const keysB = Object.keys(shapeB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every((key) => shapeA[key] === shapeB[key]);
}

function MasterListCard(props: {
  title: string;
  description: string;
  items: SettingsSimpleMasterRecord[];
  actionLabel?: string;
  readOnlyMode: boolean;
}) {
  const { actionLabel = "Add entry", description, items, readOnlyMode, title } = props;

  return (
    <Card
      className={styles.settingsCard}
      actions={
        <Button disabled={readOnlyMode} label={actionLabel} size="sm" variant="secondary" />
      }
      description={description}
      title={title}
    >
      <DataList
        className={styles.masterList}
        emptyState={<p className={styles.emptyState}>No records configured yet.</p>}
        items={items}
        renderItem={(item) => (
          <div className={styles.masterListRow}>
            <div className={styles.masterListCopy}>
              <strong>{item.label}</strong>
              {item.helper ? <span>{item.helper}</span> : null}
            </div>
            <Button disabled={readOnlyMode} label="Edit" size="sm" variant="ghost" />
          </div>
        )}
      />
    </Card>
  );
}

function RoleListCard(props: {
  readOnlyMode: boolean;
  roles: ReturnType<typeof buildSettingsMasterViewModel>["userRoles"];
}) {
  return (
    <Card
      className={styles.settingsCard}
      actions={
        <Button disabled={props.readOnlyMode} label="Add role" size="sm" variant="secondary" />
      }
      description="Role templates define the initial visibility intent before backend permission enforcement."
      title="User Roles"
    >
      <DataList
        className={styles.masterList}
        items={props.roles}
        renderItem={(item) => (
          <div className={styles.masterListRow}>
            <div className={styles.masterListCopy}>
              <strong>{item.label}</strong>
              <span>{item.summary}</span>
            </div>
            <div className={styles.rowMeta}>
              <StatusChip label={item.status} size="sm" tone={mapStatusChipTone(item.status)} />
              <Button disabled={props.readOnlyMode} label="Review" size="sm" variant="ghost" />
            </div>
          </div>
        )}
      />
    </Card>
  );
}

function TransportListCard(props: {
  readOnlyMode: boolean;
  routes: ReturnType<typeof buildSettingsMasterViewModel>["transportRoutes"];
}) {
  return (
    <Card
      className={styles.settingsCard}
      actions={
        <Button disabled={props.readOnlyMode} label="Add route" size="sm" variant="secondary" />
      }
      description="Route masters should stay aligned with fee-linkage and assignment capacity rules."
      title="Transport Routes"
    >
      <DataList
        className={styles.masterList}
        items={props.routes}
        renderItem={(item) => (
          <div className={styles.masterListRow}>
            <div className={styles.masterListCopy}>
              <strong>{item.label}</strong>
              <span>{item.summary}</span>
            </div>
            <div className={styles.rowMeta}>
              <StatusChip label={item.status} size="sm" tone={mapStatusChipTone(item.status)} />
              <Button disabled={props.readOnlyMode} label="Inspect" size="sm" variant="ghost" />
            </div>
          </div>
        )}
      />
    </Card>
  );
}

export interface SettingsMasterPageProps {
  themeMode?: ThemeMode;
  onThemeToggle?: () => void;
}

export function SettingsMasterPage(props: SettingsMasterPageProps = {}) {
  const navigate = useNavigate();
  const viewModel = buildSettingsMasterViewModel();
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">(() => {
    if (typeof window === "undefined") {
      return "desktop";
    }

    return detectViewport(window.innerWidth);
  });
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsMasterSectionId>("school-profile");
  const [mode, setMode] = useState<"read" | "edit">("edit");
  const [schoolProfile, setSchoolProfile] = useState<SettingsSchoolProfile>(viewModel.schoolProfile);
  const [brandingProfile, setBrandingProfile] = useState<SettingsBrandingProfile>(
    viewModel.brandingProfile
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");

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

  const hasUnsavedChanges =
    !deepEqualStringShape(schoolProfile, viewModel.schoolProfile) ||
    !deepEqualStringShape(brandingProfile, viewModel.brandingProfile);
  const activeSectionMeta = viewModel.sections.find((section) => section.id === activeSection);
  const readOnlyMode = mode === "read";

  function updateSchoolProfile(
    key: keyof SettingsSchoolProfile,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setSaveState("idle");
    setValidationError(null);
    setSchoolProfile((current) => ({
      ...current,
      [key]: event.target.value
    }));
  }

  function updateBrandingProfile(
    key: keyof SettingsBrandingProfile,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setSaveState("idle");
    setValidationError(null);
    setBrandingProfile((current) => ({
      ...current,
      [key]: event.target.value
    }));
  }

  function resetChanges() {
    setSchoolProfile(viewModel.schoolProfile);
    setBrandingProfile(viewModel.brandingProfile);
    setValidationError(null);
    setSaveState("idle");
  }

  function handleSave() {
    if (schoolProfile.schoolName.trim().length === 0 || brandingProfile.shortName.trim().length === 0) {
      setValidationError(
        "School name and short name are required before configuration can be staged."
      );
      setSaveState("idle");
      return;
    }

    setValidationError(null);
    setSaveState("saved");
  }

  function renderWorkspaceStatus() {
    if (hasUnsavedChanges) {
      return (
        <Card className={cx(styles.statusBanner, styles.statusBannerWarning)} elevation="subtle">
          <div className={styles.statusBannerBody}>
            <StatusChip label="Unsaved changes" tone="warning" />
            <p>Profile or branding values have changed. Save or reset before switching to backend-driven persistence.</p>
          </div>
        </Card>
      );
    }

    if (activeSection === "user-roles") {
      return (
        <Card className={cx(styles.statusBanner, styles.statusBannerInfo)} elevation="subtle">
          <div className={styles.statusBannerBody}>
            <StatusChip label="Conflict placeholder" tone="info" />
            <p>Role template saves will need optimistic version checks once the settings APIs exist.</p>
          </div>
        </Card>
      );
    }

    return null;
  }

  function renderSectionContent(): ReactNode {
    switch (activeSection) {
      case "school-profile":
        return (
          <div className={styles.sectionGrid}>
            <Card
              className={styles.settingsCard}
              description="Main school identity used across receipts, notices, and reports."
              title="School Profile"
            >
              <div className={styles.formGrid}>
                <Field
                  inputProps={{
                    onChange: (event: ChangeEvent<HTMLInputElement>) => {
                      updateSchoolProfile("schoolName", event);
                    }
                  }}
                  label="School Name"
                  readOnly={readOnlyMode}
                  value={schoolProfile.schoolName}
                />
                <Field
                  inputProps={{
                    onChange: (event: ChangeEvent<HTMLInputElement>) => {
                      updateSchoolProfile("schoolCode", event);
                    }
                  }}
                  label="School Code"
                  readOnly={readOnlyMode}
                  value={schoolProfile.schoolCode}
                />
                <Field
                  inputProps={{
                    onChange: (event: ChangeEvent<HTMLInputElement>) => {
                      updateSchoolProfile("contactEmail", event);
                    }
                  }}
                  label="Contact Email"
                  readOnly={readOnlyMode}
                  value={schoolProfile.contactEmail}
                />
                <Field
                  inputProps={{
                    onChange: (event: ChangeEvent<HTMLInputElement>) => {
                      updateSchoolProfile("phone", event);
                    }
                  }}
                  label="Phone"
                  readOnly={readOnlyMode}
                  value={schoolProfile.phone}
                />
                <div className={styles.fullSpan}>
                  <Field
                    label="Campus Address"
                    readOnly={readOnlyMode}
                    textareaProps={{
                      onChange: (event: ChangeEvent<HTMLTextAreaElement>) => {
                        updateSchoolProfile("campusAddress", event);
                      },
                      rows: 4
                    }}
                    type="textarea"
                    value={schoolProfile.campusAddress}
                  />
                </div>
              </div>
            </Card>
            <Card
              className={styles.settingsCard}
              description="Operational note"
              title="Why this matters"
            >
              <div className={styles.sideNotes}>
                <p>These values should remain stable because downstream receipts, notices, and exports read from the same settings source.</p>
                <StatusChip label="Upstream config" tone="info" />
              </div>
            </Card>
          </div>
        );
      case "branding":
        return (
          <div className={styles.sectionGrid}>
            <Card
              className={styles.settingsCard}
              description="Branding and document defaults should stay normalized for future tenant bootstrap and print artifacts."
              title="Branding & Documents"
            >
              <div className={styles.formGrid}>
                <Field
                  inputProps={{
                    onChange: (event: ChangeEvent<HTMLInputElement>) => {
                      updateBrandingProfile("shortName", event);
                    }
                  }}
                  label="Short Name"
                  readOnly={readOnlyMode}
                  value={brandingProfile.shortName}
                />
                <Field
                  label="Currency"
                  options={[
                    { label: "INR", value: "INR" },
                    { label: "USD", value: "USD" },
                    { label: "EUR", value: "EUR" }
                  ]}
                  readOnly={readOnlyMode}
                  selectProps={{
                    onChange: (event: ChangeEvent<HTMLSelectElement>) => {
                      updateBrandingProfile("currency", event);
                    }
                  }}
                  type="select"
                  value={brandingProfile.currency}
                />
                <Field
                  label="Locale"
                  options={[
                    { label: "English (India)", value: "en-IN" },
                    { label: "English (US)", value: "en-US" }
                  ]}
                  readOnly={readOnlyMode}
                  selectProps={{
                    onChange: (event: ChangeEvent<HTMLSelectElement>) => {
                      updateBrandingProfile("locale", event);
                    }
                  }}
                  type="select"
                  value={brandingProfile.locale}
                />
                <Field
                  label="Timezone"
                  options={[
                    { label: "Asia/Kolkata", value: "Asia/Kolkata" },
                    { label: "UTC", value: "UTC" }
                  ]}
                  readOnly={readOnlyMode}
                  selectProps={{
                    onChange: (event: ChangeEvent<HTMLSelectElement>) => {
                      updateBrandingProfile("timezone", event);
                    }
                  }}
                  type="select"
                  value={brandingProfile.timezone}
                />
                <div className={styles.fullSpan}>
                  <Field
                  inputProps={{
                    onChange: (event: ChangeEvent<HTMLInputElement>) => {
                        updateBrandingProfile("documentHeaderTitle", event);
                      }
                    }}
                    label="Document Header Title"
                    readOnly={readOnlyMode}
                    value={brandingProfile.documentHeaderTitle}
                  />
                </div>
                <div className={styles.fullSpan}>
                  <Field
                    label="Document Footer Text"
                    readOnly={readOnlyMode}
                    textareaProps={{
                      onChange: (event: ChangeEvent<HTMLTextAreaElement>) => {
                        updateBrandingProfile("documentFooterText", event);
                      },
                      rows: 3
                    }}
                    type="textarea"
                    value={brandingProfile.documentFooterText}
                  />
                </div>
              </div>
            </Card>
            <Card className={styles.settingsCard} description="Preview-ready defaults" title="Current Tenant Defaults">
              <div className={styles.defaultGrid}>
                <div>
                  <span>Primary identity</span>
                  <strong>{viewModel.tenant.display.displayName}</strong>
                </div>
                <div>
                  <span>Locale / timezone</span>
                  <strong>
                    {brandingProfile.locale} · {brandingProfile.timezone}
                  </strong>
                </div>
                <div>
                  <span>Currency</span>
                  <strong>{brandingProfile.currency}</strong>
                </div>
              </div>
            </Card>
          </div>
        );
      case "academic-year":
        return (
          <Card
            className={styles.settingsCard}
            actions={
              <Button disabled={readOnlyMode} label="Add academic year" size="sm" variant="secondary" />
            }
            description="Manage active and historical academic sessions."
            title="Academic Year"
          >
            <DataList
              className={styles.masterList}
              items={viewModel.academicYears}
              renderItem={(item) => (
                <div className={styles.masterListRow}>
                  <div className={styles.masterListCopy}>
                    <strong>{item.label}</strong>
                    <span>
                      {item.startDate} to {item.endDate}
                    </span>
                  </div>
                  <div className={styles.rowMeta}>
                    <StatusChip label={item.status} size="sm" tone={mapStatusChipTone(item.status)} />
                    <Button disabled={readOnlyMode} label="Review" size="sm" variant="ghost" />
                  </div>
                </div>
              )}
            />
          </Card>
        );
      case "class-master":
        return (
          <MasterListCard
            actionLabel="Add class"
            description="Class labels should remain normalized because admissions and allocation both depend on them."
            items={viewModel.classes}
            readOnlyMode={readOnlyMode}
            title="Class Master"
          />
        );
      case "section-master":
        return (
          <MasterListCard
            actionLabel="Add section"
            description="Reusable section labels should stay independent from class assignment."
            items={viewModel.sectionsMaster}
            readOnlyMode={readOnlyMode}
            title="Section Master"
          />
        );
      case "fee-heads":
        return (
          <MasterListCard
            actionLabel="Add fee head"
            description="Fee heads are upstream for payment posting and receipt generation."
            items={viewModel.feeHeads}
            readOnlyMode={readOnlyMode}
            title="Fee Heads"
          />
        );
      case "user-roles":
        return <RoleListCard readOnlyMode={readOnlyMode} roles={viewModel.userRoles} />;
      case "notice-categories":
        return (
          <MasterListCard
            actionLabel="Add category"
            description="Notice categories provide reusable publish metadata without changing notice composition logic."
            items={viewModel.noticeCategories}
            readOnlyMode={readOnlyMode}
            title="Notice Categories"
          />
        );
      case "transport-routes":
        return <TransportListCard readOnlyMode={readOnlyMode} routes={viewModel.transportRoutes} />;
      default:
        return null;
    }
  }

  return (
    <BackOfficeShell
      className={styles.shell}
      onMobileNavigationDismiss={() => {
        setMobileNavigationOpen(false);
      }}
      mobileNavigationLabel="Open sections"
      mobileNavigationOpen={mobileNavigationOpen}
      navigation={buildBackOfficeNavigation(viewModel.navigation, {
        navigateToRoute: navigate,
        onBeforeNavigate: () => {
          setMobileNavigationOpen(false);
        }
      })}
      onMobileNavigationToggle={() => {
        setMobileNavigationOpen((current) => !current);
      }}
      onThemeToggle={props.onThemeToggle}
      themeMode={props.themeMode}
      viewport={viewport}
    >
      <div className={styles.page}>
        <PageHeader
          actions={
            <div className={styles.headerActions}>
              <div className={styles.headerActionButtons}>
                <Button label="Reset" onClick={resetChanges} variant="secondary" />
                <Button label="Save Configuration" onClick={handleSave} />
              </div>
              {validationError ? (
                <div className={styles.inlineStatus}>
                  <StatusChip label="Validation error" size="sm" tone="danger" />
                  <p>{validationError}</p>
                </div>
              ) : null}
              {!validationError && saveState === "saved" ? (
                <div className={styles.inlineStatus}>
                  <StatusChip label="Saved locally" size="sm" tone="success" />
                  <p>Configuration changes are staged and ready for future API wiring.</p>
                </div>
              ) : null}
            </div>
          }
          description={viewModel.description}
          meta={
            <>
              <StatusChip label="Draft" tone="info" />
              {hasUnsavedChanges ? <StatusChip label="Unsaved" tone="warning" /> : null}
            </>
          }
          title={viewModel.title}
        />

        <section className={styles.workspace}>
          <div className={styles.workspaceBody}>
            <div className={styles.workspaceHeader}>
              <div className={styles.workspaceHeaderCopy}>
                <h2>{activeSectionMeta?.label}</h2>
                <p>{activeSectionMeta?.description}</p>
              </div>
              <SegmentedControl
                activeValue={mode}
                className={styles.modeSwitch}
                items={[
                  { value: "edit", label: "Editable" },
                  { value: "read", label: "Read only" }
                ]}
                onValueChange={(value) => {
                  setMode(value === "read" ? "read" : "edit");
                }}
                size="sm"
              />
            </div>

            <Tabs
              activeValue={activeSection}
              className={styles.tabs}
              items={viewModel.sections.map((section: SettingsMasterSection) => ({
                value: section.id,
                label: section.label
              }))}
              onValueChange={(value) => {
                setActiveSection(value as SettingsMasterSectionId);
              }}
              size="sm"
            />

            {renderWorkspaceStatus()}
            {renderSectionContent()}
          </div>
        </section>
      </div>
    </BackOfficeShell>
  );
}
