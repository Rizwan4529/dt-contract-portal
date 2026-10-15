import type { ReactNode } from "react";
import { Navigate, useLocation, type Location } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import { GLOBAL_ROUTES } from "./utils/Constants";
import { hasPermission, type Permission } from "./utils/permissions";

interface AppBootstrapProps {
  children: ReactNode;
  // Requires a logged-in user
  isProtected?: boolean;
  // Login / forgot password: logged-in users are sent back into the app
  isAuthRoute?: boolean;
  permission?: Permission | null;
}

// Route guard. Auth state is hydrated synchronously from secureStorage in authSlice.
const AppBootstrap = ({ children, isProtected = false, isAuthRoute = false, permission = null }: AppBootstrapProps) => {
  const location = useLocation();
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const isAuthenticated = Boolean(accessToken && user);

  if (isAuthRoute && isAuthenticated) {
    const from = (location.state as { from?: Location } | null)?.from?.pathname;
    return <Navigate to={from || GLOBAL_ROUTES.DASHBOARD} replace />;
  }

  if (isProtected && !isAuthenticated) {
    return <Navigate to={GLOBAL_ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  if (isAuthenticated && !hasPermission(user?.role, permission)) {
    return <Navigate to={GLOBAL_ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export default AppBootstrap;
