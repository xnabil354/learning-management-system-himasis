import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import {
  Command,
  LayoutDashboard,
  Bookmark,
  Compass,
  BookOpen,
  Trophy,
  Clock,
  Zap,
  Target,
  Flame,
  ChevronRight,
  GraduationCap,
  Play,
  Filter,
  Search,
  X,
  Sparkles,
} from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { CertificateDownloadButton } from "@/components/CertificateDownloadButton";
import { GlobalSearch } from "@/components/GlobalSearch";
import { XPWidget } from "@/components/dashboard/XPWidget";

import { DASHBOARD_COURSES_QUERY } from "@/sanity/lib/queries";
import { DASHBOARD_COURSES_QUERYResult } from "@/sanity.types";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { data: courses } = await sanityFetch({
    query: DASHBOARD_COURSES_QUERY,
    params: { userId: user.id },
  });

  const firstName = user.firstName ?? user.username ?? "Cadet";

  const hour = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
    hour: "numeric",
    hour12: false,
  });
  const numericHour = parseInt(hour, 10);
  let greeting = "Good Morning";
  if (numericHour >= 12 && numericHour < 18) greeting = "Good Afternoon";
  else if (numericHour >= 18) greeting = "Good Evening";

  let totalDurationSeconds = 0;
  let totalCompletedLessons = 0;

  const isLessonCompleted = (lesson: any) => {
    return (
      Array.isArray(lesson.completedBy) && lesson.completedBy.includes(user.id)
    );
  };

  const enrichedCourses = courses.map((course: any) => {
    const courseTotalLessons =
      course.modules?.reduce(
        (acc: number, module: any) => acc + (module.lessons?.length || 0),
        0,
      ) || 0;

    const courseCompletedLessons =
      course.modules?.reduce(
        (acc: number, module: any) =>
          acc + (module.lessons?.filter(isLessonCompleted)?.length || 0),
        0,
      ) || 0;

    const progress =
      courseTotalLessons > 0
        ? Math.round((courseCompletedLessons / courseTotalLessons) * 100)
        : 0;

    if (course.modules) {
      course.modules.forEach((module: any) => {
        module.lessons?.forEach((lesson: any) => {
          if (isLessonCompleted(lesson)) {
            totalCompletedLessons++;
            totalDurationSeconds += (lesson.duration ?? 0) * 60;
          }
        });
      });
    }

    return {
      ...course,
      progress,
      isCompleted: progress === 100,
      totalLessons: courseTotalLessons,
      completedLessons: courseCompletedLessons,
    };
  });

  const activeCourses = enrichedCourses.filter(
    (c: any) => c.progress > 0 && c.progress < 100,
  );
  const completedCourses = enrichedCourses.filter(
    (c: any) => c.progress === 100,
  );
  const completedCoursesCount = completedCourses.length;

  let resumeCourseSlug = "";
  let resumeLessonSlug = "";

  const resumeCourse =
    activeCourses.length > 0 ? activeCourses[0] : enrichedCourses[0];

  if (resumeCourse) {
    resumeCourseSlug = resumeCourse.slug?.current ?? "";

    if (resumeCourse.modules) {
      for (const module of resumeCourse.modules) {
        const uncompletedLesson = module.lessons?.find(
          (l: any) => !isLessonCompleted(l),
        );
        if (uncompletedLesson) {
          resumeLessonSlug = uncompletedLesson.slug?.current ?? "";
          break;
        }
      }
    }
  }

  const hoursLearned = (totalDurationSeconds / 3600).toFixed(1);

  const resumeLink = resumeLessonSlug
    ? `/courses/${resumeCourseSlug}/lessons/${resumeLessonSlug}`
    : resumeCourseSlug
      ? `/courses/${resumeCourseSlug}`
      : "/dashboard/courses";

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 flex overflow-hidden font-sans antialiased">
      {}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[#050505] z-[-2]" />

      {}
      <div className="fixed top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-violet-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none z-[-1]" />
      <div
        className="fixed bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-fuchsia-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none z-[-1]"
        style={{ animationDelay: "2s" }}
      />

      {}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 left-0 border-r border-white/[0.06] bg-black/40 backdrop-blur-2xl z-50 transition-all duration-300">
        {}
        <div className="h-20 flex items-center px-6 border-b border-white/[0.06]">
          <Logo />
        </div>

        {}
        <div className="p-4 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
          {}
          <div>
            <h3 className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
              Platform
            </h3>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.08] text-white font-medium border border-white/[0.08] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(167,139,250,0.5)]" />
                <LayoutDashboard className="w-4 h-4 text-violet-200" />
                <span className="relative z-10">Dashboard</span>
              </button>

              <Link
                href="/dashboard/courses"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-all font-medium group"
              >
                <Compass className="w-4 h-4 group-hover:text-violet-200 transition-colors" />
                <span>Browse</span>
              </Link>

              <Link
                href="/leaderboard"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-all font-medium group"
              >
                <Trophy className="w-4 h-4 group-hover:text-amber-400 transition-colors" />
                <span>Leaderboard</span>
              </Link>
            </div>
          </div>

          {}
          {activeCourses.length > 0 && (
            <div>
              <h3 className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                <span>Active Learning</span>
                <span className="bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded text-[9px]">
                  {activeCourses.length}
                </span>
              </h3>
              <div className="space-y-1">
                {activeCourses.slice(0, 3).map((course: any) => (
                  <Link
                    key={course.slug.current}
                    href={`/courses/${course.slug.current}`}
                    className="group w-full flex flex-col gap-2 px-3 py-2.5 rounded-xl text-zinc-400 hover:bg-white/[0.04] transition-all"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-medium text-zinc-300 group-hover:text-white truncate max-w-[140px]">
                        {course.title}
                      </span>
                      <span className="text-[10px] font-mono text-violet-400">
                        {course.progress}%
                      </span>
                    </div>
                    {}
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 group-hover:bg-violet-400 transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {}
          <div>
            <h3 className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
              Your Stats
            </h3>
            <div className="space-y-2 px-1">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {hoursLearned}h
                  </p>
                  <p className="text-[10px] text-zinc-500">Hours Learned</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {totalCompletedLessons}
                  </p>
                  <p className="text-[10px] text-zinc-500">Lessons Done</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Target className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {enrichedCourses.length > 0
                      ? Math.round(
                          enrichedCourses.reduce(
                            (sum: number, c: any) => sum + c.progress,
                            0,
                          ) / enrichedCourses.length,
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-[10px] text-zinc-500">Avg. Progress</p>
                </div>
              </div>
            </div>
          </div>

          {}
          {completedCoursesCount > 0 && (
            <div>
              <h3 className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
                Achievements
              </h3>
              <div className="mx-1 p-3 rounded-xl bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {completedCoursesCount}{" "}
                      {completedCoursesCount === 1 ? "Course" : "Courses"}
                    </p>
                    <p className="text-[10px] text-amber-300/60">Completed</p>
                  </div>
                </div>
                {completedCoursesCount >= 3 && (
                  <div className="mt-2 pt-2 border-t border-amber-500/10 flex items-center gap-1.5">
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span className="text-[10px] text-orange-300/70 font-medium">
                      On a learning streak!
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 px-4 pb-4">
          <XPWidget userId={user.id} />
        </div>

        <div className="p-4 border-t border-white/[0.06] bg-black/20">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white shadow-lg group-hover:scale-105 transition-transform">
              {firstName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate group-hover:text-violet-200 transition-colors">
                {firstName}
              </p>
              <p className="text-[10px] text-zinc-500 truncate font-mono">
                Student Account
              </p>
            </div>
            <div className="scale-75 origin-right opacity-50 group-hover:opacity-100 transition-opacity">
              <UserButton
                afterSignOutUrl="/"
                appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }}
              />
            </div>
          </div>
        </div>
      </aside>

      {}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen relative z-10 w-full transition-all duration-300">
        {}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          {}
          <div className="absolute inset-0 bg-black/0 backdrop-blur-md border-b border-white/[0.02]" />

          {}
          <div className="hidden lg:flex items-center text-zinc-500 text-xs font-medium gap-2 relative z-10">
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">
              Pages
            </span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white px-2 py-0.5 rounded-md bg-white/5 border border-white/5 backdrop-blur-sm shadow-sm">
              Dashboard
            </span>
          </div>

          {}
          <div className="lg:hidden flex items-center gap-2 relative z-10">
            <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-bold">
              <Command className="w-4 h-4" />
            </div>
            <span className="font-bold text-white tracking-tight">SISCA</span>
          </div>

          {}
          <div className="flex items-center gap-4 relative z-10">
            {}
            {}
            <div className="relative hidden sm:block group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <GlobalSearch />
            </div>

            {}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] text-xs font-medium">
              {completedCoursesCount > 0 ? (
                <>
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-200">
                    {completedCoursesCount}
                  </span>
                  <span className="text-zinc-600">/</span>
                  <span className="text-zinc-400">
                    {enrichedCourses.length}
                  </span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-zinc-400">
                    {enrichedCourses.length} Courses
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="px-6 lg:px-10 pb-10 max-w-[1600px] mx-auto w-full space-y-12">
          {}
          <div className="relative mt-4 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-1000 animate-gradient-xy" />
            <div className="relative p-8 md:p-10 rounded-2xl bg-[#09090b]/80 backdrop-blur-3xl border border-white/[0.08] overflow-hidden">
              {}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-violet-600/10 to-transparent rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-fuchsia-600/10 to-transparent rounded-full blur-[80px]" />

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-violet-300 mb-2">
                    <Sparkles className="w-3 h-3 fill-current" />
                    <span>Premium Student Access</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                    {greeting}, <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-zinc-400">
                      {firstName}
                    </span>
                  </h1>
                  <p className="text-zinc-400 text-sm md:text-base max-w-lg leading-relaxed">
                    Ready to level up? You have{" "}
                    <span className="text-white font-bold">
                      {courses.length} active courses
                    </span>{" "}
                    pending your attention today.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {}
                  <Link href={resumeLink}>
                    <button className="relative group/btn overflow-hidden rounded-full bg-white text-black px-6 py-3 font-bold text-sm shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-white via-zinc-200 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                      <span className="relative flex items-center gap-2">
                        <Play className="w-4 h-4 fill-black" />
                        Resume Learning
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Active Courses",
                value: courses.length,
                icon: BookOpen,
                color: "text-violet-400",
                bg: "bg-violet-500/10",
              },
              {
                label: "Hours Learned",
                value: `${hoursLearned}h`,
                icon: Clock,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
              },
              {
                label: "Lessons Completed",
                value: totalCompletedLessons,
                icon: Zap,
                color: "text-amber-400",
                bg: "bg-amber-500/10",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="group p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}
                  >
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {}
          <section className="space-y-6">
            <div className="flex items-end justify-between border-b border-white/[0.06] pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                  <BookOpen className="w-5 h-5 text-violet-400" />
                  My Curriculum
                </h2>
                <p className="text-xs text-zinc-500">
                  Pick up where you left off
                </p>
              </div>
              <Link
                href="/dashboard/courses"
                className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1 group"
              >
                View All{" "}
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {enrichedCourses.length > 0 ? (
                enrichedCourses.map((course: any) => (
                  <div
                    key={course.slug!.current!}
                    className="group relative block w-full h-full"
                  >
                    {}
                    <div className="relative h-full flex flex-col rounded-2xl bg-[#0A0A0A]/60 backdrop-blur-xl border border-white/[0.06] overflow-hidden hover:border-white/[0.15] hover:bg-white/[0.03] transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-900/20">
                      {}
                      <Link
                        href={`/courses/${course.slug!.current!}`}
                        className="absolute inset-0 z-10"
                      >
                        <span className="sr-only">
                          View course {course.title}
                        </span>
                      </Link>

                      {}
                      <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                        {course.thumbnail?.asset?.url ? (
                          <img
                            src={course.thumbnail.asset.url}
                            alt={course.title}
                            className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                            <BookOpen className="w-8 h-8 text-zinc-700" />
                          </div>
                        )}

                        {}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />

                        {}
                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg">
                            {course.moduleCount ?? 1} Modules
                          </span>
                        </div>
                      </div>

                      {}
                      <div className="p-5 flex flex-col flex-1 relative z-0">
                        <h3 className="text-lg font-bold text-white leading-tight mb-2 line-clamp-1 group-hover:text-violet-200 transition-colors relative">
                          {course.title}
                        </h3>
                        <div className="mt-auto pt-4 space-y-4">
                          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                            <span>Progress</span>
                            <span
                              className={
                                course.progress === 100
                                  ? "text-emerald-400"
                                  : "text-violet-400"
                              }
                            >
                              {course.progress}%
                            </span>
                          </div>
                          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 shadow-[0_0_10px_rgba(139,92,246,0.5)] ${course.progress === 100 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-violet-500 group-hover:bg-violet-400"}`}
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>

                          {}
                          {course.progress === 100 && (
                            <div className="pt-2 relative z-20">
                              <CertificateDownloadButton
                                studentName={firstName}
                                courseTitle={course.title}
                                completedAt={new Date()}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center rounded-3xl bg-white/[0.02] border border-dashed border-white/[0.06] flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/5 items-center justify-center mb-4 flex animate-pulse">
                    <BookOpen className="w-6 h-6 text-zinc-600" />
                  </div>
                  <h3 className="text-base font-medium text-white mb-1">
                    No active courses
                  </h3>
                  <p className="text-zinc-500 text-sm">
                    Start your journey today.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
