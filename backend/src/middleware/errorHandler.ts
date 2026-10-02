import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
import { ServiceError } from '../services/taskService';

/**
 * Centralized Express Error Handling Middleware
 * Ensures all unexpected failures or domain exceptions are captured,
 * formatted into standardized JSON envelopes, and prevents leaking raw server stack traces.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // If it's a domain ServiceError with explicit status and code
  if (err instanceof ServiceError) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
      }
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Generic fallback
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const response: ApiResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected internal server error occurred',
    }
  };

  res.status(statusCode).json(response);
};
