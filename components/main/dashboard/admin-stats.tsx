"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios-instance";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserCog,
  FileText,
  Newspaper,
  CalendarDays,
  CalendarCheck,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "ADMIN" | "MEMBER";
type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string | null;
};

type OkResponse<T> = { success: true; data: T };
type ErrResponse = { success: false; error: { message: string } };
type ApiResponse<T> = OkResponse<T> | ErrResponse;

type GlobalStats = {
  users: { total: number; admins: number; members: number };
  announcements: { total: number };
  blogs: { total: number; published: number; unpublished: number };
  sessions: { total: number; today: number; upcomingOpen: number };
};

async function fetchMe(): Promise<User> {
  const res = await api.get<ApiResponse<User>>("/api/auth/me");
  if (!("success" in res.data) || !res.data.success)
    throw new Error("Unauthorized");
  return res.data.data;
}

async function fetchGlobalStats(): Promise<GlobalStats> {
  const res = await api.get<ApiResponse<GlobalStats>>("/api/stats");
  if (!("success" in res.data) || !res.data.success)
    throw new Error("Failed to fetch stats");
  return res.data.data;
}

function StatCard({
  icon,
  label,
  value,
  sublabel,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sublabel?: string;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-border/60 bg-linear-to-b from-muted/40 to-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300">
        <div className="absolute -inset-px bg-[radial-gradient(900px_160px_at_0%_-10%,hsl(var(--primary)/.18),transparent_60%)]" />
      </div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/80">
          {icon}
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-extrabold tracking-tight">{value}</div>
        {sublabel ? (
          <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-9 rounded-xl" />
          </div>
          <div className="px-4 pb-5">
            <Skeleton className="mt-2 h-8 w-24" />
            <Skeleton className="mt-2 h-3 w-32" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function AdminStats() {
  const me = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    staleTime: 60_000,
  });
  const isAdmin = me.data?.role === "ADMIN";
  const stats = useQuery({
    queryKey: ["stats", "global"],
    queryFn: fetchGlobalStats,
    enabled: isAdmin,
    staleTime: 30_000,
  });

  if (me.isLoading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <GridSkeleton />
        </div>
      </section>
    );
  }

  if (!isAdmin) return null;

  if (stats.isLoading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <GridSkeleton />
        </div>
      </section>
    );
  }

  const s = stats.data!;
  const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0);
  const nf = new Intl.NumberFormat("id-ID");

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Ringkasan Statistik
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Hanya terlihat oleh admin
            </p>
          </div>
          <Badge variant="outline">Admin</Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Users className="h-5 w-5 text-primary" />}
            label="Total Pengguna"
            value={nf.format(s.users.total)}
            sublabel={`${nf.format(s.users.members)} anggota • ${nf.format(
              s.users.admins
            )} admin`}
          />
          <StatCard
            icon={<UserCog className="h-5 w-5 text-primary" />}
            label="Rasio Admin"
            value={`${pct(s.users.admins, s.users.total)}%`}
            sublabel={`${nf.format(s.users.admins)} dari ${nf.format(
              s.users.total
            )}`}
          />
          <StatCard
            icon={<Newspaper className="h-5 w-5 text-primary" />}
            label="Total Blog"
            value={nf.format(s.blogs.total)}
            sublabel={`${nf.format(s.blogs.published)} terbit • ${nf.format(
              s.blogs.unpublished
            )} draft`}
          />
          <StatCard
            icon={<FileText className="h-5 w-5 text-primary" />}
            label="Publikasi Rate"
            value={`${pct(s.blogs.published, s.blogs.total)}%`}
            sublabel={`${nf.format(s.blogs.published)} dari ${nf.format(
              s.blogs.total
            )}`}
          />
          <StatCard
            icon={<CalendarDays className="h-5 w-5 text-primary" />}
            label="Total Pengumuman"
            value={nf.format(s.announcements.total)}
            sublabel="Semua jenis kegiatan"
          />
          <StatCard
            icon={<CalendarCheck className="h-5 w-5 text-primary" />}
            label="Sesi Absensi"
            value={nf.format(s.sessions.total)}
            sublabel={`${nf.format(s.sessions.today)} hari ini`}
          />
          <StatCard
            icon={<Clock className="h-5 w-5 text-primary" />}
            label="Sesi Terbuka Mendatang"
            value={nf.format(s.sessions.upcomingOpen)}
            sublabel="Dalam status OPEN"
          />
          <StatCard
            icon={<Users className="h-5 w-5 text-primary" />}
            label="Coverage Anggota"
            value={`${pct(s.users.members, s.users.total)}%`}
            sublabel={`${nf.format(
              s.users.members
            )} anggota dari total pengguna`}
          />
        </div>
      </div>
    </section>
  );
}
