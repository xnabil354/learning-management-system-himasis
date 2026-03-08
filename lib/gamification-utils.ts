interface UserProgressForBadge {
  totalXp: number;
  lessonsCompleted: number;
  coursesCompleted: number;
  currentStreak: number;
}

export const BADGE_DEFINITIONS = [
  {
    id: "first_step",
    name: "First Step",
    icon: "🌱",
    description: "Menyelesaikan lesson pertama",
    condition: (p: UserProgressForBadge) => p.lessonsCompleted >= 1,
  },
  {
    id: "bookworm",
    name: "Bookworm",
    icon: "📚",
    description: "Menyelesaikan 5 lessons",
    condition: (p: UserProgressForBadge) => p.lessonsCompleted >= 5,
  },
  {
    id: "scholar",
    name: "Scholar",
    icon: "🎓",
    description: "Menyelesaikan 10 lessons",
    condition: (p: UserProgressForBadge) => p.lessonsCompleted >= 10,
  },
  {
    id: "fast_learner",
    name: "Fast Learner",
    icon: "⚡",
    description: "Menyelesaikan course pertama",
    condition: (p: UserProgressForBadge) => p.coursesCompleted >= 1,
  },
  {
    id: "code_master",
    name: "Code Master",
    icon: "🏆",
    description: "Menyelesaikan 3 courses",
    condition: (p: UserProgressForBadge) => p.coursesCompleted >= 3,
  },
  {
    id: "streak_3",
    name: "On Fire",
    icon: "🔥",
    description: "Login streak 3 hari berturut-turut",
    condition: (p: UserProgressForBadge) => p.currentStreak >= 3,
  },
  {
    id: "streak_7",
    name: "Week Warrior",
    icon: "⚔️",
    description: "Login streak 7 hari berturut-turut",
    condition: (p: UserProgressForBadge) => p.currentStreak >= 7,
  },
  {
    id: "xp_500",
    name: "Rising Star",
    icon: "⭐",
    description: "Mengumpulkan 500 XP",
    condition: (p: UserProgressForBadge) => p.totalXp >= 500,
  },
  {
    id: "xp_1000",
    name: "Legend",
    icon: "👑",
    description: "Mengumpulkan 1000 XP",
    condition: (p: UserProgressForBadge) => p.totalXp >= 1000,
  },
] as const;

export function getLevel(totalXp: number): {
  level: number;
  title: string;
  currentXp: number;
  nextLevelXp: number;
  progress: number;
} {
  const levels = [
    { level: 1, title: "Newbie", xp: 0 },
    { level: 2, title: "Learner", xp: 100 },
    { level: 3, title: "Student", xp: 250 },
    { level: 4, title: "Scholar", xp: 500 },
    { level: 5, title: "Expert", xp: 1000 },
    { level: 6, title: "Master", xp: 2000 },
    { level: 7, title: "Legend", xp: 5000 },
  ];

  let current = levels[0];
  let next = levels[1];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalXp >= levels[i].xp) {
      current = levels[i];
      next = levels[i + 1] || {
        level: current.level + 1,
        title: "∞",
        xp: current.xp * 2,
      };
      break;
    }
  }

  const xpInLevel = totalXp - current.xp;
  const xpForLevel = next.xp - current.xp;
  const progress =
    xpForLevel > 0 ? Math.min((xpInLevel / xpForLevel) * 100, 100) : 100;

  return {
    level: current.level,
    title: current.title,
    currentXp: xpInLevel,
    nextLevelXp: xpForLevel,
    progress,
  };
}
