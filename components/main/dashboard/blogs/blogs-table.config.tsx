"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  ColumnDef,
  FilterDef,
  RowAction,
  SortOption,
} from "@/components/data-table/types";

export type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverUrl?: string | null;
  tags: string[];
  published: boolean;
  createdAt: string;
};

export const blogColumns: ColumnDef<Blog>[] = [
  {
    key: "title",
    header: "Judul",
    render: (r) => (
      <Link href={`/blogs/${r.slug}`} className="font-medium hover:underline">
        {r.title}
      </Link>
    ),
  },
  {
    key: "tags",
    header: "Tag",
    render: (r) => (
      <div className="flex flex-wrap gap-1">
        {r.tags?.map((t) => (
          <Badge key={t} variant="outline">
            {t}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    key: "published",
    header: "Status",
    render: (r) => (
      <Badge variant={r.published ? "default" : "secondary"}>
        {r.published ? "Published" : "Draft"}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    header: "Tanggal",
    render: (r) =>
      new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(r.createdAt)),
  },
];

export const blogFilterDefs: FilterDef[] = [
  { type: "search", key: "q", placeholder: "Cari judul, isi, tag" },
];

export const makeTagFilter = (options: string[]): FilterDef => ({
  type: "select",
  key: "tag",
  label: "Semua Tag",
  options: options.map((v) => ({ label: v, value: v })),
});

export const blogSortOptions: SortOption[] = [
  { key: "createdAt", label: "Terbaru", dir: "desc" },
  { key: "createdAt", label: "Terlama", dir: "asc" },
  { key: "title", label: "Judul A-Z", dir: "asc" },
];

export const blogRowActions = ({
  onEdit,
  onDelete,
}: {
  onEdit: (row: Blog) => void;
  onDelete: (row: Blog) => void;
}): RowAction<Blog>[] => [
  {
    key: "view",
    label: "Buka",
    onClick: (r) => window.open(`/blogs/${r.id}`, "_blank"),
  },
  { key: "edit", label: "Edit", onClick: (r) => onEdit(r) },
  { key: "delete", label: "Hapus", onClick: (r) => onDelete(r) },
];
