import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse, TaskRecord } from '../types';
import { TaskService, ServiceError } from '../services/taskService';

export class TaskController {
  /**
   * GET /api/v1/tasks
   * Retrieves all tasks owned by the authenticated user.
   */
  public static async getTasks(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const tasks = await TaskService.getTasks(userId, req.query);

      const response: ApiResponse<TaskRecord[]> = {
        success: true,
        data: tasks,
        message: 'Tasks retrieved successfully',
      };
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof ServiceError) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        };
        res.status(error.statusCode).json(response);
        return;
      }
      next(error);
    }
  }

  /**
   * GET /api/v1/tasks/:id
   * Retrieves a single task owned by the authenticated user.
   */
  public static async getTaskById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const taskId = req.params.id as string;
      const task = await TaskService.getTaskById(userId, taskId);

      const response: ApiResponse<TaskRecord> = {
        success: true,
        data: task,
      };
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof ServiceError) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        };
        res.status(error.statusCode).json(response);
        return;
      }
      next(error);
    }
  }

  /**
   * POST /api/v1/tasks
   * Creates a new task bound strictly to the authenticated user.
   */
  public static async createTask(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const task = await TaskService.createTask(userId, req.body);

      const response: ApiResponse<TaskRecord> = {
        success: true,
        data: task,
        message: 'Task created successfully',
      };
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof ServiceError) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        };
        res.status(error.statusCode).json(response);
        return;
      }
      next(error);
    }
  }

  /**
   * PUT /api/v1/tasks/:id
   * Updates an existing task owned by the authenticated user.
   */
  public static async updateTask(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const taskId = req.params.id as string;
      const updatedTask = await TaskService.updateTask(userId, taskId, req.body);

      const response: ApiResponse<TaskRecord> = {
        success: true,
        data: updatedTask,
        message: 'Task updated successfully',
      };
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof ServiceError) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        };
        res.status(error.statusCode).json(response);
        return;
      }
      next(error);
    }
  }

  /**
   * DELETE /api/v1/tasks/:id
   * Deletes a task owned by the authenticated user.
   */
  public static async deleteTask(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const taskId = req.params.id as string;
      const result = await TaskService.deleteTask(userId, taskId);

      const response: ApiResponse<{ id: string }> = {
        success: true,
        data: result,
        message: 'Task deleted successfully',
      };
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof ServiceError) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        };
        res.status(error.statusCode).json(response);
        return;
      }
      next(error);
    }
  }
}
