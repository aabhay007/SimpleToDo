# SimpleToDo (Full-Stack: React + GraphQL + .NET)

## How to Run (the short version)
1) Install Docker and Docker Compose
2) From the repository root, run:
```bash
docker compose up --build
```
3) Open the apps:
- Frontend (React): http://localhost:8082
- Backend (GraphQL): http://localhost:8081/graphql

If you change code, re-run with `--build` to rebuild images.

---

## What this project is
A minimal full‑stack task manager:
- Backend: ASP.NET Core 8 + Hot Chocolate GraphQL + EF Core (PostgreSQL)
- Frontend: React + Vite + Apollo Client + React Spectrum UI
- Orchestrated with Docker Compose (frontend, backend, postgres)

### Key Endpoints
- GraphQL: `POST` http://localhost:8081/graphql
- Subscriptions: supported via in‑memory provider (dev)

### Core GraphQL Operations
- Query: `allTasks` → list tasks
- Mutations: `createTask`, `updateTaskStatus`
- Subscriptions: `taskAdded`, `taskUpdated`

---

## Local development (optional, without Docker)
- Backend: `.NET 8`, configure `ConnectionStrings:DefaultConnection` and run `dotnet ef database update` then `dotnet run` (defaults to port 8081 via compose; set `ASPNETCORE_URLS` as needed).
- Frontend: `node 20+`, update API in `frontend/src/apolloClient.js`, then `npm run dev` (Vite).

---

## Architecture Overview
- Database: PostgreSQL stores `TaskItem { id: UUID, title, description, status }` with `TaskStatus` ∈ { PENDING, COMPLETED }.
- Backend:
  - `Program.cs` wires EF Core with Npgsql, configures CORS for the frontend, and registers Hot Chocolate GraphQL (queries, mutations, subscriptions) with filtering/sorting enabled.
  - `TasksQuery`, `TasksMutation`, `TasksSubscription` implement the GraphQL API.
- Frontend:
  - `src/apolloClient.js` creates the Apollo Client pointing to `http://localhost:8081/graphql`.
  - `src/graphql/tasks.js` defines operations; `src/Tasks.jsx` renders and interacts (list/add/toggle status).

---

## Approach, AI Tools, and Reflections

### Overall Approach
- Start by understanding the end‑to‑end flow: database → EF Core → GraphQL resolvers → Apollo client → React UI.
- Keep the schema compact and expressive (status enum, simple mutations) to minimize frontend complexity while demonstrating full CRUD patterns.
- Prioritize DX: CORS, predictable ports (8081 backend, 8082 frontend), and a single `docker compose up --build` for one‑command startup.
- Use clear separation of concerns: GraphQL types and resolvers in the backend; data fetching and UI state in the frontend component.

### AI Tools and Models Used
- Code assistance: An AI coding assistant (GPT‑class model) embedded in the IDE was used to:
  - Summarize code, infer relationships, and draft documentation.
  - Propose consistent run instructions, environment variables, and Docker configuration notes.
  - Generate concise examples of GraphQL operations used by the UI.
- Refactoring support: The assistant helped identify hard‑coded API URLs and documented options for env‑based configuration via `VITE_API_URL`.
- Documentation automation: The assistant created and consolidated READMEs, ensuring instructions match the repository’s `docker-compose.yml` (ports, args, CORS envs).

### Effectiveness and Reflections
- Strengths:
  - Rapid onboarding: AI quickly builds a mental map of the codebase and surfaces key files, saving time.
  - Consistency: Documentation and commands are aligned across services, reducing drift (e.g., ports 8081/8082, compose args).
  - Error avoidance: Surfaced CORS, env var, and connection string considerations early, which often cause setup friction.
- Limitations:
  - Context sensitivity: If configuration is spread out or recently changed, AI may need to re‑scan to stay accurate.
  - Environment nuances: Hard‑coded endpoints vs. env‑based config can diverge; manual validation is still required.
- Lessons:
  - Treat AI as a pair programmer that drafts and verifies; always test the final commands locally.
  - Keep configuration centralized (compose, .env) to enable simpler docs and automation.
  - Prefer schema‑driven development for front‑back alignment; GraphQL documents in the frontend double as living documentation.

### Problem‑Solving Pattern Used Here
1) Inventory the codebase (backend, frontend, compose) to understand contracts and ports.
2) Document the simplest successful path first (compose up), then add local dev notes.
3) Capture operational details that typically break first‑run (CORS, connection strings, env vars).
4) Provide examples and file pointers (
   `frontend/src/apolloClient.js`, `frontend/src/graphql/tasks.js`, backend GraphQL types) so readers can self‑serve deeper context.

---

## Troubleshooting
- Frontend cannot reach backend: confirm backend is on 8081 and CORS `FrontendOrigin` includes the frontend origin (http://localhost:8082).
- DB connection failures: ensure Postgres is up or update `ConnectionStrings__DefaultConnection` in compose.
- Stale images after changes: re‑run with `docker compose up --build`.
