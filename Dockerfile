# ============================================
# Frontend — Multi-stage Docker build
# Stage 1: Build React app (CRA)
# Stage 2: Serve with nginx
# ============================================

# ── Stage 1: Build ──────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY public ./public
COPY src    ./src

# REACT_APP_API_URL is injected as a build-arg at compose-time.
# With the reverse proxy in front, requests to /api/* are forwarded
# to the API container — no cross-origin, no port in the URL.
ARG  REACT_APP_API_URL=/api
ENV  REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# ── Stage 2: Serve ──────────────────────────
FROM nginx:alpine AS runner

# Copy built assets
COPY --from=builder /app/build /usr/share/nginx/html

# Copy SPA nginx config (try_files fallback for React Router)
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
