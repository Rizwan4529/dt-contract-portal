import { generatePath, useNavigate } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { Eye, Pencil } from "lucide-react";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { TableActionMenuLink, TableActionsMenu } from "@/components/common/TableActionsMenu";
import StatusBadge from "@/components/common/StatusBadge";
import { formatCurrency, formatDate } from "@/utils/Helpers";
import { GLOBAL_ROUTES } from "@/utils/Constants";
import { getContractTypeLabel, type ContractRow } from "./contractView";

interface ContractsProps {
  contracts: ContractRow[];
  isLoading?: boolean;
  // "compact" = dashboard recent list (fewer columns, no pagination)
  variant?: "full" | "compact";
  canUpdate?: boolean;
  hasFilters?: boolean;
}

const columnHelper = createColumnHelper<ContractRow>();

export const getContractDetailPath = (id: string) => generatePath(GLOBAL_ROUTES.CONTRACT_DETAILS, { id });

const Contracts = ({ contracts, isLoading = false, variant = "full", canUpdate = false, hasFilters = false }: ContractsProps) => {
  const navigate = useNavigate();
  const isFull = variant === "full";

  const columns = [
    columnHelper.accessor("title", {
      header: "Title",
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    }),
    columnHelper.accessor("vendorName", { header: "Vendor / Company" }),
    columnHelper.accessor("departmentName", { header: "Department", meta: { className: "text-muted-foreground" } }),
    ...(isFull
      ? [
          columnHelper.accessor((row) => getContractTypeLabel(row.type), {
            id: "type",
            header: "Type",
            meta: { className: "text-muted-foreground" },
          }),
          columnHelper.accessor("amount", {
            header: "Value",
            cell: ({ getValue }) => formatCurrency(getValue()),
            meta: { className: "whitespace-nowrap" },
          }),
        ]
      : []),
    columnHelper.accessor("endDate", {
      header: "End Date",
      cell: ({ getValue }) => formatDate(getValue()),
      meta: { className: "whitespace-nowrap" },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => <StatusBadge status={getValue()} />,
    }),
    ...(isFull
      ? [
          columnHelper.accessor("paymentStatus", {
            header: "Payment",
            cell: ({ getValue }) => <StatusBadge status={getValue()} />,
          }),
          columnHelper.display({
            id: "actions",
            header: () => <span className="sr-only">Actions</span>,
            meta: { className: "w-12 text-right", headerClassName: "w-12" },
            cell: ({ row }) => (
              <TableActionsMenu>
                <TableActionMenuLink icon={Eye} to={getContractDetailPath(row.original._id)}>
                  View Details
                </TableActionMenuLink>
                {canUpdate && (
                  <TableActionMenuLink
                    icon={Pencil}
                    to={generatePath(GLOBAL_ROUTES.UPDATE_CONTRACT, { id: row.original._id })}
                  >
                    Edit
                  </TableActionMenuLink>
                )}
              </TableActionsMenu>
            ),
          }),
        ]
      : []),
  ];

  return (
    <DataTableCommon
      columns={columns}
      data={contracts}
      isLoading={isLoading}
      getRowId={(row) => row._id}
      onRowClick={(row) => navigate(getContractDetailPath(row._id))}
      showPagination={isFull}
      className={isFull ? undefined : "rounded-none border-0 shadow-none"}
      emptyTitle={hasFilters ? "No contracts match your filters" : "No contracts yet"}
      emptyDescription={hasFilters ? "Try a different search or clear the filters." : undefined}
    />
  );
};

export default Contracts;
