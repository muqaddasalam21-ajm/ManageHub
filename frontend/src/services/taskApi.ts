import {
  TaskRecord,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskFilter,
  ApiResponse,
} from '../types/task';

/**
 * Standardized API client error carrying HTTP status and backend envelope code
 */
export class ApiClientError extends Error {
  public statusCode: number;
  public code: string;
  public details?: unknown;

  constructor(message: string, statusCode: number = 500, code: string = 'CLIENT_ERROR', details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
).replace(/\/$/, '');

/**
 * Helper to construct standard request headers
 */
const getHeaders = (token?: string): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Unified request executor with robust error translation
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, options);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown network failure';
    throw new ApiClientError(
      `Unable to connect to backend server at ${API_BASE_URL}. Please ensure the backend is running. (${message})`,
      0,
      'NETWORK_UNAVAILABLE'
    );
  }

  let body: ApiResponse<T> | null = null;
  try {
    body = await response.json();
  } catch {
    // If response was not JSON (e.g., standard proxy 502/503 HTML or empty response)
    if (!response.ok) {
      throw new ApiClientError(
        `Backend service responded with HTTP status ${response.status} (${response.statusText})`,
        response.status,
        `HTTP_${response.status}`
      );
    }
  }

  if (!response.ok || (body && !body.success)) {
    const errorMessage = body?.error?.message || `Request failed with HTTP status ${response.status}`;
    const errorCode = body?.error?.code || `HTTP_${response.status}`;
    const errorDetails = body?.error?.details;
    throw new ApiClientError(errorMessage, response.status, errorCode, errorDetails);
  }

  return (body?.data as T) ?? ({} as T);
}

/**
 * Task Management REST API Client Service
 * Communicates exclusively with Express backend /api/v1/tasks.
 */
export const taskApi = {
  /**
   * GET /api/v1/tasks
   * Retrieves all tasks owned by the authenticated user with optional filtering.
   */
  async getTasks(filter?: TaskFilter, token?: string): Promise<TaskRecord[]> {
    const params = new URLSearchParams();

    if (filter?.status && filter.status !== 'all') {
      params.append('status', filter.status);
    }
    if (filter?.priority && filter.priority !== 'all') {
      params.append('priority', filter.priority);
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    return request<TaskRecord[]>(`/tasks${query}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
  },

  /**
   * GET /api/v1/tasks/:id
   * Retrieves a single task owned by the authenticated user.
   */
  async getTaskById(id: string, token?: string): Promise<TaskRecord> {
    return request<TaskRecord>(`/tasks/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
  },

  /**
   * POST /api/v1/tasks
   * Creates a new task. The backend infers ownership from the Bearer token.
   */
  async createTask(payload: CreateTaskPayload, token?: string): Promise<TaskRecord> {
    return request<TaskRecord>('/tasks', {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    });
  },

  /**
   * PUT /api/v1/tasks/:id
   * Updates an existing task owned by the authenticated user.
   */
  async updateTask(id: string, payload: UpdateTaskPayload, token?: string): Promise<TaskRecord> {
    return request<TaskRecord>(`/tasks/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    });
  },

  /**
   * DELETE /api/v1/tasks/:id
   * Deletes a task owned by the authenticated user.
   */
  async deleteTask(id: string, token?: string): Promise<{ id: string }> {
    return request<{ id: string }>(`/tasks/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
  },
};
