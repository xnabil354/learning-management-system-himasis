import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isSuperAdmin } from "@/lib/admin";
import { sendProgressReminders } from "@/lib/actions/emails";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    const result = await sendProgressRemindersInternal();
    return NextResponse.json(result);
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (!email || !isSuperAdmin(email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const result = await sendProgressReminders();
  return NextResponse.json(result);
}

async function sendProgressRemindersInternal() {
  const { sendProgressReminders } = await import("@/lib/actions/emails");
  return sendProgressReminders();
}
