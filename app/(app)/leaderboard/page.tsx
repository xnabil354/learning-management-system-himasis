import { auth, currentUser } from "@clerk/nextjs/server";
import { Header } from "@/components/Header";
import { getLeaderboard, getUserProgress } from "@/lib/actions/gamification";
import { getLevel, BADGE_DEFINITIONS } from "@/lib/gamification-utils";
import type { LeaderboardEntry } from "@/lib/actions/gamification";
import { Trophy, Medal, Crown, Flame, Star, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Leaderboard — SMARTSIS",
  description: "Top learners di SMARTSIS Academy",
};

export default async function LeaderboardPage() {
  const user = await currentUser();
  const userId = user?.id ?? null;

  const [leaderboard, myProgress] = await Promise.all([
    getLeaderboard(20),
    userId ? getUserProgress(userId) : null,
  ]);

  const myLevel = myProgress ? getLevel(myProgress.totalXp) : null;
  const myRank = leaderboard.findIndex((e) => e.clerkUserId === userId) + 1;

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-700/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <Header />

      <main className="relative z-10 px-6 lg:px-12 py-12 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-slate-400 mt-2">
            Top learners di SMARTSIS Academy bulan ini
          </p>
        </div>

        {myProgress && myLevel && (
          <div className="mb-10 p-6 bg-gradient-to-r from-blue-600/10 via-purple-500/5 to-sky-500/10 border border-blue-600/20 rounded-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-sky-600 flex items-center justify-center text-2xl font-bold">
                  {myLevel.level}
                </div>
                {myRank > 0 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-bold text-black">
                    #{myRank}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold">
                  {myProgress.userName || "You"}
                </h2>
                <p className="text-blue-700 text-sm font-medium">
                  {myLevel.title} — Level {myLevel.level}
                </p>
                <div className="mt-2 flex items-center gap-4 justify-center sm:justify-start text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400" />{" "}
                    {myProgress.totalXp} XP
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />{" "}
                    {myProgress.currentStreak} day streak
                  </span>
                </div>

                <div className="mt-3 w-full max-w-xs mx-auto sm:mx-0">
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>Level {myLevel.level}</span>
                    <span>{Math.round(myLevel.progress)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-sky-500 rounded-full transition-all duration-1000"
                      style={{ width: `${myLevel.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {myProgress.badges && myProgress.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {myProgress.badges.map((badge) => {
                    const def = BADGE_DEFINITIONS.find(
                      (b) => b.id === badge.id,
                    );
                    return (
                      <div
                        key={badge.id}
                        className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-lg"
                        title={
                          def ? `${def.name}: ${def.description}` : badge.name
                        }
                      >
                        {def?.icon || "🏅"}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-[60px_1fr_100px_100px_80px] gap-4 px-6 py-4 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-medium">
            <span>Rank</span>
            <span>Student</span>
            <span className="text-center">XP</span>
            <span className="text-center">Lessons</span>
            <span className="text-center">Badges</span>
          </div>

          {leaderboard.length === 0 ? (
            <div className="px-6 py-16 text-center text-slate-500">
              <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Belum ada data. Mulai belajar untuk muncul di leaderboard!</p>
            </div>
          ) : (
            leaderboard.map((entry) => (
              <LeaderboardRow
                key={entry._id}
                entry={entry}
                isCurrentUser={entry.clerkUserId === userId}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function LeaderboardRow({
  entry,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
}) {
  const level = getLevel(entry.totalXp);
  const rankIcon =
    entry.rank === 1 ? (
      <Crown className="w-5 h-5 text-amber-400" />
    ) : entry.rank === 2 ? (
      <Medal className="w-5 h-5 text-slate-300" />
    ) : entry.rank === 3 ? (
      <Medal className="w-5 h-5 text-amber-700" />
    ) : (
      <span className="text-sm text-slate-500 font-mono">{entry.rank}</span>
    );

  return (
    <div
      className={`grid grid-cols-[60px_1fr_100px_100px_80px] gap-4 px-6 py-4 items-center border-b border-slate-200 transition-colors ${
        isCurrentUser
          ? "bg-blue-50 border-l-2 border-l-blue-600"
          : "hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center justify-center">{rankIcon}</div>

      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-sky-600 flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden">
          {entry.userImage ? (
            <img
              src={entry.userImage}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            (entry.userName || "?")[0].toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 truncate text-sm">
            {entry.userName || "Student"}
            {isCurrentUser && (
              <span className="ml-2 text-xs text-blue-600">(You)</span>
            )}
          </p>
          <p className="text-xs text-slate-500">
            {level.title} • Lvl {level.level}
          </p>
        </div>
      </div>

      <div className="text-center">
        <span className="text-amber-400 font-bold text-sm">
          {entry.totalXp}
        </span>
        <span className="text-slate-600 text-xs ml-0.5">XP</span>
      </div>

      <div className="text-center text-slate-600 text-sm">
        {entry.lessonsCompleted}
      </div>

      <div className="flex items-center justify-center gap-0.5">
        {(entry.badges || []).slice(0, 3).map((badge) => {
          const def = BADGE_DEFINITIONS.find((b) => b.id === badge.id);
          return (
            <span
              key={badge.id}
              className="text-sm"
              title={def?.name || badge.name}
            >
              {def?.icon || "🏅"}
            </span>
          );
        })}
        {(entry.badges || []).length > 3 && (
          <span className="text-[10px] text-slate-500">
            +{entry.badges.length - 3}
          </span>
        )}
      </div>
    </div>
  );
}
