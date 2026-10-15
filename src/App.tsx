import { Suspense } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import AppBootstrap from "./AppBootstrap";
import SidebarLayout from "./components/layout/SidebarLayout";
import GlobalPageLoader from "./components/common/GlobalPageLoader";
import NotFoundPage from "./pages/NotFound/Page";
import { authRoutes, protectedRoutes } from "./routes";
import { GLOBAL_ROUTES } from "./utils/Constants";

const App = () => (
  <Router>
    <Routes>
      <Route path={GLOBAL_ROUTES.HOME} element={<Navigate to={GLOBAL_ROUTES.DASHBOARD} replace />} />

      {authRoutes.map(({ path, component: Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <AppBootstrap isAuthRoute>
              <Suspense fallback={<GlobalPageLoader />}>
                <Component />
              </Suspense>
            </AppBootstrap>
          }
        />
      ))}

      {/* Layout route: sidebar + header stay mounted while pages change */}
      <Route
        element={
          <AppBootstrap isProtected>
            <SidebarLayout />
          </AppBootstrap>
        }
      >
        {protectedRoutes.map(({ path, permission, component: Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <AppBootstrap permission={permission}>
                <Component />
              </AppBootstrap>
            }
          />
        ))}
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default App;
