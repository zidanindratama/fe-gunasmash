"use client";

import {
  Users,
  Target,
  HeartHandshake,
  ShieldCheck,
  Calendar,
  Trophy,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import SectionHeader from "./section-header";

function ValueCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className="group relative overflow-hidden border-border/60 bg-linear-to-b from-muted/40 to-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -inset-px bg-[radial-gradient(1200px_200px_at_0%_-10%,hsl(var(--primary)/.25),transparent_60%)]" />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background/80 backdrop-blur">
            {icon}
          </span>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </CardContent>
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />
    </Card>
  );
}

export default function MissionValues() {
  return (
    <section id="mission-values" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <SectionHeader
          eyebrow="Misi, Nilai, & Budaya"
          title="Kami berkembang bersama dan menjunjung sportivitas"
          subtitle="Latihan terstruktur, komunitas suportif, dan proses yang konsisten untuk semua level."
        />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ValueCard
            icon={<Users className="h-5 w-5 text-primary" />}
            title="Komunitas Aktif"
            desc="Lintas jurusan, ramah pemula, dan kolaboratif dalam belajar teknik dan taktik."
          />
          <ValueCard
            icon={<Target className="h-5 w-5 text-primary" />}
            title="Pembinaan Terarah"
            desc="Fundamental, footwork, konsistensi, dan match-play dengan evaluasi periodik."
          />
          <ValueCard
            icon={<HeartHandshake className="h-5 w-5 text-primary" />}
            title="Sportivitas"
            desc="Menghormati lawan, wasit, dan rekan latihan. Menang elegan, kalah bermartabat."
          />
          <ValueCard
            icon={<ShieldCheck className="h-5 w-5 text-primary" />}
            title="Disiplin & Keselamatan"
            desc="Datang tepat waktu, pemanasan, dan penggunaan perlengkapan yang aman."
          />
          <ValueCard
            icon={<Calendar className="h-5 w-5 text-primary" />}
            title="Konsistensi Jadwal"
            desc="Latihan rutin dua kali seminggu dengan kurikulum mingguan yang jelas."
          />
          <ValueCard
            icon={<Trophy className="h-5 w-5 text-primary" />}
            title="Mental Kompetitif"
            desc="Sparring terstruktur dan kesiapan bertanding pada event internal maupun eksternal."
          />
        </div>
      </div>
    </section>
  );
}
