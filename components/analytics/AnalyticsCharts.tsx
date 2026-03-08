"use client";

import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line, Radar, Scatter } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
);

ChartJS.defaults.color = "#71717a";
ChartJS.defaults.borderColor = "rgba(255,255,255,0.04)";
ChartJS.defaults.font.family =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

interface Props {
  data: {
    courses: any[];
    totalStudents: number;
    totalReviews: number;
    categories: any[];
  };
  userId: string;
}

const COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#10b981",
  "#f43f5e",
  "#6366f1",
  "#ec4899",
  "#14b8a6",
];

export default function AnalyticsCharts({ data, userId }: Props) {
  const { courses } = data;

  const getCourseProgress = (course: any) => {
    const totalLessons =
      course.modules?.reduce(
        (acc: number, m: any) => acc + (m.lessons?.length || 0),
        0,
      ) || 0;
    const completedLessons =
      course.modules?.reduce(
        (acc: number, m: any) =>
          acc +
          (m.lessons?.filter(
            (l: any) =>
              Array.isArray(l.completedBy) && l.completedBy.includes(userId),
          )?.length || 0),
        0,
      ) || 0;
    return {
      totalLessons,
      completedLessons,
      progress:
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0,
    };
  };

  const truncate = (s: string, n: number) =>
    s.length > n ? s.slice(0, n) + "…" : s;

  const radarLabels = courses.map((c) => truncate(c.title, 14));
  const radarValues = courses.map((c) => getCourseProgress(c).progress);

  const radarData = {
    labels: radarLabels,
    datasets: [
      {
        label: "Progress %",
        data: radarValues,
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        borderColor: "#8b5cf6",
        borderWidth: 2,
        pointBackgroundColor: "#8b5cf6",
        pointBorderColor: "#fff",
        pointRadius: 4,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 25,
          color: "#52525b",
          backdropColor: "transparent",
          font: { size: 9 },
        },
        grid: { color: "rgba(255,255,255,0.06)" },
        angleLines: { color: "rgba(255,255,255,0.06)" },
        pointLabels: { color: "#a1a1aa", font: { size: 10 } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#18181b",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        titleColor: "#a1a1aa",
        bodyColor: "#e4e4e7",
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          label: (ctx: any) => `${ctx.raw}%`,
        },
      },
    },
  };

  const velocityData = (() => {
    const allLessons: Array<{ date: string; duration: number }> = [];
    courses.forEach((course: any) => {
      course.modules?.forEach((m: any) => {
        m.lessons?.forEach((l: any) => {
          if (
            Array.isArray(l.completedBy) &&
            l.completedBy.includes(userId) &&
            l._createdAt
          ) {
            allLessons.push({
              date: l._createdAt,
              duration: l.duration || 0,
            });
          }
        });
      });
    });

    const weekLabels = [
      "Minggu 1",
      "Minggu 2",
      "Minggu 3",
      "Minggu 4",
      "Minggu 5",
      "Minggu 6",
    ];

    const lessonsPerWeek = new Array(6).fill(0);
    const minutesPerWeek = new Array(6).fill(0);

    if (allLessons.length > 0) {
      allLessons.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
      const firstDate = new Date(allLessons[0].date).getTime();
      allLessons.forEach((l) => {
        const diff = new Date(l.date).getTime() - firstDate;
        const weekIndex = Math.min(
          Math.floor(diff / (7 * 24 * 60 * 60 * 1000)),
          5,
        );
        lessonsPerWeek[weekIndex] += 1;
        minutesPerWeek[weekIndex] += l.duration;
      });
    }

    return {
      labels: weekLabels,
      datasets: [
        {
          label: "Lessons",
          data: lessonsPerWeek,
          borderColor: "#06b6d4",
          backgroundColor: "rgba(6, 182, 212, 0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointBackgroundColor: "#06b6d4",
          pointBorderColor: "#0e1117",
          pointBorderWidth: 2,
        },
        {
          label: "Menit",
          data: minutesPerWeek,
          borderColor: "#8b5cf6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointBackgroundColor: "#8b5cf6",
          pointBorderColor: "#0e1117",
          pointBorderWidth: 2,
        },
      ],
    };
  })();

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: { color: "#71717a", font: { size: 10 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: { color: "#71717a", font: { size: 10 } },
      },
    },
    plugins: {
      legend: {
        labels: { color: "#a1a1aa", font: { size: 11 }, usePointStyle: true },
      },
      tooltip: {
        backgroundColor: "#18181b",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        titleColor: "#a1a1aa",
        bodyColor: "#e4e4e7",
        cornerRadius: 12,
        padding: 12,
      },
    },
  };

  const barLabels = courses.map((c) => truncate(c.title, 12));
  const completedData = courses.map(
    (c) => getCourseProgress(c).completedLessons,
  );
  const remainingData = courses.map((c) => {
    const p = getCourseProgress(c);
    return Math.max(0, p.totalLessons - p.completedLessons);
  });

  const barChartData = {
    labels: barLabels,
    datasets: [
      {
        label: "Selesai",
        data: completedData,
        backgroundColor: "#10b981",
        borderRadius: {
          topLeft: 0,
          topRight: 0,
          bottomLeft: 6,
          bottomRight: 6,
        },
        borderSkipped: false,
      },
      {
        label: "Sisa",
        data: remainingData,
        backgroundColor: "#27272a",
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: "#71717a", font: { size: 10 } },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: { color: "#71717a", font: { size: 10 } },
      },
    },
    plugins: {
      legend: {
        labels: { color: "#a1a1aa", font: { size: 11 }, usePointStyle: true },
      },
      tooltip: {
        backgroundColor: "#18181b",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        titleColor: "#a1a1aa",
        bodyColor: "#e4e4e7",
        cornerRadius: 12,
        padding: 12,
      },
    },
  };

  const categoryMap = new Map<string, number>();
  courses.forEach((course: any) => {
    const cat = course.category?.title || "Uncategorized";
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  });
  const catLabels = Array.from(categoryMap.keys());
  const catValues = Array.from(categoryMap.values());

  const donutData = {
    labels: catLabels,
    datasets: [
      {
        data: catValues,
        backgroundColor: COLORS.slice(0, catLabels.length),
        borderColor: "#09090b",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#d4d4d8",
          font: { size: 11 },
          usePointStyle: true,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: "#18181b",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        titleColor: "#a1a1aa",
        bodyColor: "#e4e4e7",
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          label: (ctx: any) => ` ${ctx.label}: ${ctx.raw} courses`,
        },
      },
    },
  };

  const areaLabels = courses.map((c) => truncate(c.title, 12));
  const areaValues = courses.map((course: any) => {
    const totalDuration =
      course.modules?.reduce(
        (acc: number, m: any) =>
          acc +
          (m.lessons?.reduce(
            (la: number, l: any) =>
              la +
              (Array.isArray(l.completedBy) && l.completedBy.includes(userId)
                ? l.duration || 0
                : 0),
            0,
          ) || 0),
        0,
      ) || 0;
    return parseFloat((totalDuration / 60).toFixed(1));
  });

  const areaChartData = {
    labels: areaLabels,
    datasets: [
      {
        label: "Jam Belajar",
        data: areaValues,
        borderColor: "#a855f7",
        backgroundColor: (ctx: any) => {
          const chart = ctx.chart;
          const { ctx: canvasCtx, chartArea } = chart;
          if (!chartArea) return "rgba(168, 85, 247, 0.1)";
          const gradient = canvasCtx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          gradient.addColorStop(0, "rgba(168, 85, 247, 0.3)");
          gradient.addColorStop(1, "rgba(168, 85, 247, 0)");
          return gradient;
        },
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "#a855f7",
        pointBorderColor: "#0e1117",
        pointBorderWidth: 2,
      },
    ],
  };

  const areaOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: { color: "#71717a", font: { size: 10 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: { color: "#71717a", font: { size: 10 } },
        title: {
          display: true,
          text: "Jam",
          color: "#52525b",
          font: { size: 11 },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#18181b",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        titleColor: "#a1a1aa",
        bodyColor: "#e4e4e7",
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          label: (ctx: any) => ` ${ctx.raw}h`,
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 backdrop-blur-sm hover:border-white/[0.12] transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <span className="text-lg">🎯</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Course Progress</h3>
            <p className="text-[11px] text-zinc-500">
              Radar perbandingan progress
            </p>
          </div>
        </div>
        <div className="h-[280px]">
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 backdrop-blur-sm hover:border-white/[0.12] transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <span className="text-lg">📈</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Learning Velocity</h3>
            <p className="text-[11px] text-zinc-500">
              Kecepatan belajar mingguan
            </p>
          </div>
        </div>
        <div className="h-[280px]">
          <Line data={velocityData} options={lineOptions} />
        </div>
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 backdrop-blur-sm hover:border-white/[0.12] transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <span className="text-lg">📊</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Completion Rate</h3>
            <p className="text-[11px] text-zinc-500">
              Lesson selesai vs. sisa per course
            </p>
          </div>
        </div>
        <div className="h-[280px]">
          <Bar data={barChartData} options={barOptions} />
        </div>
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 backdrop-blur-sm hover:border-white/[0.12] transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <span className="text-lg">🍩</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Category Distribution
            </h3>
            <p className="text-[11px] text-zinc-500">
              Distribusi course per kategori
            </p>
          </div>
        </div>
        <div className="h-[280px]">
          <Doughnut data={donutData} options={donutOptions} />
        </div>
      </div>

      <div className="lg:col-span-2 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 backdrop-blur-sm hover:border-white/[0.12] transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-fuchsia-500/10 flex items-center justify-center">
            <span className="text-lg">⏱️</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Learning Hours per Course
            </h3>
            <p className="text-[11px] text-zinc-500">
              Total jam belajar yang sudah diselesaikan
            </p>
          </div>
        </div>
        <div className="h-[280px]">
          <Line data={areaChartData} options={areaOptions} />
        </div>
      </div>
    </div>
  );
}
