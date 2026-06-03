import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { ANALYTICS_QUERY } from "@/sanity/lib/queries";
import Link from "next/link";
import {
  ChevronRight,
  BarChart3,
  BookOpen,
  Clock,
  Zap,
  Trophy,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import AnalyticsChartsWrapper from "@/components/analytics/AnalyticsChartsWrapper";

export default async function AnalyticsPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const { data: analyticsRaw } = await sanityFetch({
    query: ANALYTICS_QUERY,
  });

  const analytics = analyticsRaw as {
    courses: any[];
    totalStudents: number;
    totalReviews: number;
    categories: any[];
  };

  const courses = analytics.courses || [];
  const firstName = user.firstName ?? user.username ?? "Cadet";

  let totalLessons = 0;
  let completedLessons = 0;
  let totalHoursLearned = 0;
  let completedCourses = 0;

  courses.forEach((course: any) => {
    const isCourseDone =
      Array.isArray(course.completedBy) && course.completedBy.includes(user.id);
    if (isCourseDone) completedCourses++;

    course.modules?.forEach((m: any) => {
      m.lessons?.forEach((l: any) => {
        totalLessons++;
        if (Array.isArray(l.completedBy) && l.completedBy.includes(user.id)) {
          completedLessons++;
          totalHoursLearned += (l.duration || 0) / 60;
        }
      });
    });
  });

  const avgProgress =
    courses.length > 0
      ? Math.round((completedLessons / Math.max(totalLessons, 1)) * 100)
      : 0;

  const kpis = [
    {
      label: "Hours Learned",
      value: `${totalHoursLearned.toFixed(1)}h`,
      icon: Clock,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      glow: "shadow-cyan-500/5",
    },
    {
      label: "Avg. Progress",
      value: `${avgProgress}%`,
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-600/10",
      border: "border-blue-600/20",
      glow: "shadow-blue-600/5",
    },
    {
      label: "Courses Done",
      value: completedCourses,
      icon: Trophy,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      glow: "shadow-amber-500/5",
    },
    {
      label: "Lessons Done",
      value: `${completedLessons}/${totalLessons}`,
      icon: Zap,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      glow: "shadow-emerald-500/5",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-white font-sans antialiased">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0" />
      <div className="fixed top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-blue-700/8 rounded-full blur-[120px] animate-pulse pointer-events-none z-[-1]" />
      <div
        className="fixed bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-sky-600/8 rounded-full blur-[120px] animate-pulse pointer-events-none z-[-1]"
        style={{ animationDelay: "2s" }}
      />

      <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-6 lg:px-10 border-b border-slate-200 bg-white/80 backdrop-blur-2xl">
        <div className="flex items-center gap-3 text-slate-500 text-xs font-medium">
          <Link
            href="/dashboard"
            className="hover:text-slate-900 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200">
            Analytics
          </span>
        </div>
      </header>

      <main className="px-6 lg:px-10 pb-12 max-w-[1400px] mx-auto space-y-8">
        <div className="relative mt-6 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 rounded-3xl blur opacity-15 group-hover:opacity-25 transition-opacity duration-1000" />
          <div className="relative p-8 rounded-2xl bg-white/80 backdrop-blur-3xl border border-slate-200 overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-700/8 to-transparent rounded-full blur-[80px]" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  <BarChart3 className="w-3 h-3" />
                  <span>Analytics Dashboard</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
                  Analisis Progress,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-600">
                    {firstName}
                  </span>
                </h1>
                <p className="text-slate-400 text-sm max-w-lg">
                  Pantau kemajuan belajar, identifikasi area yang perlu
                  ditingkatkan, dan capai targetmu lebih cepat.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <div
              key={i}
              className={`group p-5 rounded-2xl bg-white border ${kpi.border} hover:bg-slate-50 transition-all duration-300 backdrop-blur-sm shadow-lg ${kpi.glow}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                    {kpi.label}
                  </p>
                  <p className="text-2xl font-black text-white tracking-tight">
                    {kpi.value}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <kpi.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <AnalyticsChartsWrapper data={analytics} userId={user.id} />

        <div className="rounded-2xl bg-white border border-slate-200 p-6 backdrop-blur-sm overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Course Breakdown</h3>
              <p className="text-[11px] text-slate-500">
                Detail progress per course
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Course
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Kategori
                  </th>
                  <th className="text-center py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Modul
                  </th>
                  <th className="text-center py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Lesson
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Progress
                  </th>
                  <th className="text-center py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course: any) => {
                  const tl =
                    course.modules?.reduce(
                      (acc: number, m: any) => acc + (m.lessons?.length || 0),
                      0,
                    ) || 0;
                  const cl =
                    course.modules?.reduce(
                      (acc: number, m: any) =>
                        acc +
                        (m.lessons?.filter(
                          (l: any) =>
                            Array.isArray(l.completedBy) &&
                            l.completedBy.includes(user.id),
                        )?.length || 0),
                      0,
                    ) || 0;
                  const pct = tl > 0 ? Math.round((cl / tl) * 100) : 0;
                  const isDone = pct === 100;

                  return (
                    <tr
                      key={course._id}
                      className="border-b border-white/[0.03] hover:bg-white transition-colors"
                    >
                      <td className="py-3 px-4">
                        <Link
                          href={`/courses/${course.slug}`}
                          className="text-white font-medium hover:text-blue-300 transition-colors"
                        >
                          {course.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-xs">
                        {course.category?.title || "—"}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-400 font-mono text-xs">
                        {course.moduleCount}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-400 font-mono text-xs">
                        {cl}/{tl}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[120px]">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${isDone ? "bg-emerald-500" : "bg-blue-600"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span
                            className={`text-xs font-mono font-bold ${isDone ? "text-emerald-400" : "text-blue-600"}`}
                          >
                            {pct}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                            ✓ Selesai
                          </span>
                        ) : pct > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-600 text-[10px] font-bold">
                            ⏳ Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-500 text-[10px] font-bold">
                            — Belum
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
