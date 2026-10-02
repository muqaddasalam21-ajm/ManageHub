'use client';

import React from 'react';
import { TaskRecord, TaskStatus, TaskPriority } from '../../types/task';

interface TaskCardProps {
  task: TaskRecord;
  onEdit: (task: TaskRecord) => void;
  onDelete: (id: string, title: string) => void;
}

const statusBadgeStyles: Record<TaskStatus, { bg: string; text: string; label: string }> = {
  pending: {
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
    label: 'Pending',
  },
  in_progress: {
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-700',
    label: 'In Progress',
  },
  completed: {
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
    label: 'Completed',
  },
};

const priorityBadgeStyles: Record<TaskPriority, { bg: string; text: string; label: string }> = {
  low: {
    bg: 'bg-slate-100 border-slate-200',
    text: 'text-slate-700',
    label: 'Low',
  },
  medium: {
    bg: 'bg-sky-50 border-sky-200',
    text: 'text-sky-700',
    label: 'Medium',
  },
  high: {
    bg: 'bg-orange-50 border-orange-200',
    text: 'text-orange-700',
    label: 'High',
  },
  urgent: {
    bg: 'bg-rose-50 border-rose-200',
    text: 'text-rose-700',
    label: 'Urgent',
  },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const statusInfo = statusBadgeStyles[task.status] || statusBadgeStyles.pending;
  const priorityInfo = priorityBadgeStyles[task.priority] || priorityBadgeStyles.medium;

  const formattedDueDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  const formattedCreatedAt = new Date(task.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article
      className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
      aria-labelledby={`task-title-${task.id}`}
    >
      <div>
        {/* Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.bg} ${statusInfo.text}`}
            >
              {statusInfo.label}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityInfo.bg} ${priorityInfo.text}`}
            >
              {priorityInfo.label}
            </span>
          </div>

          {formattedDueDate && (
            <span className="text-xs text-slate-500 font-medium">
              Due: {formattedDueDate}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          id={`task-title-${task.id}`}
          className="text-lg font-semibold text-slate-900 mb-2 break-words"
        >
          {task.title}
        </h3>

        {/* Description */}
        {task.description ? (
          <p className="text-sm text-slate-600 mb-4 whitespace-pre-wrap line-clamp-3">
            {task.description}
          </p>
        ) : (
          <p className="text-sm text-slate-400 italic mb-4">No description provided.</p>
        )}
      </div>

      {/* Footer Meta & Actions */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <span>Created {formattedCreatedAt}</span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="px-3 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label={`Edit task: ${task.title}`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id, task.title)}
            className="px-3 py-1.5 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400"
            aria-label={`Delete task: ${task.title}`}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};
