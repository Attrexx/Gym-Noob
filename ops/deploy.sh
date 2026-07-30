#!/usr/bin/env bash
# ops/deploy.sh — publică API-ul de sincronizare pe VPS-ul partajat.
#
#   bash ops/deploy.sh api-v1.0.0
#
# Pași: copiază compose + backup.sh pe server → scrie tagul în .env →
# `docker compose pull && up -d` → probează /health PRIN Caddy. Idempotent;
# ROLLBACK = rulează din nou cu un tag mai vechi.
#
# Imaginea (ghcr.io/attrexx/gym-noob-api) e PUBLICĂ — fără docker login pe
# server. Prima publicare cere setarea manuală a pachetului pe public
# (docs/OPS.md §Prima pornire).
#
# Gotcha Windows (lecția Lessgo): scriptul remote trece prin `tr -d '\r'` —
# un CRLF scăpat în heredoc face bash-ul de pe server să moară criptic pe '\r'.
#
# Mediu:
#   SSH_KEY  calea cheii private (implicit: ~/.ssh/claude_ops_ed25519)
set -euo pipefail

SSH_KEY="${SSH_KEY:-$HOME/.ssh/claude_ops_ed25519}"
SERVER="claude-ops@89.167.46.38"
REMOTE_DIR="/home/claude-ops/gymnoob"
TAG="${1:-}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

if [[ "${TAG}" == "--help" || "${TAG}" == "-h" || -z "${TAG}" ]]; then
  echo "Folosire: ops/deploy.sh api-vX.Y.Z   # ex. ops/deploy.sh api-v1.0.0"
  echo "  Tagul trebuie să existe în GHCR (îl construiește workflow-ul api.yml la push de tag)."
  exit 1
fi
if [[ ! "${TAG}" =~ ^api-v[0-9]+\.[0-9]+\.[0-9]+ ]]; then
  echo "Refuz: '${TAG}' nu e un tag api-vMAJOR.MINOR.PATCH (deploy-ul e legat de taguri)." >&2
  exit 1
fi

SSH_OPTS=(-i "$SSH_KEY" -o StrictHostKeyChecking=accept-new)

echo "==> Sincronizez compose + backup.sh către ${SERVER}:${REMOTE_DIR}"
ssh "${SSH_OPTS[@]}" "$SERVER" "mkdir -p ${REMOTE_DIR}"
scp "${SSH_OPTS[@]}" "${REPO_ROOT}/infra/docker-compose.yml" "$SERVER:${REMOTE_DIR}/docker-compose.yml"
scp "${SSH_OPTS[@]}" "${REPO_ROOT}/ops/backup.sh" "$SERVER:${REMOTE_DIR}/backup.sh"
# gymnoob.env NU se copiază NICIODATĂ — trăiește doar pe server, chmod 600.

echo "==> Deploy ${TAG}"
ssh "${SSH_OPTS[@]}" "$SERVER" TAG="${TAG}" /bin/bash < <(tr -d '\r' <<'REMOTE'
set -euo pipefail
cd /home/claude-ops/gymnoob
if [ ! -f gymnoob.env ]; then
  echo "LIPSEȘTE gymnoob.env (JWT_SECRET etc.) — vezi docs/OPS.md §Prima pornire." >&2
  exit 1
fi
chmod 600 gymnoob.env
chmod +x backup.sh
# fișierele copiate de pe Windows pot avea CRLF — normalizăm ce rulează pe server
sed -i 's/\r$//' backup.sh docker-compose.yml
printf 'GYMNOOB_TAG=%s\n' "$TAG" > .env
docker compose pull
docker compose up -d
docker compose ps
REMOTE
)

echo "==> Probez /health prin Caddy (gym-api.lessgo.city)"
ssh "${SSH_OPTS[@]}" "$SERVER" /bin/bash < <(tr -d '\r' <<'REMOTE'
set -uo pipefail
ok=0
for i in $(seq 1 30); do
  if curl -fsS --resolve gym-api.lessgo.city:443:127.0.0.1 \
      https://gym-api.lessgo.city/health >/dev/null 2>&1; then
    ok=1
    break
  fi
  sleep 4
done
if [ "$ok" != 1 ]; then
  echo "PROBA A EȘUAT — ultimele loguri:"
  docker logs --tail 40 gymnoob-api 2>&1 | tail -40 || true
  exit 1
fi
curl -fsS --resolve gym-api.lessgo.city:443:127.0.0.1 https://gym-api.lessgo.city/health
echo
echo "API sănătos prin Caddy."
REMOTE
)

echo "==> Gata. Rollback: ops/deploy.sh <tag-mai-vechi>"
