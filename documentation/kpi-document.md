# Key Performance Indicators (KPIs) & OKR Framework

**Document Type:** Software Engineering Measurement & Verification Specification  
**Project Title:** Full-Stack Web App with Auth & Database (CRUD)  
**Lifecycle Stage:** Week 1 — Scope Definition & Baseline Analysis  
**Deliverable Classification:** Milestone 1 Core Planning & Measurement Specification  
**Current Milestone Key Metric:** 100% Stakeholder Alignment & Scope Approval (**Status: Pending Stakeholder Review**)  

---

## 1. Project Objectives

The project objectives align with the official 4-week software engineering roadmap to ensure systematic progression from planning through delivery:

1. **Scope Alignment:** Achieve consensus among developers, academic evaluators, and stakeholders regarding project boundaries, preventing scope creep.
2. **Technology Baseline:** Evaluate candidate tools (Next.js/React, Node.js/Express, Supabase/PostgreSQL, TailwindCSS, TypeScript) to confirm technical feasibility and integration points.
3. **Requirements Definition:** Formulate a prioritized requirements specification (functional, non-functional, MoSCoW matrix) through structured desk research and analysis.
4. **Framework & Workflow Design (Week 2):** Model database entities (ERD), specify RESTful API contracts, blueprint authentication flows, and construct UI wireframes.
5. **Tool Integration (Week 3):** Unify frontend, backend, database, styling, and static typing into an operational full-stack system.
6. **Full-Stack Implementation (Week 3):** Implement secure user authentication and end-to-end CRUD functionality with persistent relational storage.
7. **Testing and QA (Week 3–4):** Execute automated API endpoint testing, error handling validation, and responsive cross-viewport testing.
8. **Documentation (Weeks 1–4):** Maintain rigorous engineering documentation including audit reports, project charters, SOPs, and portfolio case studies.
9. **Final Presentation & Demonstration (Week 4):** Deliver an executive slide deck, live walkthrough, and 3–5 minute video demonstration validating project outcomes.

---

## 2. Objectives and Key Results (OKRs)

### Objective 1 — Establish a Clear and Approved Project Scope (Week 1)
*Focus: Baseline analysis, requirements specification, governance, and workspace setup.*

| Key Result | Target | Measurement Method | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **KR 1.1: Baseline Audit** | Complete evaluation of 5 stack technologies | Document review of `baseline-audit.md` | Completed (5/5 technologies audited) | Completed |
| **KR 1.2: Requirements Analysis** | 16 core requirements analyzed with MoSCoW prioritization | Document review of `market-research.md` | Completed (16/16 requirements analyzed) | Completed |
| **KR 1.3: Project Charter** | Comprehensive 16-section charter detailing scope boundaries | Document review of `project-charter.md` | Completed (16/16 sections authored) | Completed |
| **KR 1.4: KPI Documentation** | Formal KPI/OKR measurement framework established | Document review of `kpi-document.md` | Completed | Completed |
| **KR 1.5: Workspace Setup** | Clean directory structure and tracking README | Workspace file tree inspection | Completed | Completed |
| **KR 1.6: Scope Approval** | 100% formal sign-off from project stakeholders | Formal milestone review sign-off record | Pending review session | Pending Stakeholder Approval |

---

### Objective 2 — Design a Reliable Technical Framework (Week 2)
*Focus: Architecture diagrams, database schemas, API contracts, and test scenarios.*

| Key Result | Target | Measurement Method | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **KR 2.1: Database Schema Design** | 100% normalized relational ERD with foreign keys | ERD diagram and SQL schema draft review | Pending implementation (Week 2) | Not Started |
| **KR 2.2: API Workflow Design** | Formal REST endpoint contract covering all CRUD actions | OpenAPI / Markdown endpoint specification | Pending implementation (Week 2) | Not Started |
| **KR 2.3: Auth Workflow Design** | End-to-end sequence diagram for registration, login, JWT validation | Sequence diagram and token lifecycle review | Pending implementation (Week 2) | Not Started |
| **KR 2.4: Integration Blueprint** | Component hierarchy and data flow specifications | Frontend-backend architecture review | Pending implementation (Week 2) | Not Started |
| **KR 2.5: Standardized Documentation** | Core framework draft and coding guidelines published | Deliverable audit against Week 2 rubric | Pending implementation (Week 2) | Not Started |
| **KR 2.6: Test Scenario Log** | Definition of at least 10 positive and negative test cases | Review of test scenario specification document | Pending implementation (Week 2) | Not Started |

---

### Objective 3 — Execute and Integrate the Technical Solution (Week 3)
*Focus: Full-stack implementation, database integration, and CRUD delivery.*

| Key Result | Target | Measurement Method | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **KR 3.1: Database & Auth Integration** | Supabase PostgreSQL connected; Auth operational | Connectivity test & user creation audit | Pending implementation (Week 3) | Not Started |
| **KR 3.2: Express REST API Implementation** | 100% core CRUD routes implemented with HTTP fidelity | Route inspection & controller verification | Pending implementation (Week 3) | Not Started |
| **KR 3.3: Next.js Frontend Integration** | Responsive CRUD views consuming Express API | Browser inspection & network tab verification | Pending implementation (Week 3) | Not Started |
| **KR 3.4: TailwindCSS Styling** | Mobile-first responsive UI applied to all views | Viewport testing (375px to 1920px) | Pending implementation (Week 3) | Not Started |
| **KR 3.5: TypeScript Compilation** | Zero type errors across frontend and backend | `tsc --noEmit` build execution | Pending implementation (Week 3) | Not Started |
| **KR 3.6: Protected Route Guarding** | 100% unauthorized queries rejected with HTTP 401 | Security inspection of API & client route guards | Pending implementation (Week 3) | Not Started |

---

### Objective 4 — Validate Quality and Prepare Final Delivery (Week 4)
*Focus: Automated verification, SOP creation, executive presentation, and video demo.*

| Key Result | Target | Measurement Method | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **KR 4.1: Automated API Test Suite** | 100% passing automated endpoint tests | Jest / Supertest execution report | Pending implementation (Week 4) | Not Started |
| **KR 4.2: Error Handling & Security Audit** | Zero unhandled crashes; zero raw stack trace leaks | Centralized error handler verification | Pending implementation (Week 4) | Not Started |
| **KR 4.3: Production Build Verification** | 100% clean production builds for client and server | `npm run build` exit code 0 | Pending implementation (Week 4) | Not Started |
| **KR 4.4: Final SOP Documentation** | Comprehensive deployment, setup, and recovery SOPs | Review of SOP markdown deliverable | Pending implementation (Week 4) | Not Started |
| **KR 4.5: Portfolio Case Study & Deck** | Published case study and executive presentation deck | Portfolio review against rubric | Pending implementation (Week 4) | Not Started |
| **KR 4.6: Video Demonstration** | 3–5 minute high-quality walkthrough video | Video playback and rubric evaluation | Pending implementation (Week 4) | Not Started |

---

## 3. Technical KPIs

| KPI Metric | Target | Measurement Method | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication Success** | 100% valid sign-ups and logins issue valid JWTs | Auth test suite / Postman runner | Pending implementation | Not Started |
| **Protected Route Behavior** | 100% rejection (HTTP 401) on missing/invalid tokens | Automated security test queries | Pending implementation | Not Started |
| **CRUD Completion** | 4/4 operations (`C`, `R`, `U`, `D`) fully operational | Functional end-to-end audit | Pending implementation | Not Started |
| **Database Connectivity** | 100% successful pool connections to Supabase | Server initialization logs | Pending implementation | Not Started |
| **REST API Route Completion** | 100% required endpoints active (`/api/auth`, `/api/records`) | Express router route table audit | Pending implementation | Not Started |
| **API Payload Validation** | 100% malformed payloads rejected with HTTP 400 | Validation middleware edge-case tests | Pending implementation | Not Started |
| **Automated API Test Coverage** | ≥ 80% coverage of core API controller paths | Jest code coverage report | Pending implementation | Not Started |
| **TypeScript Compilation** | 0 compilation errors (`strict: true`) | `tsc --noEmit` command output | Pending implementation | Not Started |
| **Production Build** | Clean build with exit code 0 | Next.js and Express build logs | Pending implementation | Not Started |
| **Responsive UI Verification** | 0 horizontal overflow defects on mobile/tablet/desktop | Chrome DevTools device mode audit | Pending implementation | Not Started |
| **Error Handling Coverage** | 100% async routes wrapped in centralized handler | Error injection test run | Pending implementation | Not Started |
| **Security Validation** | CORS restricted; 0 hardcoded secrets; parameterized SQL | Source code static audit & `.gitignore` check | Pending implementation | Not Started |

---

## 4. Quality KPIs

| Quality KPI | Target | Measurement Method | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Functional Correctness** | 100% of Must-Have requirements operating as specified | Functional acceptance checklist | Pending implementation | Not Started |
| **API Reliability** | 0 server crashes during malformed/unauthorized requests | Stress and invalid-input test suite | Pending implementation | Not Started |
| **Validation Quality** | Informative field-level error messages returned for all bad inputs | API error response payload review | Pending implementation | Not Started |
| **Security Controls** | Zero plain-text credentials stored or transmitted | Supabase Auth hashing & TLS verification | Pending implementation | Not Started |
| **UI Responsiveness** | Layout adapts seamlessly across 375px, 768px, 1024px, 1440px | Multi-viewport rendering inspection | Pending implementation | Not Started |
| **Error State UX** | User-friendly toast / alert displayed for all API error responses | Client UI error-injection inspection | Pending implementation | Not Started |
| **Code Quality** | Zero unescaped lint warnings; modular folder structure | ESLint report & codebase structural review | Pending implementation | Not Started |
| **Test Success Rate** | 100% pass rate on all committed automated test suites | Test runner summary output | Pending implementation | Not Started |

---

## 5. Documentation KPIs

| Deliverable Document | Target | Measurement Method | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Baseline Audit Report** | 100% complete technical evaluation of 5 stack tools | Review of `documentation/baseline-audit.md` | Completed | Completed |
| **Market Research / Requirements** | 100% complete desk research & 16-requirement matrix | Review of `documentation/market-research.md` | Completed | Completed |
| **Project Charter** | 100% complete 16-section project charter | Review of `documentation/project-charter.md` | Completed | Completed |
| **KPI/OKR Document** | 100% complete multi-category tracking document | Review of `documentation/kpi-document.md` | Completed | Completed |
| **Framework Documentation** | Complete Week 2 architecture and workflow specification | Milestone review of Week 2 deliverable | Scheduled for Week 2 | Not Started |
| **Test Scenario Log** | Documented positive and negative test cases | Review of Week 2 test log deliverable | Scheduled for Week 2 | Not Started |
| **SOP Documentation** | Step-by-step local setup, env config, and deployment guide | Review of Week 4 SOP deliverable | Scheduled for Week 4 | Not Started |
| **Portfolio Case Study** | Rigorous engineering retrospective and architecture write-up | Review of Week 4 portfolio report | Scheduled for Week 4 | Not Started |
| **Executive Summary** | One-page high-level summary of outcomes and metrics | Review of Week 4 executive summary | Scheduled for Week 4 | Not Started |
| **Presentation Deck** | Polished slide deck covering architecture, results, and learnings | Slide count and rubric review (Week 4) | Scheduled for Week 4 | Not Started |
| **Demo Video** | 3–5 minute recorded video walking through working system | Video runtime and audio/visual review | Scheduled for Week 4 | Not Started |

---

## 6. Deployment & Operational KPIs

| Operational KPI | Target | Measurement Method | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Production Build Success** | Frontend and backend build cleanly for production | Build command output (`npm run build`) | Pending implementation | Not Started |
| **Frontend Deployment** | Next.js application successfully hosted and publicly accessible | HTTP 200 response on production URL | Pending implementation | Not Started |
| **Backend Deployment** | Express API deployed and reachable via HTTPS | HTTP 200 response on `/api/health` endpoint | Pending implementation | Not Started |
| **Database Connectivity** | Production server successfully reads/writes to PostgreSQL | Database ping / test record query | Pending implementation | Not Started |
| **Environment Configuration** | All secrets loaded via environment variables without leaks | Audit of production environment dashboard | Pending implementation | Not Started |
| **CORS Configuration** | Backend accepts requests exclusively from frontend production URL | Cross-origin request verification | Pending implementation | Not Started |
| **Production API Health** | Dedicated health check endpoint (`/health`) returns status 200 | Uptime monitor / automated ping | Pending implementation | Not Started |
| **Final Demo Readiness** | Seed data populated and clean demo walkthrough rehearsed | Dry-run demonstration checklist | Pending implementation | Not Started |

---

## 7. Week 1 KPI Status Summary

| KPI / Deliverable | Target | Measurement Method | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Baseline Audit Report** | Comprehensive technical audit of 5 technologies | File audit of `documentation/baseline-audit.md` | 100% complete; 5 tools analyzed | **Completed** |
| **Market Research / Requirements** | 16 core requirements mapped with MoSCoW priorities | File audit of `documentation/market-research.md` | 100% complete; 16 requirements analyzed | **Completed** |
| **Project Charter** | 16-section charter covering scope, risks, assumptions | File audit of `documentation/project-charter.md` | 100% complete; 16 sections authored | **Completed** |
| **KPI/OKR Document** | Multi-tier measurement framework across 4 weeks | File audit of `documentation/kpi-document.md` | 100% complete; full tracking established | **Completed** |
| **Workspace Setup** | Clean repository hierarchy and tracking README | File tree and README inspection | 100% complete; structure established | **Completed** |
| **Stakeholder Alignment** | 100% consensus on project charter and deliverables | Stakeholder review session record | Pending review session | **Pending Stakeholder Approval** |
| **Scope Approval** | Formal sign-off on In-Scope and Out-of-Scope boundaries | Formal evaluator acceptance signature | Pending review session | **Pending Stakeholder Approval** |

---

## 8. KPI Status Definitions

To maintain absolute clarity across all project stages, every KPI and deliverable is assigned one of the following standardized status designations:

- **Not Started:** The milestone, feature, or activity is scheduled for a future week and no work has begun.
- **In Progress:** The deliverable is currently being actively drafted, researched, or authored.
- **Completed:** The deliverable or technical milestone has been fully drafted, implemented, or executed to specification.
- **Pending Validation:** The technical implementation is finished but awaiting formal verification, testing pass, or build verification.
- **Pending Stakeholder Approval:** The deliverable is complete from the engineering team's perspective and is queued for formal review and sign-off by evaluators or stakeholders.
- **Blocked:** Work cannot advance due to an unresolved technical dependency, external outage, or missing requirement.

---

## 9. Measurement Rules & Verification Protocols

When features and deliverables transition into implementation in subsequent weeks, actual results will be determined strictly by objective, verifiable evidence:

1. **Automated Test Reports:** Passing test counts, code coverage percentages, and execution times generated directly by Jest/Supertest test runners.
2. **API Verification Logs:** HTTP status codes (`200`, `201`, `400`, `401`, `404`) and JSON envelopes captured via automated test scripts or Postman Collection runs.
3. **Compiler & Linter Output:** Clean exits from `tsc --noEmit` (TypeScript) and `eslint` without suppressed errors or bypasses.
4. **Build System Exit Codes:** Successful exit code 0 from production bundling commands (`next build` and backend build scripts).
5. **Deployment Health Checks:** Valid JSON responses from the `/health` endpoint and verification of HTTPS certificates.
6. **Documentation Audit Checklist:** Manual verification that all required sections, diagrams, and tables are authored without placeholder omissions.
7. **Stakeholder Approval Evidence:** Written approval, signature, or graded rubric evaluation from the academic evaluator or project lead.

---

## 10. Consolidated Final KPI Tracking Table

| Category | KPI | Target | Measurement Method | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Governance** | Stakeholder Scope Approval | 100% formal sign-off | Written review sign-off | Pending review session | Pending Stakeholder Approval |
| **Governance** | Deliverable Timeliness | 100% on-time milestone delivery | Weekly milestone timestamp | Week 1 deliverables on schedule | In Progress |
| **Documentation** | Baseline Audit Report | 100% complete audit of 5 tools | Review of `baseline-audit.md` | Completed (5/5 tools audited) | Completed |
| **Documentation** | Requirements Specification | 16 requirements analyzed (MoSCoW) | Review of `market-research.md` | Completed (16 requirements) | Completed |
| **Documentation** | Project Charter | Complete 16-section charter | Review of `project-charter.md` | Completed (16 sections) | Completed |
| **Documentation** | KPI/OKR Document | Complete measurement framework | Review of `kpi-document.md` | Completed | Completed |
| **Documentation** | Framework Draft (Week 2) | Architecture & workflow document | Review of Week 2 deliverable | Scheduled for Week 2 | Not Started |
| **Documentation** | Standard Operating Procedures | Setup, env, deployment SOPs | Review of Week 4 deliverable | Scheduled for Week 4 | Not Started |
| **Documentation** | Portfolio Case Study | Comprehensive project retrospective | Review of Week 4 deliverable | Scheduled for Week 4 | Not Started |
| **Documentation** | Executive Presentation Deck | Complete slide deck | Review of Week 4 deliverable | Scheduled for Week 4 | Not Started |
| **Documentation** | Walkthrough Video | 3–5 minute video demonstration | Video playback inspection | Scheduled for Week 4 | Not Started |
| **Technical** | User Registration | Valid sign-ups create identity | Supabase Auth API test | Pending implementation | Not Started |
| **Technical** | User Login & JWT Issuance | Valid login returns valid JWT | Auth endpoint test | Pending implementation | Not Started |
| **Technical** | Protected Route Guarding | 100% 401 rejection for unauthenticated | Automated security test | Pending implementation | Not Started |
| **Technical** | CRUD: Create Record | Persists valid record to PostgreSQL | `POST /api/records` test | Pending implementation | Not Started |
| **Technical** | CRUD: Read Records | Retrieves user-scoped records | `GET /api/records` test | Pending implementation | Not Started |
| **Technical** | CRUD: Update Record | Persists modified fields | `PUT /api/records/:id` test | Pending implementation | Not Started |
| **Technical** | CRUD: Delete Record | Removes record with confirmation | `DELETE /api/records/:id` test | Pending implementation | Not Started |
| **Technical** | Database Connection | Successful connection pool | Backend initialization test | Pending implementation | Not Started |
| **Technical** | API Payload Validation | 100% bad payloads rejected with 400 | Schema validation test suite | Pending implementation | Not Started |
| **Technical** | TypeScript Compilation | 0 type errors (`strict: true`) | `tsc --noEmit` command | Pending implementation | Not Started |
| **Technical** | Responsive UI Layout | Zero overflow across viewports | Multi-device layout audit | Pending implementation | Not Started |
| **Technical** | Centralized Error Handling | 0 unhandled process crashes | Error injection test run | Pending implementation | Not Started |
| **Technical** | Security / CORS | Restricted origins; 0 secret leaks | Static code & config review | Pending implementation | Not Started |
| **Quality** | Automated API Test Pass Rate | 100% pass rate on test suite | Jest / Supertest runner | Pending implementation | Not Started |
| **Quality** | API Response Latency | < 200 ms for local CRUD endpoints | Benchmark timing run | Pending implementation | Not Started |
| **Quality** | Code Quality / Linting | Zero critical lint warnings | ESLint execution report | Pending implementation | Not Started |
| **Deployment** | Production Build | Clean exit code 0 | `npm run build` logs | Pending implementation | Not Started |
| **Deployment** | API Health Endpoint | Returns HTTP 200 with status JSON | `GET /health` request | Pending implementation | Not Started |
| **Deployment** | Environment Secret Isolation | Zero plaintext secrets committed | Repository security audit | Completed (.gitignore verified) | Completed |
