import type { AppShellNavigationItem } from "../ui";
import type { AppRoute } from "./routes";

const backOfficeRouteByNavId: Partial<Record<string, AppRoute>> = {
  dashboard: "/dashboard/admin",
  admissions: "/admissions/new",
  students: "/students",
  attendance: "/attendance/students",
  allocation: "/allocation/class-section",
  transport: "/transport",
  reports: "/reports",
  settings: "/settings"
};

export function buildBackOfficeNavigation(
  navigation: AppShellNavigationItem[],
  options: {
    navigateToRoute: (route: AppRoute) => void;
    onBeforeNavigate?: () => void;
  }
) {
  return navigation.map((item) => ({
    ...item,
    onSelect: () => {
      options.onBeforeNavigate?.();

      const targetRoute = backOfficeRouteByNavId[item.id];

      if (targetRoute) {
        options.navigateToRoute(targetRoute);
      }
    }
  }));
}
