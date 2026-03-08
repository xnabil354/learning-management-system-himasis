"use client";

import { Search, Command } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const GlobalSearch = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/dashboard/courses?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative group w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="bg-transparent border-none py-2.5 pl-10 pr-12 w-full text-sm text-white placeholder:text-zinc-600 focus:outline-none rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl focus:bg-white/[0.05] transition-all shadow-lg"
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-500">
        Command K
      </div>
    </form>
  );
};
