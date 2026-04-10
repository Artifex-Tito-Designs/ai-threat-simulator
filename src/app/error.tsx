'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-100 mb-2">Something went wrong</h2>
        <p className="text-sm text-slate-400 mb-4">
          {error.message || 'An unexpected error occurred while loading this page.'}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-md text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30
            hover:bg-blue-500/30 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
