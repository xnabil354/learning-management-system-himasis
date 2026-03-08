"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { resend, EMAIL_FROM, APP_URL } from "@/lib/resend";
import { CourseAnnouncementEmail } from "@/lib/emails/templates/course-announcement";
import { ProgressReminderEmail } from "@/lib/emails/templates/progress-reminder";
import { clerkClient } from "@clerk/nextjs/server";
import { isSuperAdmin } from "@/lib/admin";

interface EmailResult {
  success: boolean;
  sent: number;
  error?: string;
}

export async function sendCourseAnnouncement(
  courseSlug: string,
  courseTitle: string,
  courseDescription: string,
): Promise<EmailResult> {
  const user = await currentUser();
  if (!user) return { success: false, sent: 0, error: "Unauthorized" };

  const email = user.emailAddresses?.[0]?.emailAddress;
  if (!email || !isSuperAdmin(email)) {
    return { success: false, sent: 0, error: "Admin only" };
  }

  if (
    !courseSlug ||
    typeof courseSlug !== "string" ||
    !courseTitle ||
    typeof courseTitle !== "string"
  ) {
    return { success: false, sent: 0, error: "Invalid input" };
  }

  try {
    const clerk = await clerkClient();
    const usersResponse = await clerk.users.getUserList({ limit: 100 });
    const users = usersResponse.data;

    let sent = 0;
    const batchSize = 50;

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);

      const emailPromises = batch
        .filter((u) => u.emailAddresses?.[0]?.emailAddress)
        .map((u) =>
          resend.emails.send({
            from: EMAIL_FROM,
            to: u.emailAddresses[0].emailAddress,
            subject: `📚 Course Baru: ${courseTitle}`,
            react: CourseAnnouncementEmail({
              firstName: u.firstName || "Mahasiswa",
              courseTitle,
              courseDescription:
                courseDescription || "Course baru tersedia di SISCA.",
              courseUrl: `${APP_URL}/courses/${courseSlug}`,
            }),
          }),
        );

      const results = await Promise.allSettled(emailPromises);
      sent += results.filter((r) => r.status === "fulfilled").length;
    }

    return { success: true, sent };
  } catch (error) {
    console.error(
      "Announcement email error:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return { success: false, sent: 0, error: "Failed to send emails" };
  }
}

interface CourseProgress {
  _id: string;
  title: string;
  slug: string;
  totalLessons: number;
  completedByUsers: string[];
  lessonCompletions: Array<{
    lessonId: string;
    completedBy: string[];
  }>;
}

export async function sendProgressReminders(): Promise<EmailResult> {
  const { userId } = await auth();
  if (!userId) return { success: false, sent: 0, error: "Unauthorized" };

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (!email || !isSuperAdmin(email)) {
    return { success: false, sent: 0, error: "Admin only" };
  }

  try {
    const courses = await client.fetch<CourseProgress[]>(`
      *[_type == "course"] {
        _id,
        title,
        "slug": slug.current,
        "totalLessons": count(modules[]->lessons[]->) ,
        "completedByUsers": completedBy,
        "lessonCompletions": modules[]->lessons[]-> {
          "lessonId": _id,
          "completedBy": completedBy
        }
      }
    `);

    const clerk = await clerkClient();
    const usersResponse = await clerk.users.getUserList({ limit: 100 });
    const users = usersResponse.data;

    let sent = 0;

    for (const u of users) {
      const userEmail = u.emailAddresses?.[0]?.emailAddress;
      if (!userEmail) continue;

      for (const course of courses) {
        if (!course.totalLessons || course.totalLessons === 0) continue;

        const isCompleted = course.completedByUsers?.includes(u.id);
        if (isCompleted) continue;

        const completedLessons =
          course.lessonCompletions?.filter((l) => l.completedBy?.includes(u.id))
            .length || 0;

        if (completedLessons === 0) continue;

        const percentage = Math.round(
          (completedLessons / course.totalLessons) * 100,
        );
        if (percentage >= 100) continue;

        try {
          await resend.emails.send({
            from: EMAIL_FROM,
            to: userEmail,
            subject: `📖 Lanjut belajar "${course.title}" — ${percentage}% selesai!`,
            react: ProgressReminderEmail({
              firstName: u.firstName || "Mahasiswa",
              courseTitle: course.title,
              completedLessons,
              totalLessons: course.totalLessons,
              courseUrl: `${APP_URL}/courses/${course.slug}`,
            }),
          });
          sent++;
        } catch (error) {
          console.error(
            "Reminder email error:",
            error instanceof Error ? error.message : "Unknown error",
          );
        }
      }
    }

    return { success: true, sent };
  } catch (error) {
    console.error(
      "Progress reminder error:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return { success: false, sent: 0, error: "Failed to send reminders" };
  }
}
