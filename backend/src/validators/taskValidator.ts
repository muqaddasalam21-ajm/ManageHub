import { z } from 'zod';

/**
 * Permitted status and priority domains
 */
export const TaskStatusEnum = z.enum(['pending', 'in_progress', 'completed']);
export const TaskPriorityEnum = z.enum(['low', 'medium', 'high', 'urgent']);

export type TaskStatus = z.infer<typeof TaskStatusEnum>;
export type TaskPriority = z.infer<typeof TaskPriorityEnum>;

/**
 * Schema for Task Creation (POST /api/v1/tasks)
 * STRICT: Rejects any unrecognized or forbidden fields (e.g., id, user_id, created_at, updated_at).
 */
export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty')
    .max(255, 'Title must not exceed 255 characters'),
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional()
    .default(''),
  status: TaskStatusEnum.default('pending'),
  priority: TaskPriorityEnum.default('medium'),
  due_date: z
    .string()
    .datetime({ message: 'due_date must be a valid ISO 8601 datetime string' })
    .nullable()
    .optional(),
}).strict();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

/**
 * Schema for Task Modification (PUT /api/v1/tasks/:id)
 * STRICT: Rejects any unrecognized or forbidden fields.
 * Refined to ensure at least one editable field is provided.
 */
export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty')
    .max(255, 'Title must not exceed 255 characters')
    .optional(),
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional(),
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  due_date: z
    .string()
    .datetime({ message: 'due_date must be a valid ISO 8601 datetime string' })
    .nullable()
    .optional(),
}).strict().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Update payload must contain at least one field to update' }
);

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

/**
 * Schema for Task Query Filtering (GET /api/v1/tasks)
 */
export const taskQuerySchema = z.object({
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
}).strict();

export type TaskQueryInput = z.infer<typeof taskQuerySchema>;

/**
 * UUID path parameter validation schema
 */
export const uuidParamSchema = z.object({
  id: z.string().uuid({ message: 'Task ID must be a valid UUID' }),
});
