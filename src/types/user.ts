import type { ROLES, USER_STATUS } from "@/utils/Constants";
import type { BaseEntity } from "./api";

export type Role = (typeof ROLES)[keyof typeof ROLES];
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export interface User extends BaseEntity {
  name?: string;
  email: string;
  profileImage?: string;
  role: Role;
  departmentId: string | null;
  status: UserStatus;
}

export interface CreateUserPayload {
  name?: string;
  email: string;
  password: string;
  role: Role;
  profileImage?: string;
  departmentId?: string;
}

export interface UpdateUserPayload {
  id: string;
  name?: string;
  password?: string;
  role?: Role;
  profileImage?: string;
  departmentId?: string | null;
}
