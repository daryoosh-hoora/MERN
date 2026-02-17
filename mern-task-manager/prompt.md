# Just as reminder

I summarized what we talking about in this chat, and I may change or update some articles in my mindset at the next.
I want to learn MERN stack through a task management system (simple but scalable - Mini SaaS), as a real production-ready application, not just a tutorials.
I strongly want to using these tools and technologies to build the app:

- Clean architecture + Monolith Modular separation. Adaptable to Microservice.
- CQRS, Mediator Pattern, event loop, async patterns, CRUD + Validation (zod)
- monorepo and scalable folder structure
- Docker, Dapr, Redis, pnpm, TypeScript (ESM)
- Authentication, authorization, caching, background jobs
- CI/CD and deployment

you provide a project-driven, layered, and pattern-oriented roadmap as below checklist (refer to topmost major roadmap) but not followed in order exactly (jump over some phases)

- Phase 0 – Foundations (all checked)
  - backend
  - frontend
- Phase 1 – Architecture Fundamentals
  - backend (checked)
  - frontend (jump over so not checked, but we can back on it an Phases 5)
- Phase 2 – Backend Core (all checked)
- Phase 3 – MongoDB in Depth (some checked but not in depth!)
  - Schema design patterns
  - Embedding vs referencing
  - Indexing strategy
  - Transactions
  - Pagination patterns
  - Soft deletes (checked)
  - Audit logs
  - Versioning documents
  - Add advanced querying & pagination
- Phase 4 – Authentication & Authorization (we are here now)
  - JWT (checked)
  - refresh tokens
  - Cookie vs header auth
  - Role-based access control (checked)
  - Policy-based authorization
- Phase 5 – Frontend Core
  - React + TypeScript
  - Vite
  - Tailwind (I already use it, but I prefer using Bootstrap for this course)
  - Feature-based + Container/Hook separation
  - Hooks for logic
  - Dumb vs smart components
  - Controlled vs uncontrolled
  - Rendering optimization
  - Error boundaries
  - Build login, user/task list, user/task form
- Phase 6 – State Management & Data Fetching
  - React Query (TanStack Query)
  - When NOT to use Redux
  - Global vs server state
  - Optimistic updates
  - Cache invalidation
  - Prefetching
  - Pagination + infinite scroll
  - Replace manual API calls with React Query
- Phase 7 – Full CQRS Flow
  - Command handlers (checked)
  - Query handlers (checked)
  - Read models vs write models
  - Read models optimized for UI
  - Separate mutation logic
  - Split read/write flows for a complex entity
- Phase 8 – Cross-Cutting Concerns
  - Rate limiting
  - Caching (Redis)
  - Background jobs (BullMQ)
  - File uploads
  - Error handling strategy
  - Toast & feedback patterns
  - Form validation at scale
- Phase 9 – Testing Strategy
  - Unit tests (use cases)
  - Integration tests (API)
  - Testcontainers (optional)
  - Component tests
  - Hook tests
  - E2E (Playwright)
- Phase 10 – Deployment & DevOps Basics
  - Docker (multi-stage)
  - Environment configs
  - CI pipeline
  - Production build optimization

now I am thinking about new things:

- BFF (Backend for Frontend) witch allow to develop deferent UIs (web, mobile, ...)
- Next.js using instate of React.js. (not sure, if do not break the MERN rules)
- Using Dapr
- Retry Pattern, Service Broker

later:

- Fastify in comparison with Express. what about Jest?
- Prisma instate of Mongoos
- Logging (winston / pino)
- Extendable to teams, billing, analytics later
