export type AppRoute =
  | "/login"
  | "/settings"
  | "/dashboard/admin"
  | "/admissions/new"
  | "/students"
  | "/students/profile"
  | "/allocation/class-section"
  | "/attendance/students"
  | "/reports"
  | "/transport";

export const defaultAppRoute: AppRoute = "/login";

export function normalizeRoute(pathname: string): AppRoute {
  if (pathname === "/dashboard/admin") {
    return "/dashboard/admin";
  }

  if (pathname === "/admissions/new") {
    return "/admissions/new";
  }

  if (pathname === "/students") {
    return "/students";
  }

  if (pathname.startsWith("/students/")) {
    return "/students/profile";
  }

  if (pathname === "/allocation/class-section" || pathname.startsWith("/allocation/")) {
    return "/allocation/class-section";
  }

  if (pathname === "/attendance/students" || pathname.startsWith("/attendance/")) {
    return "/attendance/students";
  }

  if (pathname === "/reports" || pathname.startsWith("/reports/")) {
    return "/reports";
  }

  if (pathname === "/transport" || pathname.startsWith("/transport/")) {
    return "/transport";
  }

  if (pathname === "/settings") {
    return "/settings";
  }

  return defaultAppRoute;
}

export function getAppRouterBasename(baseUrl: string): string {
  if (!baseUrl || baseUrl === "/") {
    return "/";
  }

  const trimmedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return trimmedBaseUrl || "/";
}
