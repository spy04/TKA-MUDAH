# TKA-Mudah

Aplikasi pembelajaran berbasis Next.js untuk siswa dan admin.

## Setup

1. Install dependency:

```bash
npm install
```

2. Buat file `.env.local` dari `.env.example`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tkamudah"
AUTH_SECRET="isi-random-secret-yang-panjang"
```

3. Jalankan project:

```bash
npm run dev
```

4. Buka `http://localhost:3000`

## Setup Database Lokal

1. Buat database PostgreSQL baru bernama `tkamudah`
2. Isi `DATABASE_URL` di `.env.local`
3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Saat schema berubah, jalankan migrasi:

```bash
npm run prisma:migrate -- --name init
```

## Catatan

- Project ini sekarang mengikuti workflow Prisma migration, bukan `db push`
- File schema Prisma sudah dipisah per domain di folder `prisma`
- Setelah menarik perubahan schema baru dari repository, jalankan `npm run prisma:generate`
