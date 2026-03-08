"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle, Loader2, Trophy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleCourseCompletion } from "@/lib/actions";
import { cn } from "@/lib/utils";

interface CourseCompleteButtonProps {
  courseId: string;
  courseSlug: string;
  isCompleted: boolean;
  completedLessons: number;
  totalLessons: number;
}

export function CourseCompleteButton({
  courseId,
  courseSlug,
  isCompleted: initialCompleted,
  completedLessons,
  totalLessons,
}: CourseCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();

  const allLessonsCompleted =
    completedLessons === totalLessons && totalLessons > 0;

  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const handleToggle = () => {
    const newState = !isCompleted;
    setIsCompleted(newState);

    startTransition(async () => {
      const result = await toggleCourseCompletion(
        courseId,
        courseSlug,
        newState,
      );
      if (result.success) {
        setIsCompleted(result.isCompleted);
      } else {
        setIsCompleted(!newState);
      }
    });
  };

  if (isCompleted) {
    return (
      <div className="relative overflow-hidden group">
        {}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-700" />

        <div className="relative flex flex-col sm:flex-row items-center gap-6 p-6 bg-[#0F0F10]/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg text-white shrink-0 animate-in zoom-in duration-500">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="text-center sm:text-left flex-1">
            <h3 className="text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              Course Completed!
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
            </h3>
            <p className="text-zinc-400 mt-1">
              Congratulations on finishing this course. You've mastered all{" "}
              {totalLessons} lessons.
            </p>
          </div>

          <Button
            onClick={handleToggle}
            disabled={isPending}
            variant="outline"
            className="border-white/10 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all rounded-full"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Circle className="w-4 h-4 mr-2" />
            )}
            Mark Incomplete
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {}
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative flex flex-col md:flex-row items-center gap-6 p-6 bg-[#0F0F10] border border-white/[0.08] rounded-2xl overflow-hidden">
        {}
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            {}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#27272a"
              strokeWidth="3"
            />

            {}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={allLessonsCompleted ? "#10b981" : "#8b5cf6"}
              strokeWidth="3"
              strokeDasharray={`${progressPercent}, 100`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <span className="absolute text-sm font-bold text-white">
            {progressPercent}%
          </span>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-white">Your Progress</h3>
          <p className="text-zinc-400 text-sm mt-1">
            You have completed{" "}
            <span className="text-white font-medium">{completedLessons}</span>{" "}
            out of{" "}
            <span className="text-white font-medium">{totalLessons}</span>{" "}
            lessons.
          </p>
        </div>

        <Button
          onClick={handleToggle}
          disabled={isPending || !allLessonsCompleted}
          size="lg"
          className={cn(
            "font-bold rounded-full transition-all duration-300 shadow-lg min-w-[200px]",
            allLessonsCompleted
              ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20 hover:shadow-emerald-500/40"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed hover:bg-zinc-800",
          )}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : allLessonsCompleted ? (
            <CheckCircle2 className="w-5 h-5 mr-2" />
          ) : (
            <Circle className="w-5 h-5 mr-2" />
          )}
          {allLessonsCompleted ? "Complete Course" : "Finish all lessons"}
        </Button>
      </div>
    </div>
  );
}
