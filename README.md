# HIMASIS E-Learning — LMS Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Sanity](https://img.shields.io/badge/Sanity-CMS-F03E2F?logo=sanity)](https://www.sanity.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk)](https://clerk.com/)
[![GroqAI](https://img.shields.io/badge/GroqAI-412991?logo=groqai)](https://groq.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

> **Platform e-learning** untuk Himpunan Mahasiswa Sistem Informasi (HIMASIS) — STMI Jakarta. Dibangun dengan arsitektur modern, fitur AI-powered tutoring, dan custom admin panel.

---

## 📖 Tentang Proyek

**HIMASIS E-Learning** adalah Learning Management System (LMS) yang dikembangkan oleh Divisi Akademik HIMASIS STMI Jakarta. Platform ini memungkinkan:

- **Mahasiswa** mengakses materi pembelajaran, menonton video, melacak progres belajar, dan mendapatkan bantuan dari AI Tutor
- **Admin** mengelola konten kursus melalui custom admin dashboard
- **Pengajar** mengunggah dan mengorganisir materi dalam format kursus → modul → lesson

---

## ✨ Fitur Utama

<table>
<tr>
<td width="50%">

### 🎓 Untuk Mahasiswa

- Video streaming platform Youtube untuk setiap lesson
- **[BARU]** Gamification System (XP, Badges, Leaderboard bulanan)
- **[BARU]** Interactive Quiz & Assessment (Grading Otomatis)
- **[BARU]** PWA Support (Installable Web App di HP & Desktop)
- Progress tracking & sertifikat penyelesaian
- AI Learning Assistant
- Pencarian global

</td>
<td width="50%">

### 🛠️ Untuk Admin

- Custom admin panel (`/admin`) dengan Sanity App SDK
- Course, Module, & Lesson editor lengkap
- **[BARU]** Manajemen Soal Quiz Multiple Choice
- Drag-and-drop reordering modul
- User management (Super Admin)
- Fallback Sanity Studio (`/studio`)

</td>
</tr>
</table>

---

## 🏗️ Tech Stack

| Layer         | Teknologi                               |
| ------------- | --------------------------------------- |
| **Framework** | Next.js 16 (App Router) + React 19      |
| **CMS**       | Sanity (Headless CMS) + Sanity App SDK  |
| **Auth**      | Clerk (Authentication & Subscription)   |
| **AI**        | GroqAI Agent                            |
| **Styling**   | Tailwind CSS 4 + Shadcn UI              |
| **Fitur**     | PWA capabilities, Native Install Prompt |
| **Language**  | TypeScript (end-to-end)                 |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+**
- **pnpm** (package manager)
- Akun: Sanity, Clerk, GroqAI

### Instalasi

```bash
git clone https://github.com/xzhndvs/lms-himasis-main.git
cd lms-himasis-main
pnpm install
```

### Environment Variables

Buat file `.env.local` dengan variabel berikut:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=<project_id>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-11-27
SANITY_API_READ_TOKEN=<read_token>
SANITY_API_WRITE_TOKEN=<write_token>
NEXT_PUBLIC_SANITY_ADMIN_TOKEN=<write_token>

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# GroqAI
GROQ_API_KEY=sk-...

# Super Admin
SUPER_ADMIN_EMAIL=<email_admin>
```

### Menjalankan Development Server

```bash
pnpm dev
```

Buka di browser:

- **App utama:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin
- **Sanity Studio:** http://localhost:3000/studio

---

## 📁 Struktur Proyek

```
├── app/
│   ├── (admin)/admin/     # Custom admin panel (Sanity App SDK)
│   ├── (app)/             # Halaman utama (mahasiswa)
│   ├── studio/            # Sanity Studio
│   └── api/               # API routes (AI chat, admin-check)
├── components/
│   ├── admin/             # Komponen admin & editor
│   ├── courses/           # Tampilan kursus
│   ├── lessons/           # Video player & sidebar
│   ├── tutor/             # AI Tutor widget
│   └── ui/                # Shadcn components
├── lib/
│   ├── actions/           # Server actions
│   ├── ai/                # AI agent & tools
│   └── hooks/             # Custom React hooks
├── sanity/
│   ├── schemaTypes/       # Definisi schema Sanity
│   └── lib/               # Client & queries
└── sanity.config.ts       # Konfigurasi Sanity Studio
```

---

## 🗄️ Skema Database

| Tipe Dokumen   | Deskripsi                    | Field Utama                               |
| -------------- | ---------------------------- | ----------------------------------------- |
| **Course**     | Container pembelajaran utama | title, slug, description, tier, modules[] |
| **Module**     | Kelompok lesson terkait      | title, description, lessons[]             |
| **Lesson**     | Unit pembelajaran individual | title, slug, video, quiz, completedBy[]   |
| **QuizResult** | Hasil nilai assesment user   | studentId, lessonId, score, isCompleted   |
| **Category**   | Pengorganisasi kursus        | title, description                        |
| **Review**     | Ulasan kursus                | rating, comment, courseId                 |
| **AdminUser**  | Daftar admin yang diizinkan  | email, name                               |

### Hierarki Konten

```
Course
├── category (→ Category)
├── modules[] (→ Module[])
│   └── lessons[] (→ Lesson[])
└── completedBy[] (user IDs)
```

---

## 🤖 AI Tutor

AI Learning Assistant menggunakan **GroqAI** melalui Vercel AI SDK dengan kemampuan:

- **Tool calling** untuk mencari konten kursus
- Pencarian semantik di seluruh courses, modules, dan lessons
- Menjawab pertanyaan berdasarkan materi yang tersedia

---

## 🔐 Arsitektur Autentikasi

| Layer                   | Mekanisme                          |
| ----------------------- | ---------------------------------- |
| **Akses `/admin`**      | Clerk middleware + email whitelist |
| **Data operasi Sanity** | API token (server-side)            |
| **Super Admin**         | `SUPER_ADMIN_EMAIL` env var        |
| **User sign-in/out**    | Clerk                              |

---

## 📊 Useful Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm typegen      # Generate Sanity types
pnpm lint         # Jalankan linter (Biome)
pnpm format       # Format code (Biome)
```

---

## 🚢 Deployment

### Deploy ke Vercel

1. Push kode ke GitHub
2. Import repository di [vercel.com](https://vercel.com)
3. Tambahkan semua environment variables
4. Deploy

### Post-Deployment Checklist

- [ ] Verifikasi semua environment variables di Vercel
- [ ] Test authentication flow
- [ ] Test subscription & tier access
- [ ] Verifikasi AI Tutor
- [ ] Konfigurasi CORS Sanity untuk domain produksi

---

## 👥 Kontributor

Dikembangkan oleh **Divisi Akademik HIMASIS** — Himpunan Mahasiswa Sistem Informasi, STMI Jakarta.

---

<p align="center">
  <strong>HIMASIS E-Learning</strong> — Divisi Akademik HIMASIS STMI Jakarta
</p>
# learning-management-system-himasis
# learning-management-system-himasis
# lms-himasis
# lms-himasis-main
# lms-himasis-main
# lms-himasis-main
# lms-himasis-main
# lms-himasis-main
# learning-management-system-himasis
