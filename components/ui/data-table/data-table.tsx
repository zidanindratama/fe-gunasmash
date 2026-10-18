"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar, DataTableFilterField } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  filters?: DataTableFilterField<TData>[];
  // Server Side Pagination
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  rowCount?: number;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  manualSorting?: boolean;
  // Server Side Filtering (Props Baru)
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey = "name",
  filters,
  pageCount,
  pagination,
  onPaginationChange,
  rowCount,
  sorting: controlledSorting,
  onSortingChange: onControlledSortingChange,
  manualSorting = false,
  columnFilters,
  onColumnFiltersChange,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // State internal sorting (bisa diangkat ke server-side juga kalau mau, tapi optional)
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // State internal jika tidak pakai server-side filtering
  const [internalColumnFilters, setInternalColumnFilters] =
    React.useState<ColumnFiltersState>([]);

  const isServerSidePagination = pagination !== undefined;
  const isServerSideFiltering = columnFilters !== undefined;

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    rowCount: rowCount,
    state: {
      sorting: controlledSorting ?? sorting,
      columnVisibility,
      rowSelection,
      // Gunakan state dari props (server side) atau internal (client side)
      columnFilters: isServerSideFiltering
        ? columnFilters
        : internalColumnFilters,
      pagination: isServerSidePagination ? pagination : undefined,
    },
    enableRowSelection: true,
    manualPagination: isServerSidePagination,
    manualFiltering: isServerSideFiltering, // PENTING: Matikan filtering client-side

    onRowSelectionChange: setRowSelection,
    onSortingChange: onControlledSortingChange ?? setSorting,
    manualSorting,

    // Handler Filter
    onColumnFiltersChange: isServerSideFiltering
      ? onColumnFiltersChange
      : setInternalColumnFilters,

    onColumnVisibilityChange: setColumnVisibility,

    // Handler Pagination
    onPaginationChange: isServerSidePagination ? onPaginationChange : undefined,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} searchKey={searchKey} filters={filters} />

      <div className="rounded-md border overflow-hidden grid">
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
