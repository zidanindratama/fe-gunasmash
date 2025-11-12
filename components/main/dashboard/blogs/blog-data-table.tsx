"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios-instance";
import DataTable from "@/components/data-table/data-table";
import {
  ListMeta,
  QueryState,
  type FilterDef,
} from "@/components/data-table/types";
import { toast } from "sonner";
import { Trash2, Pencil, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Blog,
  blogColumns,
  blogFilterDefs,
  blogRowActions,
  blogSortOptions,
  makeTagFilter,
} from "./blogs-table.config";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type OkResponse<T> = { success: true; data: T };
type ErrResponse = { success: false; error: { message: string } };
type ApiResponse<T> = OkResponse<T> | ErrResponse;

type ListShape<T> =
  | { items: T[]; meta: ListMeta }
  | { items: T[]; total: number; page: number; limit: number; pages?: number };

function normalizeList<T>(data: any): { items: T[]; meta: ListMeta } {
  if (data?.meta && Array.isArray(data?.items))
    return { items: data.items as T[], meta: data.meta as ListMeta };
  if (Array.isArray(data?.items)) {
    const total = Number(data.total ?? data.items.length);
    const page = Number(data.page ?? 1);
    const limit = Number(data.limit ?? data.items.length);
    const pages = Number.isFinite(Number(data.pages))
      ? Number(data.pages)
      : Math.max(1, Math.ceil(total / Math.max(1, limit)));
    return { items: data.items as T[], meta: { total, page, limit, pages } };
  }
  return { items: [], meta: { total: 0, page: 1, limit: 10, pages: 1 } };
}

async function fetchBlogTags(): Promise<string[]> {
  const res = await api.get<ApiResponse<ListShape<Pick<Blog, "tags">>>>(
    "/api/blogs",
    {
      params: {
        page: 1,
        limit: 200,
        sort: "createdAt:desc",
      },
    }
  );
  if (!("success" in res.data) || !res.data.success) return [];
  const { items } = normalizeList<Pick<Blog, "tags">>(res.data.data);
  const set = new Set<string>();
  items.forEach((b) => b.tags?.forEach((t) => set.add(t)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

async function fetchBlogs(params: {
  q?: string;
  filters?: Record<string, string>;
  sort?: { key: string; dir: "asc" | "desc" };
  page: number;
  limit: number;
}): Promise<{ items: Blog[]; meta: ListMeta }> {
  const qp: Record<string, string> = {
    page: String(params.page),
    limit: String(params.limit),
  };
  const where: Record<string, any> = {};
  if (params.q) qp.search = params.q;
  if (params.filters?.tag) where.tags = { has: params.filters.tag };
  if (params.filters?.status === "published") where.published = true;
  if (params.filters?.status === "draft") where.published = false;
  if (params.sort?.key) qp.sort = `${params.sort.key}:${params.sort.dir}`;
  if (Object.keys(where).length) qp.filter = JSON.stringify(where);
  const res = await api.get<ApiResponse<ListShape<Blog>>>("/api/blogs", {
    params: qp,
  });
  if (!("success" in res.data) || !res.data.success)
    throw new Error("Failed to fetch blogs");
  return normalizeList<Blog>(res.data.data);
}

export default function BlogDatatable() {
  const router = useRouter();
  const sp = useSearchParams();
  const qc = useQueryClient();
  const pageSize = 10;
  const [query, setQuery] = React.useState<QueryState>({
    q: sp.get("q") || "",
    filters: {
      tag: sp.get("tag") || "",
      status: sp.get("status") || "all",
    },
    sort: {
      key: (sp.get("sortKey") as string) || "createdAt",
      dir: ((sp.get("sortDir") as any) || "desc") as "asc" | "desc",
    },
  });
  const uiQuery = React.useMemo<QueryState>(
    () => ({
      ...query,
      filters: {
        ...query.filters,
        status:
          query.filters?.status === "all" ? "" : query.filters?.status || "",
      },
    }),
    [query]
  );
  const [page, setPage] = React.useState<number>(
    Number(sp.get("page") || "1") || 1
  );
  const [pendingDelete, setPendingDelete] = React.useState<Blog | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const { data: tagOptions } = useQuery({
    queryKey: ["blog-tags-table"],
    queryFn: fetchBlogTags,
    staleTime: 5 * 60 * 1000,
  });
  const { data, isLoading } = useQuery({
    queryKey: ["blogs-table", query, page, pageSize],
    queryFn: () => fetchBlogs({ ...query, page, limit: pageSize }),
  });

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (query.q) params.set("q", query.q);
    if (query.filters?.tag) params.set("tag", query.filters.tag);
    if (query.filters?.status && query.filters.status !== "all")
      params.set("status", query.filters.status);
    if (query.sort?.key) params.set("sortKey", query.sort.key);
    if (query.sort?.dir) params.set("sortDir", query.sort.dir);
    if (page !== 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(qs ? `/dashboard/blogs?${qs}` : "/dashboard/blogs");
  }, [query, page, router]);

  const actions = blogRowActions({
    onEdit: (r) => router.push(`/dashboard/blogs/${r.id}/update`),
    onDelete: (r) => setPendingDelete(r),
  }).map((a) =>
    a.key === "edit"
      ? { ...a, icon: <Pencil className="h-4 w-4" /> }
      : a.key === "delete"
      ? { ...a, icon: <Trash2 className="h-4 w-4" /> }
      : a.key === "view"
      ? { ...a, icon: <ExternalLink className="h-4 w-4" /> }
      : a
  );

  const statusFilterDef: FilterDef = {
    key: "status",
    label: "Semua",
    type: "select" as const,
    options: [
      { label: "Published", value: "published" },
      { label: "Draft", value: "draft" },
    ],
  };

  const filters =
    tagOptions && tagOptions.length
      ? [statusFilterDef, ...blogFilterDefs, makeTagFilter(tagOptions)]
      : [statusFilterDef, ...blogFilterDefs];

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/api/blogs/${pendingDelete.id}`);
      toast.success("Berhasil menghapus");
      setPendingDelete(null);
      qc.invalidateQueries({ queryKey: ["blogs-table"] });
    } catch {
      toast.error("Gagal menghapus");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="py-10">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Manajemen Blog
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Kelola artikel: cari, filter, urutkan, tambah, edit, dan hapus
              konten blog.
            </p>
          </div>
          <Button asChild>
            <Link
              href="/dashboard/blogs/create"
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Tambah Blog
            </Link>
          </Button>
        </div>
        <DataTable
          rows={data?.items ?? []}
          columns={blogColumns}
          meta={data?.meta ?? { total: 0, page: 1, limit: pageSize }}
          query={uiQuery}
          onQueryChange={(q) => {
            const next: QueryState = {
              ...q,
              filters: {
                ...q.filters,
                status: !q.filters?.status ? "all" : q.filters.status,
              },
            };
            setPage(1);
            setQuery(next);
          }}
          onPageChange={(p) => setPage(p)}
          filterDefs={filters}
          sortOptions={blogSortOptions}
          rowActions={actions}
          rowKey={(row) => row.id}
          loading={isLoading}
        />
      </div>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && !deleting && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus blog ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak bisa dibatalkan. Blog akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              onClick={() => setPendingDelete(null)}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction disabled={deleting} onClick={confirmDelete}>
              {deleting ? "Menghapus..." : "Ya, hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
