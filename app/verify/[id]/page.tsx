import { Metadata } from "next";
import { verifyCertificate } from "@/lib/actions/certificates";
import {
  ShieldCheck,
  ShieldX,
  Calendar,
  User,
  BookOpen,
  ExternalLink,
  Award,
} from "lucide-react";
import Link from "next/link";

interface VerifyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: VerifyPageProps): Promise<Metadata> {
  const { id } = await params;
  const cert = await verifyCertificate(id);

  if (!cert || cert.status !== "valid") {
    return {
      title: "Certificate Not Found — SISCA",
      description: "This certificate could not be verified.",
    };
  }

  return {
    title: `Certificate Verified — ${cert.studentName} | SISCA`,
    description: `This certificate confirms that ${cert.studentName} has successfully completed "${cert.courseTitle}" on SISCA (HIMASIS E-Learning).`,
    openGraph: {
      title: `✅ Verified Certificate — ${cert.studentName}`,
      description: `Successfully completed "${cert.courseTitle}" on SISCA Academy.`,
      type: "website",
    },
  };
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { id } = await params;
  const cert = await verifyCertificate(id);

  if (!cert) {
    return <InvalidCertificate id={id} reason="not_found" />;
  }

  if (cert.status === "revoked") {
    return <InvalidCertificate id={id} reason="revoked" />;
  }

  const issuedDate = new Date(cert.issuedAt).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 mb-4 animate-in zoom-in duration-500">
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Certificate Verified
          </h1>
          <p className="text-emerald-400 text-sm mt-2 font-medium">
            ✅ This certificate is authentic and valid
          </p>
        </div>

        <div className="bg-[#0F0F10] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
          <div className="h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500" />

          <div className="p-6 space-y-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <User className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                  Awarded to
                </p>
                <p className="text-xl font-bold text-white mt-0.5">
                  {cert.studentName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <BookOpen className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                  Course Completed
                </p>
                <p className="text-lg font-semibold text-white mt-0.5">
                  {cert.courseTitle}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Calendar className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                  Date of Completion
                </p>
                <p className="text-sm text-zinc-300 mt-0.5 font-medium">
                  {issuedDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
              <Award className="w-4 h-4 text-zinc-600" />
              <p className="text-xs text-zinc-600 font-mono tracking-wider">
                {cert.certificateId}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-md bg-violet-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="text-zinc-500 text-sm font-medium">
              SISCA Academy — HIMASIS E-Learning
            </span>
          </div>

          {cert.courseSlug && (
            <Link
              href={`/courses/${cert.courseSlug}`}
              className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              View Course
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function InvalidCertificate({
  id,
  reason,
}: {
  id: string;
  reason: "not_found" | "revoked";
}) {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/30">
          <ShieldX className="w-10 h-10 text-red-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {reason === "revoked"
              ? "Certificate Revoked"
              : "Certificate Not Found"}
          </h1>
          <p className="text-zinc-400 text-sm">
            {reason === "revoked"
              ? "This certificate has been revoked and is no longer valid."
              : "No certificate was found with this ID. It may have been removed or the link is incorrect."}
          </p>
        </div>

        <p className="text-xs text-zinc-700 font-mono bg-white/[0.02] border border-white/[0.06] rounded-lg px-4 py-2 inline-block">
          ID: {id}
        </p>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors"
          >
            Go to SISCA Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
