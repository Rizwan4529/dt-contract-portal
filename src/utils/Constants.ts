// ------------------------------------------------------------------
//  Environment
// ------------------------------------------------------------------
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1/";

export const ENV = {
  API_URL,
  // Uploaded files are served from `{origin}/uploads/...` (outside the /api/v1 prefix)
  FILES_URL: import.meta.env.VITE_FILES_URL || new URL(API_URL).origin,
} as const;

// ------------------------------------------------------------------
//  App
// ------------------------------------------------------------------
export const APP_CONSTANTS = {
  APP_NAME: "Dar Al Taqwa Hotel",
  APP_NAME_AR: "فندق دار التقوى",
  APP_LOCATION: "Madinah",
  APP_TITLE: "Contract Management Portal",
  APP_TAGLINE: "Trusted Partnerships for a Brighter Tomorrow",

  // Storage keys
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
  GLOBAL_THEME: "global_theme",

  LIGHT_THEME: "light",
  DARK_THEME: "dark",

  // Sidebar group labels
  OVERVIEW_LABEL: "overview",
  MANAGEMENT_LABEL: "management",
  ACCOUNT_LABEL: "account",

  CURRENCY: "SAR",
  DATE_FORMAT: "dd MMM yyyy",
  // A contract ending within this many days is flagged "Expiring Soon"
  EXPIRING_SOON_DAYS: 30,
  SEARCH_DEBOUNCE_MS: 500,
  DEFAULT_PAGE_SIZE: 10,
  INPUT_DATE_FORMAT: "yyyy-MM-dd",
  DISPLAY_INPUT_DATE_FORMAT: "dd/MM/yyyy",
  MIN_PASSWORD_LENGTH: 8,
  OTP_LENGTH: 6,
} as const;

export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export const LABEL_TO_GROUP_TITLE: Record<string, string> = {
  [APP_CONSTANTS.OVERVIEW_LABEL]: "Overview",
  [APP_CONSTANTS.MANAGEMENT_LABEL]: "Management",
  [APP_CONSTANTS.ACCOUNT_LABEL]: "Account",
};

// ------------------------------------------------------------------
//  Routes
// ------------------------------------------------------------------
export const GLOBAL_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",

  DASHBOARD: "/dashboard",
  CONTRACTS: "/contracts",
  ADD_CONTRACT: "/contracts/add",
  UPDATE_CONTRACT: "/contracts/update/:id",
  CONTRACT_DETAILS: "/contracts/:id",
  USERS: "/users",
  DEPARTMENTS: "/departments",
  VENDORS: "/vendors",
  PROFILE: "/profile",
} as const;

// ------------------------------------------------------------------
//  API — paths are relative to ENV.API_URL
// ------------------------------------------------------------------
export const API_URLS = {
  LOGIN: "auth/login",
  LOGOUT: "auth/logout",
  REFRESH_TOKEN: "auth/refresh-token",
  ME: "auth/me",
  FORGOT_PASSWORD: "auth/forgot-password",
  VERIFY_OTP: "auth/verify-otp",
  RESET_PASSWORD: "auth/reset-password",

  USERS: "users",
  DEPARTMENTS: "departments",
  VENDORS: "vendors",
  CONTRACTS: "contracts",
  MEDIA_UPLOAD: "media/upload",
} as const;

export const RTK_TAGS = {
  USERS: "USERS",
  DEPARTMENTS: "DEPARTMENTS",
  VENDORS: "VENDORS",
  CONTRACTS: "CONTRACTS",
} as const;

// ------------------------------------------------------------------
//  Domain enums (values mirror dt-contract-apis exactly)
// ------------------------------------------------------------------
export const ROLES = {
  ADMIN: "admin",
  SUB_ADMIN: "sub_admin",
  STAFF: "staff",
  HOD: "hod",
  USER: "user",
} as const;

export const ROLE_LABELS: Record<string, string> = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.SUB_ADMIN]: "Sub Admin",
  [ROLES.STAFF]: "Staff",
  [ROLES.HOD]: "Head of Department",
  [ROLES.USER]: "Viewer",
};

// Lower number = higher authority. A user can manage roles at or below their own level.
export const ROLE_HIERARCHY: Record<string, number> = {
  [ROLES.ADMIN]: 1,
  [ROLES.SUB_ADMIN]: 2,
  [ROLES.STAFF]: 3,
  [ROLES.HOD]: 4,
  [ROLES.USER]: 5,
};

// These roles MUST have a departmentId; every other role must NOT
export const DEPARTMENT_SCOPED_ROLES: string[] = [ROLES.HOD, ROLES.USER];

export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export const USER_STATUS_LABELS: Record<string, string> = {
  [USER_STATUS.ACTIVE]: "Active",
  [USER_STATUS.INACTIVE]: "Inactive",
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PARTIAL: "partial",
  PAID: "paid",
  OVERDUE: "overdue",
} as const;

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  [PAYMENT_STATUS.PENDING]: "Pending",
  [PAYMENT_STATUS.PARTIAL]: "Partially Paid",
  [PAYMENT_STATUS.PAID]: "Paid",
  [PAYMENT_STATUS.OVERDUE]: "Overdue",
};

// Derived client-side from endDate (see getContractStatus in Helpers)
export const CONTRACT_STATUS = {
  ACTIVE: "active",
  EXPIRING_SOON: "expiring_soon",
  EXPIRED: "expired",
} as const;

export const CONTRACT_STATUS_LABELS: Record<string, string> = {
  [CONTRACT_STATUS.ACTIVE]: "Active",
  [CONTRACT_STATUS.EXPIRING_SOON]: "Expiring Soon",
  [CONTRACT_STATUS.EXPIRED]: "Expired",
};

// Backend stores contract type as free text; these are the suggested options
export const CONTRACT_TYPES = {
  ONE_TIME: "one_time",
  RECURRING: "recurring",
  ANNUAL: "annual",
  OTHER: "other",
} as const;

export const CONTRACT_TYPE_LABELS: Record<string, string> = {
  [CONTRACT_TYPES.ONE_TIME]: "One-time",
  [CONTRACT_TYPES.RECURRING]: "Recurring",
  [CONTRACT_TYPES.ANNUAL]: "Annual",
  [CONTRACT_TYPES.OTHER]: "Other",
};

export const DOCUMENT_TYPE = {
  MAIN: "main",
  SUPPORTING: "supporting",
} as const;

const IMAGE_MIME_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

// Backend limits: multer `files` field, max 10 files per request, 5 MB each
export const FILE_UPLOAD = {
  FIELD_NAME: "files",
  MAX_FILES: 10,
  MAX_SIZE_MB: 5,
  // react-dropzone `accept` maps
  DOCUMENT_ACCEPT: {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    ...IMAGE_MIME_TYPES,
  },
  IMAGE_ACCEPT: IMAGE_MIME_TYPES,
  DOCUMENT_HINT: "PDF, DOC, DOCX, JPG, PNG up to 5 MB",
  IMAGE_HINT: "JPG, PNG or WEBP up to 5 MB",
};

// ------------------------------------------------------------------
//  Permissions (mirrors the CASL policies in dt-contract-apis)
// ------------------------------------------------------------------
export const PERMISSIONS = {
  READ_CONTRACT: "read_contract",
  CREATE_CONTRACT: "create_contract",
  UPDATE_CONTRACT: "update_contract",
  DELETE_CONTRACT: "delete_contract",

  READ_USER: "read_user",
  CREATE_USER: "create_user",
  UPDATE_USER: "update_user",
  DELETE_USER: "delete_user",

  READ_DEPARTMENT: "read_department",
  MANAGE_DEPARTMENT: "manage_department",

  READ_VENDOR: "read_vendor",
  MANAGE_VENDOR: "manage_vendor",
} as const;
