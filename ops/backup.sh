#!/bin/sh
# Backupul nocturn al bazei SQLite — rulează din cron pe utilizatorul claude-ops
# (instalare: vezi docs/OPS.md §Backupuri). Copiat pe server de ops/deploy.sh.
#
# `.backup` prin sqlite3 e API-ul corect de hot-backup (conștient de WAL) —
# NICIODATĂ `cp` direct pe un DB viu: poate prinde o stare coruptă.
set -eu

DIR=/home/claude-ops/gymnoob/backups
STAMP=$(date +%Y%m%d-%H%M%S)
mkdir -p "$DIR"

docker exec gymnoob-api sqlite3 /data/gym.db ".backup '/data/backup-tmp.db'"
docker cp gymnoob-api:/data/backup-tmp.db "$DIR/gym-$STAMP.db"
docker exec gymnoob-api rm -f /data/backup-tmp.db
gzip "$DIR/gym-$STAMP.db"

# păstrăm ultimele 14 (două săptămâni)
ls -1t "$DIR"/gym-*.db.gz 2>/dev/null | tail -n +15 | xargs -r rm --

echo "backup ok: gym-$STAMP.db.gz ($(du -h "$DIR/gym-$STAMP.db.gz" | cut -f1))"
