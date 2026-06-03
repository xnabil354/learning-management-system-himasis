"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { LESSON_BY_ID_QUERYResult } from "@/sanity.types";

type Course = NonNullable<LESSON_BY_ID_QUERYResult>["courses"][number];
type CourseModules = Course["modules"];
type Module = NonNullable<CourseModules>[number];
type Lesson = NonNullable<Module["lessons"]>[number];

interface LessonSidebarProps {
  courseSlug: string;
  courseTitle: string | null;
  modules: Module[] | null;
  currentLessonId: string;
  completedLessonIds?: string[];
}

export function LessonSidebar({
  courseSlug,
  courseTitle,
  modules,
  currentLessonId,
  completedLessonIds = [],
}: LessonSidebarProps) {
  if (!modules || modules.length === 0) {
    return null;
  }

  const currentModuleId = modules.find((m) =>
    m.lessons?.some((l) => l._id === currentLessonId),
  )?._id;

  return (
    <div className="w-full lg:w-80 shrink-0">
      <div className="sticky top-24 bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        {}
        <div className="p-4 border-b border-slate-200">
          <Link
            href={`/courses/${courseSlug}`}
            className="text-sm text-slate-400 hover:text-slate-900 transition-colors"
          >
            ← Back to course
          </Link>
          <h3 className="font-semibold text-slate-900 mt-2 line-clamp-2">
            {courseTitle ?? "Course"}
          </h3>
        </div>

        {}
        <div className="max-h-[60vh] overflow-y-auto">
          <Accordion
            type="multiple"
            defaultValue={currentModuleId ? [currentModuleId] : []}
            className="w-full"
          >
            {modules.map((module, moduleIndex) => {
              const lessonCount = module.lessons?.length ?? 0;
              const completedCount =
                module.lessons?.filter((l) =>
                  completedLessonIds.includes(l._id),
                ).length ?? 0;

              return (
                <AccordionItem
                  key={module._id}
                  value={module._id}
                  className="border-b border-slate-200 last:border-b-0"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 text-left">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="flex items-center justify-center w-6 h-6 rounded bg-blue-600/20 text-blue-600 text-xs font-bold shrink-0">
                        {moduleIndex + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 uppercase tracking-wider">
                            Module
                          </span>
                        </div>
                        <p className="font-medium text-sm text-slate-900 truncate mt-0.5">
                          {module.title ?? "Untitled Module"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {completedCount}/{lessonCount} lessons
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pb-3 pt-1">
                    <div className="ml-4 border-l-2 border-slate-200 pl-3 space-y-1">
                      {module.lessons?.map((lesson, lessonIndex) => {
                        const isActive = lesson._id === currentLessonId;
                        const isCompleted = completedLessonIds.includes(
                          lesson._id,
                        );

                        return (
                          <Link
                            key={lesson._id}
                            href={`/lessons/${lesson.slug!.current!}`}
                            className={cn(
                              "flex items-center gap-2.5 pl-2 pr-3 py-2 rounded-lg text-sm transition-colors",
                              isActive
                                ? "bg-blue-50 text-blue-700"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : isActive ? (
                              <Play className="w-4 h-4 text-blue-600 shrink-0 fill-blue-600" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                            )}
                            <span className="truncate">
                              {lesson.title ?? "Untitled Lesson"}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
