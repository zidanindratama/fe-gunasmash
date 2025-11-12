"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterDef, SortOption, QueryState } from "./types";

export default function DataTableToolbar({
  filterDefs,
  sortOptions,
  query,
  onQueryChange,
}: {
  filterDefs?: FilterDef[];
  sortOptions?: SortOption[];
  query: QueryState;
  onQueryChange: (q: QueryState) => void;
}) {
  const searchDef = filterDefs?.find((f) => f.type === "search") as
    | Extract<FilterDef, { type: "search" }>
    | undefined;
  const selects = (filterDefs || []).filter(
    (f) => f.type === "select"
  ) as Extract<FilterDef, { type: "select" }>[];
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full items-center gap-2 sm:max-w-md">
        {searchDef ? (
          <Input
            value={query.q ?? ""}
            onChange={(e) => onQueryChange({ ...query, q: e.target.value })}
            placeholder={searchDef.placeholder || "Search"}
          />
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {selects.map((s) => (
          <Select
            key={s.key}
            value={(query.filters?.[s.key] as string) ?? "ALL"}
            onValueChange={(v) => {
              const next = { ...(query.filters || {}) };
              if (v === "ALL") delete next[s.key];
              else next[s.key] = v;
              onQueryChange({ ...query, filters: next });
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder={s.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{s.label}</SelectItem>
              {s.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        {sortOptions && sortOptions.length ? (
          <Select
            value={`${query.sort?.key ?? sortOptions[0].key}:${
              query.sort?.dir ?? sortOptions[0].dir ?? "asc"
            }`}
            onValueChange={(v) => {
              const [key, dir] = v.split(":");
              onQueryChange({
                ...query,
                sort: { key, dir: (dir as any) || "asc" },
              });
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((o) => (
                <SelectItem
                  key={`${o.key}:${o.dir ?? "asc"}`}
                  value={`${o.key}:${o.dir ?? "asc"}`}
                >
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
        <Button
          variant="outline"
          onClick={() =>
            onQueryChange({ q: "", filters: {}, sort: query.sort })
          }
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
