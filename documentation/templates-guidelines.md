# Standardized Templates & Engineering Guidelines

**Document Type:** Software Engineering Process & Technical Standardization Specification  
**Project Title:** Full-Stack Web App with Auth & Database (CRUD)  
**Lifecycle Stage:** Week 2 — Framework & Workflow Design  
**Deliverable Classification:** Milestone 2 Core Deliverable 2 (`documentation/templates-guidelines.md`)  
**Status:** **APPROVED ENGINEERING GUIDELINES — PENDING MENTOR / EVALUATOR AUDIT**  

---

## 1. Purpose and Standardization Goals

This document establishes the official engineering conventions, development standards, reusable architectural templates, and quality criteria for the **Task Management System**.

### Primary Standardization Goals:
1. **Consistency & Maintainability:** Ensure uniform code style, file organization, and naming conventions across both the Next.js frontend and Express backend.
2. **Defensive Security & Data Isolation:** Mandate standardized authentication, authorization, and IDOR prevention patterns across every API route and database query.
3. **Robust Error & State Handling:** Guarantee that all asynchronous operations provide predictable HTTP status codes, standard JSON error envelopes, and graceful client feedback.
4. **Frictionless Collaboration & Grading:** Deliver transparent, self-documenting code and test templates suitable for academic peer review and grading rubrics.

> [!IMPORTANT]
> **Implementation Status Disclosure:** This is a **GOVERNANCE AND SPECIFICATION DOCUMENT ONLY**. All templates, schemas, and guidelines defined herein govern upcoming implementation work. In strict accordance with the 4-week roadmap, **no application source code has been authored, no database tables have been instantiated, and no npm packages have been installed.**

---

## 2. Project Naming Conventions

Uniform naming conventions must be strictly maintained across all workspace layers:

| Layer / Element | Convention | Example | Notes |
| :--- | :--- | :--- | :--- |
| **Directories / Folders** | `kebab-case` | `components/task-list`, `src/routes` | All lowercase, hyphen-separated. |
| **React Components** | `PascalCase` | `TaskCard.tsx`, `Navbar.tsx` | Matches the default component export. |
| **React Hooks** | `camelCase` with `use` prefix | `useTasks.ts`, `useAuth.ts` | Always starts with `use`. |
| **TypeScript Interfaces** | `PascalCase` with `I` prefix or standard noun | `Task`, `CreateTaskDTO`, `ApiResponse<T>` | Descriptive nouns; DTO for payload transfers. |
| **Variables & Constants** | `camelCase` / `UPPER_SNAKE_CASE` | `taskList`, `MAX_TITLE_LENGTH` | UPPER_SNAKE reserved for static constants. |
| **Functions & Methods** | `camelCase` (Verb + Noun) | `getTaskById()`, `validatePayload()` | Explicit verb-first action names. |
| **Express Route Files** | `camelCase` with `Routes` suffix | `taskRoutes.ts`, `authRoutes.ts` | Located inside `src/routes/`. |
| **Express Controllers** | `camelCase` with `Controller` suffix | `taskController.ts` | Exporting discrete async handler functions. |
| **REST API URIs** | `kebab-case`, plural nouns | `/api/v1/tasks`, `/api/v1/tasks/:id` | No verbs in URI; verbs defined by HTTP method. |
| **Database Tables** | `snake_case`, plural nouns | `tasks`, `user_profiles` | Lowercase plural SQL standard. |
| **Database Columns** | `snake_case` | `user_id`, `created_at`, `due_date` | Explicit, lowercase SQL standard. |

---

## 3. Frontend Development Guidelines

### 3.1 Next.js & React Structure
- Components must follow the **Single Responsibility Principle (SRP)**. Decompose large views into modular sub-components (e.g., `TaskTable`, `TaskRow`, `TaskBadge`, `TaskActions`).
- Reusable UI elements (`Button`, `Input`, `Select`, `Modal`) must reside in `src/components/ui/`.
- Domain-specific components must reside in `src/components/tasks/`.

### 3.2 TypeScript Conventions
- Avoid `any` under all circumstances. Use `unknown` with type guards if types are indeterminate.
- Define shared domain models in `src/types/task.ts`:
  ```typescript
  export type TaskStatus = 'pending' | 'in_progress' | 'completed';
  export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

  export interface Task {
    id: string;
    userId: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
  }
  ```

### 3.3 Form Handling & Validation
- Form inputs must be controlled components tied to React state.
- Validate inputs immediately upon blur or submission before dispatching network requests.
- Trim whitespace on text fields before submission. Display field-specific error cues directly beneath the input field.

### 3.4 Asynchronous State Progression (Loading, Error, Success)
Every data-fetching or mutating component must account for four distinct UI states:
1. **Idle State:** Initial view before user action.
2. **Loading State:** Disabled submit buttons, spinner indicators, or table row skeletons while network requests are in flight.
3. **Error State:** Descriptive toast alerts or inline banners displaying the error message returned from the backend envelope (`error.message`).
4. **Success State:** Immediate visual confirmation (toast alert: *"Task created successfully"*), modal dismissal, and local state update.

### 3.5 Responsive UI Guidelines
- Design **mobile-first** using TailwindCSS responsive utility prefixes (`sm:`, `md:`, `lg:`).
- Tables on desktop (`md:` and above) must gracefully transform into stacked card layouts on mobile viewports (< 768px).
- Interactive touch targets must be at least 44x44 pixels on touch displays.

---

## 4. Backend Development Guidelines

### 4.1 Route & Controller Conventions
- Routes strictly define paths and middleware sequences:  
  `router.post('/', authMiddleware, validate(createTaskSchema), createTaskController);`
- Controllers extract HTTP inputs (`req.params`, `req.body`, `req.user.id`), call service methods, and issue standardized JSON responses. Controllers must not contain direct database queries.

### 4.2 Service Layer Conventions
- Houses all business logic and authorization boundaries.
- Every service query mutating or reading records must include `user_id: req.user.id` to prevent IDOR vulnerabilities.
- Handles database exceptions and bubbles domain errors to controllers.

### 4.3 Middleware Pipeline Order
All incoming Express requests must execute in this exact sequence:
1. `cors()`: Origin header verification.
2. `express.json()`: Body parsing.
3. `requestLogger`: Request method, path, and duration logging.
4. `authMiddleware`: Bearer JWT verification against Supabase Auth.
5. `validateMiddleware(schema)`: Schema enforcement on `req.body`.
6. `routeController`: Core execution.
7. `errorMiddleware`: Centralized error capture.

### 4.4 HTTP Status Code Conventions
| Status Code | Purpose | Usage in Project |
| :--- | :--- | :--- |
| **`200 OK`** | Successful retrieval or update | `GET /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id` |
| **`201 Created`** | Successful entity creation | `POST /tasks` |
| **`400 Bad Request`** | Input validation failure | Malformed payload, invalid enum, missing title |
| **`401 Unauthorized`** | Missing or invalid auth token | Missing Bearer header, expired JWT |
| **`403 Forbidden`** | Authenticated but lacks permission | Attempting to access non-owned resource (if flagged) |
| **`404 Not Found`** | Resource does not exist or user mismatch | Task UUID not found for authenticated user |
| **`500 Internal Error`** | Unhandled server or database failure | Database pool failure, uncaught exception |

---

## 5. REST API Standard Template

Every endpoint developed in Week 3 must conform to this standardized contract template:

```text
ENDPOINT SPECIFICATION TEMPLATE:
--------------------------------------------------------------------------------
1. Route:            [METHOD] /api/v1/[resource-path]
2. Purpose:          [Brief explanation of the operation]
3. Authentication:   [Public | Bearer JWT Required]
4. Headers:          Authorization: Bearer <token> (if protected)
                     Content-Type: application/json (for POST/PUT)
5. URL Parameters:   :id (UUID format, if applicable)
6. Query Parameters: ?filterKey=value (if applicable)
7. Request Body:     JSON object conforming to validated DTO schema
8. Validation Rules: [List of field rules and constraints]
9. Success Response: HTTP [200 | 201]
   {
     "success": true,
     "data": { ... },
     "message": "Descriptive confirmation string"
   }
10. Error Response:  HTTP [400 | 401 | 404 | 500]
   {
     "success": false,
     "error": {
       "code": "ERROR_CODE_STRING",
       "message": "User-friendly error explanation",
       "details": [ ... ]
     }
   }
--------------------------------------------------------------------------------
```

---

## 6. CRUD Operation Standards

| CRUD Verb | HTTP Method | Target Endpoint | Payload / Params | Status Code | Required Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CREATE** | `POST` | `/api/v1/tasks` | `{ title, description?, status?, priority?, dueDate? }` | `201 Created` | Inserts row with `user_id = req.user.id`. Generates UUID. Returns created entity with timestamps. |
| **READ** | `GET` | `/api/v1/tasks` | Query params (`status`, `priority`, `search`, `sortBy`) | `200 OK` | Returns array of tasks owned exclusively by `req.user.id`. Never returns records of other users. |
| **READ (Single)**| `GET` | `/api/v1/tasks/:id` | `:id` (UUID) | `200 OK` | Returns single task if `id` exists AND `user_id = req.user.id`. Otherwise returns `404 Not Found`. |
| **UPDATE** | `PUT` | `/api/v1/tasks/:id` | `:id` (UUID), Partial/Full update body | `200 OK` | Updates fields for row where `id = :id AND user_id = req.user.id`. Refreshes `updated_at`. Returns updated entity. |
| **DELETE** | `DELETE` | `/api/v1/tasks/:id` | `:id` (UUID) | `200 OK` | Deletes row where `id = :id AND user_id = req.user.id`. Returns `{ "id": ":id" }` confirming removal. |

---

## 7. Database Standards (PostgreSQL / Supabase)

1. **Table & Column Naming:** Lowercase `snake_case`, plural table names (`public.tasks`).
2. **Identifier Strategy:** Every table must use a `UUID` primary key:  
   `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
3. **Foreign Keys:** Must reference `auth.users(id)` with explicit cascading:  
   `user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`
4. **Audit Timestamps:** Every table must include:  
   `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`  
   `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`
5. **Check Constraints:** Enforce domain integrity directly in PostgreSQL:  
   `CHECK (status IN ('pending', 'in_progress', 'completed'))`  
   `CHECK (priority IN ('low', 'medium', 'high', 'urgent'))`  
   `CHECK (char_length(trim(title)) > 0)`
6. **Indexing Strategy:** Create B-Tree indexes on all foreign keys and frequently filtered columns:  
   `CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);`  
   `CREATE INDEX idx_tasks_user_status ON public.tasks(user_id, status);`
7. **Row Level Security (RLS):** All tables in `public` must enable RLS as a secondary security gate:  
   `ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;`

---

## 8. Authentication & Security Guidelines

- **Zero Plaintext Credentials:** The Express backend must never accept, handle, or store raw user passwords. Authentication is handled via Supabase Auth.
- **JWT Bearer Verification:** Express `authMiddleware` validates token signatures against Supabase secrets before request processing.
- **Anti-IDOR Enforcement:** Under no circumstances may an Express service query the database without filtering by `user_id = req.user.id`.
- **CORS Restrictiveness:** Express `cors()` must explicitly permit only `process.env.FRONTEND_URL`.
- **Environment Isolation:** Secrets (`SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`) must never be prefixed with `NEXT_PUBLIC_` or committed to source control.

---

## 9. Validation Standards

Every task attribute is governed by dual-layer client and server validation:

| Attribute | Type | Client-Side Rule | Server-Side Rule (Zod Schema) | Error Message |
| :--- | :--- | :--- | :--- | :--- |
| **`title`** | `string` | Required, non-empty, max 255 chars | `z.string().trim().min(1).max(255)` | *"Title is required and must not exceed 255 characters"* |
| **`description`** | `string` | Optional, max 2000 chars | `z.string().max(2000).optional().default('')` | *"Description cannot exceed 2000 characters"* |
| **`status`** | `enum` | Select from predefined list | `z.enum(['pending', 'in_progress', 'completed']).default('pending')` | *"Status must be pending, in_progress, or completed"* |
| **`priority`** | `enum` | Select from predefined list | `z.enum(['low', 'medium', 'high', 'urgent']).default('medium')` | *"Priority must be low, medium, high, or urgent"* |
| **`dueDate`** | `datetime` | Valid date picker selection | `z.string().datetime().nullable().optional()` | *"Due date must be a valid ISO 8601 timestamp"* |

---

## 10. Error Handling Template

### 10.1 Standardized Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CATEGORY_CODE",
    "message": "Human-readable summary of the error",
    "details": [
      {
        "field": "title",
        "message": "Title cannot be empty"
      }
    ]
  }
}
```

### 10.2 Error Categories & Mapping
- `VALIDATION_ERROR` (HTTP 400): Schema or format mismatch.
- `UNAUTHORIZED` (HTTP 401): Missing, expired, or tampered token.
- `FORBIDDEN` (HTTP 403): User lacks operational permissions.
- `NOT_FOUND` (HTTP 404): Resource does not exist or belongs to another user.
- `INTERNAL_SERVER_ERROR` (HTTP 500): Server-side unexpected failure; sanitized message returned to client.

---

## 11. Testing Guidelines

1. **Unit Testing:** Focus on pure functions (date formatters, validation parsers, status badge transformers).
2. **API Integration Testing (Supertest + Jest):** Primary testing emphasis for Week 3/4. Test the Express application against real or mock database instances across all routes.
3. **CRUD Lifecycle Testing:** Verify the complete sequence (`Create` -> `Read` -> `Update` -> `Delete`).
4. **Security & Auth Testing:**
   - Verify unauthenticated requests return `401`.
   - Verify malformed tokens return `401`.
   - Verify User A cannot access User B's task (IDOR protection test returns `404`).
5. **Negative Scenario Testing:** Inject empty titles, invalid enums, non-existent UUIDs, and SQL injection strings to confirm robust error rejection.
6. **Responsive UI Testing:** Inspect views at 375px, 768px, and 1280px viewports ensuring zero content clipping or broken navigation.

---

## 12. Test Case Specification Template

All formal test scenarios in Week 2, 3, and 4 must be documented using this standard template:

```text
================================================================================
TEST CASE SPECIFICATION
================================================================================
Test ID:         TC-[CATEGORY]-[NUM] (e.g., TC-CRUD-001)
Feature:         [Target Feature / Endpoint]
Preconditions:   [Required system state, e.g., Authenticated User active]
Test Data:       [Input payload or query parameters]
Test Steps:
  1. [Action 1]
  2. [Action 2]
  3. [Action 3]
Expected Result: [Expected HTTP status code, response body, or UI feedback]
Actual Result:   [Pending Implementation / Recorded Result]
Status:          [Planned | Pass | Fail | Blocked]
Notes / Logs:    [Additional observations or edge cases]
================================================================================
```

---

## 13. Git & Documentation Guidelines

- **Commit Message Convention:** Follow **Conventional Commits**:  
  - `feat: add task creation endpoint and validation schema`
  - `fix: resolve IDOR check in task update controller`
  - `docs: update test scenario log for Week 2`
  - `test: add Supertest suite for CRUD task routes`
- **Meaningful Diffs:** Keep PRs/commits focused on single units of work. Avoid sweeping reformatting across unrelated files.
- **Repository Cleanliness:** Exclude `node_modules/`, `.next/`, `dist/`, `.env`, and OS temp files via `.gitignore`.
- **Traceability:** Every major commit or pull request should reference the corresponding deliverable or requirement ID (`FR-01` to `FR-10`).

---

## 14. Definition of Done (DoD)

A feature or user story is only considered **Done** and ready for milestone sign-off when all of the following criteria are satisfied:

- [ ] **TypeScript Cleanliness:** Compiles cleanly with zero type errors (`tsc --noEmit`).
- [ ] **Dual-Layer Validation:** Form fields validated on client; request body validated in Express via Zod.
- [ ] **Security Enforced:** Route guarded by `authMiddleware`; database query scoped by `user_id = req.user.id`.
- [ ] **Error Handling Covered:** Centralized error wrapper attached; user-friendly toast/alert rendered on failure.
- [ ] **Responsive Design Verified:** Layout checked on mobile (375px) and desktop (1280px) viewports.
- [ ] **Automated Tests Passing:** Associated integration test case passes in Jest/Supertest suite.
- [ ] **Documentation Updated:** Changes reflected in API contracts, project dashboard, and README.

---

## 15. Week 2 Objective Traceability Matrix

This document directly satisfies the second official Week 2 objective:  
> **"Create standardized templates, formulas, or process documentation."**

| Week 2 Objective Requirement | Covered Section in This Document |
| :--- | :--- |
| **Standardized Coding & Naming Conventions** | Section 2 (Naming Conventions) & Section 3 (Frontend Guidelines) |
| **Backend & Operational Workflow Standards** | Section 4 (Backend Guidelines) & Section 7 (Database Standards) |
| **Reusable REST API Template** | Section 5 (REST API Standard Template) & Section 6 (CRUD Standards) |
| **Process Documentation & Security Standards** | Section 8 (Security Guidelines) & Section 10 (Error Handling Template) |
| **Standardized Testing Templates** | Section 11 (Testing Guidelines) & Section 12 (Test Case Template) |
| **Quality Process & Definition of Done** | Section 14 (Definition of Done) |

---

## 16. Standardization Checklist & Open Items

### 16.1 Standardization Checklist
- [x] Project naming conventions defined across files, code symbols, routes, and database tables.
- [x] Frontend component and state lifecycle guidelines established.
- [x] Backend layered architecture and middleware sequence formalized.
- [x] REST API endpoint and response envelope templates created.
- [x] Database DDL, indexing, and RLS standards documented.
- [x] Dual-layer validation rules for all 5 task attributes specified.
- [x] Reusable test case specification template authored.
- [x] Definition of Done (DoD) checklist approved.

### 16.2 Known Gaps & Open Technical Decisions
1. **Zod vs. Joi for Validation:** Zod is selected as the primary standard due to native TypeScript static type inference (`z.infer<typeof schema>`).
2. **Date Format Standardization:** All dates must strictly utilize UTC ISO 8601 strings (`YYYY-MM-DDTHH:mm:ss.sssZ`).

### 16.3 Items Requiring Mentor / Evaluator Review
- Acceptance of the **Definition of Done (DoD)** checklist for grading upcoming Week 3 implementations.
- Sign-off on the **Test Case Specification Template** prior to generating the Week 2 Test Scenario Log.
