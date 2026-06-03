"use client";

import { Suspense } from "react";
import { useDocumentProjection, type DocumentHandle } from "@sanity/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ModuleWithLessons } from "./ModuleWithLessons";
import type { CourseModulesData } from "./types";

export function CourseWithModulesAndLessons({
  documentId,
  documentType,
  projectId,
  dataset,
}: DocumentHandle) {
  const { data } = useDocumentProjection({
    documentId,
    documentType,
    projectId,
    dataset,
    projection: `{
      title,
      modules[]{ _ref }
    }`,
  });

  const course = data as CourseModulesData | undefined;
  const moduleRefs = course?.modules ?? [];

  if (moduleRefs.length === 0) return null;

  return (
    <AccordionItem
      value={documentId}
      className="border border-slate-200 rounded-xl overflow-hidden bg-white"
    >
      <AccordionTrigger className="px-4 py-3 hover:bg-white hover:no-underline transition-colors [&[data-state=open]]:bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600/10">
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-sm text-slate-200">
              {course?.title || "Untitled Course"}
            </h3>
            <p className="text-xs text-slate-600">
              {moduleRefs.length} module{moduleRefs.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <Accordion
          type="multiple"
          defaultValue={moduleRefs.map((m) => m._ref ?? "")}
          className="space-y-2 pt-2"
        >
          {moduleRefs.map((ref) =>
            ref._ref ? (
              <Suspense
                key={ref._ref}
                fallback={
                  <Skeleton className="h-16 w-full bg-white rounded-lg" />
                }
              >
                <ModuleWithLessons
                  documentId={ref._ref}
                  documentType="module"
                  projectId={projectId}
                  dataset={dataset}
                />
              </Suspense>
            ) : null,
          )}
        </Accordion>
      </AccordionContent>
    </AccordionItem>
  );
}
