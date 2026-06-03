"use client";

import Link from "next/link";
import { Play, CheckCircle2, Circle, Lock, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import type { COURSE_WITH_MODULES_QUERYResult } from "@/sanity.types";

type Module = NonNullable<
  NonNullable<COURSE_WITH_MODULES_QUERYResult>["modules"]
>[number];
type Lesson = NonNullable<Module["lessons"]>[number];

interface ModuleAccordionProps {
  modules: Module[] | null;
  userId?: string | null;
}

export function ModuleAccordion({ modules, userId }: ModuleAccordionProps) {
  if (!modules || modules.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-slate-200 rounded-3xl bg-slate-50">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-50 flex items-center justify-center">
          <Lock className="w-8 h-8 text-slate-600" />
        </div>
        <p className="text-slate-500 font-medium">No modules available yet.</p>
      </div>
    );
  }

  const isLessonCompleted = (lesson: Lesson): boolean => {
    if (!userId || !lesson.completedBy) return false;
    return lesson.completedBy.includes(userId);
  };

  const getModuleProgress = (
    module: Module,
  ): { completed: number; total: number } => {
    const lessons = module.lessons ?? [];
    const total = lessons.length;
    const completed = lessons.filter((lesson) =>
      isLessonCompleted(lesson),
    ).length;
    return { completed, total };
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Course Curriculum
        </h2>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
          {modules.length} Modules
        </span>
      </div>

      <Accordion type="multiple" className="space-y-4">
        {modules.map((module, index) => {
          const { completed, total } = getModuleProgress(module);
          const isModuleComplete = total > 0 && completed === total;

          return (
            <AccordionItem
              key={module._id}
              value={module._id}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-colors data-[state=open]:border-blue-200"
            >
              <AccordionTrigger className="px-6 py-5 hover:no-underline group hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-5 flex-1 w-full">
                  {}
                  <div
                    className={`
                    flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold shrink-0 transition-all duration-300
                    ${
                      isModuleComplete
                        ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        : "bg-slate-50 text-slate-400 border border-slate-200 group-hover:border-slate-200 group-hover:text-slate-900"
                    }
                  `}
                  >
                    {isModuleComplete ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {}
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {module.title ?? "Untitled Module"}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-slate-500 font-medium">
                        {total} Lessons
                      </span>

                      {}
                      {userId && total > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all duration-500"
                              style={{ width: `${(completed / total) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {Math.round((completed / total) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {}
                  <ChevronDown className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors shrink-0" />
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-0 pb-0">
                <div className="border-t border-slate-200 bg-slate-50/50">
                  {module.lessons?.map((lesson, lessonIndex) => {
                    const completed = isLessonCompleted(lesson);
                    const hasVideo = !!lesson.videoUrl;

                    return (
                      <Link
                        key={lesson._id}
                        href={`/lessons/${lesson.slug!.current!}`}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group/lesson border-b border-slate-200 last:border-none"
                      >
                        {}
                        <div className="shrink-0">
                          {completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover/lesson:border-slate-400 transition-colors" />
                          )}
                        </div>

                        {}
                        <div className="flex-1 min-w-0">
                          <span
                            className={`text-sm font-medium transition-colors line-clamp-1 ${
                              completed
                                ? "text-slate-500"
                                : "text-slate-700 group-hover/lesson:text-blue-600"
                            }`}
                          >
                            {lesson.title ?? "Untitled Lesson"}
                          </span>
                        </div>

                        {}
                        <div className="flex items-center gap-3 shrink-0">
                          {hasVideo && (
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-500 group-hover/lesson:text-blue-600 group-hover/lesson:border-blue-200 transition-all shadow-sm">
                              <Play className="w-3 h-3 fill-current" />
                              VIDEO
                            </div>
                          )}
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover/lesson:text-blue-600 transition-colors opacity-0 group-hover/lesson:opacity-100" />
                        </div>
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
  );
}

import { ChevronRight } from "lucide-react";
