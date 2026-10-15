import { useAppSelector } from "@/app/hooks";
import { canManageRole, hasPermission, type Permission } from "@/utils/permissions";
import type { Role } from "@/types/user";

export function usePermission() {
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role;

  return {
    user,
    role,
    can: (permission: Permission | null | undefined) => hasPermission(role, permission),
    canManageRole: (targetRole: Role) => canManageRole(role, targetRole),
  };
}
