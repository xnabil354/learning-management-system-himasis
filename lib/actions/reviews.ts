"use server";

import { currentUser } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

interface SubmitReviewResult {
  success: boolean;
  error?: string;
}

export async function submitReview(
  courseId: string,
  courseSlug: string,
  rating: number,
  comment: string,
): Promise<SubmitReviewResult> {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "You must be signed in to leave a review" };
  }

  if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return { success: false, error: "Rating must be between 1 and 5" };
  }

  if (!comment.trim()) {
    return { success: false, error: "Comment cannot be empty" };
  }

  if (comment.length > 1000) {
    return { success: false, error: "Comment must be under 1000 characters" };
  }

  try {
    const existing = await writeClient.fetch(
      `*[_type == "review" && courseId == $courseId && userId == $userId][0]._id`,
      { courseId, userId: user.id },
    );

    const userName =
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
      user.username ||
      "Anonymous";

    if (existing) {
      await writeClient
        .patch(existing)
        .set({
          rating,
          comment: comment.trim(),
          userName,
          userImage: user.imageUrl ?? "",
        })
        .commit();
    } else {
      await writeClient.create({
        _type: "review",
        courseId,
        userId: user.id,
        userName,
        userImage: user.imageUrl ?? "",
        rating,
        comment: comment.trim(),
      });
    }

    revalidatePath(`/courses/${courseSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to submit review:", error);
    return {
      success: false,
      error: "Failed to submit review. Please try again.",
    };
  }
}

export async function deleteReview(
  reviewId: string,
  courseSlug: string,
): Promise<SubmitReviewResult> {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "You must be signed in" };
  }

  try {
    const review = await writeClient.fetch(
      `*[_type == "review" && _id == $reviewId][0]{ userId }`,
      { reviewId },
    );

    if (!review) {
      return { success: false, error: "Review not found" };
    }

    if (review.userId !== user.id) {
      return { success: false, error: "You can only delete your own reviews" };
    }

    await writeClient.delete(reviewId);
    revalidatePath(`/courses/${courseSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete review:", error);
    return {
      success: false,
      error: "Failed to delete review. Please try again.",
    };
  }
}
