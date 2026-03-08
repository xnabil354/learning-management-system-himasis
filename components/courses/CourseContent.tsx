"use client";

import { useAuth } from "@clerk/nextjs";
import { CourseHero } from "./CourseHero";
import { ModuleAccordion } from "./ModuleAccordion";
import { CourseCompleteButton } from "./CourseCompleteButton";
import { CourseReviews } from "./CourseReviews";
import type { COURSE_WITH_MODULES_QUERYResult } from "@/sanity.types";
import { Skeleton } from "../ui/skeleton";

interface ReviewData {
  _id: string;
  courseId: string | null;
  userId: string | null;
  userName: string | null;
  userImage: string | null;
  rating: number | null;
  comment: string | null;
  _createdAt: string;
}

interface CourseContentProps {
  course: NonNullable<COURSE_WITH_MODULES_QUERYResult>;
  userId: string | null;
  duration?: string;
  reviews: ReviewData[];
}

export function CourseContent({
  course,
  userId,
  duration,
  reviews,
}: CourseContentProps) {
  const { isLoaded: isAuthLoaded } = useAuth();

  let totalLessons = 0;
  let completedLessons = 0;

  for (const m of course.modules ?? []) {
    for (const l of m.lessons ?? []) {
      totalLessons++;
      if (userId && l.completedBy?.includes(userId)) {
        completedLessons++;
      }
    }
  }

  const isCourseCompleted = userId
    ? (course.completedBy?.includes(userId) ?? false)
    : false;

  if (!isAuthLoaded) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <>
      <CourseHero
        title={course.title}
        description={course.description ?? null}
        thumbnail={course.thumbnail}
        category={course.category}
        moduleCount={course.moduleCount}
        lessonCount={course.lessonCount}
        duration={duration}
      />

      <div className="max-w-5xl mx-auto space-y-12 pb-24">
        {userId && (
          <CourseCompleteButton
            courseId={course._id}
            courseSlug={course.slug!.current!}
            isCompleted={isCourseCompleted}
            completedLessons={completedLessons}
            totalLessons={totalLessons}
          />
        )}

        <ModuleAccordion modules={course.modules ?? null} userId={userId} />

        <CourseReviews
          courseId={course._id}
          courseSlug={course.slug?.current ?? ""}
          reviews={reviews}
        />
      </div>
    </>
  );
}
