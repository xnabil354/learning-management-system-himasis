"use client";

import { Suspense } from "react";
import type { DocumentHandle } from "@sanity/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDocument, useEditDocument } from "@sanity/sdk-react";
import { SelectInput } from "@/components/admin/inputs/SelectInput";
import { SwitchInput } from "@/components/admin/inputs/SwitchInput";
import { ReferenceInput } from "@/components/admin/inputs/ReferenceInput";
import { ModuleAccordionInput } from "@/components/admin/inputs/ModuleAccordionInput";
import { ImageInput } from "@/components/admin/inputs/ImageInput";
import { SlugInput } from "@/components/admin/inputs/SlugInput";
import { DocumentActions } from "@/components/admin/documents/DocumentActions";
import { OpenInStudio } from "@/components/admin/documents/OpenInStudio";
import { TIER_OPTIONS } from "@/lib/constants";

interface CourseEditorProps {
  documentId: string;
  projectId: string;
  dataset: string;
}

function CourseEditorFallback() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <Skeleton className="h-12 w-2/3 bg-white/[0.04] rounded-xl" />
      <Skeleton className="h-20 w-full bg-white/[0.04] rounded-xl" />
      <Skeleton className="h-[400px] w-full bg-white/[0.04] rounded-xl" />
    </div>
  );
}

function CourseEditorContent({
  documentId,
  projectId,
  dataset,
}: CourseEditorProps) {
  const handle: DocumentHandle = {
    documentId,
    documentType: "course",
    projectId,
    dataset,
  };

  const { data: title } = useDocument<string>({ ...handle, path: "title" });
  const { data: description } = useDocument<string>({
    ...handle,
    path: "description",
  });
  const editTitle = useEditDocument<string>({ ...handle, path: "title" });
  const editDescription = useEditDocument<string>({
    ...handle,
    path: "description",
  });

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex items-center justify-end mb-3">
        <OpenInStudio handle={handle} />
      </div>

      <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-6 mb-6">
        <Input
          value={title ?? ""}
          onChange={(e) => editTitle(e.currentTarget.value)}
          placeholder="Untitled Course"
          className="text-2xl font-semibold text-white border-none shadow-none h-auto py-1 focus-visible:ring-0 bg-transparent placeholder:text-zinc-600"
        />

        <Textarea
          value={description ?? ""}
          onChange={(e) => editDescription(e.currentTarget.value)}
          placeholder="Add a description..."
          className="text-zinc-400 border-none shadow-none resize-none focus-visible:ring-0 bg-transparent placeholder:text-zinc-600 mt-2"
          rows={2}
        />

        <div className="flex items-center justify-end mt-4 pt-4 border-t border-white/[0.06]">
          <DocumentActions {...handle} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-6">
          <ModuleAccordionInput
            documentId={documentId}
            documentType="course"
            projectId={projectId}
            dataset={dataset}
            path="modules"
            label="Modules"
          />
        </div>

        <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-6 space-y-5 h-fit">
          <ImageInput {...handle} path="thumbnail" label="Thumbnail" />
          <ReferenceInput
            {...handle}
            path="category"
            label="Category"
            referenceType="category"
            placeholder="Select category"
          />

          <SwitchInput
            {...handle}
            path="featured"
            label="Featured"
            description="Show on homepage"
          />

          <SlugInput
            {...handle}
            path="slug"
            label="URL Slug"
            sourceField="title"
          />
        </div>
      </div>
    </div>
  );
}

export function CourseEditor(props: CourseEditorProps) {
  return (
    <Suspense fallback={<CourseEditorFallback />}>
      <CourseEditorContent {...props} />
    </Suspense>
  );
}
