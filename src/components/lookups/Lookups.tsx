import { createColumnHelper } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { TableActionMenuItem, TableActionsMenu } from "@/components/common/TableActionsMenu";
import { formatDate, getFileUrl, getInitials } from "@/utils/Helpers";
import type { LookupEntity } from "@/types/lookup";
import type { LookupModuleConfig } from "./lookupConfig";

interface LookupsProps {
  config: LookupModuleConfig;
  items: LookupEntity[];
  isLoading: boolean;
  hasSearch: boolean;
  canManage: boolean;
  onEdit: (item: LookupEntity) => void;
  onDelete: (item: LookupEntity) => void;
}

const columnHelper = createColumnHelper<LookupEntity>();

const LookupThumb = ({ item }: { item: LookupEntity }) =>
  item.image ? (
    <img src={getFileUrl(item.image)} alt="" className="size-9 shrink-0 rounded-lg border bg-muted object-cover" />
  ) : (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-xs font-semibold text-brand-dark">
      {getInitials(item.name)}
    </span>
  );

const Lookups = ({ config, items, isLoading, hasSearch, canManage, onEdit, onDelete }: LookupsProps) => {
  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <LookupThumb item={row.original} />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    }),
    columnHelper.accessor("description", {
      header: "Description",
      enableSorting: false,
      cell: ({ getValue }) => <span className="line-clamp-2 max-w-md text-muted-foreground">{getValue() || "-"}</span>,
    }),
    columnHelper.accessor("createdAt", {
      header: "Added On",
      cell: ({ getValue }) => formatDate(getValue()),
      meta: { className: "text-muted-foreground whitespace-nowrap" },
    }),
    ...(canManage
      ? [
          columnHelper.display({
            id: "actions",
            header: () => <span className="sr-only">Actions</span>,
            meta: { className: "w-12 text-right", headerClassName: "w-12" },
            cell: ({ row }) => (
              <TableActionsMenu>
                <TableActionMenuItem icon={Pencil} onClick={() => onEdit(row.original)}>
                  Edit
                </TableActionMenuItem>
                <TableActionMenuItem icon={Trash2} variant="destructive" onClick={() => onDelete(row.original)}>
                  Delete
                </TableActionMenuItem>
              </TableActionsMenu>
            ),
          }),
        ]
      : []),
  ];

  const plural = config.title.toLowerCase();

  return (
    <DataTableCommon
      columns={columns}
      data={items}
      isLoading={isLoading}
      getRowId={(item) => item._id}
      emptyTitle={hasSearch ? `No ${plural} match your search` : `No ${plural} yet`}
      emptyDescription={hasSearch ? "Try a different search term." : `Add your first ${config.singular.toLowerCase()} to get started.`}
    />
  );
};

export default Lookups;
