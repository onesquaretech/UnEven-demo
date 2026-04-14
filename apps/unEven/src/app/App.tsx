import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { TenantContextProvider } from "../ui";
import { LoginPage } from "../features/login-page";
import { loginPageTenant } from "../features/login-page/loginPage.fixtures";
import { SettingsMasterPage } from "../features/settings-master";
import { settingsMasterTenant } from "../features/settings-master/settingsMaster.fixtures";
import { AdminDashboardPage } from "../features/admin-dashboard";
import { adminDashboardTenant } from "../features/admin-dashboard/adminDashboard.fixtures";
import { StudentAdmissionRegistrationPage } from "../features/student-admission-registration";
import { studentAdmissionRegistrationTenant } from "../features/student-admission-registration/studentAdmissionRegistration.fixtures";
import { StudentManagementListPage } from "../features/student-management-list";
import { studentManagementListTenant } from "../features/student-management-list/studentManagementList.fixtures";
import { StudentProfilePage } from "../features/student-profile";
import { studentProfileTenant } from "../features/student-profile/studentProfile.fixtures";
import { ClassSectionAllocationPage } from "../features/class-section-allocation";
import { classSectionAllocationTenant } from "../features/class-section-allocation/classSectionAllocation.fixtures";
import { StudentAttendancePage } from "../features/student-attendance";
import { studentAttendanceTenant } from "../features/student-attendance/studentAttendance.fixtures";
import { BasicReportPage } from "../features/basic-report";
import { basicReportTenant } from "../features/basic-report/basicReport.fixtures";
import { BasicTransportManagementPage } from "../features/basic-transport-management";
import { basicTransportManagementTenant } from "../features/basic-transport-management/basicTransportManagement.fixtures";
import styles from "./App.module.css";
import type { ThemeMode } from "../ui";
import { DemoOwnershipGuard } from "./DemoOwnershipGuard";
import { defaultAppRoute, normalizeRoute } from "./routes";

export function App() {
  const location = useLocation();
  const route = normalizeRoute(location.pathname);
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  const tenantValue =
    route === "/transport"
      ? basicTransportManagementTenant
      : route === "/reports"
      ? basicReportTenant
      : route === "/attendance/students"
      ? studentAttendanceTenant
      : route === "/allocation/class-section"
      ? classSectionAllocationTenant
      : route === "/students/profile"
      ? studentProfileTenant
      : route === "/students"
      ? studentManagementListTenant
      : route === "/admissions/new"
      ? studentAdmissionRegistrationTenant
      : route === "/dashboard/admin"
      ? adminDashboardTenant
      : route === "/settings"
        ? settingsMasterTenant
        : loginPageTenant;
  const themedTenantValue = {
    ...tenantValue,
    themePreference: themeMode
  };

  return (
    <TenantContextProvider className={styles.app} value={themedTenantValue}>
      <DemoOwnershipGuard />
      <div className={styles.pageLayer}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard/admin"
            element={<AdminDashboardPage onThemeToggle={() => {
              setThemeMode((current) => (current === "light" ? "dark" : "light"));
            }} themeMode={themeMode} />}
          />
          <Route
            path="/admissions/new"
            element={<StudentAdmissionRegistrationPage onThemeToggle={() => {
              setThemeMode((current) => (current === "light" ? "dark" : "light"));
            }} themeMode={themeMode} />}
          />
          <Route
            path="/students"
            element={<StudentManagementListPage onThemeToggle={() => {
              setThemeMode((current) => (current === "light" ? "dark" : "light"));
            }} themeMode={themeMode} />}
          />
          <Route
            path="/students/profile"
            element={<StudentProfilePage onThemeToggle={() => {
              setThemeMode((current) => (current === "light" ? "dark" : "light"));
            }} themeMode={themeMode} />}
          />
          <Route
            path="/allocation/class-section"
            element={<ClassSectionAllocationPage onThemeToggle={() => {
              setThemeMode((current) => (current === "light" ? "dark" : "light"));
            }} themeMode={themeMode} />}
          />
          <Route
            path="/attendance/students"
            element={<StudentAttendancePage onThemeToggle={() => {
              setThemeMode((current) => (current === "light" ? "dark" : "light"));
            }} themeMode={themeMode} />}
          />
          <Route
            path="/reports"
            element={<BasicReportPage onThemeToggle={() => {
              setThemeMode((current) => (current === "light" ? "dark" : "light"));
            }} themeMode={themeMode} />}
          />
          <Route
            path="/transport"
            element={<BasicTransportManagementPage onThemeToggle={() => {
              setThemeMode((current) => (current === "light" ? "dark" : "light"));
            }} themeMode={themeMode} />}
          />
          <Route
            path="/settings"
            element={<SettingsMasterPage onThemeToggle={() => {
              setThemeMode((current) => (current === "light" ? "dark" : "light"));
            }} themeMode={themeMode} />}
          />
          <Route path="*" element={<Navigate replace to={defaultAppRoute} />} />
        </Routes>
      </div>
    </TenantContextProvider>
  );
}
