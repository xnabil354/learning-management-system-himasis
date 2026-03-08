"use client";

import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CertificateTemplate } from "./CertificateTemplate";
import { Download, Loader2, Award } from "lucide-react";

interface CertificateDownloadButtonProps {
  studentName: string;
  courseTitle: string;
  completedAt: Date;
}

export const CertificateDownloadButton = ({
  studentName,
  courseTitle,
  completedAt,
}: CertificateDownloadButtonProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-500 text-sm cursor-wait"
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>Preparing Certificate...</span>
      </div>
    );
  }

  const certificateId = `SISCA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  const formattedDate = completedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <PDFDownloadLink
        document={
          <CertificateTemplate
            studentName={studentName}
            courseTitle={courseTitle}
            completionDate={formattedDate}
            certificateId={certificateId}
          />
        }
        fileName={`SISCA-Certificate-${courseTitle.replace(/\s+/g, "-")}.pdf`}
        style={{ textDecoration: "none" }}
      >
        {({ loading }: any) => (
          <span
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 bg-gradient-to-r from-amber-900/30 via-yellow-900/20 to-amber-900/30 border border-amber-500/20 text-amber-200 hover:border-amber-400/40 hover:text-amber-100 hover:shadow-[0_0_20px_rgba(217,170,93,0.1)] cursor-pointer group"
            style={loading ? { opacity: 0.5, cursor: "wait" } : {}}
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Award className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
            )}
            <span>{loading ? "Generating..." : "Download Certificate"}</span>
            {!loading && (
              <Download className="h-3 w-3 ml-auto opacity-40 group-hover:opacity-80 group-hover:-translate-y-0.5 transition-all" />
            )}
          </span>
        )}
      </PDFDownloadLink>
    </div>
  );
};
