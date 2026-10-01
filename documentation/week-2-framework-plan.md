# Week 2 Framework & Workflow Design Plan

**Project Title:** Full-Stack Web App with Auth & Database (CRUD)  
**Lifecycle Stage:** Week 2 — Framework & Workflow Design  
**Document Type:** Technical Framework Specification & Architectural Blueprint  
**Deliverable Classification:** Milestone 2 Planning Document  
**Status:** **PLANNED DESIGN — PENDING STAKEHOLDER / MENTOR REVIEW**  

---

## 1. Executive Summary & Week 2 Scope

This document initiates **Week 2: Framework & Workflow Design** for the "Full-Stack Web App with Auth & Database (CRUD)" project.

Building upon the baseline analysis and requirements established in Week 1, Week 2 is dedicated to establishing the operational framework, data models, interface contracts, middleware pipelines, and testing protocols before any implementation code is written.

### Official Week 2 Key Metric:
> **"Initial framework approved, zero critical process gaps"**

### Official Week 2 Objectives:
1. Design primary operational framework and Node.js / Express / Supabase / PostgreSQL workflows.
2. Create standardized templates, formulas, or process documentation.
3. Conduct mid-stage testing with sample data or dummy scenarios.
4. Gather initial feedback from domain mentors/team.

> [!IMPORTANT]
> **Status Disclosure:** All specifications, data schemas, API routes, and workflows in this document are **PLANNED DESIGN SPECIFICATIONS**. In strict accordance with the 4-week roadmap, **no application source code has been written, no database tables have been instantiated, and no npm packages have been installed.**

---

## 2. Proposed Application Concept: Task Management System

### 2.1 Concept Description
The designated application concept is a **Task Management System**. It provides individual authenticated users with a structured, responsive, and secure workspace to track actionable work items, prioritize responsibilities, monitor completion states, and prevent task omission.

### 2.2 Primary Users
- **Standard Authenticated Operator (End User):** An individual who registers an account, authenticates securely, and performs routine CRUD operations on their personal task inventory.
- **Academic / Technical Evaluator:** Evaluators assessing system architecture, REST compliance, database integrity, route protection, and error resilience.

### 2.3 Core Use Case
An authenticated user logs into the application, views a dashboard of their current tasks categorized by status and priority, creates new tasks with due dates, modifies existing task details or status (e.g., advancing a task from `pending` to `in_progress` to `completed`), filters/searches their task list, and deletes obsolete entries with confirmation safeguards.

### 2.4 Major Features
1. **User Authentication & Session Management:** User registration, credential login, JWT token issuance, authenticated route guards, and secure session termination.
2. **User Data Isolation:** Strict tenancy enforcement ensuring users can exclusively view, edit, or delete tasks linked to their own account.
3. **Full CRUD Task Management:** Complete Create, Read, Update, and Delete capabilities for tasks.
4. **Task Prioritization & Scheduling:** Visual priority tags (`low`, `medium`, `high`, `urgent`) and calendar due dates.
5. **Status Tracking:** Distinct workflow states (`pending`, `in_progress`, `completed`).
6. **Search & Filter Controls:** Rapid lookup by title/description and filtering by status or priority.
7. **Responsive Feedback UI:** Modal dialogs for creation/editing, confirmation prompts for deletion, and descriptive toast notifications for API responses.

---

## 3. CRUD Entity Model & Schema Specification

The core business entity of the application is the **`tasks`** entity, relationally bound to the authenticated user identity entity (**`users`** managed via Supabase Auth).

### 3.1 `tasks` Entity Field Definitions

| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| **`id`** | `UUID` | Primary Key, `DEFAULT gen_random_uuid()` | Unique immutable identifier for each task record. |
| **`user_id`** | `UUID` | Foreign Key (`auth.users.id`), `ON DELETE CASCADE`, `NOT NULL` | Associates the task with the authenticated user who owns it. |
| **`title`** | `VARCHAR(255)` | `NOT NULL`, `CHECK (char_length(trim(title)) > 0)` | Brief, descriptive title of the task. |
| **`description`** | `TEXT` | Nullable, `DEFAULT ''` | Comprehensive notes or requirements for the task. |
| **`status`** | `VARCHAR(50)` | `NOT NULL`, `DEFAULT 'pending'` | Current task lifecycle status (`pending`, `in_progress`, `completed`). |
| **`priority`** | `VARCHAR(50)` | `NOT NULL`, `DEFAULT 'medium'` | Urgency level (`low`, `medium`, `high`, `urgent`). |
| **`due_date`** | `TIMESTAMPTZ` | Nullable | Target completion timestamp (ISO 8601). |
| **`created_at`** | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Timestamp when the task was initially created. |
| **`updated_at`** | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Timestamp when the task was last modified. |

### 3.2 Value Enums & Domain Integrity Rules
- **Status Domain Values:**
  - `pending`: Task created but work has not begun.
  - `in_progress`: Task is actively being worked on.
  - `completed`: Task has been finished.
- **Priority Domain Values:**
  - `low`: Non-urgent background task.
  - `medium`: Normal priority default.
  - `high`: Critical path work item.
  - `urgent`: Immediate attention required.
- **Validation Rules:**
  - `title` must be between 1 and 255 characters after trimming whitespace.
  - `due_date` when provided must be a valid ISO 8601 date string.
  - `updated_at` must automatically refresh on every row update via a PostgreSQL trigger or ORM hook.

---

## 4. Authentication Workflow

The application implements a stateless token-based authentication lifecycle leveraging **Supabase Auth** and **JSON Web Tokens (JWT)**:

```text
[User Browser]                      [Frontend UI]                  [Supabase Auth]              [Express API]
      │                                   │                               │                           │
      ├──── 1. Submit Registration ──────>│── auth.signUp() ─────────────>│                           │
      │    (Email + Password)             │                               │ (Creates user in auth.users)
      │                                   │<─ Return User + Access JWT ───┤                           │
      │                                   │                               │                           │
      ├──── 2. Submit Login ─────────────>│── auth.signInWithPassword() ──>│                           │
      │    (Email + Password)             │                               │ (Verifies salted hash)    │
      │                                   │<─ Return Session + JWT ───────┤                           │
      │                                   │                               │                           │
      ├──── 3. Access Protected Route ───>│                               │                           │
      │                                   │── HTTP Request + Bearer JWT ─────────────────────────────>│
      │                                   │                               │                           │ (Verifies JWT)
      │                                   │                               │                           │ (Extracts user_id)
      │                                   │<─ HTTP 200 + User Data ───────────────────────────────────│
      │                                   │                               │                           │
      ├──── 4. Logout ───────────────────>│── auth.signOut() ────────────>│                           │
      │                                   │ (Clears local session token)  │                           │
      ▼                                   ▼                               ▼                           ▼
```

### 4.1 Step-by-Step Authentication Lifecycle
1. **User Registration:**
   - The user inputs email and password on the Next.js registration form.
   - Client validates format (valid email syntax, password minimum 8 characters).
   - Frontend invokes `supabase.auth.signUp()`.
   - Supabase creates a record in `auth.users` with salted password hashing (bcrypt) and issues an initial JWT session.
2. **User Login:**
   - User inputs credentials on `/login`.
   - Frontend invokes `supabase.auth.signInWithPassword()`.
   - Upon successful verification, Supabase returns a session object containing an `access_token` (JWT) and a `refresh_token`.
3. **Secure Authentication & Token Management:**
   - The JWT is retained in client-side application state / secure browser storage.
   - Every subsequent API call to the Node.js/Express backend automatically appends the token to the HTTP header:  
     `Authorization: Bearer <access_token>`
4. **Protected Application Access:**
   - **Frontend Guard:** Next.js route wrapper inspects auth session; unauthenticated visits to `/dashboard` or `/tasks` redirect immediately to `/login`.
   - **Backend Guard:** Express middleware (`authMiddleware`) intercepts incoming requests, verifies the JWT cryptographic signature against Supabase public keys/secret, extracts the `user_id` payload, and attaches it to `req.user`.
   - If the token is missing, expired, or invalid, the API immediately halts execution and returns HTTP `401 Unauthorized`.
5. **Logout:**
   - User triggers "Sign Out".
   - Frontend invokes `supabase.auth.signOut()`, purges tokens from client storage, clears React state, and redirects to `/login`.

---

## 5. Frontend Workflow & Component Architecture

The frontend is architected as a modular Next.js application styled with TailwindCSS and typed with TypeScript.

### 5.1 Page and Route Structure
- `/`: Public landing page detailing project scope and authentication actions.
- `/login`: Public authentication page with email/password login form.
- `/register`: Public registration page with email/password signup form.
- `/dashboard`: Protected dashboard displaying task metric summaries (total, pending, completed) and task controls.
- `/tasks`: Protected task inventory with search, status filters, priority filters, and data tables.

### 5.2 Component Hierarchy

```text
App / Root Layout
├── Navbar (Branding, Auth Status, Navigation Links, Logout Button)
├── ToastNotificationContainer (Alerts for Success, Error, Info)
└── Main Content Container
    ├── [Public Views]
    │   ├── LandingHero
    │   ├── LoginForm (Email, Password, Submit, Link to Register)
    │   └── RegisterForm (Email, Password, Confirm Password, Submit)
    │
    └── [Protected Views - Wrapped with AuthGuard]
        ├── DashboardMetrics (Card stats: Total, Pending, In Progress, Completed)
        ├── TaskControlBar (Search Input, Status Filter Dropdown, Priority Filter Dropdown, "New Task" Button)
        ├── TaskTable / TaskGrid (Responsive list of task cards/rows)
        │   └── TaskItem (Title, Description snippet, Status badge, Priority badge, Due date, Action buttons)
        ├── TaskModal (Dual-purpose Create / Edit form dialog)
        └── DeleteConfirmDialog (Modal prompt: "Are you sure you want to delete this task?")
```

### 5.3 UI State Management Strategy
- **Authentication State:** Global React context (`AuthContext`) managing current user, session token, and loading status.
- **Task State:** Local React state managing `tasks: Task[]`, `loading: boolean`, `error: string | null`, and filter queries.
- **Form State:** Controlled inputs for modal forms with field-level validation cues.
- **Feedback State:** Toast alerts triggering on API completion (`Task created successfully`, `Failed to delete task`).

---

## 6. REST API Workflow & Endpoint Specification

The backend exposes a standardized RESTful API rooted at `/api/v1`. All endpoints return standardized JSON envelopes.

### 6.1 Standard JSON Response Envelopes
- **Success Response:**
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Operation completed successfully"
  }
  ```
- **Error Response:**
  ```json
  {
    "success": false,
    "error": {
      "code": "BAD_REQUEST",
      "message": "Validation failed: 'title' is required",
      "details": [ ... ]
    }
  }
  ```

### 6.2 REST Endpoint Route Table

| Method | Endpoint | Protection | Description | Expected Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Public | Server health check and status report | `200 OK` |
| `GET` | `/api/v1/tasks` | Bearer JWT | Retrieve all tasks owned by the authenticated user | `200 OK`, `401 Unauthorized` |
| `POST` | `/api/v1/tasks` | Bearer JWT | Create a new task for the authenticated user | `201 Created`, `400 Bad Request`, `401 Unauthorized` |
| `GET` | `/api/v1/tasks/:id` | Bearer JWT | Retrieve a single task by ID (user-scoped) | `200 OK`, `401 Unauthorized`, `404 Not Found` |
| `PUT` | `/api/v1/tasks/:id` | Bearer JWT | Update an existing task (user-scoped) | `200 OK`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| `DELETE` | `/api/v1/tasks/:id` | Bearer JWT | Delete a task (user-scoped) | `200 OK`, `401 Unauthorized`, `404 Not Found` |

### 6.3 Query Parameter Specifications for `GET /api/v1/tasks`
- `status`: Filter by status (`pending`, `in_progress`, `completed`).
- `priority`: Filter by priority (`low`, `medium`, `high`, `urgent`).
- `search`: Keyword search matching `title` or `description`.
- `sortBy`: Field to order by (`created_at`, `due_date`, `priority`, `title`; default: `created_at`).
- `order`: Sort direction (`asc`, `desc`; default: `desc`).

---

## 7. Backend Architecture & Workflow (Node.js / Express + TypeScript)

The backend follows an industry-standard **Layered Architecture (Controller-Service-Repository Pattern)** to decouple routing, validation, business logic, and database operations.

```text
[Incoming HTTP Request]
          │
          ▼
[Express Router] (/api/v1/tasks)
          │
          ▼
[Middleware Chain]
  1. cors() ───────────────> Verify origin whitelist
  2. express.json() ───────> Parse JSON payload into req.body
  3. authMiddleware ───────> Validate Supabase Bearer JWT -> req.user
  4. validateTaskPayload ──> Validate body using Zod schema
          │
          ▼
[Task Controller] ─────────> Extracts req.user.id and validated inputs
          │
          ▼
[Task Service] ────────────> Applies business rules & ownership verification
          │
          ▼
[Database Layer (Supabase]> Executes parameterized SQL query against PostgreSQL
          │
          ▼
[Standard Response] ───────> Formats HTTP status (200/201) & JSON envelope
          │
      (On Error)
          ▼
[Centralized Error Handler]> Sanitizes error message, logs trace, returns HTTP 4xx/5xx
```

### 7.1 Backend Layer Responsibilities
1. **Routing Layer (`src/routes/`):** Defines HTTP paths and associates them with validation middleware and controller methods.
2. **Middleware Layer (`src/middlewares/`):**
   - `authMiddleware.ts`: Inspects `req.headers.authorization`, verifies token validity, populates `req.user`.
   - `validateMiddleware.ts`: Generic schema validator intercepting invalid payloads before reaching controllers.
   - `errorHandler.ts`: Catches unhandled exceptions, maps database errors to appropriate HTTP codes, and guarantees server stability.
3. **Controller Layer (`src/controllers/`):** Handles HTTP request/response parsing, calls service methods, and sets HTTP status codes.
4. **Service Layer (`src/services/`):** Houses pure business logic, task ownership checks, and query construction.
5. **Database Client (`src/config/supabase.ts`):** Initializes and exports the authenticated Supabase client using environment variables.

---

## 8. Supabase & PostgreSQL Workflow

### 8.1 Database Architecture
- **Engine:** PostgreSQL 15+ hosted via Supabase.
- **Relational Integrity:** Foreign key constraint linking `tasks.user_id` to `auth.users.id`.
- **Automated Cascades:** Deleting a user account cascades to remove all associated task rows (`ON DELETE CASCADE`), preventing orphaned data.
- **Audit Triggers:** PostgreSQL function updating `updated_at = now()` whenever a row is modified.

### 8.2 Planned Table Definition (DDL Blueprint)

```sql
-- Planned SQL DDL Schema (To be executed in Week 3)
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
    CONSTRAINT status_check CHECK (status IN ('pending', 'in_progress', 'completed')),
    CONSTRAINT priority_check CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    CONSTRAINT title_non_empty CHECK (char_length(trim(title)) > 0)
);

-- Indexing for optimized user-scoped queries
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
```

### 8.3 Row Level Security (RLS) Policy Design
As a defense-in-depth measure, PostgreSQL Row Level Security (RLS) policies will guarantee data isolation at the database engine layer:
- **SELECT Policy:** `auth.uid() = user_id`
- **INSERT Policy:** `auth.uid() = user_id`
- **UPDATE Policy:** `auth.uid() = user_id`
- **DELETE Policy:** `auth.uid() = user_id`

---

## 9. End-to-End Data Flow

The following sequence details the complete data lifecycle when an authenticated user creates a task:

```text
1. [User Input] ────────> Enters "Complete Week 2 Plan", Priority="high" into Next.js TaskModal.
2. [Client Validation] ─> Form checks: title non-empty, length < 255.
3. [Network Dispatch] ──> Frontend POST /api/v1/tasks + Bearer JWT + JSON body.
4. [CORS & Parsing] ────> Express CORS verifies origin; express.json() parses body.
5. [Token Verification]─> authMiddleware validates JWT signature; extracts user_id="usr_abc123".
6. [Server Validation] ─> Zod schema validates body ({ title: string, priority: 'high', ... }).
7. [Controller/Service]─> Constructs entity: { ...body, user_id: "usr_abc123" }.
8. [Database Write] ────> Supabase client executes INSERT into public.tasks.
9. [PostgreSQL Engine] ─> Verifies FK constraint against auth.users; assigns UUID id; commits row.
10.[API Response] ──────> Express returns HTTP 201 Created with { success: true, data: newTask }.
11.[UI State Update] ───> Next.js appends newTask to local tasks array; closes modal; shows success toast.
```

---

## 10. System Architecture Diagram

```text
+---------------------------------------------------------------------------------------+
|                                    PRESENTATION TIER                                  |
|                                                                                       |
|   +-------------------------------------------------------------------------------+   |
|   |                         Next.js 14+ / React Frontend                          |   |
|   |                                                                               |   |
|   |  - TypeScript Views (/login, /register, /dashboard, /tasks)                   |   |
|   |  - TailwindCSS Styling & Layouts                                              |   |
|   |  - Client Context: AuthContext, TaskState                                     |   |
|   |  - UI Components: TaskTable, TaskModal, DeleteDialog, ToastContainer          |   |
|   |  - API Client: Fetch/Axios Service with Authorization Interceptor             |   |
|   +-------------------------------------------------------------------------------+   |
+-------------------------------------------┬-------------------------------------------+
                                            │
                         HTTPS / REST (JSON)│ [Authorization: Bearer <JWT>]
                                            ▼
+---------------------------------------------------------------------------------------+
|                                   APPLICATION TIER                                    |
|                                                                                       |
|   +-------------------------------------------------------------------------------+   |
|   |                            Node.js / Express Server                           |   |
|   |                                                                               |   |
|   |  [cors] ──> [express.json] ──> [authMiddleware] ──> [validateMiddleware]      |   |
|   |                                                                 │                 |
|   |                                                                 ▼                 |
|   |  [Express Router: /api/v1/tasks] <──────────────────────────────┘                 |
|   |    ├── GET    /tasks         ──> TaskController.getAllTasks                       |
|   |    ├── POST   /tasks         ──> TaskController.createTask                        |
|   |    ├── GET    /tasks/:id     ──> TaskController.getTaskById                       |
|   |    ├── PUT    /tasks/:id     ──> TaskController.updateTask                        |
|   |    └── DELETE /tasks/:id     ──> TaskController.deleteTask                        |
|   |                                                                               |   |
|   |  [TaskService (Business Logic & User Ownership Checks)]                       |   |
|   |  [Centralized Error Handling Middleware]                                      |   |
|   +---------------------------------------┬---------------------------------------+   |
+-------------------------------------------┼-------------------------------------------+
                                            │
                        TCP / TLS Connection│ Supabase Client SDK (PostgREST)
                                            ▼
+---------------------------------------------------------------------------------------+
|                                   PERSISTENCE TIER                                    |
|                                                                                       |
|   +---------------------------------------+   +-----------------------------------+   |
|   |          Supabase Auth Engine         |   |      Managed PostgreSQL DB        |   |
|   |                                       |   |                                   |   |
|   |  - auth.users (Credentials & Salt)    |   |  - public.tasks Table             |   |
|   |  - JWT Issuance & Token Refresh       |   |  - FK Constraints & Triggers      |   |
|   |  - Password Hashing (bcrypt/argon2)   |   |  - Indexes (user_id, status)      |   |
|   |  - Session Revocation API             |   |  - Row Level Security (RLS)       |   |
|   +---------------------------------------+   +-----------------------------------+   |
+---------------------------------------------------------------------------------------+
```

---

## 11. Security Considerations

1. **Authentication Security:**
   - Plaintext passwords never touch the backend Express database; authentication is handled through Supabase Auth using salted cryptographic hashes.
   - JWT tokens are signed cryptographically and set with realistic expiration windows.
2. **Access Control & Multi-Tenancy:**
   - All CRUD queries enforce strict user scoping:  
     `SELECT * FROM tasks WHERE id = $1 AND user_id = $2;`
   - Prevents Insecure Direct Object References (IDOR), ensuring User A cannot read, edit, or delete User B's tasks by guessing task UUIDs.
3. **API Input Validation & Injection Mitigation:**
   - Every incoming request body is parsed against strict validation schemas before database execution.
   - All SQL interactions utilize parameterized queries or the Supabase client SDK, neutralizing SQL injection vectors.
4. **CORS & Network Security:**
   - The Express CORS middleware will whitelist only the configured frontend domain (`FRONTEND_URL`), blocking unauthorized cross-origin requests.
5. **Environment Variable Hygiene:**
   - Sensitive credentials (`SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`) will reside strictly on the server in `.env`.
   - The client will only have access to public, anon keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

---

## 12. Validation Requirements

A dual-layer validation strategy will be enforced:

### 12.1 Client-Side Validation Rules
- **Registration Form:** Valid email format; password minimum 8 characters; password confirmation must match.
- **Login Form:** Required email; required password.
- **Task Form:**
  - `title`: Required, 1 to 255 characters.
  - `description`: Optional, maximum 2000 characters.
  - `status`: Required selection from permitted values (`pending`, `in_progress`, `completed`).
  - `priority`: Required selection from permitted values (`low`, `medium`, `high`, `urgent`).
  - `due_date`: Optional; if provided, must be a valid date.

### 12.2 Server-Side Schema Validation Rules (Zod / Joi)
- Re-verifies all client rules on the incoming request body before calling the service layer.
- Strips unrecognized properties from payloads to prevent mass-assignment vulnerabilities.
- Validates URL parameters (`:id`) to ensure they conform to valid UUID string formats.

---

## 13. Proposed Testing Approach (Mid-Stage & Automated)

To fulfill the Week 2 testing objectives (*"Conduct mid-stage testing with sample data or dummy scenarios"*), the following testing strategy will be adopted:

### 13.1 Synthetic Sample Data Sets
Synthetic task scenarios will be prepared to evaluate system states without touching real user accounts:
- **Scenario A (Standard Active Task):** `{ title: "Review Pull Request", status: "pending", priority: "high", due_date: "2026-10-15T18:00:00Z" }`
- **Scenario B (Completed Low Priority):** `{ title: "Update README", status: "completed", priority: "low", due_date: null }`
- **Scenario C (Overdue Urgent Task):** `{ title: "Submit Final Milestone", status: "in_progress", priority: "urgent", due_date: "2026-10-02T12:00:00Z" }`

### 13.2 Mid-Stage Test Scenarios
1. **Unauthenticated Query Rejection:** Attempting to `GET /api/v1/tasks` without a Bearer token returns HTTP 401.
2. **Invalid Token Rejection:** Sending an expired or malformed token returns HTTP 401.
3. **Payload Validation Enforcement:** Sending `{ title: "" }` to `POST /api/v1/tasks` returns HTTP 400 with a descriptive error list.
4. **Cross-User Data Isolation (IDOR Test):** Attempting to update a task owned by User B using User A's token returns HTTP 404 / 403.
5. **Positive CRUD Lifecycle:** Create -> Read -> Update status to `completed` -> Delete.

### 13.3 Automated API Integration Testing (Week 3/4 Target)
- Test runner: **Jest** with **Supertest**.
- Will test the Express application directly in memory against mock Supabase drivers or isolated test databases.

---

## 14. Current State vs. Planned Design Matrix

To ensure absolute clarity regarding project status, all components are categorized into three distinct states:

| Component / Layer | Planned Design Specification | Work Not Yet Implemented | Decisions Requiring Approval |
| :--- | :--- | :--- | :--- |
| **Application Concept** | Task Management System with title, description, status, priority, due date | Application UI and controllers not coded | Concept acceptance by evaluator/mentors |
| **Database Schema** | PostgreSQL `tasks` table with UUID primary key and `user_id` FK | Table DDL not executed on PostgreSQL | Confirm use of `UUID` vs `SERIAL` ID format |
| **Authentication** | Supabase Auth (JWT) with client session storage and Bearer header | Auth integration and route guards not coded | Direct client auth vs. Express proxy auth |
| **Backend REST API** | Express layered architecture (Controller/Service/Middleware) | Express server files not created | Finalize base path (`/api/v1` vs `/api`) |
| **Frontend UI** | Next.js + TailwindCSS task dashboard, modals, and tables | React components not authored | Component styling theme & layout review |
| **Automated Testing** | Jest + Supertest integration suite with dummy scenarios | Test scripts not implemented | Mocking strategy vs. live test DB |

---

## 15. Week 2 Design Checklist & Critical Process Gaps

### 15.1 Week 2 Design Checklist
- [x] Application concept defined: Task Management System.
- [x] CRUD entity attributes specified (`title`, `description`, `status`, `priority`, `due_date`, `created_at`, `updated_at`).
- [x] User registration, login, auth guard, and logout lifecycles specified.
- [x] RESTful API endpoints and response envelopes documented.
- [x] Layered backend architecture and middleware pipeline blueprinted.
- [x] Database schema DDL and Row Level Security (RLS) policies planned.
- [x] Text-based system architecture diagram documented.
- [x] Validation rules (client and server) defined.
- [x] Mid-stage test scenarios and synthetic datasets specified.
- [ ] Core framework draft deliverable finalized (`documentation/framework-draft.md`).
- [ ] Standardized templates and guidelines published (`documentation/templates-guidelines.md`).
- [ ] Test scenario log created (`documentation/test-scenario-log.md`).
- [ ] Mentor / evaluator feedback gathered on framework design.

### 15.2 Critical Process Gaps & Unresolved Decisions
Before proceeding from design to execution (Week 3), the following architectural decisions and process gaps must be reviewed and formally resolved:

1. **Authentication Integration Architecture (Direct Client SDK vs. Backend Proxy):**
   - *Option A (Direct Client SDK - Recommended):* Next.js client directly calls `supabase.auth.signUp()` and `signInWithPassword()`, receives JWT, and attaches it as Bearer token to Express API calls.
   - *Option B (Backend Proxy Auth):* Next.js calls Express `/api/auth/login`, and Express forwards credentials to Supabase.
   - *Recommendation:* Option A minimizes server load, follows standard Supabase architecture, and maintains statelessness in Express.
2. **Identifier Strategy (`UUID` vs. `BIGSERIAL`):**
   - *Recommendation:* `UUID` (`gen_random_uuid()`) is selected to eliminate sequential ID enumeration attacks.
3. **Pagination & Query Limits:**
   - Default page size: 10 tasks per page with maximum limit capped at 50 to prevent unbounded query memory consumption.
4. **Resolution Gate:**
   - These 3 decisions will be submitted to the mentor/evaluator during the initial feedback gate to fulfill the Week 2 Key Metric (**"Initial framework approved, zero critical process gaps"**).
