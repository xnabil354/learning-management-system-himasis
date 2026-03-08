"use client";

import { Filter, ChevronDown, Check } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export const CourseFilters = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentSort = searchParams.get("sort") || "recent";
  const currentLimit = searchParams.get("limit") || "12";

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isLimitOpen, setIsLimitOpen] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const limitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
      if (
        limitRef.current &&
        !limitRef.current.contains(event.target as Node)
      ) {
        setIsLimitOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sort);
    replace(`${pathname}?${params.toString()}`);
    setIsSortOpen(false);
  };

  const handleLimitChange = (limit: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", limit);
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
    setIsLimitOpen(false);
  };

  const sortOptions = [
    { value: "recent", label: "Recently Accessed" },
    { value: "title", label: "Title (A-Z)" },
    { value: "progress_desc", label: "Progress (High-Low)" },
    { value: "progress_asc", label: "Progress (Low-High)" },
  ];

  const limitOptions = [
    { value: "12", label: "12 per page" },
    { value: "24", label: "24 per page" },
    { value: "48", label: "48 per page" },
    { value: "all", label: "View All" },
  ];

  return (
    <div className="flex items-center gap-2">
      {}
      <div className="relative" ref={sortRef}>
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="flex items-center gap-2 appearance-none bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl text-zinc-400 text-sm py-2.5 pl-4 pr-4 rounded-full focus:outline-none hover:text-white hover:bg-white/[0.05] transition-all min-w-[160px] justify-between"
        >
          <span className="truncate">
            {sortOptions.find((o) => o.value === currentSort)?.label ||
              "Sort By"}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-zinc-500 transition-transform ${isSortOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isSortOpen && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-[#09090b] border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-1">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center justify-between ${currentSort === option.value ? "bg-white/10 text-white font-medium" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                >
                  {option.label}
                  {currentSort === option.value && (
                    <Check className="w-3 h-3" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {}
      <div className="relative hidden sm:block" ref={limitRef}>
        <button
          onClick={() => setIsLimitOpen(!isLimitOpen)}
          className="flex items-center gap-2 appearance-none bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl text-zinc-400 text-sm py-2.5 pl-4 pr-4 rounded-full focus:outline-none hover:text-white hover:bg-white/[0.05] transition-all min-w-[130px] justify-between"
        >
          <span className="truncate">
            {limitOptions.find((o) => o.value === currentLimit)?.label ||
              "Limit"}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-zinc-500 transition-transform ${isLimitOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isLimitOpen && (
          <div className="absolute top-full right-0 mt-2 w-40 bg-[#09090b] border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-1">
              {limitOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleLimitChange(option.value)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center justify-between ${currentLimit === option.value ? "bg-white/10 text-white font-medium" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                >
                  {option.label}
                  {currentLimit === option.value && (
                    <Check className="w-3 h-3" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
