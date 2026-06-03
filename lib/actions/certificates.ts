"use server";

import { client, writeClient } from "@/sanity/lib/client";
import { nanoid } from "nanoid";

interface IssueCertificateInput {
  clerkUserId: string;
  studentName: string;
  studentEmail?: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
}

interface CertificateRecord {
  _id: string;
  certificateId: string;
  studentName: string;
  studentEmail?: string;
  courseTitle: string;
  courseSlug?: string;
  issuedAt: string;
  status: string;
}

function generateCertificateId(): string {
  const year = new Date().getFullYear();
  const uid = nanoid(6).toUpperCase();
  return `SMARTSIS-${year}-${uid}`;
}

export async function issueCertificate(
  input: IssueCertificateInput,
): Promise<{ certificateId: string; isNew: boolean }> {
  const existing = await client.fetch<{ certificateId: string } | null>(
    `*[_type == "certificate" && clerkUserId == $userId && courseId == $courseId && status == "valid"][0]{ certificateId }`,
    { userId: input.clerkUserId, courseId: input.courseId },
  );

  if (existing) {
    return { certificateId: existing.certificateId, isNew: false };
  }

  const certificateId = generateCertificateId();

  await writeClient.create({
    _type: "certificate",
    certificateId,
    clerkUserId: input.clerkUserId,
    studentName: input.studentName,
    studentEmail: input.studentEmail || "",
    courseId: input.courseId,
    courseTitle: input.courseTitle,
    courseSlug: input.courseSlug,
    issuedAt: new Date().toISOString(),
    status: "valid",
  });

  return { certificateId, isNew: true };
}

export async function verifyCertificate(
  certificateId: string,
): Promise<CertificateRecord | null> {
  if (!certificateId || typeof certificateId !== "string") return null;

  const cert = await client.fetch<CertificateRecord | null>(
    `*[_type == "certificate" && certificateId == $certId][0]{
      _id,
      certificateId,
      studentName,
      studentEmail,
      courseTitle,
      courseSlug,
      issuedAt,
      status
    }`,
    { certId: certificateId },
  );

  return cert;
}

export async function getCertificateForUserCourse(
  clerkUserId: string,
  courseId: string,
): Promise<string | null> {
  const cert = await client.fetch<{ certificateId: string } | null>(
    `*[_type == "certificate" && clerkUserId == $userId && courseId == $courseId && status == "valid"][0]{ certificateId }`,
    { userId: clerkUserId, courseId },
  );

  return cert?.certificateId || null;
}
