# OPS — API-ul de cont & sincronizare (gym-api.lessgo.city)

Runbook-ul serverului. PWA-ul rămâne pe GitHub Pages (build local, `dist/`
comis); API-ul de sincronizare e un SINGUR container pe VPS-ul partajat.

## Harta

| Ce | Unde |
|---|---|
| Server | `lessgo-dkr` — Hetzner CAX21 **ARM64**, 4 vCPU / 8 GB, Ubuntu 24.04 + Docker, `89.167.46.38` (Helsinki) |
| SSH | `claude-ops@89.167.46.38`, cheia `~/.ssh/claude_ops_ed25519`, port 22 (doar chei) |
| Director | `/home/claude-ops/gymnoob/` — compose, `.env` (tag), `gymnoob.env` (secrete), `backup.sh`, `backups/` |
| Container | `gymnoob-api` (imagine `ghcr.io/attrexx/gym-noob-api`, publică), portul 8787 DOAR intern |
| Intrare publică | Caddy-ul comun `infra-proxy-1` → vhost `gym-api.lessgo.city` (snippet: `infra/caddy/gym-api.caddy-snippet`) |
| Date | volumul Docker `gymnoob_gymnoob_data`, montat pe `/data` (SQLite: `/data/gym.db`) |

### Regulile boxei partajate (nenegociabile)

Boxa găzduiește și **lessgo.city, anyvote.eu, honcho, hermes, ollama**:

1. **Nu atinge containerele/compose-urile/volumele celorlalți.** Niciodată.
2. **Fără `ports:`** — doar Caddy expune 80/443; loopback 5432/6379 sunt luate de Honcho.
3. Containerele web-facing intră în rețeaua externă **`infra_lessgo-net`**.
4. **Memoria e strâmtă** (~4,4 GB liberi înainte de AnyVote; Ollama se umflă).
   Bugetul nostru: **256 MB** (`mem_limit` în compose). Înainte de PRIMA pornire
   rulează poarta de capacitate:
   ```bash
   ssh claude-ops@89.167.46.38 'free -h && docker stats --no-stream'
   ```
   Dacă nu sunt măcar ~500 MB liberi confortabil, nu porni — discută întâi resize-ul.

## Prima pornire (o singură dată, în ordinea asta)

1. **DNS** — în Cloudflare (zona lessgo.city): A record `gym-api` → `89.167.46.38`,
   **obligatoriu DNS-only (nor GRI)** — cu proxy portocaliu Caddy nu poate emite
   certificatul. Verifică propagarea: `nslookup gym-api.lessgo.city`.
2. **Poarta de capacitate** — `free -h` (vezi mai sus).
3. **Imaginea publică** — după primul push de tag (`git tag api-v1.0.0 && git push origin api-v1.0.0`,
   workflow-ul `api.yml` construiește arm64):
   GitHub → profilul Attrexx → Packages → `gym-noob-api` → Package settings →
   **Change visibility → Public**. Pachetele GHCR se nasc private; serverul face
   pull fără login doar dacă e public.
4. **Secretele pe server** (doar pe server, niciodată în repo):
   ```bash
   ssh claude-ops@89.167.46.38
   mkdir -p ~/gymnoob && cd ~/gymnoob
   umask 077
   cat > gymnoob.env <<EOF
   JWT_SECRET=$(openssl rand -base64 48)
   CORS_ORIGINS=https://attrexx.github.io
   EOF
   chmod 600 gymnoob.env
   ```
   (Restul variabilelor au valori implicite bune — vezi tabelul de la final.)
5. **Vhost-ul Caddy** — urmează pas cu pas comentariile din
   `infra/caddy/gym-api.caddy-snippet`: backup → merge → `caddy validate` →
   `caddy reload`. DNS-ul trebuie să existe DEJA (pasul 1), altfel emiterea
   certificatului intră în retry-spam.
6. **Primul deploy** — de pe mașina de dev, în Git Bash:
   ```bash
   bash ops/deploy.sh api-v1.0.0
   ```
   Scriptul copiază compose-ul, scrie tagul, face pull + up și probează
   `https://gym-api.lessgo.city/health` prin Caddy. Verificare finală din
   exterior: deschide https://gym-api.lessgo.city/health în browser.
7. **Cronul de backup** (pe server, ca `claude-ops`):
   ```bash
   crontab -e
   # adaugă:
   10 4 * * * /home/claude-ops/gymnoob/backup.sh >> /home/claude-ops/gymnoob/backup.log 2>&1
   ```

## Deploy obișnuit

```bash
# 1) taghează și lasă CI-ul să construiască imaginea arm64
git tag api-v1.1.0 && git push origin api-v1.1.0
# 2) când workflow-ul „API — build & push" e verde:
bash ops/deploy.sh api-v1.1.0
```

**Rollback:** `bash ops/deploy.sh api-v1.0.0` (orice tag mai vechi existent în
GHCR). Nu există migrații de schemă pe server de gestionat la rollback —
row-store-ul e generic; migratorul `user_version` e forward-only și aditiv.

## Backupuri & restaurare

- Nocturn la 04:10: `backup.sh` → `~/gymnoob/backups/gym-<stamp>.db.gz`, se țin 14.
- Log: `~/gymnoob/backup.log`. Verifică ocazional că apar fișiere noi:
  `ls -lh ~/gymnoob/backups | tail`.

**Exercițiul de restaurare** (fă-l o dată „pe bune" înainte să conteze):

```bash
ssh claude-ops@89.167.46.38
cd ~/gymnoob
docker compose down
# pune backupul ales în volum ca gym.db (șterge și fișierele WAL vechi!)
docker run --rm \
  -v gymnoob_gymnoob_data:/data \
  -v /home/claude-ops/gymnoob/backups:/b \
  alpine:3 sh -c "gunzip -c /b/gym-YYYYMMDD-HHMMSS.db.gz > /data/gym.db \
    && rm -f /data/gym.db-wal /data/gym.db-shm"
docker compose up -d
curl -fsS --resolve gym-api.lessgo.city:443:127.0.0.1 https://gym-api.lessgo.city/health
# apoi un login real din aplicație
```

Cel mai rău caz (volum pierdut de tot): telefoanele utilizatorilor încă au
datele complete local — după recreare, un „Trimite varianta locală" din
aplicație repopulează serverul (`/sync/replace`).

## Resetare de parolă (până există resetare prin email)

Rulată de proprietar, parola NOUĂ vine pe stdin (nu ca argument — ar apărea în `ps`):

```bash
ssh claude-ops@89.167.46.38
printf 'parola-noua-min-8' | docker exec -i gymnoob-api \
  node dist/server/src/tools/reset-password.js emailul@utilizatorului.ro
```

Închide toate sesiunile utilizatorului (refresh-urile mor); utilizatorul intră
cu parola nouă.

## Depanare

```bash
docker logs --tail 100 gymnoob-api           # logurile API-ului
docker compose ps                            # starea (healthcheck-ul e în imagine)
docker stats --no-stream gymnoob-api         # memoria (limita: 256 MB)
docker exec gymnoob-api sqlite3 /data/gym.db 'SELECT COUNT(*) FROM users;'
```

- **503/timeout prin Caddy, dar containerul e healthy** → verifică rețeaua:
  containerul trebuie să fie în `infra_lessgo-net` (`docker inspect gymnoob-api`).
- **Certificat neemis** → DNS-ul nu era gata la reload sau e pe proxy portocaliu;
  repară DNS-ul, apoi `docker exec infra-proxy-1 caddy reload --config /etc/caddy/Caddyfile`.
- **CORS blocat în browser** → originea lipsește din `CORS_ORIGINS` în
  `gymnoob.env`; editează + `docker compose up -d` (fără rebuild).
- **429 la utilizatori legitimi** → crește `RATE_SYNC_PER_MIN` în `gymnoob.env`.

## Testul manual pe două dispozitive (rulat la lansarea sincronizării)

Desktop (Chrome) + telefon (Motorola, Chrome), pe https://attrexx.github.io/Gym-Noob/:

1. Pe A: onboarding → câteva seturi într-o sesiune → Setări → creează cont → „Sincronizat".
2. Pe B: „Am deja cont" → login → profilul și istoricul apar (snapshot).
3. Pe B: pornește o sesiune, loghează un set, încheie → pe A: adu aplicația în
   față → setul apare (sync la visibilitychange).
4. Offline pe amândouă → editează ACELAȘI șablon pe A apoi pe B → online → ultima
   editare câștigă pe ambele.
5. Șterge un șablon pe A → dispare și pe B.
6. Pe A: restaurează un backup v1 vechi → mesajul de dezlegare apare; leagă din
   nou contul → dialogul de conflict oferă cloud/local/anulează.
7. Mod avion pe B în mijlocul unei sesiuni → încheie sesiunea → la reconectare
   se sincronizează singură (backoff).
8. `DELETE` cont dintr-un dispozitiv → celălalt primește 401 la următorul sync
   și trece pe „nelegat" fără să piardă datele locale.

## Variabilele de mediu (gymnoob.env)

| Variabilă | Implicit | Ce face |
|---|---|---|
| `JWT_SECRET` | — (OBLIGATORIU în producție, ≥32 caractere) | semnătura tokenurilor de acces |
| `CORS_ORIGINS` | `https://attrexx.github.io,http://localhost:5173,http://localhost:4173` | originile permise, separate prin virgulă |
| `QUOTA_BYTES` | `26214400` (25 MB) | cota de stocare per cont (~15+ ani de seturi) |
| `RATE_AUTH_PER_15MIN` | `10` | cereri `/auth/*` per IP per 15 min (înainte de scrypt) |
| `RATE_SYNC_PER_MIN` | `60` | cereri `/sync*` per utilizator pe minut |
| `RATE_REPLACE_PER_HOUR` | `5` | `/sync/replace` per utilizator pe oră |
| `ACCESS_TTL_SEC` | `900` | viața tokenului de acces (15 min) |
| `REFRESH_TTL_DAYS` | `60` | viața refresh-ului (rotit la fiecare folosire) |
| `LOG_LEVEL` | `info` | `silent` taie logurile de cereri |

`PORT`, `DB_PATH` și `APP_VERSION` sunt setate de compose — nu le pune în env.
