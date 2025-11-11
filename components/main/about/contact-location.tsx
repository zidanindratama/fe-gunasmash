"use client";

import Link from "next/link";
import { Calendar, MapPin, Mail, Phone, Instagram } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SectionHeader from "./section-header";

export default function ContactLocation() {
  const contact = {
    email: "gunasmash@gunadarma.ac.id",
    phone: "+62 857-0000-0000",
    instagram: "https://instagram.com/gunasmash",
    address: "Sport Center Kampus H, Universitas Gunadarma",
    mapsLink: "https://maps.google.com?q=Universitas+Gunadarma+Kampus+H",
    schedule: ["Rabu 15:00–17:00 WIB", "Minggu 08:00–10:00 WIB"],
    updatedAt: "05 Nov 2025",
  };
  return (
    <section id="contact" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <SectionHeader
          eyebrow="Kontak & Lokasi"
          title="Hubungi kami dan temukan lokasi latihan"
        />
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <Card className="relative overflow-hidden rounded-3xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Kontak Resmi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-background">
                  <Mail className="h-4 w-4" />
                </div>
                <Link
                  href={`mailto:${contact.email}`}
                  className="text-sm hover:underline"
                >
                  {contact.email}
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-background">
                  <Phone className="h-4 w-4" />
                </div>
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="text-sm hover:underline"
                >
                  {contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-background">
                  <Instagram className="h-4 w-4" />
                </div>
                <Link
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                >
                  @gunasmash
                </Link>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm font-semibold">Lokasi Latihan</div>
                <div className="text-sm text-muted-foreground">
                  {contact.address}
                </div>
                <div>
                  <Button asChild variant="outline" className="rounded-xl">
                    <Link
                      href={contact.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Buka di Maps
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              Terakhir diperbarui: {contact.updatedAt}
            </CardFooter>
          </Card>
          <Card className="relative overflow-hidden rounded-3xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Jadwal Ringkas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border bg-linear-to-b from-muted/40 to-background p-5">
                <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold">
                  <Calendar className="h-4 w-4 text-primary" />
                  Latihan Rutin
                </div>
                <ul className="space-y-2">
                  {contact.schedule.map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border bg-linear-to-b from-muted/40 to-background p-5">
                <div className="text-sm text-muted-foreground">
                  Catatan: Jadwal dapat berubah mengikuti ketersediaan lapangan.
                  Cek halaman Schedules untuk update terbaru.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
