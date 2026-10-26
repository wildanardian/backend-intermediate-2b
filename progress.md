# Ringkasan Proyek `chill-backend` (Mission Backend Bootcamp)

**Konteks:** backend untuk aplikasi streaming film/series bernama "Chill".

## 1. Tech stack (sudah terpasang di `package.json`)

- **Runtime:** Node.js (CommonJS), **Express 5**
- **Middleware:** `cors`, `helmet`, `morgan`, `dotenv`
- **ORM:** Prisma 7 + `@prisma/adapter-mariadb`, database **MySQL**
- **Dev:** `nodemon`
- **`.env`:** berisi `DATABASE_URL` dan `PORT`

## 2. Struktur folder

```
src/
  app.js, server.js        ← file ada tapi KOSONG
  config/ controllers/ middlewares/ routes/ services/   ← folder KOSONG
prisma/
  schema.prisma, seed.js, migrations/, generated/
prisma.config.ts
```

Polanya sudah disiapkan sebagai layered architecture (routes → controllers → services), tetapi belum ada kode di dalamnya.

## 3. Yang SUDAH selesai: skema database (12 model)

| Domain | Tabel |
|---|---|
| User | `users` (name, email unik, password_hash, avatar_url) |
| Katalog | `contents` (title, slug unik, synopsis, type movie/series, poster/banner, age_rating, release_year, duration, is_trending) |
| Genre | `genres`, `content_genres` (tabel penghubung many-to-many) |
| Pemeran | `casts`, `content_casts` (dengan `role`) |
| Episode | `episodes` (episode_number, video_url, thumbnail, duration) |
| Aktivitas user | `watchlist` (Daftar Saya), `watch_progress` (lanjutkan menonton, per konten/episode) |
| Langganan | `subscription_plans` (price, max_devices, max_screens, features), `user_subscriptions` (status, started_at, expires_at) |

Nama kolom di database sudah memakai snake_case lewat `@map`.

## 4. Yang SEBAGIAN selesai

### Migration
Baru ada satu migration (`init_streaming_schema`), dan isinya hanya **ALTER** (rename kolom ke snake_case) untuk `contents`, `content_genres`, dan `episodes`. Tabel-tabelnya sendiri kemungkinan dibuat lewat `db push`, jadi riwayat migration belum lengkap. Kalau dijalankan di database baru, migration ini akan gagal.

### Seed (`prisma/seed.js`)
Sudah ada data 14 genre, 10 film beserta genrenya, dan 1 test user. Tetapi script ini **belum bisa jalan** karena:

- `bcrypt` belum di-install
- Field yang dipakai `password`, padahal di schema namanya `passwordHash`
- `genreMap(name)` dipanggil seperti fungsi (seharusnya `genreMap[name]`), dan arrow function `{ genreId: ... }` tidak mengembalikan object
- Beberapa genre yang dipakai film tidak ada di daftar genre: Fantasi, Musikal, Animasi, Horor
- `main()` tidak pernah dipanggil, dan tidak ada `prisma.$disconnect()`
- `PrismaClient` di-import dari `@prisma/client`, padahal output generator ada di `prisma/generated`. Prisma 7 juga butuh adapter MariaDB saat inisialisasi client.
- Belum ada konfigurasi `seed` di `prisma.config.ts`, dan belum ada data series, episode, cast, maupun subscription plan

## 5. Yang BELUM ada

- `app.js` / `server.js`: inisialisasi Express, middleware, listen PORT
- Prisma client instance (`src/config`)
- Semua endpoint REST: auth (register/login), konten, genre, episode, watchlist, watch progress, subscription
- Autentikasi (hash password, JWT) dan middleware auth
- Validasi input dan error handler terpusat
- Script `npm` untuk `dev`/`start`, isi `.gitignore` dan `.env.example` (keduanya masih kosong)

## 6. Catatan desain yang perlu diputuskan

- Tabel penghubung (`content_genres`, `content_casts`, `watchlist`) belum punya unique constraint gabungan, jadi data duplikat bisa masuk
- Kolom `watchlist.userId`/`contentId` belum diberi `@map`, jadi tidak konsisten dengan kolom lain yang snake_case
- Belum ada `onDelete: Cascade`, jadi menghapus konten akan ditolak kalau masih punya relasi
- `synopsis` bertipe `String` (VARCHAR 191 di MySQL), dan sinopsis yang panjang bisa terpotong. Sebaiknya pakai `@db.Text`
- `type` dan `status` masih berupa String bebas. Bisa diganti `enum`
