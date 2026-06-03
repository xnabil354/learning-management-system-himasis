import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Play, Tag, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { COURSE_WITH_MODULES_QUERYResult } from "@/sanity.types";

type Course = NonNullable<COURSE_WITH_MODULES_QUERYResult>;

type CourseHeroProps = Pick<
  Course,
  | "title"
  | "description"
  | "thumbnail"
  | "category"
  | "moduleCount"
  | "lessonCount"
>;

export function CourseHero({
  title,
  description,
  thumbnail,
  category,
  moduleCount,
  lessonCount,
  duration,
}: CourseHeroProps & { duration?: string }) {
  return (
    <div className="relative -mx-6 lg:-mx-12 -mt-12 mb-12">
      {}
      <div className="absolute inset-0 overflow-hidden h-[500px] pointer-events-none select-none">
        {thumbnail?.asset?.url && (
          <div className="absolute inset-0 opacity-20 blur-[100px] scale-110">
            <Image
              src={thumbnail.asset.url}
              alt=""
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/80 to-white" />
      </div>

      {}
      <div className="relative z-10 px-6 lg:px-12 py-12 pt-24 max-w-7xl mx-auto">
        {}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-900 transition-colors mb-8 group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span>Back to dashboard</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {}
          <div className="relative group shrink-0 w-full lg:w-[400px]">
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-700 to-sky-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
              {thumbnail?.asset?.url ? (
                <Image
                  src={thumbnail.asset.url}
                  alt={title ?? "Course thumbnail"}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100">
                  <span className="text-4xl">📚</span>
                </div>
              )}

              {}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>

            {}
            <div className="absolute inset-x-4 -bottom-4 h-4 bg-slate-300/50 blur-xl md:hidden" />
          </div>

          {}
          <div className="flex-1 space-y-6 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              {category?.title && (
                <Badge
                  variant="outline"
                  className="bg-slate-50 border-slate-200 text-blue-700 px-3 py-1 text-xs uppercase tracking-wider font-semibold backdrop-blur-md"
                >
                  {category.title}
                </Badge>
              )}
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-white/80 px-3 py-1 rounded-full border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Course
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 leading-[0.9]">
              {title}
            </h1>

            {description && (
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl border-l-2 border-slate-200 pl-5">
                {description}
              </p>
            )}

            {}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {moduleCount ?? 0}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Modules
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200">
                <Play className="w-5 h-5 text-sky-500" />
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {lessonCount ?? 0}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Lessons
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200">
                <Clock className="w-5 h-5 text-cyan-500" />
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {duration ?? "~"}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Duration
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
