# chill-backend

REST API untuk aplikasi streaming film dan series "Chill", dibangun dengan Express 5, Prisma 7, dan MySQL.

## Prasyarat
- Node.js dan npm
- MySQL yang sedang berjalan

## Setup
1. `npm install`
2. Salin `.env.example` menjadi `.env`, lalu isi `DATABASE_URL`, `PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN`
3. `npx prisma migrate dev` untuk membuat tabel dan client Prisma
4. `npx prisma db seed` untuk mengisi genre, movie, series, cast, dan user uji
   (`testinguser@localhost.com` / `password123`)
5. `npm run dev` (development, nodemon) atau `npm start`

## Endpoint
Semua path diawali `/api`. Body request memakai snake_case.

| Method | Path | Auth | Keterangan |
|---|---|---|---|
| GET | /health | Tidak | Cek server |
| POST | /auth/register | Tidak | `name`, `email`, `password` (min 6) |
| POST | /auth/login | Tidak | `email`, `password`, mengembalikan token JWT |
| GET | /genres | Tidak | Daftar genre |
| GET | /genres/:id | Tidak | Detail genre |
| POST | /genres | Tidak | `name` wajib dan unik |
| PATCH | /genres/:id | Tidak | Ubah `name` |
| DELETE | /genres/:id | Tidak | Hapus genre |
| GET | /contents | Tidak | Filter `?type=movie\|series`, `?q=judul`; menyertakan genres |
| GET | /contents/:id | Tidak | Menyertakan genres, dan episodes jika series |
| POST | /contents | Tidak | Lihat aturan di bawah; `genre_ids` (array) opsional |
| PATCH | /contents/:id | Tidak | Ubah sebagian field |
| DELETE | /contents/:id | Tidak | Hapus content beserta relasinya |
| GET | /contents/:contentId/episodes | Tidak | Episode urut `episode_number` |
| POST | /contents/:contentId/episodes | Tidak | `episode_number`, `title`, `video_url` wajib |
| PATCH | /episodes/:id | Tidak | Ubah sebagian field episode |
| DELETE | /episodes/:id | Tidak | Hapus episode |
| GET | /watchlist | Ya | Watchlist user login, terbaru dulu |
| POST | /watchlist | Ya | `content_id` |
| DELETE | /watchlist/:contentId | Ya | Hapus content dari watchlist |

Endpoint ber-auth memakai header `Authorization: Bearer <token>`.
Respons sukses: `{ success: true, message, data }`. Respons error: `{ success: false, message }`.

## Aturan bisnis
- POST content wajib: `title`, `slug` (unik), `type`, `synopsis`, `poster_url`, `banner_url`, `age_rating`, `release_year`
- `type=movie`: `video_url` dan `duration` wajib
- `type=series`: `video_url` dan `duration` harus kosong; jika diisi dibalas 400
- Episode hanya bisa dibuat untuk content `series`; `episode_number` unik per content (409 jika duplikat)
- Series yang sudah punya episode tidak bisa diubah menjadi movie
- Status code: 400 validasi, 401 auth, 404 tidak ditemukan, 409 duplikat
