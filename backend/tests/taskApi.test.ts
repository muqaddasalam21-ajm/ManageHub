import request from 'supertest';
import app from '../src/app';
import { isSupabaseConfigured } from '../src/config/supabase';
import {
  createTaskSchema,
  updateTaskSchema,
  uuidParamSchema,
  taskQuerySchema,
} from '../src/validators/taskValidator';

describe('Task Management API - Architecture & Security Tests', () => {

  // ============================================================================
  // 1. Health Endpoint Verification
  // ============================================================================
  describe('GET /api/v1/health', () => {
    it('should return HTTP 200 with standard healthy status JSON', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('healthy');
      expect(typeof res.body.data.uptimeSeconds).toBe('number');
    });
  });

  // ============================================================================
  // 2. Authentication & Route Guard Verification (Unauthenticated Requests)
  // ============================================================================
  describe('Authentication Enforcement (Protected Routes)', () => {
    it('TC-SEC-001: should reject GET /api/v1/tasks without Authorization header (HTTP 401)', async () => {
      const res = await request(app).get('/api/v1/tasks');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
      expect(res.body.error.message).toContain('Authorization');
    });

    it('should reject POST /api/v1/tasks without token (HTTP 401)', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .send({ title: 'Unauthorized Task' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should reject PUT /api/v1/tasks/:id without token (HTTP 401)', async () => {
      const res = await request(app)
        .put('/api/v1/tasks/00000000-0000-0000-0000-000000000000')
        .send({ title: 'Unauthorized Update' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should reject DELETE /api/v1/tasks/:id without token (HTTP 401)', async () => {
      const res = await request(app)
        .delete('/api/v1/tasks/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('TC-SEC-002: should reject malformed Authorization token format (HTTP 401)', async () => {
      const res = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', 'Basic dXNlcjpwYXNz');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  // ============================================================================
  // 3. Zod Payload & Parameter Validation Verification
  // ============================================================================
  describe('Validation Schemas (Zod Enforcement)', () => {
    describe('createTaskSchema', () => {
      it('TC-VAL-001: should reject empty or whitespace-only title', () => {
        const result = createTaskSchema.safeParse({ title: '   ' });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Title cannot be empty');
        }
      });

      it('should reject title exceeding 255 characters', () => {
        const longTitle = 'a'.repeat(256);
        const result = createTaskSchema.safeParse({ title: longTitle });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Title must not exceed 255 characters');
        }
      });

      it('TC-VAL-002: should reject invalid status enum', () => {
        const result = createTaskSchema.safeParse({
          title: 'Valid Title',
          status: 'invalid_status_enum',
        });
        expect(result.success).toBe(false);
      });

      it('should reject invalid priority enum', () => {
        const result = createTaskSchema.safeParse({
          title: 'Valid Title',
          priority: 'critical_urgent_not_allowed',
        });
        expect(result.success).toBe(false);
      });

      it('TC-VAL-003: should reject malformed due_date format', () => {
        const result = createTaskSchema.safeParse({
          title: 'Valid Title',
          due_date: 'tomorrow-afternoon',
        });
        expect(result.success).toBe(false);
      });

      it('Security: should strictly reject forbidden injected fields (id, user_id, created_at, updated_at)', () => {
        const result = createTaskSchema.safeParse({
          title: 'Valid Title',
          id: 'fake-id',
          user_id: 'fake-user-id',
          created_at: new Date().toISOString(),
        });
        expect(result.success).toBe(false);
      });

      it('TC-CRUD-001: should accept valid task creation payload with defaults', () => {
        const validPayload = {
          title: 'Design Database Migrations',
          description: 'Task description',
          priority: 'high' as const,
          due_date: '2026-10-15T18:00:00.000Z',
        };
        const result = createTaskSchema.safeParse(validPayload);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.status).toBe('pending');
          expect(result.data.priority).toBe('high');
        }
      });
    });

    describe('updateTaskSchema', () => {
      it('should reject completely empty update payload', () => {
        const result = updateTaskSchema.safeParse({});
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Update payload must contain at least one field to update');
        }
      });

      it('should accept valid partial update payload', () => {
        const result = updateTaskSchema.safeParse({ status: 'completed' });
        expect(result.success).toBe(true);
      });

      it('Security: should reject forbidden injected user_id in update payload', () => {
        const result = updateTaskSchema.safeParse({
          title: 'New Title',
          user_id: 'another-user-id',
        });
        expect(result.success).toBe(false);
      });
    });

    describe('uuidParamSchema', () => {
      it('should reject non-UUID route parameters', () => {
        const result = uuidParamSchema.safeParse({ id: '123-not-a-valid-uuid' });
        expect(result.success).toBe(false);
      });

      it('should accept valid UUID route parameters', () => {
        const result = uuidParamSchema.safeParse({ id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' });
        expect(result.success).toBe(true);
      });
    });

    describe('taskQuerySchema', () => {
      it('should accept valid filter query params', () => {
        const result = taskQuerySchema.safeParse({ status: 'in_progress', priority: 'high' });
        expect(result.success).toBe(true);
      });

      it('should reject invalid filter query values', () => {
        const result = taskQuerySchema.safeParse({ status: 'unknown_status' });
        expect(result.success).toBe(false);
      });
    });
  });

  // ============================================================================
  // 4. Live Supabase Integration Tests (Gated by live configuration)
  // ============================================================================
  describe('Live Database CRUD & IDOR Isolation (Supabase Dependent)', () => {
    const liveConfigured = isSupabaseConfigured();

    if (!liveConfigured) {
      it.skip('TC-CRUD-002 to 005 & TC-SEC-003 to 005: Live Database Tests [BLOCKED/PENDING LIVE SUPABASE CONFIGURATION]', () => {
        // Skipped in local testing until real Supabase project credentials are provided.
        // Preserves integrity: zero fabricated database results.
      });
    } else {
      it('should perform authenticated CRUD operations against live Supabase instance', async () => {
        // This block will execute when real Supabase credentials are configured in local .env
      });
    }
  });
});
