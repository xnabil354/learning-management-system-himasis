import { getUserProgress } from "@/lib/actions/gamification";
import { getLevel, BADGE_DEFINITIONS } from "@/lib/gamification-utils";
import { Star, Flame, BookOpen, Trophy, TrendingUp } from "lucide-react";
import Link from "next/link";

interface XPWidgetProps {
  userId: string;
}

export async function XPWidget({ userId }: XPWidgetProps) {
  const progress = await getUserProgress(userId);

  if (!progress) {
    return (
      <div className="p-6 bg-[#0F0F10] border border-white/[0.08] rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="font-semibold text-white">Your XP & Level</h3>
        </div>
        <p className="text-zinc-500 text-sm">
          Mulai belajar untuk mendapatkan XP!
        </p>
        <div className="mt-3 text-center text-3xl font-bold text-zinc-700">
          0 XP
        </div>
      </div>
    );
  }

  const level = getLevel(progress.totalXp);
  const badges = progress.badges || [];

  return (
    <div className="p-6 bg-[#0F0F10] border border-white/[0.08] rounded-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-amber-500/20">
              {level.level}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{level.title}</h3>
            <p className="text-xs text-zinc-500">Level {level.level}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-amber-400">
            {progress.totalXp}
          </p>
          <p className="text-xs text-zinc-500">Total XP</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[10px] text-zinc-500 mb-1.5">
          <span>Level {level.level}</span>
          <span>
            {level.currentXp} / {level.nextLevelXp} XP
          </span>
        </div>
        <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${level.progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
          <BookOpen className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-white">
            {progress.lessonsCompleted}
          </p>
          <p className="text-[10px] text-zinc-500">Lessons</p>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
          <Trophy className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-white">
            {progress.coursesCompleted}
          </p>
          <p className="text-[10px] text-zinc-500">Courses</p>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
          <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-white">
            {progress.currentStreak}
          </p>
          <p className="text-[10px] text-zinc-500">Streak</p>
        </div>
      </div>

      {badges.length > 0 && (
        <div>
          <h4 className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2">
            Your Badges
          </h4>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => {
              const def = BADGE_DEFINITIONS.find((b) => b.id === badge.id);
              return (
                <div
                  key={badge.id}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs"
                  title={def?.description || badge.name}
                >
                  <span className="text-base">{def?.icon || "🏅"}</span>
                  <span className="text-zinc-300 font-medium">
                    {def?.name || badge.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Link
        href="/leaderboard"
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-all"
      >
        <TrendingUp className="w-4 h-4" />
        View Leaderboard
      </Link>
    </div>
  );
}
