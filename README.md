# Turborepo · Next.js · Tailwind · shadcn/ui · Nginx

Turborepo monorepo with two Next.js apps — a public-facing **web** gateway and an **admin** dashboard — running side-by-side in a single Docker container, fronted by a host-installed Nginx reverse proxy on port `82`.

```
.
├── apps/
│   ├── web/        # Web gateway (port 7000)
│   └── admin/      # Admin dashboard (port 7100)
├── packages/
│   ├── ui/             # Shared React components (shadcn-style)
│   ├── shared/         # Types, constants, utility functions
│   ├── tailwind-config/    # Shared Tailwind preset
│   └── eslint-config/      # Shared ESLint presets
├── Dockerfile              # Production image (single container, both apps)
├── Dockerfile.dev          # Dev image (volume-mounted source, polling enabled)
├── docker-compose.yml      # Production stack (loopback-only ports)
├── docker-compose.dev.yml  # Dev stack (full port exposure + volumes)
├── Jenkinsfile
├── nginx-configuration.sh  # Installs/writes host Nginx config, reloads Nginx
├── EnvMaker.sh             # Generates per-app .env files
├── serve-local.sh          # pnpm web:serve & pnpm admin:serve
├── serve-prod.sh           # pnpm web:serve:production & pnpm admin:serve:production
├── turbo.json
└── pnpm-workspace.yaml
```

## Architecture

```
Browser ──► Nginx (:82, on host)
              │
              ├─ /app            ──► http://localhost:7000/app    (web)
              └─ /app/admin      ──► http://localhost:7100/admin  (admin)
                                          ▲
                                          │
              Both apps run inside one Docker container ("monorepo-container"),
              reachable only on 127.0.0.1 from the host.
```

- **Web** (Next.js): `BASE_PATH=/app`, internal port `7000`
- **Admin** (Next.js): `BASE_PATH=/admin`, internal port `7100`
- **Nginx gateway** (host): listens on `:82`, proxies `/app` and `/app/admin` to the apps

## Prerequisites

- Node.js ≥ 18 (22 recommended)
- pnpm ≥ 10 (`corepack enable pnpm`)
- Docker + Docker Compose (production-like deploy)
- Nginx + sudo (host-side gateway)

## Quick start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
./EnvMaker.sh
```

This writes `apps/web/.env` and `apps/admin/.env` with sane defaults. Edit them to point at your backend / file server.

### 3. Run locally (no Docker)

```bash
pnpm dev            # both apps in parallel via Turbo
# or:
./serve-local.sh    # same effect, explicit
```

Open:
- http://localhost:7000/app (web)
- http://localhost:7100/admin (admin)

### 4. Production-like (Docker + host Nginx)

```bash
pnpm build                       # build the monorepo
docker compose up -d --build     # build + start the single container
sudo ./nginx-configuration.sh    # write /etc/nginx/sites-available/monorepo.conf and reload nginx
```

Then visit:

- http://localhost:82/app        → web
- http://localhost:82/app/admin  → admin

To tear down:

```bash
docker compose down
```

### 5. Dev with Docker (live reload)

```bash
pnpm docker:dev
# or directly:
docker compose -f docker-compose.dev.yml up --build
```

The dev compose mounts the source into the container and enables `WATCHPACK_POLLING` / `CHOKIDAR_USEPOLLING` so file changes propagate. `node_modules` stays inside the container (anonymous volume).

Other dev helpers:

```bash
pnpm docker:dev:down      # stop the dev container
pnpm docker:dev:logs      # follow logs
pnpm docker:dev:restart   # down + up --build
pnpm docker:dev:reset     # forcefully remove stale containers, then up --build
                          # (handles "container name already in use" errors)
```

Production helpers:

```bash
pnpm docker:prod          # build + start in detached mode
pnpm docker:prod:down     # stop the prod stack
pnpm docker:prod:logs     # follow prod logs
```

## Scripts

| Command                              | Description                                  |
|--------------------------------------|----------------------------------------------|
| `pnpm dev`                           | Run both apps in dev mode via Turbo          |
| `pnpm build`                         | Build all apps + shared packages             |
| `pnpm lint`                          | Lint all packages                            |
| `pnpm check-types`                   | TypeScript check across the workspace        |
| `pnpm web:serve`                     | Run only the web app (dev)                   |
| `pnpm admin:serve`                   | Run only the admin app (dev)                 |
| `pnpm web:serve:production`          | Run only the web app (prod, after `build`)   |
| `pnpm admin:serve:production`        | Run only the admin app (prod, after `build`) |
| `pnpm web:build` / `pnpm admin:build`| Build a single app                           |
| `pnpm clear-cache`                   | Remove `.turbo` and `.next/`                 |
| `pnpm remove-all`                    | Remove caches + `node_modules`, prune pnpm   |
| `pnpm remove-all-and-build`          | `remove-all` + `install` + `build`           |
| `pnpm docker:dev`                    | Start the dev compose                        |

## CI / Jenkins

`Jenkinsfile` runs `docker compose down && docker compose build --no-cache && docker compose up -d` on every build.

## Nginx gateway

`nginx-configuration.sh`:

1. Rewrites `/etc/nginx/proxy_params` (long timeouts, big buffers, HMR-friendly `Connection: ""`).
2. Writes `/etc/nginx/sites-available/monorepo.conf` and symlinks it into `sites-enabled`.
3. Runs `nginx -t` for syntax check.
4. Reloads Nginx via `systemctl reload nginx`.
5. Prints the gateway URLs (`http://<host>:82/app` and `http://<host>:82/app/admin`).

The site config exposes only `/app` and `/app/admin`; everything else on `:82` returns 404. HMR endpoints (`/_next/webpack-hmr`) are proxied with WebSocket upgrade headers.

## Shared packages

- **`@workspace/ui`** — Button, Card, Input, Label, Badge, Separator, SiteHeader, ThemeToggle
- **`@workspace/shared`** — types (`User`, `ApiResponse<T>`), constants (`APP_NAME`, `DEFAULT_PAGE_SIZE`), utilities (`cn`, `formatDate`, `sleep`)
- **`@workspace/tailwind-config`** — Tailwind preset with shadcn-style CSS variables and brand tokens
- **`@workspace/eslint-config`** — base React/Next ESLint configs

## Production checklist

- [ ] Replace `localhost` / `:82` with real domain + TLS termination (Let's Encrypt)
- [ ] Add auth in front of `/app/admin`
- [ ] Set NODE_ENV=production in `.env` files
- [ ] Wire CI to run `pnpm lint && pnpm check-types && pnpm build`
- [ ] Enable Turbo remote caching (`turbo login && turbo link`)
- [ ] Add healthchecks to the Docker service
# docker-jenkins
# docker-jenkins
