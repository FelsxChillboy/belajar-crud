# Aplikasi Inventaris

Aplikasi CRUD inventaris menggunakan React, Vite, Tailwind CSS, Express, dan MySQL/MariaDB di Laragon.

## Persiapan

1. Jalankan MySQL dari Laragon.
2. Buka `database/inventaris.sql` di HeidiSQL/phpMyAdmin atau jalankan melalui klien MySQL. Skrip membuat database `inventaris`, tabel, dan beberapa kategori awal.
3. Salin `backend/.env.example` menjadi `backend/.env`. Sesuaikan koneksi database jika diperlukan (konfigurasi Laragon standar biasanya memakai user `root` tanpa password).
4. Pasang dependensi dari folder utama:

   ```bash
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```

5. Jalankan frontend dan backend:

   ```bash
   npm run dev
   ```

   Frontend tersedia di `http://localhost:5173`, API di `http://localhost:5000`.

## Endpoint

- `GET /api/barang` — daftar barang beserta nama kategori
- `POST /api/barang` — tambah barang (`nama`, `stok` opsional, `kategori_id`)
- `PATCH /api/barang/:id` — perbarui satu atau lebih kolom
- `DELETE /api/barang/:id` — hapus barang
- `GET /api/kategori` — daftar kategori untuk pilihan formulir
