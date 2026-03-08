"use client";

import { Loader2, Plus } from "lucide-react";

interface EmptyStateProps {
  emoji: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  isLoading?: boolean;
}

export function EmptyState({
  emoji,
  message,
  actionLabel,
  onAction,
  isLoading = false,
}: EmptyStateProps) {
  return (
    <div className="p-16 rounded-xl bg-white/[0.02] border border-white/[0.06] border-dashed text-center">
      <div className="text-5xl mb-4 opacity-60">{emoji}</div>
      <p className="text-sm text-zinc-500 mb-6 max-w-xs mx-auto">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-lg transition-all duration-200"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {isLoading ? "Creating..." : actionLabel}
        </button>
      )}
    </div>
  );
}
