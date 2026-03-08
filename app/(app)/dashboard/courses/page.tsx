import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BookOpen, LayoutGrid, List } from "lucide-react";
import { Header } from "@/components/Header";
import { CourseCard } from "@/components/courses";
import { sanityFetch } from "@/sanity/lib/live";
import { DASHBOARD_COURSES_QUERY } from "@/sanity/lib/queries";
import { SearchInput } from "@/components/SearchInput";
import { CourseFilters } from "@/components/CourseFilters";
import { Pagination } from "@/components/Pagination";

interface SearchParamsProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MyCoursesPage({
  searchParams,
}: SearchParamsProps) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { data: courses } = await sanityFetch({
    query: DASHBOARD_COURSES_QUERY,
    params: { userId: user.id },
  });

  type Course = (typeof courses)[number];
  type CourseWithProgress = Course & {
    totalLessons: number;
    completedLessons: number;
    progress: number;
  };

  const allCourses = courses.reduce(
    (acc: CourseWithProgress[], course: Course) => {
      const { total, completed } = (course.modules ?? []).reduce(
        (stats: { total: number; completed: number }, m: { lessons: any }) =>
          (m.lessons ?? []).reduce(
            (
              s: { total: number; completed: number },
              l: { completedBy: string | string[] },
            ) => ({
              total: s.total + 1,
              completed:
                s.completed + (l.completedBy?.includes(user.id) ? 1 : 0),
            }),
            stats,
          ),
        { total: 0, completed: 0 },
      );

      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      if (completed > 0) {
        acc.push({
          ...course,
          totalLessons: total,
          completedLessons: completed,
          progress,
        });
      }
      return acc;
    },
    [],
  );

  const resolvedParams = await searchParams;
  const query = (resolvedParams.q as string)?.toLowerCase() || "";
  const sort = (resolvedParams.sort as string) || "recent";
  const limitParam = resolvedParams.limit as string;
  const pageParam = resolvedParams.page as string;

  let filteredCourses = allCourses.filter((course: CourseWithProgress) =>
    course.title?.toLowerCase().includes(query),
  );

  if (sort === "title") {
    filteredCourses.sort((a: CourseWithProgress, b: CourseWithProgress) =>
      (a.title ?? "").localeCompare(b.title ?? ""),
    );
  } else if (sort === "progress_desc") {
    filteredCourses.sort((a: any, b: any) => b.progress - a.progress);
  } else if (sort === "progress_asc") {
    filteredCourses.sort((a: any, b: any) => a.progress - b.progress);
  } else {
  }

  const limit =
    limitParam === "all" ? filteredCourses.length : Number(limitParam) || 12;
  const currentPage = Number(pageParam) || 1;
  const totalPages = Math.ceil(filteredCourses.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + limit,
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0" />
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-violet-900/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-fuchsia-900/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <Header />

      <main className="relative z-10 px-6 lg:px-12 py-12 max-w-[1600px] mx-auto min-h-screen">
        {}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
              My Courses
            </h1>
            <p className="text-zinc-400 max-w-lg text-lg leading-relaxed">
              Track your progress and continue mastering your skills.
              <br className="hidden md:block" />
              <span className="text-violet-400 font-medium">
                Keep the streak alive!
              </span>
            </p>
          </div>

          {}
          <div className="flex items-center gap-3 p-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-2xl">
            <SearchInput />
            <div className="w-px h-8 bg-white/10 hidden md:block" />

            <div className="flex items-center gap-2">
              <CourseFilters />

              <div className="p-1 rounded-full bg-white/5 border border-white/5 flex gap-1 ml-2">
                <button className="p-2 rounded-full bg-white/10 text-white shadow-sm">
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-colors">
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {}
          <div className="absolute -top-10 -left-10 w-full h-full bg-gradient-to-r from-violet-500/5 via-transparent to-transparent blur-3xl -z-10 opacity-50" />
        </div>

        {paginatedCourses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {paginatedCourses.map((course: CourseWithProgress) => (
                <div
                  key={course.slug!.current!}
                  className="group transition-all duration-500 hover:-translate-y-2"
                >
                  <CourseCard
                    slug={{ current: course.slug!.current! }}
                    title={course.title}
                    description={course.description}
                    thumbnail={course.thumbnail}
                    moduleCount={course.moduleCount}
                    lessonCount={course.totalLessons}
                    completedLessonCount={course.completedLessons}
                    isCompleted={course.completedBy?.includes(user.id) ?? false}
                    showProgress
                  />
                </div>
              ))}
            </div>

            <Pagination totalPages={totalPages} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.05]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/5 to-transparent opacity-50" />
            <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-6 ring-1 ring-white/10 shadow-[0_0_50px_rgba(139,92,246,0.1)] animate-pulse">
              <BookOpen className="w-10 h-10 text-violet-300" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">
              {query ? "No courses found" : "No courses started yet"}
            </h3>
            <p className="text-zinc-500 text-lg max-w-md mx-auto mb-8">
              {query
                ? `No results for "${query}". Try another search term.`
                : "Browse our catalog to find your next challenge."}
            </p>
            <button className="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10">
              Explore Catalog
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
