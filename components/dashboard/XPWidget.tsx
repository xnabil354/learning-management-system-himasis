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
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="font-semibold text-slate-900">Your XP & Level</h3>
        </div>
        <p className="text-slate-500 text-sm">
          Mulai belajar untuk mendapatkan XP!
        </p>
        <div className="mt-3 text-center text-3xl font-bold text-slate-700">
          0 XP
        </div>
      </div>
    );
  }

  const level = getLevel(progress.totalXp);
  const badges = progress.badges || [];

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-amber-500/20">
              {level.level}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">{level.title}</h3>
            <p className="text-xs text-slate-500">Level {level.level}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-amber-600">
            {progress.totalXp}
          </p>
          <p className="text-xs text-slate-500">Total XP</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
          <span>Level {level.level}</span>
          <span>
            {level.currentXp} / {level.nextLevelXp} XP
          </span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${level.progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
          <BookOpen className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-slate-900">
            {progress.lessonsCompleted}
          </p>
          <p className="text-[10px] text-slate-500">Lessons</p>
        </div>
        <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
          <Trophy className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-slate-900">
            {progress.coursesCompleted}
          </p>
          <p className="text-[10px] text-slate-500">Courses</p>
        </div>
        <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
          <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-slate-900">
            {progress.currentStreak}
          </p>
          <p className="text-[10px] text-slate-500">Streak</p>
        </div>
      </div>

      {badges.length > 0 && (
        <div>
          <h4 className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">
            Your Badges
          </h4>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => {
              const def = BADGE_DEFINITIONS.find((b) => b.id === badge.id);
              return (
                <div
                  key={badge.id}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  title={def?.description || badge.name}
                >
                  <span className="text-base">{def?.icon || "🏅"}</span>
                  <span className="text-slate-700 font-medium">
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
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all"
      >
        <TrendingUp className="w-4 h-4" />
        View Leaderboard
      </Link>
    </div>
  );
}
