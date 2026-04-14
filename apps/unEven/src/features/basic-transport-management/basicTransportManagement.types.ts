import type {
  AppShellNavigationItem,
  FieldOption,
  ProgressBarTone,
  StatusChipTone,
  TenantContextInput
} from "../../ui";

export type BasicTransportAccent =
  | "teal"
  | "blue"
  | "violet"
  | "amber"
  | "rose"
  | "sky"
  | "emerald";

export type BasicTransportRowAction = "save" | "edit" | "pending";
export type BasicTransportFeeMode = "included" | "custom" | "pending";

export interface BasicTransportRouteSummary {
  id: string;
  label: string;
  vehicleLabel: string;
  occupiedValue: number;
  capacityValue: number;
  tone: ProgressBarTone;
}

export interface BasicTransportStop {
  id: string;
  label: string;
  timeLabel: string;
  studentCountLabel: string;
  active?: boolean;
}

export interface BasicTransportAssignmentRow {
  id: string;
  studentName: string;
  studentCode: string;
  classLabel: string;
  initials: string;
  accent: BasicTransportAccent;
  pickupPoint: string;
  pickupPointOptions: FieldOption[];
  feeLabel: string;
  feeMode: BasicTransportFeeMode;
  action: BasicTransportRowAction;
}

export interface BasicTransportRouteDetail {
  id: string;
  label: string;
  vehicleNumber: string;
  driverName: string;
  capacityValue: number;
  assignedValue: number;
  seatsLeftLabel: string;
  feeLabel: string;
  vehicleMeta: string;
  capacityTone: ProgressBarTone;
  stops: BasicTransportStop[];
  assignments: BasicTransportAssignmentRow[];
}

export interface BasicTransportViewModel {
  tenant: TenantContextInput;
  title: string;
  description: string;
  navigation: AppShellNavigationItem[];
  primaryActionLabel: string;
  filters: {
    searchValue: string;
    searchPlaceholder: string;
    routeValue: string;
    classValue: string;
    pickupPointValue: string;
    feeValue: string;
    routeOptions: FieldOption[];
    classOptions: FieldOption[];
    pickupPointOptions: FieldOption[];
    feeOptions: FieldOption[];
    summaryLabel: string;
  };
  routeRail: {
    title: string;
    description: string;
    routes: BasicTransportRouteSummary[];
    statusCardTitle: string;
    statusCardValue: string;
    statusCardNote: string;
  };
  assignmentTable: {
    title: string;
    description: string;
    feeMappingTitle: string;
    feeMappingValue: string;
    feeMappingNote: string;
    feeMappingActionLabel: string;
  };
  detailsPanel: {
    title: string;
    description: string;
    vehicleCardTitle: string;
    capacityTitle: string;
    stopsTitle: string;
    feeTitle: string;
    editActionLabel: string;
    saveActionLabel: string;
  };
  routeDetails: BasicTransportRouteDetail[];
  conflictNote: {
    label: string;
    tone: StatusChipTone;
    message: string;
  };
}
