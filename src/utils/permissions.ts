import { PERMISSIONS, ROLE_HIERARCHY, ROLES } from "./Constants";
import type { Role } from "@/types/user";

type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ALL_ROLES = Object.values(ROLES);
const LOOKUP_MANAGERS: Role[] = [ROLES.ADMIN, ROLES.SUB_ADMIN, ROLES.STAFF];

// Keep in sync with dt-contract-apis/auth/authorization/policies/*.policy.js
const PERMISSION_ROLES: Record<Permission, Role[]> = {
  [PERMISSIONS.READ_CONTRACT]: ALL_ROLES,
  [PERMISSIONS.CREATE_CONTRACT]: [ROLES.STAFF],
  // Backend currently grants contract update/delete to nobody
  [PERMISSIONS.UPDATE_CONTRACT]: [],
  [PERMISSIONS.DELETE_CONTRACT]: [],

  // User actions are further restricted by canManageRole()
  [PERMISSIONS.READ_USER]: ALL_ROLES,
  [PERMISSIONS.CREATE_USER]: ALL_ROLES,
  [PERMISSIONS.UPDATE_USER]: ALL_ROLES,
  [PERMISSIONS.DELETE_USER]: ALL_ROLES,

  [PERMISSIONS.READ_DEPARTMENT]: ALL_ROLES,
  [PERMISSIONS.MANAGE_DEPARTMENT]: LOOKUP_MANAGERS,

  [PERMISSIONS.READ_VENDOR]: ALL_ROLES,
  [PERMISSIONS.MANAGE_VENDOR]: LOOKUP_MANAGERS,
};

export const hasPermission = (role: Role | undefined | null, permission: Permission | null | undefined) => {
  if (!permission) return true;
  if (!role) return false;
  return PERMISSION_ROLES[permission]?.includes(role) ?? false;
};

// Actor can create / manage a target role at the same level or below
export const canManageRole = (actorRole: Role | undefined | null, targetRole: Role) => {
  if (!actorRole) return false;
  return ROLE_HIERARCHY[targetRole] >= ROLE_HIERARCHY[actorRole];
};

export const getManageableRoles = (actorRole: Role | undefined | null) =>
  ALL_ROLES.filter((role) => canManageRole(actorRole, role));

export type { Permission };
