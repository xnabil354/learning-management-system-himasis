"use server";

import { client, writeClient } from "@/sanity/lib/client";
import { BADGE_DEFINITIONS } from "@/lib/gamification-utils";

const XP_REWARDS = {
  LESSON_COMPLETE: 25,
  COURSE_COMPLETE: 100,
  FIRST_LESSON: 50,
} as const;

interface UserProgress {
  _id: string;
  clerkUserId: string;
  userName?: string;
  userImage?: string;
  totalXp: number;
  lessonsCompleted: number;
  coursesCompleted: number;
  currentStreak: number;
  lastActiveDate?: string;
  badges: Array<{ id: string; name: string; earnedAt: string }>;
  xpHistory: Array<{ amount: number; reason: string; earnedAt: string }>;
}

export interface LeaderboardEntry {
  _id: string;
  clerkUserId: string;
  userName: string;
  userImage?: string;
  totalXp: number;
  lessonsCompleted: number;
  coursesCompleted: number;
  badges: Array<{ id: string; name: string; earnedAt: string }>;
  rank?: number;
}

async function getOrCreateProgress(
  userId: string,
  userName?: string,
  userImage?: string,
): Promise<UserProgress> {
  const existing = await client.fetch<UserProgress | null>(
    `*[_type == "userProgress" && clerkUserId == $userId][0]{
      _id, clerkUserId, userName, userImage, totalXp,
      lessonsCompleted, coursesCompleted, currentStreak, lastActiveDate,
      badges[]{ id, name, earnedAt },
      xpHistory[]{ amount, reason, earnedAt }
    }`,
    { userId },
  );

  if (existing) {
    if (
      (userName && userName !== existing.userName) ||
      (userImage && userImage !== existing.userImage)
    ) {
      await writeClient
        .patch(existing._id)
        .set({
          ...(userName ? { userName } : {}),
          ...(userImage ? { userImage } : {}),
        })
        .commit();
    }
    return {
      ...existing,
      badges: existing.badges || [],
      xpHistory: existing.xpHistory || [],
    };
  }

  const created = await writeClient.create({
    _type: "userProgress",
    clerkUserId: userId,
    userName: userName || "Student",
    userImage: userImage || "",
    totalXp: 0,
    lessonsCompleted: 0,
    coursesCompleted: 0,
    currentStreak: 0,
    badges: [],
    xpHistory: [],
  });

  return {
    _id: created._id,
    clerkUserId: userId,
    userName: userName || "Student",
    userImage: userImage || "",
    totalXp: 0,
    lessonsCompleted: 0,
    coursesCompleted: 0,
    currentStreak: 0,
    badges: [],
    xpHistory: [],
  };
}

function calculateStreak(
  currentStreak: number,
  lastActiveDate?: string,
): number {
  const today = new Date().toISOString().split("T")[0];

  if (!lastActiveDate) return 1;
  if (lastActiveDate === today) return currentStreak;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (lastActiveDate === yesterdayStr) return currentStreak + 1;
  return 1;
}

export async function awardXP(
  userId: string,
  reason: "lesson" | "course",
  userName?: string,
  userImage?: string,
): Promise<{ xpGained: number; newBadges: string[] }> {
  const progress = await getOrCreateProgress(userId, userName, userImage);

  let xpAmount =
    reason === "lesson"
      ? XP_REWARDS.LESSON_COMPLETE
      : XP_REWARDS.COURSE_COMPLETE;

  const isFirstLesson = reason === "lesson" && progress.lessonsCompleted === 0;
  if (isFirstLesson) {
    xpAmount += XP_REWARDS.FIRST_LESSON;
  }

  const today = new Date().toISOString().split("T")[0];
  const newStreak = calculateStreak(
    progress.currentStreak,
    progress.lastActiveDate,
  );

  const newTotalXp = progress.totalXp + xpAmount;
  const newLessons = progress.lessonsCompleted + (reason === "lesson" ? 1 : 0);
  const newCourses = progress.coursesCompleted + (reason === "course" ? 1 : 0);

  await writeClient
    .patch(progress._id)
    .set({
      totalXp: newTotalXp,
      lessonsCompleted: newLessons,
      coursesCompleted: newCourses,
      currentStreak: newStreak,
      lastActiveDate: today,
    })
    .setIfMissing({ xpHistory: [] })
    .append("xpHistory", [
      {
        _type: "object",
        _key: `xp-${Date.now()}`,
        amount: xpAmount,
        reason: isFirstLesson ? "first_lesson" : reason,
        earnedAt: new Date().toISOString(),
      },
    ])
    .commit();

  const updatedProgress = {
    totalXp: newTotalXp,
    lessonsCompleted: newLessons,
    coursesCompleted: newCourses,
    currentStreak: newStreak,
  };

  const existingBadgeIds = new Set(progress.badges.map((b) => b.id));
  const newBadges: string[] = [];

  for (const badge of BADGE_DEFINITIONS) {
    if (!existingBadgeIds.has(badge.id) && badge.condition(updatedProgress)) {
      newBadges.push(badge.id);
    }
  }

  if (newBadges.length > 0) {
    const badgeEntries = newBadges.map((id) => {
      const def = BADGE_DEFINITIONS.find((b) => b.id === id)!;
      return {
        _type: "object" as const,
        _key: `badge-${id}`,
        id,
        name: def.name,
        earnedAt: new Date().toISOString(),
      };
    });

    await writeClient
      .patch(progress._id)
      .setIfMissing({ badges: [] })
      .append("badges", badgeEntries)
      .commit();
  }

  return { xpGained: xpAmount, newBadges };
}

export async function getUserProgress(
  userId: string,
): Promise<UserProgress | null> {
  return client.fetch<UserProgress | null>(
    `*[_type == "userProgress" && clerkUserId == $userId][0]{
      _id, clerkUserId, userName, userImage, totalXp,
      lessonsCompleted, coursesCompleted, currentStreak, lastActiveDate,
      badges[]{ id, name, earnedAt },
      xpHistory[]{ amount, reason, earnedAt } | order(earnedAt desc) [0...10]
    }`,
    { userId },
  );
}

export async function getLeaderboard(
  limit: number = 20,
): Promise<LeaderboardEntry[]> {
  const results = await client.fetch<LeaderboardEntry[]>(
    `*[_type == "userProgress" && totalXp > 0] | order(totalXp desc) [0...$limit]{
      _id, clerkUserId, userName, userImage, totalXp,
      lessonsCompleted, coursesCompleted,
      badges[]{ id, name, earnedAt }
    }`,
    { limit },
  );

  return (results || []).map((entry, index) => ({
    ...entry,
    badges: entry.badges || [],
    rank: index + 1,
  }));
}
