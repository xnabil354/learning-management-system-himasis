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
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-sm cursor-wait"
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>Preparing Certificate...</span>
      </div>
    );
  }

  const certificateId = `SMARTSIS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
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
        fileName={`SMARTSIS-Certificate-${courseTitle.replace(/\s+/g, "-")}.pdf`}
        style={{ textDecoration: "none" }}
      >
        {({ loading }: any) => (
          <span
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-200 text-amber-700 hover:border-amber-300 hover:text-amber-800 hover:shadow-md hover:shadow-amber-100 cursor-pointer group"
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
