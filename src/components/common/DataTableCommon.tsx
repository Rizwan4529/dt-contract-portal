import { useState, type ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { APP_CONSTANTS, PAGE_SIZE_OPTIONS } from "@/utils/Constants";
import EmptyStateCommon from "./EmptyStateCommon";

// Per-column styling: columnHelper.accessor("x", { meta: { className: "w-40" } })
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    className?: string;
    headerClassName?: string;
  }
}

const SKELETON_ROWS = 5;

interface DataTableCommonProps<TData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  data: TData[];
  isLoading?: boolean;
  getRowId?: (row: TData) => string;
  onRowClick?: (row: TData) => void;
  // Backend returns full lists, so pagination is client-side
  showPagination?: boolean;
  pageSize?: number;
  emptyTitle?: ReactNode;
  emptyDescription?: ReactNode;
  emptyAction?: ReactNode;
  className?: string;
}

export const DataTableCommon = <TData,>({
  columns,
  data,
  isLoading = false,
  getRowId,
  onRowClick,
  showPagination = true,
  pageSize = APP_CONSTANTS.DEFAULT_PAGE_SIZE,
  emptyTitle = "No records found",
  emptyDescription,
  emptyAction,
  className,
}: DataTableCommonProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  // TanStack Table returns non-memoizable functions, so the React Compiler skips this component (expected)
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: showPagination ? getPaginationRowModel() : undefined,
    autoResetPageIndex: true,
    initialState: { pagination: { pageSize } },
  });

  const rows = table.getRowModel().rows;
  const columnCount = table.getVisibleLeafColumns().length;

  return (
    <div className={cn("overflow-hidden rounded-xl border bg-card shadow-card", className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/60 hover:bg-muted/60">
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                const SortIcon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ChevronsUpDown;

                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "h-11 px-3 text-xs font-semibold text-foreground first:pl-5 last:pr-4",
                      header.column.columnDef.meta?.headerClassName,
                    )}
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="-ml-1 inline-flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 hover:bg-accent"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <SortIcon className={cn("size-3.5", !sorted && "text-muted-foreground/60")} />
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: SKELETON_ROWS }).map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                {Array.from({ length: columnCount }).map((__, cellIndex) => (
                  <TableCell key={cellIndex} className="h-14 px-3 first:pl-5">
                    <Skeleton className="h-4 w-full max-w-36" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columnCount} className="p-0">
                <EmptyStateCommon title={emptyTitle} description={emptyDescription} action={emptyAction} />
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                className={cn(onRowClick && "cursor-pointer")}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={cn("h-14 px-3 text-[13px] first:pl-5 last:pr-4", cell.column.columnDef.meta?.className)}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {showPagination && !isLoading && data.length > 0 && (
        // Plain values, not the table instance: its identity never changes, so a memoized child would go stale
        <DataTablePagination
          pageIndex={table.getState().pagination.pageIndex}
          pageSize={table.getState().pagination.pageSize}
          total={table.getPrePaginationRowModel().rows.length}
          pageCount={table.getPageCount()}
          canPrevious={table.getCanPreviousPage()}
          canNext={table.getCanNextPage()}
          onPageSizeChange={table.setPageSize}
          onPrevious={table.previousPage}
          onNext={table.nextPage}
        />
      )}
    </div>
  );
};

interface DataTablePaginationProps {
  pageIndex: number;
  pageSize: number;
  total: number;
  pageCount: number;
  canPrevious: boolean;
  canNext: boolean;
  onPageSizeChange: (size: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const DataTablePagination = ({
  pageIndex,
  pageSize,
  total,
  pageCount,
  canPrevious,
  canNext,
  onPageSizeChange,
  onPrevious,
  onNext,
}: DataTablePaginationProps) => {
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min(total, (pageIndex + 1) * pageSize);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row">
      <span>
        Showing <span className="font-medium text-foreground">{from}</span>-
        <span className="font-medium text-foreground">{to}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span>
      </span>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">Rows per page</span>
          <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger size="sm" className="w-18" aria-label="Rows per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous page"
            onClick={onPrevious}
            disabled={!canPrevious}
          >
            <ChevronLeft />
          </Button>
          <span className="min-w-16 text-center">
            {pageIndex + 1} / {Math.max(1, pageCount)}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            onClick={onNext}
            disabled={!canNext}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};
