# Core Framework Draft: Operational & Technical Architecture

**Document Type:** Technical Architecture & Operational Framework Specification  
**Project Title:** Full-Stack Web App with Auth & Database (CRUD)  
**Lifecycle Stage:** Week 2 — Framework & Workflow Design  
**Deliverable Classification:** Milestone 2 Core Deliverable 1 (`documentation/framework-draft.md`)  
**Status:** **PLANNED ARCHITECTURE DRAFT — PENDING MENTOR / EVALUATOR APPROVAL**  

---

## 1. Framework Purpose

The purpose of this Core Framework Draft is to satisfy the first primary objective of **Week 2**: *"Design primary operational framework and Node.js / Express / Supabase / PostgreSQL workflows."*

This document translates the foundational scope from Week 1 and the concept planning from `documentation/week-2-framework-plan.md` into an exhaustive technical blueprint. It formalizes:
- The decoupled client-server architectural boundaries.
- The layered backend structure (Routes, Middlewares, Controllers, Services).
- The relational PostgreSQL data model and Row Level Security (RLS) policies.
- The formal REST API contract schemas and error handling envelopes.
- The end-to-end data lifecycle for the Task Management System.

> [!IMPORTANT]
> **Implementation Status Disclosure:** This is a **DESIGN AND SPECIFICATION DOCUMENT ONLY**. All components, interfaces, routes, database tables, and validation schemas detailed herein are **PLANNED / NOT YET IMPLEMENTED**. In strict accordance with the 4-week roadmap, no application code has been generated, no database tables have been instantiated, and no npm packages have been installed.

---

## 2. Application Architecture

The system utilizes a decoupled, three-tier architecture ensuring strict separation of concerns, independent maintainability, and clean network boundaries:

```text
+-----------------------------------------------------------------------------------------+
|                                    PRESENTATION TIER                                    |
|                                                                                         |
|   +---------------------------------------------------------------------------------+   |
|   |                          Next.js / React Web Client                             |   |
|   |   - Pages: Landing (/), Login (/login), Register (/register), Tasks (/tasks)    |   |
|   |   - TypeScript Props & Shared Contract Interfaces                               |   |
|   |   - TailwindCSS Responsive Design & State Modifiers                             |   |
|   |   - Auth Context & Protected Route Client Guards                                |   |
|   |   - Fetch API Client with Bearer Token Injection                                |   |
|   +---------------------------------------------------------------------------------+   |
+--------------------------------------------┬--------------------------------------------+
                                             │
                          HTTPS / REST (JSON)│ [Headers: Authorization: Bearer <JWT>]
                                             ▼
+-----------------------------------------------------------------------------------------+
|                                    APPLICATION TIER                                     |
|                                                                                         |
|   +---------------------------------------------------------------------------------+   |
|   |                            Node.js / Express Server                             |   |
|   |                                                                                 |   |
|   |   [CORS Whitelist] ──> [JSON Body Parser] ──> [Request Logger]                  |   |
|   |                                                      │                          |   |
|   |                                                      ▼                          |   |
|   |   [Auth Middleware (JWT Verify)] ──> [Payload Validation (Zod Schemas)]         |   |
|   |                                                      │                          |   |
|   |                                                      ▼                          |   |
|   |   [Task Controller] ───────────────> [Task Service (Business Rules & IDOR)]     |   |
|   |                                                      │                          |   |
|   |   [Centralized Error Handler] <──────────────────────┘ (Catches all exceptions) |   |
|   +----------------------------------------┬----------------------------------------+   |
+--------------------------------------------┼--------------------------------------------+
                                             │
                        TCP / TLS Connection │ Supabase JavaScript SDK / PostgreSQL Client
                                             ▼
+-----------------------------------------------------------------------------------------+
|                                   PERSISTENCE TIER                                      |
|                                                                                         |
|   +----------------------------------------+   +------------------------------------+   |
|   |           Supabase Auth                |   |          PostgreSQL 15+            |   |
|   |   - Identity Management (`auth.users`) |   |   - Table: `public.tasks`          |   |
|   |   - Salted Hashing (bcrypt/Argon2)     |   |   - Foreign Key Cascades           |   |
|   |   - Cryptographic JWT Issuance         |   |   - B-Tree Indexes (user_id, date) |   |
|   |   - Token Revocation / Refresh Engine  |   |   - Row Level Security (RLS)       |   |
|   +----------------------------------------+   +------------------------------------+   |
+-----------------------------------------------------------------------------------------+
```

---

## 3. Frontend Framework

### 3.1 Technology Composition
- **Next.js 14+ (App/Pages Router):** Delivers fast routing, layout composability, and clean navigation guards.
- **TypeScript:** Enforces end-to-end type safety for components, forms, API responses, and custom hooks.
- **TailwindCSS:** Provides atomic, responsive utility classes eliminating external CSS bloat and guaranteeing uniform design tokens.

### 3.2 Page & Component Hierarchy
```text
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx             # Brand header, auth status indicator, sign-out button
│   │   ├── Footer.tsx             # Project metadata, roadmap links
│   │   └── ProtectedLayout.tsx    # Auth guard container evaluating session state
│   ├── tasks/
│   │   ├── TaskTable.tsx          # Responsive tabular list for desktop viewports
│   │   ├── TaskCard.tsx           # Compact card representation for mobile viewports
│   │   ├── TaskControlBar.tsx     # Search input, status dropdown, priority dropdown, "New Task" button
│   │   ├── TaskModal.tsx          # Modal dialog supporting both Create and Edit modes
│   │   ├── TaskBadge.tsx          # Status ('pending', 'in_progress', 'completed') & Priority badges
│   │   └── DeleteDialog.tsx       # Destructive action confirmation modal
│   └── ui/
│       ├── Button.tsx             # Primary, secondary, outline, destructive button variants
│       ├── Input.tsx              # Styled text/password inputs with validation error cues
│       ├── Select.tsx             # Styled dropdown selectors for enum values
│       └── Toast.tsx              # Success, error, and warning alert toasts
├── context/
│   └── AuthContext.tsx            # Global user session context, token distribution, and logout
├── hooks/
│   ├── useTasks.ts                # Custom hook for CRUD API operations, loading states, and error handling
│   └── useDebounce.ts             # Debouncing input values for search queries
└── pages/
    ├── index.tsx                  # Public project overview landing view
    ├── login.tsx                  # Public login form view
    ├── register.tsx               # Public registration form view
    └── tasks.tsx                  # Protected task management dashboard view
```

### 3.3 Client-Side Validation & State Flow
1. **Form Handling:** Forms manage local component state with immediate change validation (e.g., checking that `title` is not empty and `due_date` is a valid date).
2. **State Flow:**
   - On mount, `useTasks` initiates a `GET /api/v1/tasks` request via the API client.
   - While awaiting response, `loading = true` renders skeleton loaders.
   - Upon success, records are populated into `tasks: Task[]` state.
   - On form submission (Create/Update), the UI issues an asynchronous mutation. If successful, it performs an in-place state update or cache re-fetch and displays a success toast.
   - If the API returns an error envelope, `error = error.message` triggers an alert banner without breaking the view.

---

## 4. Backend Framework

### 4.1 Technology Composition
- **Node.js (LTS v18/v20):** High-throughput, non-blocking asynchronous JavaScript/TypeScript runtime.
- **Express Framework:** Minimalist HTTP routing, middleware pipeline orchestration, and controller mapping.
- **TypeScript:** Strict compilation (`"strict": true`) guaranteeing compile-time type safety across routes, controllers, and database interactions.

### 4.2 Layered Directory Structure (Planned for Week 3)
```text
server/
├── src/
│   ├── config/
│   │   ├── env.ts                 # Validated environment variable schema (Zod)
│   │   └── supabase.ts            # Initialized Supabase client instance
│   ├── controllers/
│   │   ├── authController.ts      # (Optional proxy auth or session verification)
│   │   └── taskController.ts      # HTTP request parsing, status codes, controller methods
│   ├── middlewares/
│   │   ├── authMiddleware.ts      # Bearer JWT verification against Supabase Auth
│   │   ├── validateMiddleware.ts  # Generic request body validation via Zod schemas
│   │   └── errorMiddleware.ts     # Centralized error mapping and exception safety
│   ├── models/
│   │   └── taskTypes.ts           # Shared TypeScript interfaces (Task, CreateTaskDTO, UpdateTaskDTO)
│   ├── routes/
│   │   ├── index.ts               # Root router mounting /api/v1 sub-routers
│   │   └── taskRoutes.ts          # Express Router defining /api/v1/tasks endpoints
│   ├── services/
│   │   └── taskService.ts         # Business logic, user ownership filtering, database calls
│   └── app.ts                     # Express app initialization, CORS, middleware assembly
└── tsconfig.json                  # TypeScript compiler configuration
```

### 4.3 Layer Responsibilities
- **Routes:** Map HTTP verb + URL to the middleware sequence and controller method.
- **Middlewares:** Enforce cross-cutting concerns: origin checks (CORS), token signature validation (Auth), schema enforcement (Validation).
- **Controllers:** Extract `req.user.id`, `req.params`, and `req.body`; invoke corresponding service methods; format standard JSON response envelopes with appropriate HTTP status codes.
- **Services:** Execute core business rules, enforce data isolation (`WHERE user_id = auth_user_id`), and execute queries against Supabase PostgreSQL.
- **Error Handling Middleware:** Intercepts all rejected promises from async routes via an `asyncHandler` wrapper, categorizes errors (e.g., Validation, Unauthorized, NotFound, Internal), and outputs sanitized JSON responses.

---

## 5. Authentication Framework

### 5.1 Registration Workflow
1. User submits email and password on `/register`.
2. Client checks password length (≥ 8 characters) and email regex.
3. Supabase Auth (`supabase.auth.signUp()`) encrypts password using salted bcrypt/Argon2 and stores identity in `auth.users`.
4. Returns created user object and initial JWT session.

### 5.2 Login Workflow
1. User submits email and password on `/login`.
2. Supabase Auth (`supabase.auth.signInWithPassword()`) verifies credentials against salted hash.
3. Returns active session containing `access_token` (JWT with user ID in `sub` claim) and `refresh_token`.

### 5.3 JWT & Session Lifecycle
- **Token Format:** Signed JSON Web Token (JWT) issued by Supabase Auth with HMAC-SHA256 or asymmetric key signature.
- **Storage:** Client maintains token in memory / secure browser session storage.
- **Transmission:** Frontend attaches header to every backend API request:  
  `Authorization: Bearer <jwt_access_token>`
- **Verification:** Express `authMiddleware` intercepts the request:
  - Extracts Bearer token from header.
  - Verifies signature using Supabase JWT secret or public keys.
  - Extracts `user.id` and populates `req.user = { id: payload.sub, email: payload.email }`.
  - Rejects missing, tampered, or expired tokens immediately with HTTP `401 Unauthorized`.

### 5.4 Protected Routes
- **Client Route Guard:** Next.js `ProtectedLayout` inspects `AuthContext`. If user is unauthenticated, navigates to `/login`.
- **Server Route Guard:** Express `authMiddleware` attached to `/api/v1/tasks/*`. Requests without valid tokens are halted at the middleware layer before touching controllers.

### 5.5 Logout Workflow
- User clicks "Sign Out".
- Client invokes `supabase.auth.signOut()`.
- Client purges local tokens, resets React state, and navigates to `/login`.

### 5.6 User Isolation (Anti-IDOR)
Every query executed in `taskService` automatically appends `AND user_id = req.user.id`. No client can access, alter, or delete tasks belonging to another user, even if they guess valid UUIDs.

---

## 6. Database Framework (Supabase / PostgreSQL)

### 6.1 Database Schema (Planned DDL)
The relational schema binds the `tasks` entity directly to Supabase's managed identity engine (`auth.users`):

```sql
-- Planned PostgreSQL Schema for Week 3 Execution
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    priority VARCHAR(50) NOT NULL DEFAULT 'medium',
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT status_domain_check CHECK (status IN ('pending', 'in_progress', 'completed')),
    CONSTRAINT priority_domain_check CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    CONSTRAINT title_length_check CHECK (char_length(trim(title)) > 0 AND char_length(title) <= 255)
);

-- Planned Indexes for Performance & Query Scoping
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON public.tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_due_date ON public.tasks(user_id, due_date);

-- Planned Trigger for Automatic updated_at Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### 6.2 Key Strategies & Constraints
- **Primary Key:** `UUID` generated via `gen_random_uuid()` to prevent sequential ID enumeration attacks.
- **Foreign Key:** `user_id` referencing `auth.users(id)` with `ON DELETE CASCADE` ensuring complete cleanup if an account is deleted.
- **Data Integrity Constraints:**
  - `CHECK` constraints on `status` and `priority` enforcing strict domain enums at the database engine level.
  - `CHECK` constraint ensuring `title` cannot be empty or purely whitespace.
- **Row Level Security (RLS) Policies (Defense-in-Depth):**
  ```sql
  ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Users can view own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

  CREATE POLICY "Users can delete own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);
  ```

---

## 7. CRUD Workflow

| Operation | User Interaction | Client API Call | Backend Route & Controller | Service & DB Action | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Create Task** | Clicks "New Task", completes modal form, submits. | `POST /api/v1/tasks` with JSON body + JWT | `taskRoutes.ts` → `validate(createTaskSchema)` → `createTaskController` | Validates body; inserts row into `tasks` with `user_id = req.user.id`. | Returns HTTP `201 Created` with new task object. UI updates task list. |
| **Read Tasks** | Navigates to `/tasks`, applies search/filters. | `GET /api/v1/tasks?status=...&search=...` + JWT | `taskRoutes.ts` → `getTasksController` | Queries `tasks` where `user_id = req.user.id` applying filter params. | Returns HTTP `200 OK` with `{ tasks: [...], totalCount: N }`. UI renders table. |
| **Update Task** | Clicks "Edit" icon, modifies fields or status, clicks "Save". | `PUT /api/v1/tasks/:id` with update body + JWT | `taskRoutes.ts` → `validate(updateTaskSchema)` → `updateTaskController` | Verifies `id` format; updates row matching `id` AND `user_id`. | Returns HTTP `200 OK` with updated task object. UI refreshes row. |
| **Delete Task** | Clicks "Delete" icon, confirms prompt in modal dialog. | `DELETE /api/v1/tasks/:id` + JWT | `taskRoutes.ts` → `deleteTaskController` | Deletes row matching `id` AND `user_id`. | Returns HTTP `200 OK` with deletion confirmation message. UI removes item. |

---

## 8. API Contract Draft

All REST endpoints operate under the base path `/api/v1`.

### 8.1 Endpoint Specifications

#### 1. Server Health Check
- **Endpoint:** `GET /api/v1/health`
- **Auth Required:** No (Public)
- **Purpose:** Verifies backend process availability.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "status": "healthy",
      "timestamp": "2026-10-01T21:09:00.000Z",
      "uptime": 124.5
    }
  }
  ```

#### 2. Get User Tasks (Read All / Filtered)
- **Endpoint:** `GET /api/v1/tasks`
- **Auth Required:** Yes (`Bearer <JWT>`)
- **Query Parameters:**
  - `status` (optional): `pending` | `in_progress` | `completed`
  - `priority` (optional): `low` | `medium` | `high` | `urgent`
  - `search` (optional): string (searches title/description)
  - `sortBy` (optional): `created_at` | `due_date` | `priority` | `title` (default: `created_at`)
  - `order` (optional): `asc` | `desc` (default: `desc`)
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "tasks": [
        {
          "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
          "userId": "b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
          "title": "Finalize Week 2 Deliverables",
          "description": "Complete framework draft and guidelines",
          "status": "in_progress",
          "priority": "high",
          "dueDate": "2026-10-07T18:00:00.000Z",
          "createdAt": "2026-10-01T20:00:00.000Z",
          "updatedAt": "2026-10-01T21:00:00.000Z"
        }
      ],
      "totalCount": 1
    }
  }
  ```

#### 3. Create Task (Create)
- **Endpoint:** `POST /api/v1/tasks`
- **Auth Required:** Yes (`Bearer <JWT>`)
- **Validation Rules:**
  - `title`: Required, string, 1 to 255 chars, non-whitespace.
  - `description`: Optional, string, max 2000 chars.
  - `status`: Optional, enum (`pending`, `in_progress`, `completed`), default: `pending`.
  - `priority`: Optional, enum (`low`, `medium`, `high`, `urgent`), default: `medium`.
  - `dueDate`: Optional, valid ISO 8601 string.
- **Request Body Example:**
  ```json
  {
    "title": "Set up PostgreSQL Migrations",
    "description": "Execute initial DDL script on Supabase",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-10-08T12:00:00.000Z"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "id": "c1ffbc99-9c0b-4ef8-bb6d-6bb9bd380b22",
      "userId": "b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
      "title": "Set up PostgreSQL Migrations",
      "description": "Execute initial DDL script on Supabase",
      "status": "pending",
      "priority": "high",
      "dueDate": "2026-10-08T12:00:00.000Z",
      "createdAt": "2026-10-01T21:05:00.000Z",
      "updatedAt": "2026-10-01T21:05:00.000Z"
    },
    "message": "Task created successfully"
  }
  ```

#### 4. Get Task by ID (Read One)
- **Endpoint:** `GET /api/v1/tasks/:id`
- **Auth Required:** Yes (`Bearer <JWT>`)
- **Parameters:** `id` must be a valid UUID.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { ...taskObject }
  }
  ```
- **Error Response (404 Not Found):**
  ```json
  {
    "success": false,
    "error": {
      "code": "NOT_FOUND",
      "message": "Task not found or access denied"
    }
  }
  ```

#### 5. Update Task (Update)
- **Endpoint:** `PUT /api/v1/tasks/:id`
- **Auth Required:** Yes (`Bearer <JWT>`)
- **Parameters:** `id` must be a valid UUID.
- **Validation Rules:** At least one updatable field (`title`, `description`, `status`, `priority`, `dueDate`) must be provided.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { ...updatedTaskObject },
    "message": "Task updated successfully"
  }
  ```

#### 6. Delete Task (Delete)
- **Endpoint:** `DELETE /api/v1/tasks/:id`
- **Auth Required:** Yes (`Bearer <JWT>`)
- **Parameters:** `id` must be a valid UUID.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { "id": "c1ffbc99-9c0b-4ef8-bb6d-6bb9bd380b22" },
    "message": "Task deleted successfully"
  }
  ```

---

## 9. End-to-End Data Flow

The complete data lifecycle from user interaction to database commit and UI feedback:

```text
[1. User Action]
     │ User fills TaskModal form on Next.js and clicks "Create Task"
     ▼
[2. Frontend Validation]
     │ React form checks input: title is not empty, dueDate is valid format
     ▼
[3. HTTP Dispatch]
     │ Client API service creates POST request to `/api/v1/tasks`
     │ Headers: { "Authorization": "Bearer <JWT>", "Content-Type": "application/json" }
     │ Body: JSON payload
     ▼
[4. Network / Transport]
     │ HTTPS request travels to Node.js / Express server
     ▼
[5. Express Middlewares]
     │ 5a. CORS middleware checks origin
     │ 5b. express.json() parses body stream
     │ 5c. authMiddleware verifies JWT cryptographic signature with Supabase
     │     - If invalid: halts and returns HTTP 401 Unauthorized
     │     - If valid: extracts user_id, sets req.user = { id, email }
     │ 5d. validateMiddleware verifies body against Zod createTaskSchema
     │     - If invalid: halts and returns HTTP 400 Bad Request with field errors
     ▼
[6. Task Controller]
     │ taskController.createTask receives validated data and req.user.id
     │ Passes parameters to taskService.createTask(userId, taskData)
     ▼
[7. Task Service & Business Logic]
     │ Enforces business rules (defaults, ownership assignment)
     │ Invokes Supabase PostgreSQL query:
     │ supabase.from('tasks').insert({ ...taskData, user_id: userId })
     ▼
[8. PostgreSQL Engine]
     │ Verifies Foreign Key against auth.users(id)
     │ Enforces CHECK constraints (status, priority, title)
     │ RLS policies confirm auth.uid() == user_id
     │ Inserts row, triggers updated_at, commits transaction
     ▼
[9. Controller Response Formulation]
     │ Controller wraps created entity in standard envelope:
     │ Responds with HTTP 201 Created: { success: true, data: newTask, message: "..." }
     ▼
[10. Frontend UI State Update]
     │ Next.js fetch promise resolves
     │ Local tasks array appends newTask
     │ TaskModal closes
     │ Toast alert confirms: "Task created successfully"
```

---

## 10. Security Framework

A multi-layered defense-in-depth security model is designed across all tiers:

1. **Authentication Security:**  
   - Handled via Supabase Auth; passwords never touch Express server application memory.
   - Salted cryptographic password hashing (bcrypt/Argon2).
   - Short-lived JWT access tokens with secure refresh token rotation.
2. **Authorization & Route Protection:**  
   - Zero-trust model: every `/api/v1/tasks/*` route requires a valid Bearer JWT.
   - Unauthorized requests immediately halted with HTTP `401 Unauthorized`.
3. **Insecure Direct Object Reference (IDOR) Prevention:**  
   - Every read, update, or delete database query strictly combines the record ID with the authenticated user's ID:  
     `WHERE id = :taskId AND user_id = :authUserId`  
   - Users cannot view, modify, or delete tasks belonging to other accounts, even if IDs are discovered.
4. **Input Validation & Sanitization:**  
   - Client-side form constraints prevent basic formatting errors.
   - Server-side schema validation (Zod) rejects malformed types, invalid enums, and extra unexpected properties before service execution.
5. **SQL Injection Neutralization:**  
   - Zero raw string-concatenated SQL queries.
   - All queries use parameterized statements via the Supabase client SDK.
6. **CORS (Cross-Origin Resource Sharing):**  
   - Express `cors` middleware explicitly restricts origins to the configured client domain (`FRONTEND_URL`), blocking unauthorized web origins.
7. **Environment Variable & Secret Hygiene:**  
   - Sensitive keys (`SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`) stored strictly on the backend server in `.env`.
   - Never committed to Git; tracked via `.gitignore` and `.env.example`.
8. **User Data Isolation at Database Engine Layer (RLS):**  
   - PostgreSQL Row Level Security (RLS) policies enforce ownership independently of application code bugs.

---

## 11. Error & Exception Handling Framework

### 11.1 Centralized Error Handling Architecture
To ensure zero process crashes and zero sensitive stack trace leaks in production, all backend asynchronous controllers are wrapped in an `asyncHandler` that routes caught errors into a centralized Express error middleware.

### 11.2 Standardized Error Envelopes
All error responses adhere to a consistent contract:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "title",
        "message": "Title must be between 1 and 255 characters"
      }
    ]
  }
}
```

### 11.3 Error Mapping Taxonomy
| Error Condition | HTTP Status | Error Code | Client Feedback |
| :--- | :--- | :--- | :--- |
| Schema validation failure | `400 Bad Request` | `VALIDATION_ERROR` | Inline form field cues |
| Missing or invalid Bearer JWT | `401 Unauthorized` | `UNAUTHORIZED` | Redirect to `/login` |
| Record belongs to another user / not found | `404 Not Found` | `NOT_FOUND` | "Task not found or access denied" toast |
| Unhandled server exception | `500 Internal Server Error` | `INTERNAL_SERVER_ERROR` | "An unexpected error occurred. Please try again." |

---

## 12. Planned Testing Integration

The testing framework aligns with the mid-stage and automated verification objectives of Weeks 2, 3, and 4:

### 12.1 Testing Levels
1. **Mid-Stage Scenario Validation (Week 2):**  
   Manual and scripted validation using sample JSON payloads to test controller error branches and route behaviors against dummy scenarios.
2. **Automated API Integration Tests (Week 3/4):**  
   Using **Jest** and **Supertest** to test the Express application directly across positive and negative paths:
   - Positive path: Create task -> Verify HTTP 201 -> Read task -> Verify HTTP 200 -> Update task -> Verify HTTP 200 -> Delete task -> Verify HTTP 200.
   - Negative paths: Missing token -> Verify HTTP 401; Empty title -> Verify HTTP 400; IDOR attempt -> Verify HTTP 404.
3. **Manual Cross-Device UI Testing (Week 3/4):**  
   Verifying responsive layouts across mobile (375px), tablet (768px), and desktop (1280px+).

---

## 13. Implementation Readiness Checklist

| Readiness Category | Criterion | Status | Verification Method |
| :--- | :--- | :--- | :--- |
| **Concept & Entity** | Task management model and fields specified | **Ready for Week 3** | Reviewed in Section 3 |
| **System Architecture** | Decoupled client-server architecture diagrammed | **Ready for Week 3** | Reviewed in Section 2 |
| **API Contract** | All CRUD endpoints, methods, and payloads specified | **Ready for Week 3** | Reviewed in Section 8 |
| **Database Blueprint** | PostgreSQL schema DDL and RLS rules authored | **Ready for Week 3** | Reviewed in Section 6 |
| **Security Controls** | IDOR mitigation, JWT auth, and validation planned | **Ready for Week 3** | Reviewed in Section 10 |
| **Error Handling** | Standard error envelopes and status codes defined | **Ready for Week 3** | Reviewed in Section 11 |
| **Source Code** | Next.js and Express source code implementation | **Not Started** | Deferred to Week 3 Execution |
| **Database Execution** | Table creation on live Supabase instance | **Not Started** | Deferred to Week 3 Execution |

---

## 14. Framework Dependencies, Gaps & Traceability

### 14.1 Framework Dependencies
- **Node.js LTS (v18+ or v20+)** and **npm** package manager.
- **Supabase Cloud Account / Project** for managed PostgreSQL and Auth service.
- **TypeScript (v5+)** for static type checking across client and server.
- **TailwindCSS (v3+)** and **PostCSS** for styling.
- **Testing Libraries:** Jest, Supertest, `@types/jest`, `@types/supertest`.

### 14.2 Known Gaps & Open Technical Questions
1. **Token Refresh Strategy on Frontend:**  
   Determine whether the client will rely entirely on Supabase client automatic token refresh or pass refresh tokens explicitly to Express. *(Recommendation: Let Supabase client manage session refresh in the browser).*
2. **Soft Deletion vs. Hard Deletion:**  
   Currently specified as Hard Deletion (`DELETE FROM tasks`). If audit logs are requested, a `deleted_at` timestamp can be added. *(Recommendation: Hard deletion is optimal for the 4-week student CRUD scope).*

### 14.3 Decisions Still Requiring Approval
- Formal sign-off on the Task Management concept and 7 core entity fields (`title`, `description`, `status`, `priority`, `due_date`, `created_at`, `updated_at`).
- Approval of the direct client-side Supabase Auth flow with Bearer JWT verification in Express.

### 14.4 Week 2 Objective Traceability Matrix
This document directly satisfies the first official Week 2 objective:  
> **"Design primary operational framework and Node.js / Express / Supabase / PostgreSQL workflows."**

- **Node.js / Express Workflow:** Detailed in Section 4 (Layered Architecture) and Section 8 (API Contract).
- **Supabase / PostgreSQL Workflow:** Detailed in Section 5 (Auth Framework) and Section 6 (Database DDL & RLS).
- **Full Operational Lifecycle:** Detailed in Section 2 (System Architecture) and Section 9 (End-to-End Data Flow).
