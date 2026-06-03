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
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-white transition-colors" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="bg-transparent border-none py-2.5 pl-10 pr-12 w-full text-sm text-white placeholder:text-slate-600 focus:outline-none rounded-xl bg-white border border-slate-200 backdrop-blur-xl focus:bg-slate-50 transition-all shadow-lg"
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-500">
        Command K
      </div>
    </form>
  );
};
