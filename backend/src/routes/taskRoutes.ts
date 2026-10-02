import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { requireAuth } from '../middleware/authMiddleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validateMiddleware';
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  uuidParamSchema,
} from '../validators/taskValidator';

const router = Router();

// Enforce authentication on all task endpoints
router.use(requireAuth);

// GET /api/v1/tasks - Retrieve user tasks with optional status/priority filtering
router.get(
  '/',
  validateQuery(taskQuerySchema),
  TaskController.getTasks
);

// POST /api/v1/tasks - Create a new task
router.post(
  '/',
  validateBody(createTaskSchema),
  TaskController.createTask
);

// GET /api/v1/tasks/:id - Retrieve a single task by ID
router.get(
  '/:id',
  validateParams(uuidParamSchema),
  TaskController.getTaskById
);

// PUT /api/v1/tasks/:id - Update an existing task
router.put(
  '/:id',
  validateParams(uuidParamSchema),
  validateBody(updateTaskSchema),
  TaskController.updateTask
);

// DELETE /api/v1/tasks/:id - Delete a task
router.delete(
  '/:id',
  validateParams(uuidParamSchema),
  TaskController.deleteTask
);

export default router;
