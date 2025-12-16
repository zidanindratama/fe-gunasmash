export type AnnouncementType =
  | "TRAINING"
  | "SPARRING"
  | "TOURNAMENT"
  | "BRIEFING"
  | "RECRUITMENT"
  | "EVENT"
  | "INFO";

export interface Announcement {
  id: string;
  title: string;
  type: AnnouncementType;
  datetime: string;
  location: string;
  content: string;
  imageUrl?: string;
  htmlContent?: string;
}

const DUMMY_HTML = `
  <h2>Background</h2>
  <p>Latihan ini sangat penting untuk meningkatkan stamina dan kelincahan. Kita akan fokus pada pergerakan kaki (footwork) yang efisien agar tidak mudah lelah saat rally panjang.</p>
  <p>Jangan lupa, badminton bukan hanya soal tangan, tapi 70% adalah soal kaki.</p>
  
  <h2>Menu Latihan</h2>
  <ul>
    <li>Pemanasan Statis & Dinamis (15 Menit)</li>
    <li>Drill Shadow 6 Titik (3 Set x 10 Repetisi)</li>
    <li>Multishuttle Feeding: Netting & Drive</li>
    <li>Pendinginan (Cooling Down)</li>
  </ul>

  <h2>Perlengkapan Wajib</h2>
  <p>Harap membawa perlengkapan berikut:</p>
  <ol>
    <li>Raket (minimal 1)</li>
    <li>Sepatu Badminton (bukan running)</li>
    <li>Air minum minimal 1.5 Liter</li>
    <li>Handuk kecil</li>
  </ol>

  <blockquote>"Champions keep playing until they get it right." - Billie Jean King</blockquote>
`;

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "Latihan Rutin Rabu Sore",
    type: "TRAINING",
    datetime: "2025-02-14T16:00:00.000Z",
    location: "Sport Center Kampus H",
    content:
      "Fokus latihan: Footwork dan agility. Wajib membawa skipping rope.",
    imageUrl:
      "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000&auto=format&fit=crop",
    htmlContent: DUMMY_HTML,
  },
  {
    id: "2",
    title: "Sparring vs Univ. Indonesia",
    type: "SPARRING",
    datetime: "2025-02-16T09:00:00.000Z",
    location: "Gymnasium UI, Depok",
    content:
      "Laga persahabatan ganda putra dan campuran. Kumpul di basecamp jam 07:30.",
    imageUrl:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop",
    htmlContent: `
      <h2>Detail Acara</h2>
      <p>Ini adalah laga persahabatan tahunan. Tujuannya untuk mempererat tali silaturahmi antar UKM Badminton.</p>
      <h2>Matchup</h2>
      <ul>
        <li>3 Partai Ganda Putra</li>
        <li>2 Partai Ganda Campuran</li>
      </ul>
    `,
  },
  {
    id: "3",
    title: "Open Recruitment Batch 2",
    type: "RECRUITMENT",
    datetime: "2025-03-01T00:00:00.000Z",
    location: "Online Registration",
    content:
      "Pendaftaran anggota baru dibuka kembali. Ajak teman-temanmu bergabung!",
    htmlContent: "<p>Detail pendaftaran akan segera diupdate.</p>",
  },
  {
    id: "4",
    title: "Gunadarma Cup 2025",
    type: "TOURNAMENT",
    datetime: "2025-04-20T08:00:00.000Z",
    location: "GOR Ciracas",
    content:
      "Turnamen internal terbesar tahun ini. Total hadiah 10 Juta Rupiah. Siapkan pasanganmu!",
    imageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
    htmlContent: DUMMY_HTML,
  },
  {
    id: "5",
    title: "Technical Meeting Turnamen",
    type: "BRIEFING",
    datetime: "2025-04-18T19:00:00.000Z",
    location: "Zoom Meeting",
    content: "Wajib hadir bagi seluruh peserta Gunadarma Cup 2025.",
    htmlContent: "<p>Link Zoom akan dibagikan H-1 di grup WhatsApp.</p>",
  },
  {
    id: "6",
    title: "Maintenance Lapangan",
    type: "INFO",
    datetime: "2025-02-10T00:00:00.000Z",
    location: "Sport Center Kampus H",
    content: "Lapangan ditutup sementara untuk perbaikan lantai vinyl.",
    htmlContent:
      "<p>Mohon maaf atas ketidaknyamanan ini. Latihan dialihkan ke GOR alternatif.</p>",
  },
];
