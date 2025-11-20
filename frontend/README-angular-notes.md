Notes:
- This is a minimal Angular CLI scaffold intended for development with `ng serve`.
- It relies on the `@angular/cli` and related packages. Run `npm install` before `npm start`.
- For production builds, run `npm run build` and serve `dist/frontend` with a static server (nginx, http-server, etc.).

Proxy and health-check notes:
- The production Nginx image exposes a `/health` endpoint that proxies to the backend service at `http://backend:3000/health` inside the Docker Compose network.
- The Angular app uses a relative request to `/health` so in Docker the nginx proxy will forward the request to the backend. When running the dev server with `ng serve` locally, `/health` won't be proxied — use `http://localhost:3000/health` directly or configure an Angular proxy for local development.
 - The Angular app uses a relative request to `/health` so in Docker the nginx proxy will forward the request to the backend.
 - For local development we added `proxy.conf.json` so `ng serve` can proxy requests to the backend. Usage:

```powershell
cd frontend
npm install
npm start
```

This runs `ng serve` with the proxy configuration (`--proxy-config proxy.conf.json`) so requests to `/health` and `/api` are forwarded to `http://localhost:3000`.
