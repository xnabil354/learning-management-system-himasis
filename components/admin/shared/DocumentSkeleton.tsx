"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DocumentListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full bg-slate-50 rounded-xl" />
      ))}
    </div>
  );
}

export function DocumentCardSkeleton() {
  return (
    <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
      <Skeleton className="h-36 w-full bg-slate-50" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4 bg-slate-50 rounded" />
        <Skeleton className="h-4 w-full bg-slate-50 rounded" />
        <Skeleton className="h-4 w-1/2 bg-slate-50 rounded" />
      </div>
    </div>
  );
}

export function DocumentGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <DocumentCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HierarchicalListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-12 w-full bg-slate-50 rounded-xl" />
          <div className="pl-4 space-y-2">
            <Skeleton className="h-14 w-full bg-white rounded-lg" />
            <Skeleton className="h-14 w-full bg-white rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ModuleListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-12 w-full bg-slate-50 rounded-xl" />
          <div className="pl-4 space-y-2">
            <Skeleton className="h-16 w-full bg-white rounded-lg" />
            <Skeleton className="h-16 w-full bg-white rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
