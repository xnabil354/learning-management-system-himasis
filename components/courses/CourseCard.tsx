"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Layers, CheckCircle2, Sparkles, Lock } from "lucide-react";
import { TIER_STYLES } from "@/lib/constants";
import { Progress } from "@/components/ui/progress";
import type { DASHBOARD_COURSES_QUERYResult } from "@/sanity.types";

type SanityCourse = DASHBOARD_COURSES_QUERYResult[number];

export interface CourseCardProps extends Pick<
  SanityCourse,
  "title" | "description" | "thumbnail" | "moduleCount" | "lessonCount"
> {
  slug?: { current: string } | null;
  href?: string;
  completedLessonCount?: number | null;
  isCompleted?: boolean;
  showProgress?: boolean;
}

export function CourseCard({
  slug,
  href,
  title,
  description,
  thumbnail,
  moduleCount,
  lessonCount,
  completedLessonCount = 0,
  isCompleted = false,
  showProgress = false,
}: CourseCardProps) {
  const styles = TIER_STYLES["free"];
  const totalLessons = lessonCount ?? 0;
  const completed = completedLessonCount ?? 0;
  const progressPercent =
    totalLessons > 0 ? (completed / totalLessons) * 100 : 0;

  const linkHref = href ?? `/courses/${slug?.current ?? ""}`;

  return (
    <Link href={linkHref} className="group block w-full h-full">
      <div className="relative h-full flex flex-col rounded-2xl bg-[#0F0F10]/60 backdrop-blur-md border border-white/[0.06] overflow-hidden hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-500 hover:shadow-2xl hover:shadow-violet-900/10 group-hover:-translate-y-1">
        {}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-transparent to-fuchsia-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" />

        {}
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
          {thumbnail?.asset?.url ? (
            <Image
              src={thumbnail.asset.url}
              alt={title ?? "Course thumbnail"}
              fill
              className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#18181b]">
              <div className="text-6xl opacity-20 grayscale group-hover:grayscale-0 transition-all duration-500">
                <Sparkles className="w-16 h-16 text-violet-400" />
              </div>
            </div>
          )}

          {}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F10] via-transparent to-transparent opacity-60" />

          {}
          {isCompleted && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/90 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)] backdrop-blur-md border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Done
            </div>
          )}
        </div>

        {}
        <div className="p-5 flex flex-col flex-1 relative z-10">
          <h3 className="text-lg font-bold mb-2 text-white group-hover:text-violet-200 transition-colors line-clamp-2 leading-tight">
            {title ?? "Untitled Course"}
          </h3>

          {description && (
            <p className="text-sm text-zinc-400 mb-4 line-clamp-2 leading-relaxed group-hover:text-zinc-300 transition-colors">
              {description}
            </p>
          )}

          <div className="mt-auto pt-2 flex items-center gap-4 text-xs font-medium text-zinc-500 group-hover:text-zinc-400 transition-colors">
            <span className="flex items-center gap-1.5 bg-white/[0.03] px-2 py-1 rounded-md border border-white/[0.05]">
              <Layers className="w-3.5 h-3.5 text-violet-400" />
              {moduleCount ?? 0} modules
            </span>
            <span className="flex items-center gap-1.5 bg-white/[0.03] px-2 py-1 rounded-md border border-white/[0.05]">
              <Play className="w-3.5 h-3.5 text-fuchsia-400" />
              {lessonCount ?? 0} lessons
            </span>
          </div>

          {}
          {showProgress && totalLessons > 0 && (
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
                <span className="text-zinc-500">Progress</span>
                <span
                  className={
                    isCompleted ? "text-emerald-400" : "text-violet-400"
                  }
                >
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-out ${isCompleted ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
