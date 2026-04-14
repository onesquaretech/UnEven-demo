import type { AppShellNavigationItem, NoticeListItem, TenantContextInput } from "../../ui";

export interface AdminDashboardMetric {
  id: string;
  label: string;
  value: string;
  meta: string;
  trend?: string;
  tone: "accent" | "success" | "warning" | "danger" | "neutral";
}

export interface AdminDashboardQuickLink {
  id: string;
  label: string;
  description: string;
  route?: string;
  actionLabel: string;
  available: boolean;
}

export interface AdminDashboardAttendanceMetric {
  id: string;
  label: string;
  value: string;
}

export interface AdminDashboardAttendanceOverview {
  presentPercentage: number;
  presentLabel: string;
  hint: string;
  metrics: AdminDashboardAttendanceMetric[];
}

export interface AdminDashboardFeeCollectionBar {
  id: string;
  label: string;
  value: number;
}

export interface AdminDashboardFeeCollectionOverview {
  collectedToday: string;
  subtitle: string;
  changeLabel: string;
  bars: AdminDashboardFeeCollectionBar[];
}

export interface AdminDashboardPendingAction {
  id: string;
  title: string;
  description: string;
  owner: string;
  priority: "critical" | "warning" | "info";
  actionLabel: string;
  route?: string;
  available: boolean;
}

export interface AdminDashboardAdmissionRequest {
  id: string;
  studentName: string;
  guardianName: string;
  classLabel: string;
  submittedLabel: string;
  documentProgress: string;
  statusLabel: "Pending" | "Ready Review" | "Reviewed" | "Draft";
}

export interface AdminDashboardClassOccupancy {
  id: string;
  classLabel: string;
  studentCount: number;
  capacity: number;
}

export interface AdminDashboardViewModel {
  tenant: TenantContextInput;
  title: string;
  description: string;
  academicYearLabel: string;
  updatedAtLabel: string;
  navigation: AppShellNavigationItem[];
  metrics: AdminDashboardMetric[];
  quickLinks: AdminDashboardQuickLink[];
  notices: NoticeListItem[];
  attendanceOverview: AdminDashboardAttendanceOverview;
  feeCollectionOverview: AdminDashboardFeeCollectionOverview;
  pendingActions: AdminDashboardPendingAction[];
  recentAdmissions: AdminDashboardAdmissionRequest[];
  classOccupancy: AdminDashboardClassOccupancy[];
}
