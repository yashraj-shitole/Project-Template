Project scaffold with backend, frontend and MongoDB (Docker)

Quick start (PowerShell, run from repo root):

- Start all services (in `services` folder):

```powershell
cd services; docker compose --env-file .env up --build
```

- Backend will be available at `http://localhost:3000` and exposes `/health` and `/items` endpoints.
- Frontend static app will be at `http://localhost:4200`.
- MongoDB is exposed on `localhost:27017` and stores data in `./database/data`.

Notes:
- `services/.env` contains the `MONGO_INITDB_ROOT_USERNAME` and `MONGO_INITDB_ROOT_PASSWORD` used by `docker-compose`.
- If Docker for Windows is used, bind mounts should work with the relative path `../database/data` (compose will resolve it relative to `services`).
