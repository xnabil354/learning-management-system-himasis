import { auth } from "@clerk/nextjs/server";
import type { Tier } from "@/lib/constants";

export async function hasAccessToTier(
  _requiredTier: Tier | null | undefined,
): Promise<boolean> {
  return true;
}

export async function getUserTier(): Promise<Tier> {
  return "free";
}
