# Panduan Deploy SMARTSIS HIMASIS ke Vercel

Dokumen ini adalah runbook deployment untuk project `lms-himasis-main` ke Vercel. Tujuannya agar production deploy berjalan rapi, aman, mudah diulang, dan mudah di-debug jika ada error.

Terakhir diverifikasi lokal: `2026-06-24`.

Status teknis saat dokumen dibuat:

- Framework: Next.js 16 App Router.
- Package manager: pnpm.
- Lockfile: `pnpm-lock.yaml`.
- Auth: Clerk.
- CMS/content: Sanity.
- Email: Resend + React Email.
- AI tutor: AI SDK + OpenAI.
- Scheduled job: route cron `/api/cron/progress-reminder`.
- Local verification: `pnpm typecheck` sukses, `pnpm build` sukses.

## 1. Prinsip Penting

Jangan pernah menaruh secret di source code atau commit ke GitHub.

File `.env.local` sudah di-ignore oleh `.gitignore`, jadi aman selama tidak dipaksa commit manual. Semua secret production harus dimasukkan lewat Vercel Project Settings, bukan di file repo.

Gunakan `pnpm`, bukan `npm`, karena project ini punya `pnpm-lock.yaml` dan dependency tree-nya dibuat oleh pnpm.

Vercel akan otomatis mendeteksi pnpm dari `pnpm-lock.yaml`. Jika override manual diperlukan, gunakan install command `pnpm install`, tapi normalnya tidak perlu.

## 2. Arsitektur Production

Saat production, request mengalir seperti ini:

1. User membuka domain Vercel atau custom domain.
2. Next.js menjalankan route, server components, route handlers, dan proxy auth.
3. Clerk menangani login, session, protected route, dan membership check.
4. Sanity menjadi CMS untuk course, module, lesson, certificate, admin users, dan data LMS lain.
5. OpenAI dipakai oleh `/api/chat` untuk AI tutor.
6. Resend dipakai untuk email welcome, certificate, announcement, dan reminder.
7. Vercel Cron dapat memanggil `/api/cron/progress-reminder` secara otomatis jika diaktifkan.

## 3. File Yang Relevan Untuk Deploy

File utama:

- `package.json`: scripts build, dependencies, devDependencies.
- `pnpm-lock.yaml`: dependency lockfile.
- `next.config.ts`: config Next.js, termasuk remote image Sanity.
- `proxy.ts`: route protection dengan Clerk.
- `.gitignore`: memastikan `.env*`, `.next`, `.vercel`, dan generated files tidak ke-commit.
- `app/api/webhooks/clerk/route.ts`: Clerk webhook untuk user baru.
- `app/api/cron/progress-reminder/route.ts`: endpoint reminder email.
- `sanity/env.ts`: validasi env Sanity wajib.
- `sanity/lib/client.ts`: Sanity read/write clients.
- `sanity/lib/live.ts`: Sanity live fetch.
- `lib/resend.ts`: Resend API client dan base URL email.
- `lib/ai/tutor-agent.ts`: model OpenAI untuk tutor.

## 4. Checklist Sebelum Deploy

Jalankan dari root project:

```bash
git pull origin main
pnpm install
pnpm typecheck
pnpm build
```

Build harus selesai tanpa error. Warning masih bisa muncul, tetapi pahami artinya.

Warning yang tidak fatal:

- `baseline-browser-mapping`: data browser mapping dari dependency. Project sudah punya direct dev dependency `baseline-browser-mapping`, tetapi warning bisa tetap muncul dari nested tooling. Ini bukan blocker selama build sukses.
- Peer warning `@clerk/themes`: package mengharapkan range React tertentu. Selama typecheck dan build sukses, ini bukan blocker langsung, tetapi tetap pantau saat upgrade Clerk/React.

Jika build gagal karena env Sanity:

- Pastikan `.env.local` lokal lengkap.
- Pastikan `NEXT_PUBLIC_SANITY_PROJECT_ID` dan `NEXT_PUBLIC_SANITY_DATASET` terisi.

## 5. Commit Yang Harus Masuk GitHub

Sebelum Vercel deploy dari GitHub, semua perubahan yang dibutuhkan production harus sudah di-push.

Contoh:

```bash
git status --short
git add package.json pnpm-lock.yaml proxy.ts middleware.ts deploy.md
git commit -m "chore: prepare vercel deployment"
git push origin main
```

Jika ada perubahan lain seperti `app/(app)/page.tsx`, cek dulu apakah memang ingin ikut deploy:

```bash
git diff -- "app/(app)/page.tsx"
```

Jika ingin ikut:

```bash
git add "app/(app)/page.tsx"
```

Jika tidak ingin ikut, jangan add file itu. Jangan revert perubahan orang lain tanpa sengaja.

## 6. Environment Variables Production

Buka Vercel:

Project -> Settings -> Environment Variables.

Masukkan env untuk environment `Production`. Untuk awal, boleh centang juga `Preview` dan `Development` jika ingin preview deploy memakai konfigurasi yang sama. Untuk tim profesional, idealnya Production dan Preview memakai key berbeda.

### 6.1 Public Environment Variables

Variable dengan prefix `NEXT_PUBLIC_` akan masuk ke browser bundle. Jangan isi dengan secret kecuali benar-benar paham risikonya.

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-11-27
NEXT_PUBLIC_SANITY_ORG_ID=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=https://domain-production-kamu
NEXT_PUBLIC_SANITY_ADMIN_TOKEN=
```

Catatan penting tentang `NEXT_PUBLIC_SANITY_ADMIN_TOKEN`:

- Nama env ini berarti token akan tersedia di browser.
- Jika token punya write/admin permission, ini risiko keamanan serius.
- Untuk deploy cepat, aplikasi saat ini mungkin membutuhkannya untuk admin UI berbasis Sanity SDK.
- Untuk production publik yang aman, refactor admin write flow agar token write hanya dipakai server-side melalui `SANITY_API_WRITE_TOKEN`, bukan `NEXT_PUBLIC_SANITY_ADMIN_TOKEN`.

Rekomendasi:

- Jangan gunakan token owner/global.
- Jika terpaksa dipakai sementara, buat token khusus dengan permission seminimal mungkin.
- Batasi akses admin route dengan Clerk dan pastikan hanya admin yang bisa membuka UI.
- Prioritaskan refactor sebelum aplikasi dipakai publik luas.

### 6.2 Secret Environment Variables

Variable ini hanya untuk server/runtime. Jangan pakai prefix `NEXT_PUBLIC_`.

```env
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
SANITY_API_READ_TOKEN=
SANITY_API_WRITE_TOKEN=
RESEND_API_KEY=
OPENAI_API_KEY=
CRON_SECRET=
```

### 6.3 Optional/Legacy Variables

Variable ini ada di `.env.local` atau README, tetapi tidak semuanya aktif dipakai runtime saat ini.

```env
GROQ_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
SUPER_ADMIN_EMAIL=
```

Catatan `SUPER_ADMIN_EMAIL`:

- Saat dokumen ini dibuat, `lib/admin.ts` masih hardcoded:

```ts
export const SUPER_ADMIN_EMAIL = "nabilzihni08@gmail.com";
```

- Jadi env `SUPER_ADMIN_EMAIL` belum efektif kecuali kode diubah.
- Untuk production yang fleksibel, sebaiknya refactor menjadi:

```ts
export const SUPER_ADMIN_EMAIL =
  process.env.SUPER_ADMIN_EMAIL || "fallback@example.com";
```

## 7. Mendapatkan Env Dari Masing-Masing Service

### 7.1 Sanity

Yang dibutuhkan:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SANITY_ORG_ID`
- `SANITY_API_READ_TOKEN`
- `SANITY_API_WRITE_TOKEN`
- sementara: `NEXT_PUBLIC_SANITY_ADMIN_TOKEN`

Langkah:

1. Buka Sanity Manage.
2. Pilih project yang dipakai LMS.
3. Ambil Project ID.
4. Pastikan dataset production ada, biasanya `production`.
5. Buat API token:
   - Read token untuk query private/draft/live.
   - Write token untuk create/update/delete document.
6. Tambahkan CORS origin:
   - `http://localhost:3000` untuk local.
   - `https://nama-project.vercel.app` untuk Vercel domain.
   - `https://domain-kustom.com` jika memakai custom domain.
7. Jika credentials dibutuhkan di browser untuk Sanity SDK admin, izinkan credentials hanya bila perlu.

Sanity env minimal agar build tidak gagal:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-11-27
```

### 7.2 Clerk

Yang dibutuhkan:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`

Langkah:

1. Buka Clerk Dashboard.
2. Pilih aplikasi production atau buat instance production.
3. Ambil publishable key dan secret key.
4. Masukkan ke Vercel env.
5. Atur allowed origins, redirect URLs, dan after sign-in/sign-up URL sesuai domain production.
6. Setelah Vercel deploy pertama berhasil, buat webhook endpoint production.

Webhook endpoint:

```text
https://domain-production-kamu/api/webhooks/clerk
```

Event yang dipakai kode:

```text
user.created
```

Setelah endpoint dibuat:

1. Copy signing secret dari Clerk webhook endpoint.
2. Masukkan ke Vercel sebagai `CLERK_WEBHOOK_SECRET`.
3. Redeploy production agar env baru aktif.

Route webhook sudah dibuat public di `proxy.ts`, sehingga Clerk bisa memanggil endpoint tanpa session user.

### 7.3 Resend

Yang dibutuhkan:

- `RESEND_API_KEY`

Langkah:

1. Buka Resend Dashboard.
2. Buat API key production.
3. Masukkan ke Vercel env sebagai `RESEND_API_KEY`.
4. Untuk production email sungguhan, verifikasi domain di Resend.
5. Setelah domain verified, ubah `EMAIL_FROM` di `lib/resend.ts` dari:

```ts
export const EMAIL_FROM = "SMARTSIS HIMASIS <onboarding@resend.dev>";
```

menjadi email domain sendiri, contoh:

```ts
export const EMAIL_FROM = "SMARTSIS HIMASIS <noreply@domain-kamu.com>";
```

Catatan:

- `onboarding@resend.dev` cocok untuk test terbatas.
- Production sebaiknya memakai domain verified agar email tidak ditolak atau masuk spam.

### 7.4 OpenAI

Yang dibutuhkan:

- `OPENAI_API_KEY`

Kode memakai:

```ts
openai("gpt-4o")
```

Langkah:

1. Buka OpenAI API dashboard.
2. Buat API key.
3. Masukkan ke Vercel env sebagai `OPENAI_API_KEY`.
4. Pastikan billing/quota aktif.
5. Test fitur AI tutor dari user yang memenuhi membership `ultra`.

Jika `OPENAI_API_KEY` kosong, route `/api/chat` bisa error saat dipakai.

### 7.5 Cron Secret

Yang dibutuhkan:

- `CRON_SECRET`

Buat random string panjang minimal 16 karakter, lebih baik 32+ karakter.

Contoh format:

```env
CRON_SECRET=random_string_panjang_dan_unik
```

Jangan pakai contoh itu di production.

Vercel otomatis mengirim header:

```text
Authorization: Bearer <CRON_SECRET>
```

Route `app/api/cron/progress-reminder/route.ts` sudah membandingkan header tersebut dengan `process.env.CRON_SECRET`.

## 8. Setup Project Di Vercel Dashboard

Langkah:

1. Buka Vercel Dashboard.
2. Klik `Add New` -> `Project`.
3. Import GitHub repository:

```text
xnabil354/learning-management-system-himasis
```

4. Framework Preset: `Next.js`.
5. Root Directory: biarkan root project.
6. Build settings:

```text
Install Command: auto / pnpm install
Build Command: pnpm build
Output Directory: kosong/default
Development Command: pnpm dev
```

7. Tambahkan environment variables production.
8. Klik Deploy.

Vercel akan:

1. Clone repository.
2. Detect `pnpm-lock.yaml`.
3. Install dependencies dengan pnpm.
4. Menjalankan `pnpm build`.
5. Membuat production deployment.

## 9. Deploy Via CLI Opsional

Dashboard lebih mudah untuk awal. CLI berguna untuk debugging.

Install Vercel CLI:

```bash
pnpm add -g vercel
```

Login:

```bash
vercel login
```

Link project:

```bash
vercel link
```

Pull env dari Vercel ke local cache:

```bash
vercel pull
```

Build lokal memakai konfigurasi Vercel:

```bash
vercel build
```

Deploy preview:

```bash
vercel
```

Deploy production:

```bash
vercel --prod
```

## 10. Custom Domain

Jika memakai domain sendiri:

1. Buka Vercel Project -> Settings -> Domains.
2. Tambahkan domain, contoh:

```text
lms.himasis.org
```

3. Ikuti instruksi DNS dari Vercel.
4. Tunggu DNS propagasi.
5. Update env:

```env
NEXT_PUBLIC_APP_URL=https://lms.himasis.org
```

6. Update Clerk allowed origins/redirect URLs.
7. Update Sanity CORS origin.
8. Update Clerk webhook endpoint:

```text
https://lms.himasis.org/api/webhooks/clerk
```

9. Redeploy production.

## 11. Mengaktifkan Vercel Cron

Saat ini route cron sudah ada:

```text
/api/cron/progress-reminder
```

Tetapi cron tidak otomatis aktif tanpa config.

Buat file `vercel.json` di root project jika memang ingin email reminder otomatis berjalan:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    {
      "path": "/api/cron/progress-reminder",
      "schedule": "0 2 * * *"
    }
  ]
}
```

Penjelasan jadwal:

- Vercel cron memakai UTC.
- Indonesia WIB = UTC+7.
- `0 2 * * *` berarti 02:00 UTC = 09:00 WIB setiap hari.

Setelah menambah `vercel.json`:

```bash
git add vercel.json
git commit -m "chore: add vercel cron"
git push origin main
```

Lalu deploy ulang.

Jangan aktifkan cron sebelum yakin:

- `RESEND_API_KEY` benar.
- Domain email verified.
- Logic reminder sudah sesuai.
- Tidak akan mengirim email massal yang tidak diinginkan.

## 12. Post-Deploy Verification

Setelah deploy sukses, lakukan checklist ini.

### 12.1 Basic Page Check

Buka:

```text
https://domain-production-kamu/
```

Cek:

- Landing page tampil.
- Tidak ada error 500.
- Asset dan style muncul.
- Logo/gambar dari Sanity tampil.

### 12.2 Auth Check

Cek:

- Sign in bekerja.
- Sign out bekerja.
- `/dashboard` menolak user belum login.
- `/dashboard` bisa dibuka setelah login.
- `/admin` hanya bisa dipakai admin.
- `/verify/[id]` tetap public.

### 12.3 Sanity Check

Cek:

- Course list tampil.
- Detail course tampil.
- Detail lesson tampil.
- Admin panel bisa read data.
- Admin panel bisa create/update data jika memang write token sudah benar.

Jika Sanity error:

- Cek env Vercel.
- Cek Sanity CORS origin.
- Cek token permission.
- Cek dataset name.

### 12.4 Email Check

Cek:

- Signup user baru memicu Clerk webhook.
- Clerk webhook log status 2xx.
- Welcome email terkirim.
- Resend logs menunjukkan accepted/sent.

Jika email tidak terkirim:

- Cek `RESEND_API_KEY`.
- Cek `CLERK_WEBHOOK_SECRET`.
- Cek webhook endpoint URL.
- Cek Resend domain verification.
- Cek Vercel Runtime Logs untuk `/api/webhooks/clerk`.

### 12.5 AI Tutor Check

Cek:

- Login sebagai user yang punya plan `ultra`.
- Buka fitur tutor.
- Kirim pertanyaan.
- Response streaming berjalan.

Jika error:

- Cek `OPENAI_API_KEY`.
- Cek billing/quota OpenAI.
- Cek membership/plan Clerk.
- Cek runtime logs route `/api/chat`.

### 12.6 Cron Check

Jika cron diaktifkan:

1. Buka Vercel Dashboard -> Project -> Cron Jobs.
2. Pastikan job terdaftar.
3. Trigger manual jika tersedia.
4. Cek runtime logs:

```text
requestPath:/api/cron/progress-reminder
```

Jika 401:

- `CRON_SECRET` tidak ada atau salah.
- Header Authorization tidak cocok.

Jika 500:

- Cek Resend.
- Cek Sanity query.
- Cek logic `sendProgressReminders`.

## 13. Troubleshooting Umum

### 13.1 Build Error: Missing Sanity Env

Gejala:

```text
Missing environment variable: NEXT_PUBLIC_SANITY_DATASET
Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID
```

Solusi:

- Tambahkan env di Vercel Production.
- Redeploy.
- Pastikan nama env tidak typo.

### 13.2 Clerk Error: Missing Publishable Key

Gejala:

```text
@clerk/nextjs: Missing publishableKey
```

Solusi:

- Tambahkan `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
- Tambahkan `CLERK_SECRET_KEY`.
- Redeploy.

### 13.3 Webhook Clerk 401/400

Kemungkinan:

- URL webhook salah.
- Route webhook masih dilindungi auth.
- `CLERK_WEBHOOK_SECRET` salah.
- Event tidak subscribe `user.created`.

Solusi:

- Gunakan endpoint:

```text
https://domain-production-kamu/api/webhooks/clerk
```

- Pastikan `proxy.ts` mengecualikan `/api/webhooks(.*)`.
- Copy ulang signing secret webhook dari Clerk.
- Redeploy setelah update env.

### 13.4 Sanity 401/403

Kemungkinan:

- Token salah.
- Token permission kurang.
- Dataset salah.
- CORS belum memasukkan domain production.

Solusi:

- Buat token baru.
- Tambahkan origin production di Sanity CORS.
- Redeploy.

### 13.5 Email Tidak Terkirim

Kemungkinan:

- `RESEND_API_KEY` tidak ada.
- Sender belum verified.
- Menggunakan `onboarding@resend.dev` untuk tujuan di luar batas test.
- Clerk webhook gagal.

Solusi:

- Cek Resend Logs.
- Cek Vercel Runtime Logs.
- Pakai verified domain.
- Update `EMAIL_FROM`.

### 13.6 AI Tutor Error

Kemungkinan:

- `OPENAI_API_KEY` kosong.
- OpenAI billing belum aktif.
- User tidak punya plan `ultra`.
- Sanity search tool gagal query.

Solusi:

- Cek Vercel env.
- Cek OpenAI dashboard.
- Cek Clerk membership.
- Cek route logs `/api/chat`.

### 13.7 Pnpm/Npm Error

Jangan menjalankan:

```bash
npm install
```

Gunakan:

```bash
pnpm install
pnpm add <package>
pnpm add -D <package>
```

Project ini memakai pnpm. Mencampur npm dengan pnpm dapat membuat dependency tree atau lockfile bermasalah.

## 14. Security Checklist Production

Wajib:

- `.env.local` tidak di-commit.
- `CLERK_SECRET_KEY` hanya di Vercel env.
- `SANITY_API_WRITE_TOKEN` hanya di Vercel env.
- `RESEND_API_KEY` hanya di Vercel env.
- `OPENAI_API_KEY` hanya di Vercel env.
- `CRON_SECRET` random dan panjang.
- Clerk webhook memakai signature verification.
- Admin route dilindungi Clerk.
- Sanity CORS hanya memasukkan domain yang diperlukan.
- Resend memakai verified domain.

Perlu perhatian khusus:

- `NEXT_PUBLIC_SANITY_ADMIN_TOKEN` adalah risiko jika berisi write/admin token.
- Untuk standar production yang lebih aman, refactor admin operations supaya write token tidak pernah masuk browser.

## 15. Deployment Flow Rekomendasi Tim

Untuk kerja tim dengan GitHub:

1. Developer push ke branch masing-masing.
2. Buka Pull Request.
3. Vercel membuat Preview Deployment.
4. Review UI dan logs di Preview.
5. Merge PR ke `main`.
6. Vercel membuat Production Deployment otomatis.
7. Setelah production deploy, cek smoke test.

Smoke test minimal:

- Home page.
- Login.
- Dashboard.
- Course detail.
- Lesson detail.
- Admin page.
- AI tutor.
- Email webhook jika memungkinkan.

## 16. Rollback

Jika production rusak setelah deploy:

1. Buka Vercel Dashboard.
2. Pilih project.
3. Buka Deployments.
4. Pilih deployment sebelumnya yang stabil.
5. Klik Promote to Production atau Rollback, tergantung UI Vercel.
6. Setelah rollback, cek runtime logs.
7. Buat fix di branch baru.

Jika error karena env:

1. Fix env di Settings.
2. Redeploy deployment terbaru.
3. Jangan ubah code jika akar masalah hanya env.

## 17. Referensi Resmi

- Vercel Next.js: https://vercel.com/docs/frameworks/full-stack/nextjs
- Vercel Environment Variables: https://vercel.com/docs/environment-variables
- Vercel Package Managers: https://vercel.com/docs/package-managers
- Vercel Cron Jobs: https://vercel.com/docs/cron-jobs
- Vercel Cron Security: https://vercel.com/docs/cron-jobs/manage-cron-jobs
- Vercel CLI Env Pull: https://vercel.com/docs/cli/env
- Clerk Environment Variables: https://clerk.com/docs/guides/development/clerk-environment-variables
- Clerk Webhooks: https://clerk.com/docs/guides/development/webhooks/syncing
- Sanity on Vercel: https://vercel.com/docs/integrations/cms/sanity
- Resend with Vercel Functions: https://resend.com/docs/send-with-vercel-functions
- Next.js Environment Variables: https://nextjs.org/docs/app/guides/environment-variables
- Next.js Proxy: https://nextjs.org/docs/app/api-reference/file-conventions/proxy

## 18. Quick Command Summary

Local verification:

```bash
pnpm install
pnpm typecheck
pnpm build
```

Update dari GitHub:

```bash
git pull origin main
pnpm install
```

Commit deployment docs/config:

```bash
git add deploy.md package.json pnpm-lock.yaml proxy.ts middleware.ts
git commit -m "chore: prepare vercel deployment"
git push origin main
```

Deploy CLI production:

```bash
vercel --prod
```

Pull env Vercel ke local:

```bash
vercel env pull .env.local
```

Build dengan Vercel CLI:

```bash
vercel build
```
