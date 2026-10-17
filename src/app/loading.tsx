export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800" />
          <div className="absolute inset-0 rounded-full border-4 border-[#00AEEF] border-t-transparent animate-spin" />
        </div>
        <p className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
          Loading CVET...
        </p>
      </div>
    </div>
  );
}
