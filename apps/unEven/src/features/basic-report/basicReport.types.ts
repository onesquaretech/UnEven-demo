import type {
  AppShellNavigationItem,
  FieldOption,
  TenantContextInput
} from "../../ui";

export interface BasicReportMetric {
  id: string;
  label: string;
  value: string;
  meta: string;
  tone: "accent" | "info" | "warning" | "neutral";
}

export interface BasicReportTile {
  id: string;
  title: string;
  description: string;
  accent: "teal" | "amber" | "violet" | "blue";
  generatedFileType: "PDF" | "CSV";
}

export interface BasicReportHistoryItem {
  id: string;
  title: string;
  meta: string;
  format: "PDF" | "CSV";
  accent: "teal" | "amber" | "violet" | "blue";
}

export interface BasicReportViewModel {
  tenant: TenantContextInput;
  title: string;
  description: string;
  navigation: AppShellNavigationItem[];
  exportActions: {
    pdf: string;
    csv: string;
  };
  filters: {
    startDate: string;
    endDate: string;
    classValue: string;
    periodValue: string;
    searchValue: string;
    classOptions: FieldOption[];
    periodOptions: FieldOption[];
    searchPlaceholder: string;
  };
  metrics: BasicReportMetric[];
  reportHub: {
    title: string;
    description: string;
    tiles: BasicReportTile[];
    summaryInsights: string[];
  };
  historyPanel: {
    title: string;
    description: string;
    emptyLabel: string;
    noteTitle: string;
    noteBody: string;
    noteCaption: string;
    items: BasicReportHistoryItem[];
  };
}
