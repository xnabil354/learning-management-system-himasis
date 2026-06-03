"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useDocuments } from "@sanity/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Layers,
  PlayCircle,
  Tag,
  ArrowUpRight,
  ExternalLink,
  CheckCircle2,
  Circle,
  ArrowRight,
} from "lucide-react";
import { projectId, dataset } from "@/sanity/env";

function StatCardContent({ documentType }: { documentType: string }) {
  const { data: documents } = useDocuments({
    documentType,
    projectId,
    dataset,
  });

  return (
    <span className="text-3xl font-semibold tracking-tight text-white">
      {documents?.length ?? 0}
    </span>
  );
}

interface StatCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  documentType: string;
  href: string;
  accent: string;
  iconBg: string;
}

function StatCard({
  title,
  icon: Icon,
  documentType,
  href,
  accent,
  iconBg,
}: StatCardProps) {
  return (
    <Link href={href} className="group">
      <div className="relative overflow-hidden rounded-xl bg-white border border-slate-200 p-5 hover:bg-slate-50 hover:border-slate-200 transition-all duration-300">
        <div className="flex items-start justify-between mb-6">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}
          >
            <Icon className={`h-5 w-5 ${accent}`} />
          </div>
          <ArrowUpRight className="h-4 w-4 text-slate-700 group-hover:text-slate-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" />
        </div>
        <Suspense
          fallback={<Skeleton className="h-9 w-12 bg-slate-50 rounded" />}
        >
          <StatCardContent documentType={documentType} />
        </Suspense>
        <p className="text-[13px] text-slate-500 mt-1 font-medium">{title}</p>
      </div>
    </Link>
  );
}

const STAT_CARDS: StatCardProps[] = [
  {
    title: "Courses",
    icon: BookOpen,
    documentType: "course",
    href: "/admin/courses",
    accent: "text-blue-600",
    iconBg: "bg-blue-600/10",
  },
  {
    title: "Modules",
    icon: Layers,
    documentType: "module",
    href: "/admin/modules",
    accent: "text-blue-400",
    iconBg: "bg-blue-500/10",
  },
  {
    title: "Lessons",
    icon: PlayCircle,
    documentType: "lesson",
    href: "/admin/lessons",
    accent: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
  },
  {
    title: "Categories",
    icon: Tag,
    documentType: "category",
    href: "/admin/categories",
    accent: "text-amber-400",
    iconBg: "bg-amber-500/10",
  },
];

function ContentHealthContent() {
  const { data: courses } = useDocuments({
    documentType: "course",
    projectId,
    dataset,
  });
  const { data: modules } = useDocuments({
    documentType: "module",
    projectId,
    dataset,
  });
  const { data: lessons } = useDocuments({
    documentType: "lesson",
    projectId,
    dataset,
  });
  const { data: categories } = useDocuments({
    documentType: "category",
    projectId,
    dataset,
  });

  const checks = [
    {
      label: "Courses",
      passed: (courses?.length || 0) > 0,
      count: courses?.length || 0,
    },
    {
      label: "Modules",
      passed: (modules?.length || 0) > 0,
      count: modules?.length || 0,
    },
    {
      label: "Lessons",
      passed: (lessons?.length || 0) > 0,
      count: lessons?.length || 0,
    },
    {
      label: "Categories",
      passed: (categories?.length || 0) > 0,
      count: categories?.length || 0,
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const percentage = Math.round((passedCount / checks.length) * 100);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">
          {percentage}% Complete
        </span>
        <span className="text-xs text-slate-600">
          {passedCount}/{checks.length} checks
        </span>
      </div>
      <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="space-y-3">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {check.passed ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <Circle className="h-4 w-4 text-slate-700" />
              )}
              <span
                className={`text-sm ${check.passed ? "text-slate-300" : "text-slate-600"}`}
              >
                {check.label}
              </span>
            </div>
            <span
              className={`text-xs font-mono ${check.passed ? "text-slate-500" : "text-slate-700"}`}
            >
              {check.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const QUICK_LINKS = [
  {
    label: "Courses",
    desc: "Create and manage courses",
    href: "/admin/courses",
    icon: BookOpen,
    accent: "text-blue-600",
  },
  {
    label: "Modules",
    desc: "Organize course modules",
    href: "/admin/modules",
    icon: Layers,
    accent: "text-blue-400",
  },
  {
    label: "Lessons",
    desc: "Edit lesson content",
    href: "/admin/lessons",
    icon: PlayCircle,
    accent: "text-emerald-400",
  },
  {
    label: "Categories",
    desc: "Manage content categories",
    href: "/admin/categories",
    icon: Tag,
    accent: "text-amber-400",
  },
];

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Categories",
    desc: "Create categories to organize courses by topic",
  },
  {
    step: "02",
    title: "Lessons",
    desc: "Build individual lessons with video and text content",
  },
  {
    step: "03",
    title: "Modules",
    desc: "Group related lessons into structured modules",
  },
  {
    step: "04",
    title: "Courses",
    desc: "Assemble modules into a complete course curriculum",
  },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Overview of your content management system
          </p>
        </div>
        <Link href="/studio" target="_blank">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open Studio
          </button>
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.documentType} {...card} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-5">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="group">
                  <div className="rounded-xl bg-white border border-slate-200 p-4 hover:bg-slate-50 hover:border-slate-200 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${item.accent} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 group-hover:text-slate-900 transition-colors">
                          {item.label}
                        </p>
                        <p className="text-xs text-slate-600 truncate">
                          {item.desc}
                        </p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-700 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            Content Health
          </h2>
          <div className="rounded-xl bg-white border border-slate-200 p-5">
            <Suspense
              fallback={
                <div className="space-y-4">
                  <Skeleton className="h-1.5 w-full bg-slate-50 rounded-full" />
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Skeleton className="h-4 w-4 bg-slate-50 rounded-full" />
                      <Skeleton className="h-4 w-24 bg-slate-50 rounded" />
                    </div>
                  ))}
                </div>
              }
            >
              <ContentHealthContent />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          Recommended Workflow
        </h2>
        <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            {WORKFLOW_STEPS.map((item) => (
              <div key={item.step} className="p-5 group">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                  Step {item.step}
                </span>
                <h3 className="text-sm font-medium text-white mt-2 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
