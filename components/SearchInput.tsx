"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export const SearchInput = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative group w-full md:w-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
      <input
        type="text"
        placeholder="Search courses..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("q")?.toString()}
        className="bg-transparent border-none py-2.5 pl-10 pr-4 w-full md:w-64 text-sm text-white placeholder:text-zinc-600 focus:outline-none rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl focus:bg-white/[0.05] transition-all"
      />
    </div>
  );
};
