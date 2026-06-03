"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CourseCard } from "./CourseCard";
import type { DASHBOARD_COURSES_QUERYResult } from "@/sanity.types";

export type CourseListCourse = DASHBOARD_COURSES_QUERYResult[number];

interface CourseListProps {
  courses: CourseListCourse[];
  showFilters?: boolean;
  showSearch?: boolean;
  emptyMessage?: string;
}

export function CourseList({
  courses,
  showSearch = true,
  emptyMessage = "No courses found",
}: CourseListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter((course) => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const title = course.title?.toLowerCase() ?? "";
      const description = course.description?.toLowerCase() ?? "";
      if (!title.includes(query) && !description.includes(query)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {}
      {showSearch && (
        <div className="flex items-center justify-end">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-blue-600"
            />
          </div>
        </div>
      )}

      {}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.slug!.current!}
              slug={{ current: course.slug!.current! }}
              title={course.title}
              description={course.description}
              thumbnail={course.thumbnail}
              moduleCount={course.moduleCount}
              lessonCount={course.lessonCount}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-slate-400">{emptyMessage}</p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-2 text-sm text-blue-600 hover:text-blue-300 transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
}
