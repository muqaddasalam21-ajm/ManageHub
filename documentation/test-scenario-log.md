# Test Scenario Log: Mid-Stage Testing & Verification Blueprint

**Document Type:** Software Testing & Quality Assurance Scenario Log  
**Project Title:** Full-Stack Web App with Auth & Database (CRUD)  
**Lifecycle Stage:** Week 2 — Framework & Workflow Design  
**Deliverable Classification:** Milestone 2 Core Deliverable 3 (`documentation/test-scenario-log.md`)  
**Status:** **PLANNED TEST SPECIFICATION — NOT YET EXECUTED**  

---

## 1. Test Scenario Log Purpose

The purpose of this Test Scenario Log is to fulfill Objective 3 of **Week 2**: *"Conduct mid-stage testing with sample data or dummy scenarios."*

Before implementation code is written in Week 3, quality assurance engineering mandates the creation of structured test scenarios, synthetic datasets, and verification procedures. This document specifies:
- Rigorous positive, negative, and boundary test scenarios across Authentication, CRUD, Validation, and Security.
- Synthetic dummy user personas and task datasets for deterministic testing.
- A standardized defect tracking template and exit criteria for Week 3/4 testing phases.

> [!IMPORTANT]
> **Execution Status Disclosure:** All test scenarios in this document are **PLANNED SPECIFICATIONS**. Because application implementation has not yet occurred, **execution status across all scenarios is explicitly marked as "Not Yet Executed"**. Zero test runs have occurred, and zero actual test results have been fabricated.

---

## 2. Testing Scope

The planned test coverage encompasses 14 distinct functional, security, and quality domains:

1. **User Registration:** Verification of account creation, password complexity checks, and duplicate account rejection.
2. **User Login:** Verification of credential authentication, JWT token issuance, and bad password rejection.
3. **Authentication Lifecycle:** Stateless token storage, Bearer header attachment, and session termination (logout).
4. **Protected Routes:** Redirection of unauthenticated visitors on the client and rejection of unauthenticated API requests.
5. **Task Creation (CRUD - Create):** Verification of valid task insertion with default values and timestamps.
6. **Task Retrieval (CRUD - Read):** Verification of user-scoped task listings, individual task lookups, and filter/search query parsing.
7. **Task Modification (CRUD - Update):** Verification of partial and full task updates with audit timestamp updates.
8. **Task Deletion (CRUD - Delete):** Verification of task removal and prevention of orphan records.
9. **Dual-Layer Validation:** Rejection of missing fields, empty titles, invalid enums, and malformed date strings.
10. **Authorization & IDOR Prevention:** Strict verification that User A cannot read, update, or delete tasks belonging to User B.
11. **Error Handling & Response Codes:** Verification of HTTP 400, 401, 403, 404, and 500 error envelopes.
12. **Database Constraints:** PostgreSQL engine enforcement of primary keys, foreign keys (`ON DELETE CASCADE`), and domain `CHECK` rules.
13. **REST API Behavior:** Verification of HTTP verbs, JSON request body parsing, and CORS header enforcement.
14. **Responsive UI:** Visual rendering integrity across mobile (375px), tablet (768px), and desktop (1280px) viewports.

---

## 3. Synthetic Test Data Specification

To guarantee data privacy and reproducible testing, synthetic dummy data is established. No real personal information is used.

### 3.1 Synthetic User Personas

| Persona ID | Display Name | Synthetic Email | Purpose in Testing |
| :--- | :--- | :--- | :--- |
| **`USER_A`** | Alice Test | `alice.test@example.com` | Primary authenticated user; owner of baseline task records. |
| **`USER_B`** | Bob Test | `bob.test@example.com` | Secondary authenticated user; used to test authorization boundaries and IDOR isolation. |

### 3.2 Synthetic Task Records (Pre-Seeded Sample Data)

| Task Reference | Owner | Title | Description | Status | Priority | Due Date (UTC ISO 8601) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`TASK_A1`** | `USER_A` | Design Architecture Diagrams | Complete C4 and flow diagrams | `in_progress` | `high` | `2026-10-15T18:00:00.000Z` |
| **`TASK_A2`** | `USER_A` | Write Documentation Guidelines | Finalize markdown templates | `completed` | `medium` | `2026-10-10T12:00:00.000Z` |
| **`TASK_A3`** | `USER_A` | Review Project Rubric | Verify milestone deliverables | `pending` | `low` | `2026-10-20T09:00:00.000Z` |
| **`TASK_B1`** | `USER_B` | Bob Private Task | Confidential notes owned by Bob | `pending` | `urgent` | `2026-10-12T17:00:00.000Z` |

### 3.3 Test Payloads (Valid & Invalid Examples)

- **`PAYLOAD_VALID_TASK`:**  
  `{ "title": "Implement Zod Middleware", "description": "Add schema validation", "status": "pending", "priority": "high", "dueDate": "2026-10-18T15:00:00.000Z" }`
- **`PAYLOAD_EMPTY_TITLE`:**  
  `{ "title": "   ", "description": "Testing empty whitespace", "status": "pending", "priority": "low" }`
- **`PAYLOAD_INVALID_STATUS`:**  
  `{ "title": "Test Bad Status", "status": "archived_status_not_allowed" }`
- **`PAYLOAD_INVALID_PRIORITY`:**  
  `{ "title": "Test Bad Priority", "priority": "extreme_urgent" }`
- **`PAYLOAD_MALFORMED_DATE`:**  
  `{ "title": "Test Bad Date", "dueDate": "next-tuesday-afternoon" }`
- **`PAYLOAD_SQL_INJECTION`:**  
  `{ "title": "Test SQLi'; DROP TABLE tasks; --", "description": "Injection probe" }`

---

## 4. Comprehensive Test Scenario Matrix (20 Scenarios)

The following matrix defines 20 discrete scenarios covering Functional CRUD, Security, Validation, and System Error paths.

| Test ID | Feature | Scenario Description | Preconditions | Test Data | Steps | Expected Result | Execution Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`TC-AUTH-001`** | User Registration | Successful registration of a new user account | Database connected; email not previously registered | `email: "new.user@example.com"`, `password: "SecurePass123!"` | 1. Send `POST /api/v1/auth/register`<br>2. Inspect HTTP status & body | HTTP `201 Created`; user identity created in Supabase Auth; password hashed | **Not Yet Executed** | Verifies standard registration flow |
| **`TC-AUTH-002`** | User Registration | Registration rejection for duplicate email | `USER_A` account already exists | `email: "alice.test@example.com"`, `password: "Password123!"` | 1. Send `POST /api/v1/auth/register`<br>2. Inspect HTTP status | HTTP `400 Bad Request` or `409 Conflict`; descriptive error indicating email in use | **Not Yet Executed** | Negative test for account collision |
| **`TC-AUTH-003`** | User Login | Successful login with valid credentials | `USER_A` account exists | `email: "alice.test@example.com"`, `password: "Password123!"` | 1. Send `POST /api/v1/auth/login`<br>2. Inspect response envelope | HTTP `200 OK`; returns valid JWT `access_token` and `refresh_token` | **Not Yet Executed** | Verifies token generation |
| **`TC-AUTH-004`** | User Login | Login rejection for incorrect password | `USER_A` account exists | `email: "alice.test@example.com"`, `password: "WrongPassword999"` | 1. Send `POST /api/v1/auth/login`<br>2. Inspect response | HTTP `401 Unauthorized`; generic error message preventing user enumeration | **Not Yet Executed** | Negative authentication test |
| **`TC-AUTH-005`** | User Logout | Client session termination | `USER_A` has active session | Active JWT session | 1. Trigger `signOut()`<br>2. Verify client storage cleared | Client purges JWT; subsequent protected route visits redirect to `/login` | **Not Yet Executed** | Session termination verification |
| **`TC-SEC-001`** | Protected Routes | Unauthenticated API query rejection | None | None (no `Authorization` header) | 1. Send `GET /api/v1/tasks`<br>2. Inspect HTTP status | HTTP `401 Unauthorized`; `{ success: false, error: { code: "UNAUTHORIZED" } }` | **Not Yet Executed** | Verifies backend auth guard |
| **`TC-SEC-002`** | Security | Rejection of expired or tampered JWT | Backend active | Header: `Authorization: Bearer invalid.token.xyz` | 1. Send `GET /api/v1/tasks` with forged token<br>2. Inspect status | HTTP `401 Unauthorized`; token verification fails | **Not Yet Executed** | Verifies cryptographic signature check |
| **`TC-SEC-003`** | IDOR Isolation | User A attempts to read User B's task | `TASK_B1` exists owned by `USER_B`; `USER_A` authenticated | `id: TASK_B1.id`, Auth: `USER_A` JWT | 1. Send `GET /api/v1/tasks/:TASK_B1_id` with `USER_A` token<br>2. Inspect status | HTTP `404 Not Found` (or `403 Forbidden`); record data not returned | **Not Yet Executed** | Core IDOR cross-tenant isolation test |
| **`TC-SEC-004`** | IDOR Isolation | User A attempts to update User B's task | `TASK_B1` exists owned by `USER_B`; `USER_A` authenticated | `id: TASK_B1.id`, Body: `{ title: "Hacked" }`, Auth: `USER_A` JWT | 1. Send `PUT /api/v1/tasks/:TASK_B1_id` with `USER_A` token<br>2. Inspect status | HTTP `404 Not Found`; `TASK_B1` remains unchanged in database | **Not Yet Executed** | Verifies update ownership barrier |
| **`TC-SEC-005`** | IDOR Isolation | User A attempts to delete User B's task | `TASK_B1` exists owned by `USER_B`; `USER_A` authenticated | `id: TASK_B1.id`, Auth: `USER_A` JWT | 1. Send `DELETE /api/v1/tasks/:TASK_B1_id` with `USER_A` token<br>2. Inspect status | HTTP `404 Not Found`; `TASK_B1` remains intact in database | **Not Yet Executed** | Verifies delete ownership barrier |
| **`TC-SEC-006`** | Security | Parameterized SQL injection neutralization | `USER_A` authenticated | `PAYLOAD_SQL_INJECTION` | 1. Send `POST /api/v1/tasks` with SQL probe<br>2. Inspect DB state | HTTP `201 Created`; string stored literally; zero SQL commands executed | **Not Yet Executed** | Proves parameterized queries resist SQLi |
| **`TC-CRUD-001`** | CRUD - Create | Create task with complete valid payload | `USER_A` authenticated | `PAYLOAD_VALID_TASK` | 1. Send `POST /api/v1/tasks`<br>2. Inspect returned entity | HTTP `201 Created`; returns UUID `id`, `userId = USER_A.id`, timestamps | **Not Yet Executed** | Positive CRUD creation test |
| **`TC-CRUD-002`** | CRUD - Read | Retrieve all tasks owned by authenticated user | `USER_A` owns 3 tasks (`TASK_A1-A3`) | Auth: `USER_A` JWT | 1. Send `GET /api/v1/tasks`<br>2. Inspect response array | HTTP `200 OK`; returns 3 tasks; none belonging to `USER_B` | **Not Yet Executed** | Positive CRUD multi-read test |
| **`TC-CRUD-003`** | CRUD - Read Single | Retrieve single existing task by valid ID | `TASK_A1` exists owned by `USER_A` | `id: TASK_A1.id`, Auth: `USER_A` JWT | 1. Send `GET /api/v1/tasks/:TASK_A1_id`<br>2. Inspect payload | HTTP `200 OK`; returns exact task object matching `TASK_A1` | **Not Yet Executed** | Positive CRUD single-read test |
| **`TC-CRUD-004`** | CRUD - Update | Modify task status and priority | `TASK_A1` exists (`status: in_progress`) | Body: `{ status: "completed", priority: "urgent" }` | 1. Send `PUT /api/v1/tasks/:TASK_A1_id`<br>2. Inspect response | HTTP `200 OK`; status changed to `completed`; `updated_at > created_at` | **Not Yet Executed** | Positive CRUD update test |
| **`TC-CRUD-005`** | CRUD - Delete | Delete owned task with valid ID | `TASK_A3` exists owned by `USER_A` | `id: TASK_A3.id`, Auth: `USER_A` JWT | 1. Send `DELETE /api/v1/tasks/:TASK_A3_id`<br>2. Verify in DB | HTTP `200 OK`; row deleted; subsequent GET returns HTTP `404` | **Not Yet Executed** | Positive CRUD deletion test |
| **`TC-VAL-001`** | Validation | Rejection of empty / whitespace-only title | `USER_A` authenticated | `PAYLOAD_EMPTY_TITLE` | 1. Send `POST /api/v1/tasks`<br>2. Inspect error envelope | HTTP `400 Bad Request`; `{ error: { code: "VALIDATION_ERROR", details: [...] } }` | **Not Yet Executed** | Field validation negative test |
| **`TC-VAL-002`** | Validation | Rejection of invalid status enum value | `USER_A` authenticated | `PAYLOAD_INVALID_STATUS` | 1. Send `POST /api/v1/tasks`<br>2. Inspect error response | HTTP `400 Bad Request`; error specifies valid statuses (`pending`, `in_progress`, `completed`) | **Not Yet Executed** | Domain enum validation test |
| **`TC-VAL-003`** | Validation | Rejection of malformed due date format | `USER_A` authenticated | `PAYLOAD_MALFORMED_DATE` | 1. Send `POST /api/v1/tasks`<br>2. Inspect error response | HTTP `400 Bad Request`; error identifies invalid ISO 8601 date string | **Not Yet Executed** | Date formatting validation test |
| **`TC-ERR-001`** | Error Handling | Requesting non-existent task UUID | `USER_A` authenticated | `id: "00000000-0000-0000-0000-000000000000"` | 1. Send `GET /api/v1/tasks/:non_existent_uuid`<br>2. Inspect response | HTTP `404 Not Found`; `{ error: { code: "NOT_FOUND", message: "Task not found" } }` | **Not Yet Executed** | Verifies 404 error envelope mapping |

---

## 5. Security Scenarios Specification

To guarantee application defenses, the 8 mandated security vectors are explicitly structured:

1. **Unauthenticated Access (`TC-SEC-001`):** Calls to `/api/v1/tasks/*` without an `Authorization` header must immediately terminate at `authMiddleware` with HTTP `401 Unauthorized`.
2. **Invalid / Expired Token (`TC-SEC-002`):** Calls with an altered or expired JWT must be rejected with HTTP `401 Unauthorized`.
3. **Cross-Tenant Read Isolation (`TC-SEC-003`):** `USER_A` requesting `TASK_B1` (`/api/v1/tasks/:b1_id`) must receive HTTP `404 Not Found`, preventing object enumeration.
4. **Cross-Tenant Update Isolation (`TC-SEC-004`):** `USER_A` issuing a `PUT` against `TASK_B1` must be rejected with HTTP `404 Not Found`, leaving the record unmodified.
5. **Cross-Tenant Delete Isolation (`TC-SEC-005`):** `USER_A` issuing a `DELETE` against `TASK_B1` must be rejected with HTTP `404 Not Found`, leaving the row intact.
6. **Malformed JSON Payload (`TC-VAL-001`):** Submitting broken JSON syntax must return HTTP `400 Bad Request` without crashing the Express process.
7. **SQL Injection Resistance (`TC-SEC-006`):** Inserting strings like `' OR '1'='1` or `; DROP TABLE tasks;` into `title` or `description` must be safely parameterized and stored as literal string data.
8. **Unauthorized API Access Route-Level:** Attempting to invoke undocumented or administrative routes must be rejected with standard HTTP status codes.

---

## 6. CRUD Scenario Specification

The CRUD scenarios span both positive and boundary conditions:

- **Create:** Valid payload creation (`TC-CRUD-001`); Missing title failure (`TC-VAL-001`).
- **Read:** Multi-record list retrieval (`TC-CRUD-002`); Single-record lookup (`TC-CRUD-003`); Non-existent ID lookup (`TC-ERR-001`).
- **Update:** Full/partial field update (`TC-CRUD-004`); Cross-user update block (`TC-SEC-004`).
- **Delete:** Valid deletion with confirmation (`TC-CRUD-005`); Cross-user deletion block (`TC-SEC-005`).

---

## 7. Validation Scenario Specification

Validation testing exercises both client-side and server-side boundaries:

- **Empty Title:** Triggers client inline error cue and server Zod rejection (`TC-VAL-001`).
- **Excessively Long Title:** Title exceeding 255 characters rejected with HTTP `400 Bad Request`.
- **Invalid Status:** Status outside `['pending', 'in_progress', 'completed']` rejected with HTTP `400 Bad Request` (`TC-VAL-002`).
- **Invalid Priority:** Priority outside `['low', 'medium', 'high', 'urgent']` rejected with HTTP `400 Bad Request`.
- **Invalid Date:** Non-ISO date string rejected with HTTP `400 Bad Request` (`TC-VAL-003`).
- **Missing Required Fields:** Omission of `title` rejected with HTTP `400 Bad Request`.
- **Valid Payload:** Complete payload processed with HTTP `201 Created` (`TC-CRUD-001`).

---

## 8. Error Handling Specification

Every anticipated failure state maps to a standardized HTTP status code:

| Status Code | Trigger Condition | Expected Response Payload Code |
| :--- | :--- | :--- |
| **`400 Bad Request`** | Validation failure on title, status, priority, or date format | `VALIDATION_ERROR` |
| **`401 Unauthorized`** | Missing, malformed, or expired Bearer JWT token | `UNAUTHORIZED` |
| **`403 Forbidden`** | Authenticated user lacks permission for action | `FORBIDDEN` |
| **`404 Not Found`** | Task ID does not exist or belongs to another user account | `NOT_FOUND` |
| **`500 Internal Error`** | Unhandled server exception or database connectivity loss | `INTERNAL_SERVER_ERROR` |

---

## 9. Mid-Stage Dummy Data Test Plan (Week 2 Objective)

During Week 2, before live database tables and frontend forms exist, mid-stage testing is conducted conceptually and through mock harnesses:

1. **Controller Mock Harness:** Wire Express route handlers to mock service functions returning synthetic data (`TASK_A1-A3`).
2. **Middleware Pipeline Verification:** Pass synthetic HTTP headers (`Authorization: Bearer ...`) into `authMiddleware` to verify signature checking and `req.user` attachment logic.
3. **Validation Schema Verification:** Feed synthetic payloads (`PAYLOAD_EMPTY_TITLE`, `PAYLOAD_INVALID_STATUS`) directly into Zod schemas to confirm error messages match specification.

---

## 10. Test Execution Rules

When execution commences in Weeks 3 and 4, the testing process must adhere to the following rules:

1. **Zero Production Data:** All testing must utilize synthetic test accounts (`alice.test@example.com`, `bob.test@example.com`).
2. **Isolated Test Environments:** Integration tests must run against dedicated test tables or mock drivers to avoid state contamination.
3. **Idempotence & Cleanup:** Test suites creating records must delete them during teardown (`afterEach` / `afterAll`).
4. **Honest Defect Recording:** Any scenario producing a result divergent from the Expected Result must be marked `Fail` and logged in the Defect Tracker.

---

## 11. Defect & Issue Tracking Template

All defects discovered during future test execution will be logged using this standardized format:

```text
================================================================================
DEFECT LOG ENTRY
================================================================================
Defect ID:       DEF-[NUM] (e.g., DEF-001)
Associated TC:   [e.g., TC-SEC-003]
Severity:        [Critical | Major | Minor | Cosmetic]
Discovered Date: [YYYY-MM-DD]
Description:     [Clear summary of incorrect behavior]
Steps to Reproduce:
  1. [Step 1]
  2. [Step 2]
Expected Result: [Expected behavior per specification]
Actual Result:   [Actual divergent behavior observed]
Resolution:      [Fix description / commit reference]
Status:          [Open | In Progress | Resolved | Closed]
================================================================================
```

---

## 12. Test Exit Criteria

The application will satisfy test completion requirements only when:

- [ ] **100% Core Scenarios Passing:** All 20 scenarios in this log pass without failure.
- [ ] **Zero Critical or Major Defects:** Zero unresolved security defects (IDOR, SQLi) or crash-level errors.
- [ ] **Automated Test Suite Clean:** Jest/Supertest suite executes with zero failures (`exit code 0`).
- [ ] **Responsive Viewports Verified:** Zero layout truncation at 375px, 768px, and 1280px viewports.

---

## 13. Week 2 Objective Traceability Matrix

This document directly satisfies the third official objective of Week 2:  
> **"Conduct mid-stage testing with sample data or dummy scenarios."**

- **Sample Data Specification:** Defined in Section 3 (`USER_A`, `USER_B`, `TASK_A1-A3`).
- **Dummy Scenarios:** Formulated across Section 4 (20 Scenarios), Section 5 (Security), and Section 7 (Validation).
- **Mid-Stage Test Plan:** Formalized in Section 9 (Controller & Middleware Mock Testing).

---

## 14. Testing Status Summary

| Metric | Recorded Value |
| :--- | :--- |
| **Total Planned Scenarios** | **20** |
| **Executed Scenarios** | **0** |
| **Passed Scenarios** | **0** |
| **Failed Scenarios** | **0** |
| **Blocked Scenarios** | **0** |
| **Overall Testing Status** | **Not Yet Executed (Scheduled for Week 3 Execution)** |

---

## 15. Week 2 Testing Readiness Checklist

- [x] Testing scope established across auth, CRUD, validation, and security.
- [x] Synthetic personas (`USER_A`, `USER_B`) and task datasets specified.
- [x] 20 discrete test scenarios detailed with steps, test data, and expected results.
- [x] 8 core security scenarios designed (including IDOR and SQLi).
- [x] Standard HTTP status code error mapping documented.
- [x] Defect tracking template and exit criteria defined.
- [x] All execution statuses verified as **Not Yet Executed**.
- [x] Traceability mapped to Week 2 objectives.
- [ ] Week 3 execution of automated Jest/Supertest test suites (Pending Week 3 Kickoff).
