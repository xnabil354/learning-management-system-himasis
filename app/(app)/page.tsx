import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Code2,
  GraduationCap,
  Layers,
  Shield,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { FEATURED_COURSES_QUERY, STATS_QUERY } from "@/sanity/lib/queries";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const [{ data: courses }, { data: stats }, user] = await Promise.all([
    sanityFetch({ query: FEATURED_COURSES_QUERY }),
    sanityFetch({ query: STATS_QUERY }),
    currentUser(),
  ]);

  const isSignedIn = !!user;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20 overflow-x-hidden">
      <Header />

      <main>
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[bottom_1px_center] -z-10 [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-full bg-[#050505] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,transparent_70%,black)] pointer-events-none -z-10" />

          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md animate-fade-in opacity-0">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                <span className="text-xs font-medium text-zinc-400 tracking-wide uppercase">
                  Himpunan Mahasiswa Sistem Informasi
                </span>
              </div>

              <h1 className="text-5xl md:text-9xl font-bold tracking-tighter mb-6 animate-fade-in opacity-0 [animation-delay:200ms] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                SISCA.
              </h1>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-8 animate-fade-in opacity-0 [animation-delay:300ms] text-zinc-400">
                Student Information System for College Academy
              </h2>

              <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in opacity-0 [animation-delay:400ms]">
                Platform pembelajaran eksklusif untuk{" "}
                <span className="text-zinc-200 font-medium">
                  Mahasiswa Sistem Informasi
                </span>{" "}
                dari <span className="text-zinc-200 font-medium">Himasis</span>.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in opacity-0 [animation-delay:600ms]">
                <Link href={isSignedIn ? "/dashboard" : "/dashboard"}>
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-zinc-200 border-0 h-12 px-8 rounded-full text-base font-semibold tracking-tight transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    {isSignedIn ? "Akses Dashboard" : "Mulai Belajar"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="#courses">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-zinc-400 hover:text-white h-12 px-8 rounded-full text-base font-medium"
                  >
                    Lihat Kurikulum
                  </Button>
                </Link>
              </div>

              <div className="mt-20 w-full max-w-3xl mx-auto animate-fade-in opacity-0 [animation-delay:800ms]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center hover:border-white/10 transition-colors">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                      {stats?.courseCount ?? 0}
                    </div>
                    <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                      Kursus
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center hover:border-white/10 transition-colors">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                      {stats?.lessonCount ?? 0}
                    </div>
                    <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                      Pelajaran
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center hover:border-white/10 transition-colors">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                      100%
                    </div>
                    <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                      Gratis
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center hover:border-white/10 transition-colors">
                    <div className="text-3xl md:text-4xl font-bold text-violet-400 mb-1">
                      <GraduationCap className="w-8 h-8 md:w-10 md:h-10 mx-auto" />
                    </div>
                    <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                      Bersertifikat
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 relative">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="max-w-2xl mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Kenapa belajar di{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                  SISCA
                </span>
                ?
              </h2>
              <p className="text-lg text-zinc-400">
                Platform yang dirancang khusus untuk mendukung perjalanan
                akademik mahasiswa Sistem Informasi Himasis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="group relative overflow-hidden rounded-2xl bg-[#0A0A0A] border border-white/10 p-8 md:col-span-2 min-h-[280px] hover:border-white/20 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 border border-violet-500/20">
                      <Layers className="w-6 h-6 text-violet-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Kurikulum Terstruktur
                    </h3>
                    <p className="text-zinc-400 max-w-md leading-relaxed">
                      Materi disusun secara sistematis dari dasar hingga lanjut.
                      Setiap kursus terbagi dalam modul dan pelajaran yang mudah
                      diikuti langkah demi langkah.
                    </p>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-2">
                    <div className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-zinc-400">
                      Langkah demi Langkah
                    </div>
                    <div className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-zinc-400">
                      Video Pembelajaran
                    </div>
                    <div className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-zinc-400">
                      Materi Tertulis
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-[#0A0A0A] border border-white/10 p-8 min-h-[280px] hover:border-white/20 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                    <Shield className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Akses Gratis Selamanya
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Seluruh materi tersedia tanpa biaya. Cukup daftar dan mulai
                    belajar — tanpa batasan waktu dan tanpa biaya tersembunyi.
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-[#0A0A0A] border border-white/10 p-8 min-h-[280px] hover:border-white/20 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20">
                    <Zap className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Lacak Progresmu
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Pantau kemajuan belajar lewat dashboard pribadi. Lihat
                    kursus yang sedang diambil, pelajaran yang selesai, dan jam
                    belajar yang sudah terakumulasi.
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-[#0A0A0A] border border-white/10 p-8 md:col-span-2 min-h-[280px] hover:border-white/20 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-tl from-fuchsia-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between h-full gap-6">
                  <div className="max-w-md">
                    <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 flex items-center justify-center mb-6 border border-fuchsia-500/20">
                      <Trophy className="w-6 h-6 text-fuchsia-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Sertifikat Pembelajaran
                    </h3>
                    <p className="text-zinc-400 leading-relaxed">
                      Selesaikan seluruh modul kursus dan dapatkan sertifikat
                      digital sebagai bukti kompetensi. Tampilkan di CV dan
                      profil profesionalmu.
                    </p>
                  </div>
                  <div className="hidden md:flex items-center justify-center">
                    <div className="relative w-28 h-28">
                      <svg
                        className="w-28 h-28 -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="rgba(255,255,255,0.05)"
                          strokeWidth="8"
                        />

                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          strokeDasharray="251.2"
                          strokeDashoffset="0"
                          strokeLinecap="round"
                        />

                        <defs>
                          <linearGradient
                            id="gradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop
                              offset="0%"
                              style={{ stopColor: "#a855f7" }}
                            />

                            <stop
                              offset="100%"
                              style={{ stopColor: "#d946ef" }}
                            />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          100%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="courses"
          className="py-32 bg-[#080808] border-t border-white/5"
        >
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex items-end justify-between mb-16">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Modul Pembelajaran
                </h2>
                <p className="text-zinc-400">
                  Pilih modul untuk memulai pembelajaran.
                </p>
              </div>
              <Link href="/dashboard/courses" className="hidden md:block">
                <Button
                  variant="outline"
                  className="border-white/10 bg-transparent text-white hover:bg-white/5"
                >
                  Lihat Semua Modul
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {courses.map((course: any) => (
                <Link
                  key={course.slug!.current!}
                  href={`/courses/${course.slug!.current!}`}
                  className="group block"
                >
                  <div className="relative rounded-xl border border-white/5 bg-[#0A0A0A] p-6 transition-all duration-300 hover:border-white/10 hover:bg-[#0F0F0F] flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-lg bg-zinc-900 overflow-hidden relative border border-white/5 hidden sm:block">
                        {course.thumbnail?.asset?.url ? (
                          <img
                            src={course.thumbnail.asset.url}
                            alt=""
                            className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-zinc-700">
                            <Code2 size={20} />
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-violet-400 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-zinc-500 line-clamp-1 max-w-md">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-600 font-medium">
                          <span>{course.moduleCount ?? 0} Modul</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-800" />
                          <span>{course.lessonCount ?? 0} Pelajaran</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-zinc-600 group-hover:text-white transition-colors">
                      <span className="text-sm font-medium mr-2 hidden sm:block">
                        Mulai
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link href="/dashboard/courses">
                <Button
                  variant="outline"
                  className="w-full border-white/10 bg-transparent text-white hover:bg-white/5"
                >
                  Lihat Semua Modul
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#050505] to-[#050505]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/5 blur-[150px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Siap untuk{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                berkembang
              </span>
              ?
            </h2>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
              Bergabung bersama mahasiswa Sistem Informasi lainnya dan mulai
              perjalanan belajarmu hari ini.
            </p>
            <Link href={isSignedIn ? "/dashboard" : "/dashboard"}>
              <Button
                size="lg"
                className="bg-white text-black hover:bg-zinc-200 border-0 h-14 px-10 rounded-full text-base font-semibold tracking-tight transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                {isSignedIn ? "Lanjutkan Belajar" : "Daftar Sekarang — Gratis"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        <footer className="py-20 border-t border-white/5 bg-[#050505]">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 bg-white rounded-sm"></div>
                  <span className="font-bold text-lg tracking-tight">
                    SISCA | Himasis
                  </span>
                </div>
                <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
                  Student Information System for College Academy.
                  <br />
                  Himpunan Mahasiswa Sistem Informasi.
                  <br />
                  Membangun masa depan teknologi bersama Himasis.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-6">Platform</h4>
                <ul className="space-y-4 text-sm text-zinc-500">
                  <li>
                    <Link
                      href="/dashboard"
                      className="hover:text-white transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#courses"
                      className="hover:text-white transition-colors"
                    >
                      Kurikulum
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Himasis
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
              <p>&copy; 2026 Himasis. All rights reserved.</p>
              <div className="flex gap-4">
                <span>Instagram</span>
                <span>LinkedIn</span>
                <span>Website</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
