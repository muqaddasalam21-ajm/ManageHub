import { supabaseServer, isSupabaseConfigured } from '../config/supabase';
import { TaskRecord } from '../types';
import { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from '../validators/taskValidator';

export class ServiceError extends Error {
  public code: string;
  public statusCode: number;

  constructor(code: string, message: string, statusCode: number = 400) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ServiceError.prototype);
  }
}

export class TaskService {
  /**
   * Retrieves all tasks owned exclusively by the authenticated user.
   * Supports optional status and priority query filtering.
   */
  public static async getTasks(userId: string, filter?: TaskQueryInput): Promise<TaskRecord[]> {
    if (!isSupabaseConfigured()) {
      throw new ServiceError(
        'SERVICE_UNAVAILABLE',
        'Database service is pending live Supabase configuration in environment variables.',
        503
      );
    }

    let query = supabaseServer
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filter?.status) {
      query = query.eq('status', filter.status);
    }
    if (filter?.priority) {
      query = query.eq('priority', filter.priority);
    }

    const { data, error } = await query;

    if (error) {
      throw new ServiceError('DATABASE_ERROR', error.message, 500);
    }

    return (data as TaskRecord[]) || [];
  }

  /**
   * Retrieves a single task by ID, enforcing that the record belongs to the authenticated user.
   */
  public static async getTaskById(userId: string, taskId: string): Promise<TaskRecord> {
    if (!isSupabaseConfigured()) {
      throw new ServiceError(
        'SERVICE_UNAVAILABLE',
        'Database service is pending live Supabase configuration in environment variables.',
        503
      );
    }

    const { data, error } = await supabaseServer
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new ServiceError('NOT_FOUND', 'Task not found or access denied', 404);
    }

    return data as TaskRecord;
  }

  /**
   * Creates a new task bound strictly to the authenticated user's ID.
   */
  public static async createTask(userId: string, input: CreateTaskInput): Promise<TaskRecord> {
    if (!isSupabaseConfigured()) {
      throw new ServiceError(
        'SERVICE_UNAVAILABLE',
        'Database service is pending live Supabase configuration in environment variables.',
        503
      );
    }

    const { data, error } = await supabaseServer
      .from('tasks')
      .insert({
        user_id: userId,
        title: input.title,
        description: input.description ?? '',
        status: input.status,
        priority: input.priority,
        due_date: input.due_date ?? null,
      })
      .select()
      .single();

    if (error) {
      throw new ServiceError('DATABASE_ERROR', error.message, 500);
    }

    return data as TaskRecord;
  }

  /**
   * Updates an existing task, strictly requiring matching task ID and user ID.
   */
  public static async updateTask(userId: string, taskId: string, input: UpdateTaskInput): Promise<TaskRecord> {
    if (!isSupabaseConfigured()) {
      throw new ServiceError(
        'SERVICE_UNAVAILABLE',
        'Database service is pending live Supabase configuration in environment variables.',
        503
      );
    }

    // Verify task exists and is owned by authenticated user
    await this.getTaskById(userId, taskId);

    const { data, error } = await supabaseServer
      .from('tasks')
      .update(input)
      .eq('id', taskId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new ServiceError('DATABASE_ERROR', error?.message || 'Failed to update task', 500);
    }

    return data as TaskRecord;
  }

  /**
   * Deletes a task, strictly requiring matching task ID and user ID.
   */
  public static async deleteTask(userId: string, taskId: string): Promise<{ id: string }> {
    if (!isSupabaseConfigured()) {
      throw new ServiceError(
        'SERVICE_UNAVAILABLE',
        'Database service is pending live Supabase configuration in environment variables.',
        503
      );
    }

    // Verify task exists and is owned by authenticated user
    await this.getTaskById(userId, taskId);

    const { error } = await supabaseServer
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId);

    if (error) {
      throw new ServiceError('DATABASE_ERROR', error.message, 500);
    }

    return { id: taskId };
  }
}
