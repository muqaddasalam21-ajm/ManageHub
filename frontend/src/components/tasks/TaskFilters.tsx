'use client';

import React from 'react';
import { TaskFilter, TaskStatus, TaskPriority } from '../../types/task';

interface TaskFiltersProps {
  filter: TaskFilter;
  onChange: (newFilter: TaskFilter) => void;
  disabled?: boolean;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ filter, onChange, disabled }) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...filter,
      status: e.target.value as TaskStatus | 'all',
    });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...filter,
      priority: e.target.value as TaskPriority | 'all',
    });
  };

  const handleReset = () => {
    onChange({
      status: 'all',
      priority: 'all',
    });
  };

  const isFiltered = (filter.status && filter.status !== 'all') || (filter.priority && filter.priority !== 'all');

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-sm font-medium text-slate-700">
            Status:
          </label>
          <select
            id="status-filter"
            value={filter.status || 'all'}
            onChange={handleStatusChange}
            disabled={disabled}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="priority-filter" className="text-sm font-medium text-slate-700">
            Priority:
          </label>
          <select
            id="priority-filter"
            value={filter.priority || 'all'}
            onChange={handlePriorityChange}
            disabled={disabled}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {isFiltered && (
        <button
          type="button"
          onClick={handleReset}
          disabled={disabled}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline focus:outline-none disabled:opacity-50"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};
