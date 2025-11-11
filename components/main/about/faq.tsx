"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import SectionHeader from "./section-header";

export default function FAQ() {
  const items = [
    {
      q: "Apakah pemula boleh bergabung?",
      a: "Boleh. Program kami bertahap mulai dari fundamental, sehingga pemula dapat mengikuti dengan nyaman.",
    },
    {
      q: "Latihan diadakan kapan dan di mana?",
      a: "Rabu sore dan Minggu pagi di Sport Center Kampus H atau GOR sekitar. Jadwal detail ada di halaman Schedules.",
    },
    {
      q: "Apa saja perlengkapan yang perlu dibawa?",
      a: "Raket, sepatu non-marking, kaos ganti, handuk, dan air minum. Shuttlecock disediakan bersama sesuai kebijakan sesi.",
    },
    {
      q: "Bagaimana alur pendaftaran anggota?",
      a: "Daftar akun, lengkapi profil, verifikasi, lalu aktifkan keanggotaan. Setelah itu kamu bisa hadir latihan reguler.",
    },
    {
      q: "Apakah ada biaya keanggotaan?",
      a: "Jika diberlakukan, informasi biaya akan tercantum di Schedules atau saat proses pendaftaran.",
    },
  ];
  return (
    <section id="faq" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <SectionHeader
          eyebrow="FAQ"
          title="Pertanyaan yang sering ditanyakan"
          subtitle="Jika masih ada pertanyaan, hubungi kami melalui kontak di bawah."
        />
        <div className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            {items.map((it, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">
                  {it.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {it.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
