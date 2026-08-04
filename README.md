# Fluxa

Fluxa is a modern collaborative project management platform for software teams featuring workspaces, teams, Kanban boards, sprint planning, issue tracking, and real-time collaboration.

## Running the project

### Local development

From the repository root, run both apps with a single command:

```bash
pnpm dev
```

The apps will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Health check: http://localhost:4000/api/v1/health

### Docker Compose

To run the full stack with PostgreSQL, the backend, and the frontend together:

```bash
docker compose up --build
```

Prisma is configured to use the Docker Postgres service via the `DATABASE_URL` in the server environment. When the containers are running, the backend can connect to PostgreSQL at:

- Host: `localhost`
- Port: `5432`
- Database: `fluxa`

If you need to apply Prisma migrations while the stack is running, use:

```bash
cd server
pnpm prisma migrate deploy
```

The Docker services will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Health check: http://localhost:4000/api/v1/health

To stop the stack:

```bash
docker compose down
```
