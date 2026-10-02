'use client';

import React from 'react';
import { useAuth } from '../lib/useAuth';
import { TaskList } from '../components/tasks/TaskList';

export default function HomePage() {
  const { user, token, loading, isConfigured } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
      {/* Top Application Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              M
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                ManageHub
              </h1>
              <p className="text-xs text-slate-500">
                Task Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Week 3: Integration Active
            </span>

            {user ? (
              <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                {user.email}
              </span>
            ) : (
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                Guest Mode
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Architecture & Milestone Ribbon */}
        <section className="mb-8 rounded-xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
                Full-Stack Web App with Auth &amp; Database (CRUD)
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Frontend Task Management Integration
              </h2>
              <p className="text-sm text-indigo-200 mt-1 max-w-2xl">
                REST API client connected to Express backend <code className="text-white bg-white/20 px-1.5 py-0.5 rounded text-xs font-mono">/api/v1/tasks</code> with strict anti-IDOR authentication scoping.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-white/10 rounded-md border border-white/10">Next.js 14</span>
              <span className="px-2.5 py-1 bg-white/10 rounded-md border border-white/10">Express REST</span>
              <span className="px-2.5 py-1 bg-white/10 rounded-md border border-white/10">Supabase Auth</span>
              <span className="px-2.5 py-1 bg-white/10 rounded-md border border-white/10">PostgreSQL RLS</span>
            </div>
          </div>
        </section>

        {/* Task Management Section */}
        {loading ? (
          <div className="py-20 text-center" aria-live="polite">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-slate-500">Checking authentication session...</p>
          </div>
        ) : (
          <TaskList
            token={token}
            isAuthenticated={Boolean(user && token)}
            isConfigured={isConfigured}
            userEmail={user?.email}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ManageHub &bull; 4-Week Software Engineering Project</span>
          <span className="text-slate-400">Strict Layered Architecture &bull; Zero Backend Bypass</span>
        </div>
      </footer>
    </div>
  );
}
