import type { ReactNode } from "react";

export type SortDir = "asc" | "desc";

export type ColumnDef<T> = {
  key: keyof T | string;
  header: string;
  width?: string | number;
  align?: "left" | "center" | "right";
  render?: (row: T) => ReactNode;
};

export type FilterDef =
  | { type: "search"; key: string; placeholder?: string }
  | {
      type: "select";
      key: string;
      label: string;
      options: { label: string; value: string }[];
    };

export type SortOption = { key: string; label: string; dir?: SortDir };

export type RowAction<T> = {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void | Promise<void>;
};

export type ListMeta = {
  total: number;
  page: number;
  limit: number;
  pages?: number;
};

export type QueryState = {
  q?: string;
  filters?: Record<string, string>;
  sort?: { key: string; dir: SortDir };
};

export type DataTableProps<T> = {
  rows: T[];
  columns: ColumnDef<T>[];
  meta: ListMeta;
  query: QueryState;
  onQueryChange: (next: QueryState) => void;
  onPageChange: (page: number) => void;
  filterDefs?: FilterDef[];
  sortOptions?: SortOption[];
  rowActions?: RowAction<T>[];
  rowKey?: (row: T, index: number) => string | number;
  loading?: boolean;
};
