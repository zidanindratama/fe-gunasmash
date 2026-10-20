# Frontend GunaSmash

Website untuk UKM Bulutangkis GunaSmash. Frontend ini menggunakan Next.js dan mengambil data dari backend GunaSmash.

## Fitur

- Halaman publik untuk profil klub, jadwal latihan, pengumuman, dan artikel.
- Pendaftaran dan login anggota.
- Area anggota untuk melihat profil dan melakukan check-in kehadiran.
- Dashboard admin untuk mengelola pengumuman, sesi absensi, anggota, dan artikel.
- Tampilan responsif, pilihan tema, serta pencarian dan tabel data pada dashboard.

## Menjalankan di komputer lokal

### Prasyarat

- Node.js 20.9 atau lebih baru.
- Backend GunaSmash sudah berjalan. Ikuti petunjuk di `../be-gunasmash/README.md`.

### Instalasi

Dari folder `fe-gunasmash`, jalankan:

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Konfigurasi alamat layanan

Atur alamat aplikasi dan API di `.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- `NEXT_PUBLIC_API_URL` adalah alamat dasar API. Untuk backend di komputer yang sama, gunakan `http://localhost:4000/api`.
- `NEXT_PUBLIC_APP_URL` adalah alamat website yang dipakai untuk metadata, sitemap, dan robots.

Salin `.env.example` sebagai titik awal. Ganti URL jika backend atau frontend berjalan di alamat atau port lain. Setelah mengubah environment, mulai ulang server frontend. Variabel dengan awalan `NEXT_PUBLIC_` dapat dilihat browser; jangan menyimpan password atau secret di sana.

Backend juga harus mengizinkan origin frontend lewat `CORS_WHITELIST` pada file `.env` backend. Contoh nilai lokal:

```dotenv
CORS_WHITELIST=http://localhost:3000,http://127.0.0.1:3000
```

Jika frontend berjalan di port lain, tambahkan origin yang sesuai ke daftar tersebut.

## Perintah yang tersedia

```bash
npm run dev      # Jalankan server pengembangan
npm run build    # Buat build produksi
npm start        # Jalankan build produksi
npm run lint     # Periksa kode dengan ESLint
```

Untuk menjalankan build produksi, atur variabel environment terlebih dahulu, lalu jalankan `npm run build` dan `npm start`.
