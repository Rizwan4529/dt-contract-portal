import { createColumnHelper } from "@tanstack/react-table";
import { Pencil, Power, PowerOff, Trash2 } from "lucide-react";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { TableActionMenuItem, TableActionsMenu } from "@/components/common/TableActionsMenu";
import AvatarCommon from "@/components/common/AvatarCommon";
import StatusBadge from "@/components/common/StatusBadge";
import { formatDate } from "@/utils/Helpers";
import { ROLE_LABELS, USER_STATUS } from "@/utils/Constants";
import type { User } from "@/types/user";

export type UserAction = "edit" | "activate" | "deactivate" | "delete";

interface UsersProps {
  users: User[];
  isLoading: boolean;
  hasFilters: boolean;
  getDepartmentName: (id?: string | null) => string;
  canManage: (user: User) => boolean;
  onAction: (action: UserAction, user: User) => void;
}

const columnHelper = createColumnHelper<User>();

const Users = ({ users, isLoading, hasFilters, getDepartmentName, canManage, onAction }: UsersProps) => {
  const columns = [
    columnHelper.accessor((user) => user.name || user.email, {
      id: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <AvatarCommon name={row.original.name || row.original.email} src={row.original.profileImage} className="size-8" />
          <span className="font-medium">{row.original.name || "-"}</span>
        </div>
      ),
    }),
    columnHelper.accessor("email", { header: "Email", meta: { className: "text-muted-foreground" } }),
    columnHelper.accessor((user) => ROLE_LABELS[user.role], { id: "role", header: "Role" }),
    columnHelper.accessor((user) => getDepartmentName(user.departmentId), {
      id: "department",
      header: "Department",
      meta: { className: "text-muted-foreground" },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => <StatusBadge status={getValue()} />,
    }),
    columnHelper.accessor("createdAt", {
      header: "Added On",
      cell: ({ getValue }) => formatDate(getValue()),
      meta: { className: "text-muted-foreground whitespace-nowrap" },
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      meta: { className: "w-12 text-right", headerClassName: "w-12" },
      cell: ({ row }) => {
        const user = row.original;
        if (!canManage(user)) return null;
        const isActive = user.status === USER_STATUS.ACTIVE;
        return (
          <TableActionsMenu>
            <TableActionMenuItem icon={Pencil} onClick={() => onAction("edit", user)}>
              Edit
            </TableActionMenuItem>
            {isActive ? (
              <TableActionMenuItem icon={PowerOff} onClick={() => onAction("deactivate", user)}>
                Deactivate
              </TableActionMenuItem>
            ) : (
              <TableActionMenuItem icon={Power} onClick={() => onAction("activate", user)}>
                Activate
              </TableActionMenuItem>
            )}
            <TableActionMenuItem icon={Trash2} variant="destructive" onClick={() => onAction("delete", user)}>
              Delete
            </TableActionMenuItem>
          </TableActionsMenu>
        );
      },
    }),
  ];

  return (
    <DataTableCommon
      columns={columns}
      data={users}
      isLoading={isLoading}
      getRowId={(user) => user._id}
      emptyTitle={hasFilters ? "No users match your filters" : "No users yet"}
      emptyDescription={
        hasFilters ? "Try a different search or clear the filters." : "Add team members to give them access to the portal."
      }
    />
  );
};

export default Users;
