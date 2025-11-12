"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DataTableProps } from "./types";
import DataTableToolbar from "./toolbar";
import DataTablePagination from "./pagination";

export default function DataTable<T extends Record<string, any>>({
  rows,
  columns,
  meta,
  query,
  onQueryChange,
  onPageChange,
  filterDefs,
  sortOptions,
  rowActions,
  rowKey,
  loading,
}: DataTableProps<T>) {
  const pages =
    meta.pages ?? Math.max(1, Math.ceil(meta.total / Math.max(1, meta.limit)));
  const skeletonCount = Math.max(3, Math.min(meta.limit || 10, 8));
  return (
    <Card className="rounded-3xl">
      <CardContent className="pt-6">
        <DataTableToolbar
          filterDefs={filterDefs}
          sortOptions={sortOptions}
          query={query}
          onQueryChange={onQueryChange}
        />
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead
                    key={String(col.key)}
                    style={{ width: col.width }}
                    className={
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                        ? "text-center"
                        : "text-left"
                    }
                  >
                    {col.header}
                  </TableHead>
                ))}
                {rowActions && rowActions.length ? (
                  <TableHead className="w-12" />
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: skeletonCount }).map((_, i) => (
                  <TableRow key={`s-${i}`}>
                    {columns.map((c, ci) => (
                      <TableCell key={`${i}-${ci}`}>
                        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                      </TableCell>
                    ))}
                    {rowActions && rowActions.length ? (
                      <TableCell className="text-right">
                        <div className="inline-block h-8 w-8 animate-pulse rounded bg-muted" />
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))
              ) : rows.length ? (
                rows.map((row, i) => (
                  <TableRow key={rowKey ? rowKey(row, i) : row.id ?? i}>
                    {columns.map((col) => (
                      <TableCell
                        key={String(col.key)}
                        className={
                          col.align === "right"
                            ? "text-right"
                            : col.align === "center"
                            ? "text-center"
                            : "text-left"
                        }
                      >
                        {col.render
                          ? col.render(row)
                          : String(
                              col.key in row
                                ? row[col.key as keyof typeof row]
                                : ""
                            )}
                      </TableCell>
                    ))}
                    {rowActions && rowActions.length ? (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-40">
                            {rowActions.map((a) => (
                              <DropdownMenuItem
                                key={a.key}
                                onClick={() => a.onClick(row)}
                                className="flex items-center gap-2"
                              >
                                {a.icon ? (
                                  <span className="inline-flex h-4 w-4 items-center justify-center">
                                    {a.icon}
                                  </span>
                                ) : null}
                                <span>{a.label}</span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="text-center text-sm text-muted-foreground"
                  >
                    Tidak ada data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-6">
          <DataTablePagination
            page={meta.page}
            pages={pages}
            onPageChange={onPageChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
