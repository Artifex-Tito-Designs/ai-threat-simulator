export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex items-center gap-3 text-slate-500 text-sm">
        <div className="w-5 h-5 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin" />
        Loading...
      </div>
    </div>
  );
}
