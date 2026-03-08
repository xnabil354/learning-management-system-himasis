import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { issueCertificate } from "@/lib/actions/certificates";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { courseId, courseSlug, courseTitle, studentName } = body;

  if (!courseId || !courseTitle) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;
    const name =
      studentName ||
      (user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.firstName || "Mahasiswa");

    const result = await issueCertificate({
      clerkUserId: userId,
      studentName: name,
      studentEmail: email || undefined,
      courseId,
      courseTitle,
      courseSlug: courseSlug || "",
    });

    return NextResponse.json({
      certificateId: result.certificateId,
      isNew: result.isNew,
    });
  } catch (error: any) {
    console.error("[Certificate Issue]", error?.message || error);
    return NextResponse.json(
      { error: "Failed to issue certificate" },
      { status: 500 },
    );
  }
}
