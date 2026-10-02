export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Week 3: Foundation Initialized
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-3">
          Task Management System
        </h1>
        <p className="text-base text-slate-600 mb-6">
          Full-Stack Web App with Auth & Database (CRUD) — Next.js, React, TailwindCSS, and TypeScript integration active.
        </p>
        <div className="grid grid-cols-2 gap-4 text-left border-t border-slate-100 pt-6 text-sm text-slate-700">
          <div>
            <span className="font-semibold text-slate-900">Frontend Tier:</span> Next.js 14 / TailwindCSS
          </div>
          <div>
            <span className="font-semibold text-slate-900">Backend Tier:</span> Express / TypeScript
          </div>
          <div>
            <span className="font-semibold text-slate-900">Database Tier:</span> Supabase / PostgreSQL
          </div>
          <div>
            <span className="font-semibold text-slate-900">Current Phase:</span> Week 3 Tool Integration
          </div>
        </div>
      </div>
    </main>
  );
}
