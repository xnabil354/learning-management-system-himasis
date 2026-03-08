"use client";

import { Suspense } from "react";
import type { DocumentHandle } from "@sanity/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDocument, useEditDocument } from "@sanity/sdk-react";
import { DocumentActions } from "@/components/admin/documents/DocumentActions";
import { OpenInStudio } from "@/components/admin/documents/OpenInStudio";
import { SlugInput } from "@/components/admin/inputs/SlugInput";
import { PortableTextInput } from "@/components/admin/inputs/PortableTextInput";
import { Video } from "lucide-react";

interface LessonEditorProps {
  documentId: string;
  projectId: string;
  dataset: string;
}

function LessonEditorFallback() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <Skeleton className="h-12 w-2/3 bg-white/[0.04] rounded-xl" />
      <Skeleton className="h-20 w-full bg-white/[0.04] rounded-xl" />
      <Skeleton className="h-16 w-full bg-white/[0.04] rounded-xl" />
    </div>
  );
}

function LessonEditorContent({
  documentId,
  projectId,
  dataset,
}: LessonEditorProps) {
  const handle: DocumentHandle = {
    documentId,
    documentType: "lesson",
    projectId,
    dataset,
  };

  const { data: title } = useDocument<string>({ ...handle, path: "title" });
  const { data: description } = useDocument<string>({
    ...handle,
    path: "description",
  });
  const { data: videoUrl } = useDocument<string>({
    ...handle,
    path: "videoUrl",
  });
  const { data: duration } = useDocument<number>({
    ...handle,
    path: "duration",
  });

  const editTitle = useEditDocument<string>({ ...handle, path: "title" });
  const editDescription = useEditDocument<string>({
    ...handle,
    path: "description",
  });
  const editVideoUrl = useEditDocument<string>({
    ...handle,
    path: "videoUrl",
  });
  const editDuration = useEditDocument<number>({
    ...handle,
    path: "duration",
  });

  return (
    <div className="max-w-[1200px] mx-auto space-y-4">
      <div className="flex items-center justify-end gap-3">
        <DocumentActions {...handle} />
        <div className="h-5 w-px bg-white/[0.06]" />
        <OpenInStudio handle={handle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-6">
            <Input
              value={title ?? ""}
              onChange={(e) => editTitle(e.currentTarget.value)}
              placeholder="Untitled Lesson"
              className="text-2xl font-semibold text-white border-none shadow-none h-auto py-1 focus-visible:ring-0 bg-transparent placeholder:text-zinc-600"
            />

            <Textarea
              value={description ?? ""}
              onChange={(e) => editDescription(e.currentTarget.value)}
              placeholder="Add a description..."
              className="text-zinc-400 border-none shadow-none resize-none focus-visible:ring-0 bg-transparent placeholder:text-zinc-600 mt-3"
              rows={3}
            />
          </div>

          <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-6">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">
              Settings
            </h3>
            <SlugInput
              {...handle}
              path="slug"
              label="URL Slug"
              sourceField="title"
            />
          </div>

          <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-6">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">
              Lesson Content
            </h3>
            <PortableTextInput {...handle} path="content" label="Content" />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-6 lg:sticky lg:top-20 space-y-6">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                YouTube Video
              </h3>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-500">YouTube URL</label>
              <Input
                value={videoUrl ?? ""}
                onChange={(e) => editVideoUrl(e.currentTarget.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600 focus:border-violet-500/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-500">
                Duration (minutes)
              </label>
              <Input
                type="number"
                value={duration ?? ""}
                onChange={(e) =>
                  editDuration(
                    e.currentTarget.value
                      ? Number(e.currentTarget.value)
                      : (0 as any),
                  )
                }
                placeholder="e.g. 15"
                min={0}
                className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600 focus:border-violet-500/40"
              />
            </div>

            {videoUrl && (
              <div className="mt-4">
                <p className="text-xs text-zinc-500 mb-2">Preview</p>
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(videoUrl)}`}
                  title="Video Preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full aspect-video rounded-lg border-0"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function LessonEditor(props: LessonEditorProps) {
  return (
    <Suspense fallback={<LessonEditorFallback />}>
      <LessonEditorContent {...props} />
    </Suspense>
  );
}
