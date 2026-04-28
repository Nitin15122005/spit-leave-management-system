# ============================================
# Frontend — Multi-stage Docker build
# Stage 1: Build React app (Vite)
# Stage 2: Serve with nginx
# ============================================

# ── Stage 1: Build ──────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace root (needed for npm workspaces + turbo)
COPY package.json package-lock.json turbo.json ./

# Copy only the web app package manifest first (layer cache)
COPY apps/web/package.json ./apps/web/package.json

RUN npm ci --workspace=apps/web

# Copy web app source
COPY apps/web ./apps/web

# VITE_API_URL=/api — same-origin, proxy routes it to the API container
ARG  VITE_API_URL=/api
ENV  VITE_API_URL=$VITE_API_URL

RUN npm run build --workspace=apps/web

# ── Stage 2: Serve ──────────────────────────
FROM nginx:alpine AS runner

# Vite builds to apps/web/build (configured in vite.config.js outDir)
COPY --from=builder /app/apps/web/build /usr/share/nginx/html

# SPA nginx config (try_files fallback for React Router)
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
