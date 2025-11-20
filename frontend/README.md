Angular CLI frontend (minimal scaffold)

Local development (inside `frontend`):

- Install dependencies:

```powershell
cd frontend
npm install
```

- Start dev server (binds to 0.0.0.0 so Docker can expose it):

```powershell
npm start
```

Docker (via `services/docker-compose.yml`):

- From repo root:

```powershell
cd services; docker compose --env-file .env up --build
```

The frontend will be available on port `4200`.
