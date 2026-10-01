# Desk Research & Requirements Analysis Report

**Project Title:** Full-Stack Web App with Auth & Database (CRUD)  
**Lifecycle Stage:** Week 1 — Scope Definition & Baseline Analysis  
**Deliverable Status:** Desk Research & Core Requirements Mapping (**PLANNED / SPECIFIED**)  
**Document Classification:** Software Engineering Milestone 1 Requirements Specification  

---

## 1. Executive Summary & Research Methodology

This report fulfills the requirements analysis component of Week 1 Objective 2: *"Conduct stakeholder interviews / market research to map core project requirements."*

Because empirical stakeholder interviews and surveys have not yet been conducted in the field, this document adopts a disciplined **Desk Research & Requirements Analysis** methodology. It analyzes industry-standard patterns, curriculum benchmarks, and technical expectations commonly required of beginner-to-intermediate full-stack web applications featuring authentication, RESTful APIs, and relational database persistence.

> [!IMPORTANT]
> **Research Governance & Integrity Disclosure:**
> - **Stakeholder interviews:** Pending
> - **Market research type:** Desk research / requirements analysis
> - **Interview results:** Not available (no fictional interviews or quotes are included)
> - **Survey results:** Not available (no invented market statistics or percentages are reported)
> - **Stakeholder Alignment:** Pending formal review; alignment has **not** yet been claimed as achieved.

---

## 2. In-Depth Analysis of Core Application Requirements

The following 16 core requirements have been evaluated across user necessity, technical significance, expected implementation approach, and project prioritization.

### 2.1 User Registration
- **Description:** Enables new users to create an account by supplying credentials (email and secure password).
- **Why Users Need It:** Allows individuals to establish personal identity and access individualized data within the application.
- **Why It Matters Technically:** Enforces credential hashing, prevents duplicate account creation, and instantiates user records in the identity schema.
- **Expected Implementation Approach:** Form validation on client; delegated to Supabase Auth API (`auth.signUp()`) to ensure salted hashing (bcrypt/Argon2) and identity record creation.
- **Priority:** **Must Have**

### 2.2 User Login
- **Description:** Authenticates returning users via email and password, establishing an active session.
- **Why Users Need It:** Grants returning users secure, seamless access to their existing records.
- **Why It Matters Technically:** Verifies credentials, initiates session lifecycles, and returns cryptographically signed JSON Web Tokens (JWTs) for request authorization.
- **Expected Implementation Approach:** Supabase Auth (`auth.signInWithPassword()`) returning access and refresh tokens.
- **Priority:** **Must Have**

### 2.3 Authentication
- **Description:** Verifies identity on every interaction and maintains session continuity across page reloads.
- **Why Users Need It:** Keeps user accounts protected without requiring credential re-entry on every page navigation.
- **Why It Matters Technically:** Eliminates stateful server-session bottlenecks by leveraging stateless JWT bearer tokens transmitted via HTTP `Authorization` headers.
- **Expected Implementation Approach:** Client-side token storage (in-memory/secure cookie) paired with Express JWT verification middleware on protected API endpoints.
- **Priority:** **Must Have**

### 2.4 Protected Routes
- **Description:** Restricts access to sensitive pages and backend endpoints exclusively to verified users.
- **Why Users Need It:** Prevents unauthorized viewing or tampering with private account data.
- **Why It Matters Technically:** Enforces zero-trust defense on both client routing (Next.js route guards/middleware) and backend API endpoints (HTTP 401 Unauthorized responses).
- **Expected Implementation Approach:** Next.js client-side route guards redirecting unauthenticated users to `/login`; Express middleware rejecting missing/invalid tokens.
- **Priority:** **Must Have**

### 2.5 Role-Based Access Control (RBAC)
- **Description:** Differentiates permissions based on user role (e.g., standard `User` vs. privileged `Admin`).
- **Why Users Need It:** Ensures users only access features appropriate to their operational responsibility.
- **Why It Matters Technically:** Prevents privilege escalation and restricts administrative actions (e.g., managing other users or system-wide records).
- **Expected Implementation Approach:** Role claim embedded in user metadata or stored in a `profiles` table, evaluated via backend authorization middleware.
- **Priority:** **Could Have** (Scope contingency for Week 3/4 if primary CRUD velocity allows; single-user ownership is prioritized first).

### 2.6 CRUD Operations
- **Description:** Complete suite of Create, Read, Update, and Delete actions on domain data entities.
- **Why Users Need It:** The fundamental utility of the application: creating items, viewing existing entries, modifying outdated details, and removing obsolete items.
- **Why It Matters Technically:** Forms the core data persistence and business logic contracts, validating HTTP method mapping (`POST`, `GET`, `PUT`/`PATCH`, `DELETE`).
- **Expected Implementation Approach:** Express REST route handlers executing parameterized SQL operations against PostgreSQL tables via Supabase client.
- **Priority:** **Must Have**

### 2.7 Relational Database
- **Description:** Structured SQL database engine organizing entities into tables with strict schemas and relations.
- **Why Users Need It:** Ensures recorded data is reliably stored, consistent, and permanently accessible.
- **Why It Matters Technically:** Provides ACID guarantees, schema validation, foreign key constraints (e.g., linking records to `user_id`), and indexing for efficient querying.
- **Expected Implementation Approach:** PostgreSQL instance managed via Supabase, with explicit relational schemas and foreign key cascades.
- **Priority:** **Must Have**

### 2.8 REST APIs
- **Description:** Standardized HTTP-based interface connecting the client interface to backend services.
- **Why Users Need It:** Enables smooth, asynchronous data updates without jarring full-page browser reloads.
- **Why It Matters Technically:** Enforces architectural decoupling, uniform resource naming (`/api/v1/records`), standard HTTP verbs, and consistent JSON envelopes.
- **Expected Implementation Approach:** Node.js with Express Router utilizing modular controllers, standard status codes (`200`, `201`, `400`, `401`, `404`, `500`), and JSON responses.
- **Priority:** **Must Have**

### 2.9 Form Validation
- **Description:** Verifies that user-entered data complies with required formats, lengths, and types before submission.
- **Why Users Need It:** Provides immediate visual guidance when an entry is invalid, preventing silent errors or failed submissions.
- **Why It Matters Technically:** First line of defense against malformed inputs, database truncation errors, and injection attacks.
- **Expected Implementation Approach:** Client-side feedback in React forms combined with strict server-side schema validation (e.g., Zod / Joi) inside Express middleware.
- **Priority:** **Must Have**

### 2.10 Search
- **Description:** Allows users to query records matching specific text keywords.
- **Why Users Need It:** Speeds up record retrieval as the dataset grows beyond what can be scanned visually.
- **Why It Matters Technically:** Requires server-side query parameter processing (`?search=term`) translated into SQL `ILIKE` or full-text search operators.
- **Expected Implementation Approach:** Search bar input with debouncing on the frontend, executing filtered SQL queries on the backend.
- **Priority:** **Should Have**

### 2.11 Filtering
- **Description:** Allows users to narrow down displayed records based on categories, status, or date intervals.
- **Why Users Need It:** Simplifies data exploration and task prioritization by isolating specific subsets of items.
- **Why It Matters Technically:** Requires dynamic SQL query construction handling optional filter parameters (`?status=active&category=work`).
- **Expected Implementation Approach:** UI dropdowns/filter chips passing structured query parameters to the Express API controller.
- **Priority:** **Should Have**

### 2.12 Pagination
- **Description:** Segments large record collections into manageable, numbered pages.
- **Why Users Need It:** Prevents sluggish page rendering and infinite scrolling fatigue.
- **Why It Matters Technically:** Protects backend and database performance by capping query payload size using SQL `LIMIT` and `OFFSET` (or cursor-based pagination).
- **Expected Implementation Approach:** API accepts `?page=1&limit=10`, returns paginated data alongside metadata (`totalCount`, `totalPages`, `currentPage`).
- **Priority:** **Should Have**

### 2.13 Responsive UI
- **Description:** An adaptive interface layout that dynamically adjusts to mobile, tablet, and desktop viewports.
- **Why Users Need It:** Enables access and management of data across different devices without broken elements.
- **Why It Matters Technically:** Adheres to modern web accessibility standards, eliminating horizontal overflow and unreadable text.
- **Expected Implementation Approach:** Mobile-first component construction utilizing TailwindCSS responsive breakpoint classes (`sm:`, `md:`, `lg:`).
- **Priority:** **Must Have**

### 2.14 Error Handling
- **Description:** Graceful handling and informative reporting of unexpected failures or client mistakes.
- **Why Users Need It:** Explains clearly what went wrong (e.g., "Network disconnected" or "Invalid credentials") rather than leaving a blank screen.
- **Why It Matters Technically:** Prevents unhandled exceptions from terminating the Node process; avoids leaking internal database schemas or stack traces to end users.
- **Expected Implementation Approach:** Centralized Express error-handling middleware returning sanitized `{ success: false, error: "..." }` envelopes; React error boundaries and toast notifications.
- **Priority:** **Must Have**

### 2.15 Security
- **Description:** Comprehensive defenses against common web vulnerabilities (CORS, injection, token theft).
- **Why Users Need It:** Protects personal identity, prevents data leaks, and ensures data privacy.
- **Why It Matters Technically:** Safeguards against OWASP Top 10 vulnerabilities through parameterized queries, secure CORS headers, password hashing, and token verification.
- **Expected Implementation Approach:** Express security middleware (`cors`, `helmet`), parameterized SQL via Supabase client, environment variable isolation, and HTTPS/TLS encryption.
- **Priority:** **Must Have**

### 2.16 Automated API Testing
- **Description:** Programmatic test suites verifying endpoint behavior, response codes, and payload schemas automatically.
- **Why Users Need It:** Indirect benefit: ensures features remain functional and regression-free during iterative updates.
- **Why It Matters Technically:** Validates contract adherence, reduces manual QA time, and provides confidence during refactoring.
- **Expected Implementation Approach:** Integration test suite using Jest and Supertest targeting Express route endpoints (auth, CRUD, validation edge cases).
- **Priority:** **Should Have** (Core endpoints targeted in Week 3/4).

---

## 3. Requirements Priority Matrix

| Requirement | Description | User Need | Technical Importance | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **User Registration** | Creates new user account with email and password | Establish personal account and secure workspace | Salting/hashing credentials; identity schema instantiation | **Must Have** |
| **User Login** | Authenticates returning user with email/password | Access personal records across sessions | Token issuance (JWT); session lifecycle initiation | **Must Have** |
| **Authentication** | Verifies identity on every transaction | Seamless access without continuous re-login | Stateless JWT token validation on API requests | **Must Have** |
| **Protected Routes** | Guards views and API endpoints from unauthenticated access | Keeps private data confidential | Client-side navigation guards + HTTP 401 server enforcement | **Must Have** |
| **Role-Based Access Control** | Assigns roles (`User`, `Admin`) with distinct permissions | Prevents standard users from modifying system-wide settings | Server-side authorization middleware based on user claims | **Could Have** |
| **CRUD Operations** | Complete Create, Read, Update, Delete workflow | Core functionality to record, view, modify, and remove data | REST HTTP verb mapping; parameterized database mutations | **Must Have** |
| **Relational Database** | Structured PostgreSQL tables with integrity constraints | Reliable, persistent, durable data storage | ACID transactions; foreign key relations (`user_id`) | **Must Have** |
| **REST APIs** | Structured HTTP endpoints returning JSON | Fast, non-blocking UI interactions without page reloads | Modularity; separation of concerns; predictable contracts | **Must Have** |
| **Form Validation** | Validates field rules before and during submission | Clear, immediate feedback on incorrect inputs | Input sanitation; protection against bad database inserts | **Must Have** |
| **Search** | Keyword search across record attributes | Quickly locate specific records | Query parsing; SQL `ILIKE` / substring filtering | **Should Have** |
| **Filtering** | Categorical and status filtering of items | Isolate subsets of data efficiently | Dynamic SQL query generation with multiple parameters | **Should Have** |
| **Pagination** | Page-based segmenting of record lists | Clean browsing; avoids overwhelming long lists | Payload capping via SQL `LIMIT` / `OFFSET`; query optimization | **Should Have** |
| **Responsive UI** | Mobile, tablet, and desktop adaptive layouts | Unbroken experience on any device screen | Viewport resilience using TailwindCSS utility classes | **Must Have** |
| **Error Handling** | Graceful error capture and user alerts | Understand and recover from operational errors | Prevents process crashes; hides server stack traces | **Must Have** |
| **Security** | CORS, input sanitation, secure token handling | Peace of mind that data is safe and isolated | Mitigates OWASP risks; enforces authentication policies | **Must Have** |
| **Automated API Testing** | Automated script suites testing REST endpoints | Ensures reliable, bug-free application updates | Regression prevention; CI/CD compatibility; contract tests | **Should Have** |

---

## 4. Functional Requirements

The planned application system will satisfy the following functional requirements:

- **`FR-01` Account Creation:** The system shall allow unregistered visitors to create an account by providing an email and password meeting complexity rules.
- **`FR-02` User Authentication:** The system shall authenticate registered users, issuing a valid JWT upon successful verification.
- **`FR-03` Session Termination:** The system shall allow authenticated users to log out, invalidating their client-side session token.
- **`FR-04` Record Creation:** The system shall allow an authenticated user to submit new records through a validated form.
- **`FR-05` Record Retrieval:** The system shall retrieve and display records belonging to the authenticated user in an organized table view.
- **`FR-06` Record Modification:** The system shall allow a user to edit an existing record via a pre-filled form, persisting updates to the database.
- **`FR-07` Record Deletion:** The system shall allow a user to delete a record with explicit confirmation to prevent accidental loss.
- **`FR-08` Data Scoping:** The system shall strictly prevent users from viewing, editing, or deleting records created by other users.
- **`FR-09` Search & Filtering:** The system shall allow users to search records by keyword and filter by category or status.
- **`FR-10` Form Feedback:** The system shall display inline validation errors if required fields are omitted or incorrectly formatted.

---

## 5. Non-Functional Requirements

To ensure architectural quality and engineering standard compliance, the system will adhere to these non-functional requirements:

### 5.1 Security
- Passwords must never be stored in plaintext; all password management is delegated to Supabase Auth's salted hashing mechanisms.
- All non-public backend REST endpoints must require a valid Bearer JWT.
- CORS must be restricted strictly to the frontend origin.
- All database queries must use parameterized interfaces to eliminate SQL injection vulnerabilities.

### 5.2 Performance
- API response latency for basic CRUD operations should remain under 200 ms under local development conditions.
- Frontend bundle size must be optimized using Tailwind purging and Next.js code splitting.

### 5.3 Reliability
- The backend API process must not crash upon receiving invalid input or database disconnections; all async routes must be wrapped with centralized error handling.
- Database transactions must maintain ACID properties, preventing partial writes.

### 5.4 Maintainability
- TypeScript must be used across frontend and backend codebases with strict type checking enabled (`strict: true`).
- Clean folder structure separating routes, controllers, services, and middlewares.

### 5.5 Usability
- Interface elements must provide immediate feedback for asynchronous actions (e.g., loading spinners, disabled submit buttons during submission, success toasts).
- Confirmation dialogs must accompany destructive operations (record deletion).

### 5.6 Responsiveness
- The interface must remain fully functional across viewports from 375px (mobile) to 1920px (desktop) without horizontal scrolling or clipped content.

### 5.7 Scalability
- The stateless REST API architecture must allow horizontal scaling without shared in-memory server state.
- Database records must be queryable via indexed foreign keys (`user_id`).

---

## 6. Requirements Summary

### Must Have (Essential Core for Final Project)
1. **User Registration** (Secure account creation)
2. **User Login** (Credential verification)
3. **Authentication** (JWT token lifecycle)
4. **Protected Routes** (Route guards & API security)
5. **CRUD Operations** (Full Create, Read, Update, Delete functionality)
6. **Relational Database** (PostgreSQL schema with user association)
7. **REST APIs** (Decoupled Express service with standardized HTTP verbs)
8. **Form Validation** (Dual-layer client and server validation)
9. **Responsive UI** (TailwindCSS multi-device layout)
10. **Error Handling** (Centralized error pipeline and user notifications)
11. **Security** (CORS, token verification, parameterized queries)

### Should Have (Useful Enhancements Improving Project Quality)
1. **Search** (Keyword-based record lookup)
2. **Filtering** (Category and status filtering)
3. **Pagination** (Page-based dataset chunking)
4. **Automated API Testing** (Jest/Supertest integration suite)

### Could Have (Optional Enhancements If Schedule Permits)
1. **Role-Based Access Control** (Multi-tier admin/user role differentiation)
2. **Export Functionality** (CSV/JSON data export for user records)
3. **Dark / Light Theme Toggle** (TailwindCSS theme switching)

---

## 7. Stakeholder Research Status

To maintain transparent governance throughout Week 1:

- **Stakeholder Interviews:** **Pending** (Interviews will be scheduled with academic evaluators and target users; no fictional interview content has been manufactured).
- **Market Research Type:** **Desk Research & Requirements Analysis** (Based on industry-standard CRUD architectures, OWASP guidelines, and academic software engineering standards).
- **Interview Results:** **Not available** at this stage.
- **Survey Results:** **Not available** at this stage.
- **Stakeholder Alignment Gate:** Formal alignment and scope sign-off remain **in progress** pending final review of Week 1 deliverables.

---

## 8. Week 1 Requirements Traceability

This requirements analysis directly satisfies **Objective 2 of Week 1** (*"Conduct stakeholder interviews / market research to map core project requirements"*). 

### How These Requirements Will Guide Week 2 (Framework & Workflow Design):
1. **Database Schema Design:** The identified entities (`users`, `records`) and their relationships will directly determine the **Entity-Relationship Diagram (ERD)** to be drafted in Week 2.
2. **API Contract Formulation:** The functional requirements (`FR-01` through `FR-10`) and CRUD specifications will dictate the exact REST endpoints, HTTP methods, request bodies, and response envelopes specified in the Week 2 API documentation.
3. **Component Architecture & Wireframes:** The UI requirements (form validation, responsive tables, modal dialogs, search/filter controls) will establish the component hierarchy and wireframe diagrams designed in Week 2.
4. **Security & Middleware Pipeline:** Non-functional security requirements will define the Express middleware architecture (CORS, Auth Guard, Validation Layer) to be blueprinted in Week 2.
