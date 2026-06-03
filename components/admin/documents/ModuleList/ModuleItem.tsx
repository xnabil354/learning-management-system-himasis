"use client";

import Link from "next/link";
import { useDocumentProjection } from "@sanity/sdk-react";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, BookOpen, Layers } from "lucide-react";
import type { ModuleItemProps, ModuleData } from "./types";

export function ModuleItem({
  documentId,
  documentType,
  projectId,
  dataset,
  index,
}: ModuleItemProps) {
  const { data } = useDocumentProjection({
    documentId,
    documentType,
    projectId,
    dataset,
    projection: `{
      title,
      description,
      "lessonCount": count(lessons)
    }`,
  });

  const module = data as ModuleData | undefined;
  const lessonCount = module?.lessonCount ?? 0;

  return (
    <Link href={`/admin/modules/${documentId}`}>
      <div className="p-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-200 transition-all duration-200 cursor-pointer group">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-600">
            {index !== undefined && (
              <span className="text-xs font-medium text-slate-600 w-5">
                {index + 1}.
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-600 shrink-0" />
              <h3 className="font-medium text-sm text-slate-200 truncate group-hover:text-slate-900 transition-colors">
                {module?.title || "Untitled Module"}
              </h3>
            </div>
            {module?.description && (
              <p className="text-xs text-slate-600 line-clamp-1 mt-1 ml-6">
                {module.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Badge
              variant="secondary"
              className="bg-slate-50 text-slate-500 border-slate-200"
            >
              <BookOpen className="h-3 w-3 mr-1" />
              {lessonCount} lesson{lessonCount === 1 ? "" : "s"}
            </Badge>
            <ChevronRight className="h-4 w-4 text-slate-700 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
