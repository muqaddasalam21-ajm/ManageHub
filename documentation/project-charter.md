# Project Charter: Full-Stack Web App with Auth & Database (CRUD)

**Document Type:** Software Engineering Project Charter  
**Project Title:** Full-Stack Web App with Auth & Database (CRUD)  
**Lifecycle Stage:** Week 1 — Scope Definition & Baseline Analysis  
**Deliverable Classification:** Milestone 1 Core Planning Document  
**Status:** Approved for Baseline Planning (Implementation: **PLANNED / PENDING**)  

---

## 1. Project Overview

The **Full-Stack Web App with Auth & Database (CRUD)** project is a rigorous, 4-week software engineering initiative designed to build, test, and document a secure, decoupled web application. The application delivers end-to-end user identity management, authenticated route protection, structured RESTful API services, and complete Create, Read, Update, and Delete (CRUD) operations backed by a relational PostgreSQL database.

This project emphasizes modern engineering standards, architectural decoupling (separating the Next.js client from the Node.js/Express server), strong static typing via TypeScript, responsive UI styling via TailwindCSS, and automated endpoint verification.

---

## 2. Problem Statement

Modern full-stack applications frequently suffer from architectural pitfalls when built without formal requirements engineering:
- Tight coupling between client and persistence layers, resulting in unmaintainable systems.
- Inadequate authentication security, exposing unhashed passwords or failing to protect private API endpoints.
- Vulnerabilities arising from missing input validation, causing database corruption or injection defects.
- Inconsistent user interfaces that lack mobile responsiveness and fail to communicate system state (loading, error, empty).

This project addresses these challenges by engineering a clean, decoupled, production-grade system backed by automated verification, strict schema constraints, and comprehensive operational documentation.

---

## 3. Project Purpose

The purpose of this project is to apply foundational and intermediate software engineering principles across a structured 4-week development lifecycle. By deliberately separating planning, architectural design, execution, and verification, the project demonstrates how professional engineering methodologies ensure software reliability, security, and maintainability.

---

## 4. Project Objectives

The project aims to design, specify, implement, and verify a full-stack web application demonstrating:

1. **User Registration:** Secure account creation with credential validation and salted hashing.
2. **User Login:** Authenticated session establishment with cryptographically signed token issuance.
3. **Secure Authentication:** Stateless token lifecycle management (JWT) ensuring zero plaintext credential exposure.
4. **Protected Routes:** Comprehensive client-side navigation guards and server-side HTTP 401/403 authorization middleware.
5. **CRUD Functionality:** Complete Create, Read, Update, and Delete operations for domain records.
6. **Relational Database Integration:** Robust PostgreSQL schema with foreign keys, primary keys, timestamps, and relational integrity.
7. **REST API Architecture:** Decoupled, modular Express API routes adhering to standard HTTP methods and status codes.
8. **Data Validation:** Strict dual-layer validation across frontend forms and backend API payload schemas.
9. **Responsive Frontend:** Adaptive, mobile-first user interface styled with TailwindCSS utilities.
10. **Error Handling:** Centralized server error middleware and user-friendly client alert notifications.
11. **Automated API Endpoint Testing:** Scripted test suites validating endpoint status codes, payloads, and authorization edge cases.

---

## 5. Target Users

- **Primary Persona (End User / Authenticated Operator):** Individuals who create, inspect, update, and manage personal data records through an intuitive, reliable web interface.
- **Secondary Persona (Academic / Technical Evaluator):** Software engineering reviewers and instructors assessing code architecture, REST fidelity, security controls, test coverage, and documentation rigor.

---

## 6. Proposed Solution

The proposed solution implements a **three-tier decoupled architecture**:
1. **Frontend Presentation Tier (Next.js / React + TypeScript + TailwindCSS):** Delivers a responsive Single Page Application (SPA) managing client routing, form states, token storage, and UI feedback.
2. **Application & Service Tier (Node.js / Express + TypeScript):** A dedicated REST API server handling request routing, CORS headers, token verification, schema validation, and error processing.
3. **Persistence & Identity Tier (Supabase / PostgreSQL):** A managed PostgreSQL relational engine enforcing schema constraints and relationships, coupled with Supabase Auth for credential handling.

---

## 7. Core Features

- **Account Management:** User registration, credential login, secure logout, and session continuity.
- **Access Control:** Automatic redirection of unauthenticated users to `/login`; server-side rejection of unauthenticated requests with HTTP 401.
- **Record Management (CRUD):**
  - *Create:* Interactive form with instant validation to create new records.
  - *Read:* Responsive tabular and detail views listing user-owned records.
  - *Update:* Pre-populated edit modal persisting field modifications.
  - *Delete:* Destructive action safeguarded by an explicit confirmation dialog.
- **Data Scoping:** Enforced data isolation ensuring users access exclusively their own records (`user_id` scoping).
- **Search & Filtering:** Search bar and category filters enabling rapid record lookup.
- **User Feedback Pipeline:** Inline form error cues, loading state indicators, and success toast alerts.

---

## 8. Technology Stack

### Frontend:
- **Next.js / React:** Component architecture, page routing, and state management.
- **TypeScript:** Type contracts for props, component state, and API payload models.
- **TailwindCSS:** Utility-first responsive design system.

### Backend:
- **Node.js:** Event-driven asynchronous runtime.
- **Express:** RESTful routing, middleware pipeline, and controller architecture.

### Database & Auth:
- **Supabase / PostgreSQL:** Managed relational database, table constraints, and auth engine.

### Testing:
- **Automated API Endpoint Testing:** Programmatic testing suite (Jest / Supertest) targeting REST endpoints.

---

## 9. Project Scope

The following deliverables and components are strictly **In-Scope** for the 4-week timeline:

- Designing the three-tier system architecture, database ERD, and REST API contract.
- Implementation of the Supabase PostgreSQL database schema with foreign key relationships.
- Implementation of the Node.js/Express REST API endpoints (`/api/auth`, `/api/records`).
- Implementation of the Next.js/React frontend with TailwindCSS responsive styling.
- Secure token handling between frontend client and backend API headers.
- Dual-layer form and payload validation (client and server).
- Automated integration test suite for core REST API routes.
- Standard Operating Procedures (SOPs) for local execution, environment setup, and deployment.
- Final academic presentation deck and demonstration video.

---

## 10. Out of Scope

To prevent scope creep and guarantee high-quality execution of core features within the 4-week timeframe, the following features are **intentionally excluded**:

- Complex enterprise Role-Based Access Control (RBAC) beyond basic user-level data ownership.
- Social OAuth logins (Google, GitHub, Facebook) — standard email/password authentication is prioritized.
- File upload/object storage pipelines (e.g., S3/Supabase Storage bucket management).
- Payment gateways, subscription billing, or e-commerce processing.
- Real-time WebSockets or live collaborative multi-user editing.
- Native mobile applications (iOS / Android).
- Complex microservice infrastructure or Kubernetes cluster orchestration.

---

## 11. Key Assumptions

- **Development Environment:** Developers have access to Node.js (v18+ or v20+ LTS), Git, modern web browsers, and terminal tooling.
- **Technology Availability:** Cloud services (Supabase managed PostgreSQL) maintain high availability without extended service interruptions.
- **Database Access:** Free-tier cloud PostgreSQL connectivity is sufficient for development and testing workloads.
- **Testing Data:** Synthetic, non-production dummy data will be utilized for manual verification and automated test suites.
- **Project Timeline:** The project will adhere strictly to the 4-week milestone schedule without timeline extensions.
- **Student / Team Resources:** Allocation of focused engineering hours each week aligned with the specific objectives of that milestone.

---

## 12. Constraints

- **Time Constraint:** Strict 4-week hard deadline across planning, design, implementation, and handover.
- **Academic Scope:** Must satisfy academic engineering rubrics requiring decoupled architecture, documentation, and clean Git hygiene.
- **Resource Constraints:** Single developer / small student team with finite hours per week, necessitating strict adherence to the MoSCoW prioritization matrix.
- **Core Priority Focus:** Essential CRUD and authentication must be perfected before any discretionary enhancements are considered.
- **Technology Boundaries:** Must utilize the mandated technology stack (Next.js, Express, PostgreSQL/Supabase, TypeScript, TailwindCSS).

---

## 13. Risks & Mitigation Strategies

| Risk | Potential Impact | Planned Mitigation Strategy |
| :--- | :--- | :--- |
| **Authentication Security** | Insecure token handling or credential exposure could compromise user accounts. | Delegate password hashing and token generation to Supabase Auth; enforce stateless JWT verification on all protected Express routes; store tokens securely in memory / secure cookies. |
| **Database Configuration** | Remote connection timeouts or misconfigured connection strings could halt API operations. | Establish environment variable templates early; test database pool connectivity during Week 2; utilize Supabase client SDK fallback. |
| **API Integration** | Payload shape mismatches between frontend fetch calls and backend controllers causing client runtime crashes. | Define shared TypeScript interfaces for all request and response envelopes during Week 2 architecture design before coding. |
| **Scope Creep** | Adding unnecessary features (social auth, file uploads, notifications) could jeopardize the 4-week deadline. | Strictly enforce the "Out of Scope" boundary list; relegate non-essential features to the "Could Have" backlog. |
| **Technical Errors** | Unhandled server exceptions could crash the Node.js process during evaluation. | Wrap asynchronous controllers with an `asyncHandler` utility and implement a centralized Express error-handling middleware. |
| **Testing Delays** | Postponing testing to the final days could lead to undiscovered regressions. | Schedule automated API endpoint test writing concurrently with API route development during Week 3. |
| **Deployment Problems** | Environment variables, CORS errors, or build failures could disrupt the final demonstration. | Standardize `.env.example` templates; configure CORS origins dynamically; perform dry-run production builds early in Week 4. |
| **Time Management** | Imbalanced effort across weeks causing rushed implementation in Week 4. | Adhere rigidly to the weekly deliverables defined in the official 4-week roadmap; hold weekly milestone gate reviews. |

---

## 14. Success Criteria

| Success Criterion | Target Benchmark | Actual Result (Week 1 Status) |
| :--- | :--- | :--- |
| **Authentication System** | Secure user registration and login functional with JWT issuance | **Pending implementation (Week 3)** |
| **Protected Routes** | Unauthorized requests to API or protected pages rejected with 401/redirect | **Pending implementation (Week 3)** |
| **CRUD Operations** | Full Create, Read, Update, Delete cycles operational and verified | **Pending implementation (Week 3)** |
| **Database Connection** | PostgreSQL (Supabase) connected with relational foreign key integrity | **Pending implementation (Week 3)** |
| **REST API Endpoints** | Standard HTTP verbs (`POST`, `GET`, `PUT`, `DELETE`) operational with JSON responses | **Pending implementation (Week 3)** |
| **Input Validation** | Client form validation and backend schema validation rejecting bad payloads | **Pending implementation (Week 3)** |
| **Responsive UI** | Mobile, tablet, and desktop layouts rendering without overflow or breakage | **Pending implementation (Week 3)** |
| **Automated API Testing** | Automated test suite passing with zero critical route failures | **Pending implementation (Week 3/4)** |
| **Type Safety** | Clean TypeScript compilation with zero type errors (`strict: true`) | **Pending implementation (Week 3/4)** |
| **Production Build** | Frontend and backend build successfully without lint or compilation errors | **Pending implementation (Week 4)** |
| **Project Documentation** | All milestone reports, audit documents, SOPs, and charters completed | **In Progress (Week 1 on schedule)** |
| **Final Demonstration** | Live system demonstration and presentation delivered within rubric requirements | **Not yet measured (Scheduled Week 4)** |

---

## 15. Official 4-Week Project Timeline

The project strictly follows the official 4-week roadmap:

### Week 1: Scope Definition & Baseline Analysis

**Objectives:**
- Audit current domain workflows and baseline tools:
  - Next.js / React
  - Node.js / Express
  - Supabase / PostgreSQL
- Conduct stakeholder interviews / market research to map core project requirements.
- Define success metrics (KPIs/OKRs) and establish workspace documentation structure.
- Create project master sheet / workspace dashboard.

**Deliverables:**
- Baseline audit report (`documentation/baseline-audit.md`)
- Project charter & KPI document (`documentation/project-charter.md`, `documentation/kpi-document.md`)
- Workspace setup (clean repository hierarchy and tracking README)

---

### Week 2: Framework & Workflow Design

**Objectives:**
- Design primary operational framework and Node.js / Express / Supabase / PostgreSQL workflows.
- Create standardized templates, formulas, or process documentation.
- Conduct mid-stage testing with sample data or dummy scenarios.
- Gather initial feedback from domain mentors/team.

**Deliverables:**
- Core framework draft
- Standardized templates & guidelines
- Test scenario log

---

### Week 3: Execution & Tool Integration

**Objectives:**
- Integrate TailwindCSS and TypeScript.
- Roll out test execution across target scenarios/campaign segments.
- Refine copy, analytics tracking, or calculation formulas based on pilot data.
- Establish operational SLAs and QA checklists.

**Deliverables:**
- Integrated tool workflows
- Pilot execution data
- SLA checklist

---

### Week 4: Final Implementation, SOPs & Executive Presentation

**Objectives:**
- Finalize SOPs and training handoff documentation.
- Publish final project portfolio materials (case study report + executive summary).
- Prepare 3–5 minute video presentation walking through strategic findings/outcomes.
- Present results to domain leads for final score evaluation.

**Deliverables:**
- Final SOP documentation
- Executive presentation deck
- Demo video (3–5 min)
- Portfolio case study

---

## 16. Expected Final Deliverables

At the conclusion of the 4-week engineering lifecycle, the project will submit the following completed artifacts:

1. **Source Code Repository:** Clean, modular, well-commented Next.js frontend and Express backend codebases written in TypeScript with full CRUD and authentication.
2. **Database Schema & Migrations:** SQL definitions for PostgreSQL tables, constraints, foreign keys, and indexes.
3. **Automated Test Suite:** Integration test scripts verifying API endpoints and validation edge cases.
4. **Standard Operating Procedures (SOPs):** Detailed setup, environment configuration, database migration, and troubleshooting documentation.
5. **Project Portfolio Case Study:** Comprehensive technical report detailing architecture, trade-offs, and outcomes.
6. **Executive Presentation Deck:** Slide deck summarizing problem, solution, architecture, and metrics.
7. **Demo Video:** A 3–5 minute walkthrough demonstrating authenticated workflows, CRUD operations, database changes, and responsive UI.
