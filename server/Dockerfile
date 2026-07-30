# syntax=docker/dockerfile:1
# Imaginea API-ului de sincronizare. Se construiește în CI (arm64 via QEMU —
# VPS-ul Hetzner CAX e ARM!) cu contextul = RĂDĂCINA repo-ului (are nevoie de
# shared/). Vezi .github/workflows/api.yml și docs/OPS.md.

FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY server/package.json server/package-lock.json server/
RUN cd server && npm ci
COPY shared/ shared/
COPY server/tsconfig.json server/
COPY server/src/ server/src/
RUN cd server && npx tsc -p .

FROM node:24-bookworm-slim
# sqlite3 (CLI): doar pentru backupul nocturn — `.backup` e API-ul corect de
# hot-backup; un `cp` pe un DB viu cu WAL poate produce o copie coruptă.
RUN apt-get update && apt-get install -y --no-install-recommends sqlite3 \
  && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
# dist/ conține server/src + shared (rootDir = repo root în tsconfig)
COPY --from=build /app/server/dist ./dist
RUN mkdir -p /data && chown node:node /data
USER node
VOLUME /data
EXPOSE 8787
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:8787/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/server/src/main.js"]
