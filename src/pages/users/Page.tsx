import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeaderCommon from "@/components/common/PageHeaderCommon";
import ConfirmDialogCommon from "@/components/common/ConfirmDialogCommon";
import {
  FilterBarCommon,
  FilterDrawerCommon,
  FilterFieldCommon,
  FilterSelectCommon,
  SearchInputCommon,
} from "@/components/common/FilterCommons";
import { PAGE_STACK } from "@/components/layout/adminPageLayout";
import Users, { type UserAction } from "@/components/users/Users";
import AddUpdateUser from "@/components/users/AddUpdateUser";
import {
  useActivateUserMutation,
  useDeactivateUserMutation,
  useDeleteUserMutation,
} from "@/app/features/users/usersApi";
import { useUserList } from "@/hooks/useUserList";
import { useLookupOptions } from "@/hooks/useLookupOptions";
import { usePermission } from "@/hooks/usePermission";
import { getManageableRoles } from "@/utils/permissions";
import { PERMISSIONS, ROLE_LABELS, USER_STATUS_LABELS } from "@/utils/Constants";
import { toSelectItems } from "@/utils/Helpers";
import type { User } from "@/types/user";

type ConfirmAction = Exclude<UserAction, "edit">;

const CONFIRM_COPY: Record<ConfirmAction, { title: string; description: string; label: string; destructive: boolean }> = {
  delete: {
    title: "Delete user?",
    description: "This permanently removes the account. This action cannot be undone.",
    label: "Delete",
    destructive: true,
  },
  deactivate: {
    title: "Deactivate user?",
    description: "The user will be signed out and will not be able to log in until reactivated.",
    label: "Deactivate",
    destructive: true,
  },
  activate: {
    title: "Activate user?",
    description: "The user will be able to log in to the portal again.",
    label: "Activate",
    destructive: false,
  },
};

const Page = () => {
  const { can, role, canManageRole } = usePermission();
  const { users, isLoading, search, setSearch, filters, setFilters, initialFilters, activeCount } = useUserList();
  const { departmentItems, getDepartmentName } = useLookupOptions({ vendors: false });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirm, setConfirm] = useState<{ action: ConfirmAction; user: User } | null>(null);

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [activateUser, { isLoading: isActivating }] = useActivateUserMutation();
  const [deactivateUser, { isLoading: isDeactivating }] = useDeactivateUserMutation();

  const roleItems = getManageableRoles(role).map((value) => ({ value, label: ROLE_LABELS[value] }));

  const handleAction = (action: UserAction, user: User) => {
    if (action === "edit") {
      setSelectedUser(user);
      setOpenDialog(true);
      return;
    }
    setConfirm({ action, user });
  };

  const handleConfirm = () => {
    if (!confirm) return;
    const { action, user } = confirm;
    const mutation = { delete: deleteUser, activate: activateUser, deactivate: deactivateUser }[action];
    return mutation(user._id).unwrap();
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setOpenDialog(true);
  };

  const copy = confirm ? CONFIRM_COPY[confirm.action] : null;

  return (
    <div className={PAGE_STACK}>
      <PageHeaderCommon
        title="User Management"
        description="Manage portal users, their roles and department access"
        actions={
          can(PERMISSIONS.CREATE_USER) && (
            <Button onClick={handleAdd}>
              <Plus />
              Add User
            </Button>
          )
        }
      />

      <FilterBarCommon
        actions={
          <FilterDrawerCommon filters={filters} initialFilters={initialFilters} onApply={setFilters}>
            {(draft, setDraftValue) => (
              <>
                <FilterFieldCommon label="Role">
                  <FilterSelectCommon
                    value={draft.role}
                    onChange={(value) => setDraftValue("role", value)}
                    items={roleItems}
                    placeholder="Roles"
                  />
                </FilterFieldCommon>
                <FilterFieldCommon label="Status">
                  <FilterSelectCommon
                    value={draft.status}
                    onChange={(value) => setDraftValue("status", value)}
                    items={toSelectItems(USER_STATUS_LABELS)}
                    placeholder="Statuses"
                  />
                </FilterFieldCommon>
                <FilterFieldCommon label="Department">
                  <FilterSelectCommon
                    value={draft.departmentId}
                    onChange={(value) => setDraftValue("departmentId", value)}
                    items={departmentItems}
                    placeholder="Departments"
                  />
                </FilterFieldCommon>
              </>
            )}
          </FilterDrawerCommon>
        }
      >
        <SearchInputCommon value={search} onChange={setSearch} placeholder="Search by name or email..." />
      </FilterBarCommon>

      <Users
        users={users}
        isLoading={isLoading}
        hasFilters={activeCount > 0}
        getDepartmentName={getDepartmentName}
        canManage={(user) => canManageRole(user.role)}
        onAction={handleAction}
      />

      {/* keyed so create / edit always get a fresh form + schema */}
      <AddUpdateUser
        key={selectedUser?._id ?? "new"}
        open={openDialog}
        onOpenChange={setOpenDialog}
        selectedUser={selectedUser}
        departmentItems={departmentItems}
      />

      <ConfirmDialogCommon
        open={Boolean(confirm)}
        onOpenChange={(open) => !open && setConfirm(null)}
        title={copy?.title}
        description={
          confirm && (
            <>
              <span className="font-medium text-foreground">{confirm.user.name || confirm.user.email}</span>:{" "}
              {copy?.description}
            </>
          )
        }
        confirmLabel={copy?.label}
        variant={copy?.destructive ? "destructive" : "default"}
        isLoading={isDeleting || isActivating || isDeactivating}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default Page;
