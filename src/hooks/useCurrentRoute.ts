import { matchPath, useLocation } from "react-router-dom";
import { ALL_ROUTES } from "@/routes";

// Resolves the route config entry for the current URL (first match wins, so order in routes.ts matters)
export function useCurrentRoute() {
  const { pathname } = useLocation();
  return ALL_ROUTES.find((route) => matchPath(route.path, pathname)) ?? null;
}
