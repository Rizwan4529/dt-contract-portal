import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import {
  Building2,
  FileText,
  Handshake,
  LayoutDashboard,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { APP_CONSTANTS, GLOBAL_ROUTES, PERMISSIONS } from "./utils/Constants";
import type { Permission } from "./utils/permissions";

// ------------------------------------------------------------------
//  Lazy pages
// ------------------------------------------------------------------
const LoginPage = lazy(() => import("./components/auth/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./components/auth/ForgotPasswordPage"));

const DashboardPage = lazy(() => import("./pages/dashboard/Page"));
const ContractsPage = lazy(() => import("./pages/contracts/Page"));
const AddUpdateContractPage = lazy(() => import("./pages/contracts/AddUpdateContractPage"));
const ContractDetailPage = lazy(() => import("./pages/contracts/DetailPage"));
const UsersPage = lazy(() => import("./pages/users/Page"));
const DepartmentsPage = lazy(() => import("./pages/departments/Page"));
const VendorsPage = lazy(() => import("./pages/vendors/Page"));
const ProfilePage = lazy(() => import("./pages/profile/Page"));

// ------------------------------------------------------------------
//  Route config
//  One source of truth for the router, sidebar, page titles and guards.
// ------------------------------------------------------------------
export interface AppRoute {
  path: string;
  name: string;
  component: LazyExoticComponent<ComponentType>;
  protected: boolean;
  // Required permission (null = any authenticated user)
  permission?: Permission | null;
  // Sidebar
  includeInSidebar?: boolean;
  label?: string;
  icon?: LucideIcon;
  // Highlights this sidebar item while on a child page (e.g. contract details)
  parentPath?: string;
}

export const authRoutes: AppRoute[] = [
  { path: GLOBAL_ROUTES.LOGIN, name: "Login", component: LoginPage, protected: false },
  { path: GLOBAL_ROUTES.FORGOT_PASSWORD, name: "Forgot Password", component: ForgotPasswordPage, protected: false },
];

// Order matters: static paths before dynamic ones (/contracts/add before /contracts/:id)
export const protectedRoutes: AppRoute[] = [
  {
    path: GLOBAL_ROUTES.DASHBOARD,
    name: "Dashboard",
    component: DashboardPage,
    protected: true,
    permission: null,
    includeInSidebar: true,
    label: APP_CONSTANTS.OVERVIEW_LABEL,
    icon: LayoutDashboard,
  },
  {
    path: GLOBAL_ROUTES.CONTRACTS,
    name: "Contracts",
    component: ContractsPage,
    protected: true,
    permission: PERMISSIONS.READ_CONTRACT,
    includeInSidebar: true,
    label: APP_CONSTANTS.OVERVIEW_LABEL,
    icon: FileText,
  },
  {
    path: GLOBAL_ROUTES.ADD_CONTRACT,
    name: "Add Contract",
    component: AddUpdateContractPage,
    protected: true,
    permission: PERMISSIONS.CREATE_CONTRACT,
    // Opened from the "Add Contract" button on the Contracts page
    parentPath: GLOBAL_ROUTES.CONTRACTS,
  },
  {
    path: GLOBAL_ROUTES.UPDATE_CONTRACT,
    name: "Edit Contract",
    component: AddUpdateContractPage,
    protected: true,
    permission: PERMISSIONS.UPDATE_CONTRACT,
    parentPath: GLOBAL_ROUTES.CONTRACTS,
  },
  {
    path: GLOBAL_ROUTES.CONTRACT_DETAILS,
    name: "Contract Details",
    component: ContractDetailPage,
    protected: true,
    permission: PERMISSIONS.READ_CONTRACT,
    parentPath: GLOBAL_ROUTES.CONTRACTS,
  },
  {
    path: GLOBAL_ROUTES.USERS,
    name: "Users",
    component: UsersPage,
    protected: true,
    permission: PERMISSIONS.READ_USER,
    includeInSidebar: true,
    label: APP_CONSTANTS.MANAGEMENT_LABEL,
    icon: Users,
  },
  {
    path: GLOBAL_ROUTES.DEPARTMENTS,
    name: "Departments",
    component: DepartmentsPage,
    protected: true,
    permission: PERMISSIONS.READ_DEPARTMENT,
    includeInSidebar: true,
    label: APP_CONSTANTS.MANAGEMENT_LABEL,
    icon: Building2,
  },
  {
    path: GLOBAL_ROUTES.VENDORS,
    name: "Vendors",
    component: VendorsPage,
    protected: true,
    permission: PERMISSIONS.READ_VENDOR,
    includeInSidebar: true,
    label: APP_CONSTANTS.MANAGEMENT_LABEL,
    icon: Handshake,
  },
  {
    path: GLOBAL_ROUTES.PROFILE,
    name: "Profile",
    component: ProfilePage,
    protected: true,
    permission: null,
    includeInSidebar: true,
    label: APP_CONSTANTS.ACCOUNT_LABEL,
    icon: UserRound,
  },
];

export const ALL_ROUTES: AppRoute[] = [...authRoutes, ...protectedRoutes];
