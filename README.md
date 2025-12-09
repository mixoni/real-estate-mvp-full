# Real Estate Marketplace MVP

Monorepo containing:

- `frontend/` – Next.js 14 + TailwindCSS app (public marketplace + dashboards skeleton)
- `backend/` – NestJS + PostgreSQL API

## Prerequisites

- Node.js 18+
- pnpm or npm (commands below use `npm`)
- Docker + Docker Compose

## Quick Start

1. Start PostgreSQL via Docker:

```bash
docker compose up -d
```

2. Backend setup:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

Backend runs on http://localhost:4000

3. Frontend setup:

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000

You can now open the marketplace in your browser and test basic flows.
