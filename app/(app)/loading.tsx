import LoadingSpinner from "@/components/LoadingSpinner";

function Loading() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-500/8 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div
          className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {}
      <div className="relative z-10">
        <LoadingSpinner text="Loading..." isFullScreen size="lg" />
      </div>
    </div>
  );
}

export default Loading;
