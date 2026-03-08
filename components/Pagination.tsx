"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
}

export const Pagination = ({ totalPages }: PaginationProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12 pb-8">
      <button
        disabled={currentPage <= 1}
        onClick={() => replace(createPageURL(currentPage - 1))}
        className="p-2 rounded-full border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <span className="text-sm font-medium text-zinc-400">
        Page <span className="text-white">{currentPage}</span> of{" "}
        <span className="text-white">{totalPages}</span>
      </span>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => replace(createPageURL(currentPage + 1))}
        className="p-2 rounded-full border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
