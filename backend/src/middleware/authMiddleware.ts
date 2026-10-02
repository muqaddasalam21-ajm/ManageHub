import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types';
import { supabaseServer, isSupabaseConfigured } from '../config/supabase';

/**
 * Authentication Middleware
 * Validates the JWT Bearer token supplied in the Authorization header.
 * 
 * SECURITY RULES:
 * 1. User identity is derived strictly from the cryptographically verified Supabase JWT.
 * 2. User ID passed in request body or headers is NEVER accepted as proof of identity.
 * 3. Missing, expired, or malformed tokens are immediately rejected with HTTP 401.
 */
export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing or malformed Authorization header. Expected: Bearer <token>'
      }
    };
    res.status(401).json(response);
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Bearer token not provided'
      }
    };
    res.status(401).json(response);
    return;
  }

  // Check if Supabase credentials are configured
  if (!isSupabaseConfigured()) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'AUTH_SERVICE_UNAVAILABLE',
        message: 'Authentication service is pending live Supabase configuration in environment variables.'
      }
    };
    res.status(401).json(response);
    return;
  }

  try {
    // Verify token cryptographically with Supabase Auth engine
    const { data: { user }, error } = await supabaseServer.auth.getUser(token);

    if (error || !user) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: error?.message || 'Invalid, expired, or revoked authentication token'
        }
      };
      res.status(401).json(response);
      return;
    }

    // Attach verified identity to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Token verification failed';
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: errorMessage
      }
    };
    res.status(401).json(response);
  }
};
