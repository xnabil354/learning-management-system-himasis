"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  useApplyDocumentActions,
  publishDocument,
  unpublishDocument,
  discardDocument,
  deleteDocument,
  type DocumentHandle,
  useDocument,
  useQuery,
} from "@sanity/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, Trash2, Download, RotateCcw } from "lucide-react";

interface DocumentActionsProps extends DocumentHandle {}

function DocumentActionsFallback() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-20 bg-white/[0.05] rounded-lg" />
      <Skeleton className="h-8 w-8 bg-white/[0.05] rounded-lg" />
    </div>
  );
}

function DocumentActionsContent({
  documentId,
  documentType,
  projectId,
  dataset,
}: DocumentActionsProps) {
  const router = useRouter();
  const apply = useApplyDocumentActions();

  const baseId = documentId.replace("drafts.", "");

  const { data: doc } = useDocument({
    documentId,
    documentType,
    projectId,
    dataset,
  });

  const { data: publishedDoc } = useQuery<{
    _id: string;
  } | null>({
    query: `*[_id == $id][0]{ _id }`,
    params: { id: baseId },
    perspective: "published",
  });

  const isDraft = doc?._id.startsWith("drafts.");
  const hasPublishedVersion = !!publishedDoc;

  const getListUrl = () => {
    if (documentType === "category") return "/admin/categories";
    return `/admin/${documentType}s`;
  };

  return (
    <div className="flex items-center gap-2">
      {}
      {isDraft && (
        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
          Draft
        </span>
      )}

      {}
      {isDraft && hasPublishedVersion && (
        <button
          type="button"
          onClick={() => {
            const confirmed = window.confirm(
              "Discard all changes? This will revert to the published version.",
            );
            if (!confirmed) return;
            apply(
              discardDocument({
                documentId: baseId,
                documentType,
              }),
            );
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-400 border border-white/[0.08] rounded-lg hover:bg-white/[0.05] hover:border-zinc-600 hover:text-zinc-300 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Discard
        </button>
      )}

      {}
      {!isDraft && (
        <button
          type="button"
          onClick={() =>
            apply(
              unpublishDocument({
                documentId: baseId,
                documentType,
              }),
            )
          }
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-400 border border-white/[0.08] rounded-lg hover:bg-white/[0.05] hover:border-zinc-600 hover:text-zinc-300 transition-colors"
        >
          <Download className="h-4 w-4" />
          Unpublish
        </button>
      )}

      {}
      {isDraft && (
        <button
          type="button"
          onClick={() =>
            apply(
              publishDocument({
                documentId: baseId,
                documentType,
              }),
            )
          }
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg shadow-lg shadow-violet-500/20 transition-all"
        >
          <Upload className="h-4 w-4" />
          Publish
        </button>
      )}

      {}
      <button
        type="button"
        onClick={async () => {
          const confirmed = window.confirm(
            "Delete this document permanently? This cannot be undone.",
          );
          if (!confirmed) return;

          if (isDraft && !hasPublishedVersion) {
            await apply(
              discardDocument({
                documentId: baseId,
                documentType,
              }),
            );
          } else {
            await apply(
              deleteDocument({
                documentId: baseId,
                documentType,
              }),
            );
          }
          router.push(getListUrl());
        }}
        className="h-8 w-8 inline-flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function DocumentActions(props: DocumentActionsProps) {
  return (
    <Suspense fallback={<DocumentActionsFallback />}>
      <DocumentActionsContent {...props} />
    </Suspense>
  );
}
