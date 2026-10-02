'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TaskRecord, TaskFilter, CreateTaskPayload, UpdateTaskPayload } from '../../types/task';
import { taskApi, ApiClientError } from '../../services/taskApi';
import { TaskCard } from './TaskCard';
import { TaskFilters } from './TaskFilters';
import { TaskModal } from './TaskModal';

interface TaskListProps {
  token?: string | null;
  isAuthenticated: boolean;
  isConfigured: boolean;
  userEmail?: string | null;
}

export const TaskList: React.FC<TaskListProps> = ({
  token,
  isAuthenticated,
  isConfigured,
  userEmail,
}) => {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [filter, setFilter] = useState<TaskFilter>({
    status: 'all',
    priority: 'all',
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<TaskRecord | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Deletion confirm state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /**
   * Fetch tasks from backend REST API
   */
  const loadTasks = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setTasks([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await taskApi.getTasks(filter, token);
      setTasks(data);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        if (err.statusCode === 401) {
          setError('Your session has expired or is invalid. Please sign in again.');
        } else if (err.code === 'SERVICE_UNAVAILABLE') {
          setError('Backend reports database service is unavailable (pending live Supabase configuration).');
        } else {
          setError(err.message);
        }
      } else {
        const message = err instanceof Error ? err.message : 'Failed to retrieve tasks.';
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [filter, token, isAuthenticated]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Handler for Create / Update
  const handleModalSubmit = async (payload: CreateTaskPayload | UpdateTaskPayload) => {
    if (!token) return;
    setSubmitting(true);
    setModalError(null);

    try {
      if (selectedTask) {
        await taskApi.updateTask(selectedTask.id, payload as UpdateTaskPayload, token);
      } else {
        await taskApi.createTask(payload as CreateTaskPayload, token);
      }
      setIsModalOpen(false);
      setSelectedTask(null);
      await loadTasks();
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setModalError(err.message);
      } else {
        const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
        setModalError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handler for Delete
  const handleDelete = async (id: string, title: string) => {
    if (!token) return;

    const confirmed = window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`);
    if (!confirmed) return;

    setDeletingId(id);
    setError(null);

    try {
      await taskApi.deleteTask(id, token);
      await loadTasks();
    } catch (err: unknown) {
      const msg = err instanceof ApiClientError ? err.message : 'Failed to delete task.';
      setError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const openCreateModal = () => {
    setSelectedTask(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: TaskRecord) => {
    setSelectedTask(task);
    setModalError(null);
    setIsModalOpen(true);
  };

  // 1. Unconfigured State
  if (!isConfigured) {
    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-8 text-center max-w-2xl mx-auto shadow-sm">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-4 font-semibold text-lg">
          !
        </div>
        <h2 className="text-xl font-bold text-amber-900 mb-2">Live Supabase Project Required</h2>
        <p className="text-sm text-amber-800 mb-4 max-w-lg mx-auto">
          The frontend task integration communicates with the Node.js/Express REST API using verified Supabase Bearer JWTs. To enable live authentication and task management, configure your Supabase project credentials in <code>frontend/.env.local</code> and <code>backend/.env</code>.
        </p>
        <div className="inline-block text-left text-xs text-amber-800/90 font-mono bg-white/80 p-3 rounded-lg border border-amber-200">
          NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co<br />
          NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
        </div>
      </section>
    );
  }

  // 2. Unauthenticated State
  if (!isAuthenticated) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center max-w-2xl mx-auto shadow-sm">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mb-4 font-semibold text-lg">
          &#x1F512;
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h2>
        <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
          Personal tasks are strictly protected by user identity. Please sign in with an authenticated session to manage your tasks.
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-left max-w-md mx-auto space-y-1">
          <div className="font-semibold text-slate-700">Security Architecture Notice:</div>
          <div>• Requests are routed to Node.js / Express <code>/api/v1/tasks</code>.</div>
          <div>• User identity is derived strictly from cryptographic Bearer JWTs.</div>
          <div>• Direct browser-to-database bypass is prohibited.</div>
        </div>
      </section>
    );
  }

  // 3. Authenticated Task Management Experience
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Your Tasks</h2>
          <p className="text-sm text-slate-500">
            Authenticated as <span className="font-medium text-slate-700">{userEmail || 'Active User'}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          disabled={loading || submitting}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 inline-flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> New Task
        </button>
      </div>

      {/* Filters Toolbar */}
      <TaskFilters filter={filter} onChange={setFilter} disabled={loading} />

      {/* Global Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold mb-0.5">Operation Notice:</div>
            <div>{error}</div>
          </div>
          <button
            type="button"
            onClick={loadTasks}
            className="text-xs font-semibold text-rose-700 underline hover:text-rose-900 flex-shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="py-16 text-center" aria-live="polite">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-slate-500 font-medium">Loading tasks from backend...</p>
        </div>
      ) : tasks.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-3 text-lg font-bold">
            &#x270E;
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">No tasks yet. Create your first task.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
            {filter.status !== 'all' || filter.priority !== 'all'
              ? 'No tasks match the selected filter criteria. Try resetting filters or adding a new task.'
              : 'Keep track of your items, priorities, and deadlines in one central workspace.'}
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Create Task
          </button>
        </div>
      ) : (
        /* Task Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <div key={task.id} className={deletingId === task.id ? 'opacity-40 pointer-events-none' : ''}>
              <TaskCard task={task} onEdit={openEditModal} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleModalSubmit}
        task={selectedTask}
        submitting={submitting}
        error={modalError}
      />
    </div>
  );
};
