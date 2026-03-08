"use client";

import type { Tier } from "@/lib/constants";

export function useUserTier(): Tier {
  return "free";
}

export function hasTierAccess(
  _userTier: Tier,
  _contentTier: Tier | null | undefined,
): boolean {
  return true;
}
