export const TIER_OPTIONS = [{ value: "free", label: "Free" }] as const;

export type Tier = "free";

type TierColor = "emerald";

const TIER_COLOR_MAP: Record<TierColor, { border: string; text: string }> = {
  emerald: {
    border: "border-emerald-500/20",
    text: "text-emerald-400",
  },
};

export function getTierColorClasses(color: TierColor) {
  return TIER_COLOR_MAP[color];
}

export const TIER_STYLES: Record<
  Tier,
  {
    gradient: string;
    border: string;
    text: string;
    badge: string;
  }
> = {
  free: {
    gradient: "from-emerald-500 to-teal-600",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    badge: "bg-emerald-500/90 text-white",
  },
};

export const TIER_FEATURES = [
  {
    tier: "Free",
    color: "emerald",
    features: [
      "Access to all courses",
      "All modules & lessons",
      "AI Learning Assistant",
      "Community access",
      "Course completion certificates",
      "Lifetime updates",
    ],
  },
] as const;
