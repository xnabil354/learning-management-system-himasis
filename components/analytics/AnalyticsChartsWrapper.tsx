"use client";

import dynamic from "next/dynamic";

const AnalyticsCharts = dynamic(
  () => import("@/components/analytics/AnalyticsCharts"),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 h-[350px] animate-pulse flex items-center justify-center"
          >
            <div className="text-zinc-600 text-xs font-medium">
              Loading chart...
            </div>
          </div>
        ))}
      </div>
    ),
  },
);

interface Props {
  data: any;
  userId: string;
}

export default function AnalyticsChartsWrapper({ data, userId }: Props) {
  return <AnalyticsCharts data={data} userId={userId} />;
}
