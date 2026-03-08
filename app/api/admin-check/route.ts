import { NextRequest, NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ authorized: false }, { status: 400 });
  }

  const authorized = await isAdminEmail(email);
  return NextResponse.json({ authorized });
}
