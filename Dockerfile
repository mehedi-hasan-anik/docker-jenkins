FROM node:22-alpine

# Install tini for proper signal handling
RUN apk add --no-cache tini

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Copy project files
COPY . .

# Clean any stale build/cache artifacts, install deps, then build the monorepo
RUN pnpm remove-all-and-build

# Use tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]

# Run both apps (on ports 7000 and 7100, internal only)
CMD ["sh", "-c", "pnpm web:serve:production & pnpm admin:serve:production && wait"]
