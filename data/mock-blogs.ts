export interface BlogAuthor {
  name: string;
  avatarUrl: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  htmlContent?: string;
  coverUrl: string;
  tags: string[];
  createdAt: string;
  readTime: string;
  author: BlogAuthor;
}

const DUMMY_BLOG_HTML = `
  <p>Bulutangkis adalah olahraga yang menuntut fisik prima, teknik tinggi, dan strategi yang matang. Dalam artikel ini, kita akan membedah aspek-aspek krusial yang sering terabaikan oleh pemain pemula maupun menengah.</p>
  
  <h2>1. Posisi Kaki adalah Kunci</h2>
  <p>Banyak pemain terlalu fokus pada pukulan tangan, padahal <strong>footwork</strong> adalah pondasi utamanya. Tanpa posisi kaki yang tepat, pukulan sekuat apapun tidak akan efektif.</p>
  <ul>
    <li>Selalu kembali ke titik tengah (base position) setelah memukul.</li>
    <li>Gunakan langkah <em>chasse</em> untuk pergerakan yang efisien.</li>
    <li>Jaga lutut tetap menekuk agar siap bereaksi ke segala arah.</li>
  </ul>

  <h2>2. Rotasi Pinggang saat Smash</h2>
  <p>Kekuatan smash tidak hanya berasal dari lengan, tetapi dari rantai kinetik tubuh. Mulai dari tolakan kaki, putaran pinggang, hingga lecutan pergelangan tangan.</p>
  
  <blockquote>"Power comes from coordination, not just muscle."</blockquote>

  <h2>3. Mentalitas Juara</h2>
  <p>Saat poin kritis (seperti 19-19), ketenangan adalah segalanya. Jangan terburu-buru mematikan lawan. Bermainlah sabar dan tunggu kesempatan yang tepat.</p>
`;

export const MOCK_BLOGS: Blog[] = [
  {
    id: "1",
    title: "5 Tips to Improve Your Smash Power",
    slug: "5-tips-improve-smash-power",
    content: "Smashing is one of the most exciting aspects of badminton...",
    htmlContent: DUMMY_BLOG_HTML,
    coverUrl:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop",
    tags: ["Technique", "Training", "Guide"],
    createdAt: "2025-02-10T10:00:00.000Z",
    readTime: "5 min read",
    author: {
      name: "Budi Santoso",
      avatarUrl: "https://i.pravatar.cc/150?u=coach",
    },
  },
  {
    id: "2",
    title: "Recap: Gunadarma Cup 2024 Highlights",
    slug: "recap-gunadarma-cup-2024",
    content: "What a weekend! The annual Gunadarma Cup concluded with...",
    htmlContent: `
      <p>Turnamen tahun ini berjalan sangat meriah dengan partisipasi lebih dari 50 pasang ganda.</p>
      <h2>Juara Ganda Putra</h2>
      <p>Selamat kepada pasangan Raka & Dimas yang berhasil mempertahankan gelar juara mereka setelah pertarungan sengit 3 set di final.</p>
      <img src="https://images.unsplash.com/photo-1717659487323-7783a99bcf61?q=80&w=1000&auto=format&fit=crop" alt="Victory Moment" class="rounded-xl my-4" />
      <p>Terima kasih kepada seluruh sponsor dan panitia yang bertugas.</p>
    `,
    coverUrl:
      "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000&auto=format&fit=crop",
    tags: ["Event", "News", "Tournament"],
    createdAt: "2025-01-28T09:00:00.000Z",
    readTime: "3 min read",
    author: {
      name: "Andi Pratama",
      avatarUrl: "https://i.pravatar.cc/150?u=andi-pratama",
    },
  },
  {
    id: "3",
    title: "Choosing the Right Racket for Your Playstyle",
    slug: "choosing-right-racket",
    content: "Head-heavy, head-light, or balanced? Stiff or flexible shaft?...",
    coverUrl:
      "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?q=80&w=1000&auto=format&fit=crop",
    tags: ["Gear", "Guide", "Tips"],
    createdAt: "2025-02-05T14:30:00.000Z",
    readTime: "7 min read",
    author: {
      name: "Marsya Anindita",
      avatarUrl: "https://i.pravatar.cc/150?u=marsya",
    },
  },
  {
    id: "4",
    title: "The Importance of Footwork in Badminton",
    slug: "importance-of-footwork",
    content:
      "You can't hit what you can't reach. Footwork is the foundation...",
    coverUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
    tags: ["Training", "Technique", "Drills"],
    createdAt: "2025-01-15T08:00:00.000Z",
    readTime: "6 min read",
    author: {
      name: "Coach Hendra",
      avatarUrl: "https://i.pravatar.cc/150?u=hendra",
    },
  },
  {
    id: "5",
    title: "Nutrition for Badminton Athletes",
    slug: "nutrition-badminton-athletes",
    content: "What you eat before and after a match significantly impacts...",
    coverUrl:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000&auto=format&fit=crop",
    tags: ["Health", "Nutrition", "Lifestyle"],
    createdAt: "2025-02-12T11:00:00.000Z",
    readTime: "4 min read",
    author: {
      name: "Dr. Ryan",
      avatarUrl: "https://i.pravatar.cc/150?u=ryan",
    },
  },
];
