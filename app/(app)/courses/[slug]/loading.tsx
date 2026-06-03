import { Skeleton } from "@/components/ui/skeleton";

function Loading() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden">
      {}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div
          className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-cyan-400/5 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl bg-slate-200" />
          <div className="flex flex-col gap-1">
            <Skeleton className="w-16 h-4 bg-slate-200" />
            <Skeleton className="w-12 h-2 bg-slate-200" />
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Skeleton className="w-28 h-9 rounded-lg bg-slate-200" />
          <Skeleton className="w-28 h-9 rounded-lg bg-slate-200" />
          <Skeleton className="w-24 h-9 rounded-lg bg-slate-200" />
        </div>
        <Skeleton className="w-9 h-9 rounded-full bg-slate-200" />
      </nav>

      {}
      <main className="relative z-10 px-6 lg:px-12 py-8 max-w-7xl mx-auto">
        {}
        <div className="mb-8">
          <Skeleton className="h-5 w-36 bg-slate-200 rounded" />
        </div>

        {}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {}
          <Skeleton className="w-full md:w-72 h-48 rounded-2xl bg-slate-200 shrink-0" />

          {}
          <div className="flex-1 space-y-4">
            {}
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-16 rounded-full bg-slate-200" />
              <Skeleton className="h-7 w-28 rounded-full bg-slate-200" />
            </div>

            {}
            <Skeleton className="h-10 w-full max-w-lg bg-slate-200 rounded-lg" />

            {}
            <div className="space-y-2">
              <Skeleton className="h-5 w-full bg-slate-200 rounded" />
              <Skeleton className="h-5 w-3/4 bg-slate-200 rounded" />
            </div>

            {}
            <div className="flex items-center gap-6 pt-2">
              <Skeleton className="h-5 w-24 bg-slate-200 rounded" />
              <Skeleton className="h-5 w-20 bg-slate-200 rounded" />
            </div>
          </div>
        </div>

        {}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {}
              <Skeleton className="w-14 h-14 rounded-full bg-slate-200" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-28 bg-slate-200 rounded" />
                <Skeleton className="h-4 w-36 bg-slate-200 rounded" />
              </div>
            </div>
            <Skeleton className="h-10 w-44 rounded-lg bg-slate-200" />
          </div>
        </div>

        {}
        <Skeleton className="h-8 w-40 bg-slate-200 rounded mb-6" />

        {}
        <div className="space-y-4">
          {["module-1", "module-2", "module-3"].map((id) => (
            <div
              key={id}
              className="rounded-xl bg-slate-50 border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {}
                  <Skeleton className="w-10 h-10 rounded-lg bg-slate-200" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-16 bg-slate-200 rounded" />
                    <Skeleton className="h-5 w-48 bg-slate-200 rounded" />
                    <Skeleton className="h-4 w-36 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {}
                  <Skeleton className="w-32 h-2 rounded-full bg-slate-200 hidden sm:block" />
                  {}
                  <Skeleton className="w-6 h-6 bg-slate-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Loading;
