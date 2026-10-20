#!/usr/bin/env bash
set -Eeuo pipefail

# Run from the Git checkout: sudo bash scripts/pull-rebuild.sh
APP=/opt/pustakasetia
SOURCE=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)
die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
[[ $EUID == 0 ]] || die 'Jalankan dengan sudo.'
for command in git rsync runuser systemctl flock curl; do
  command -v "$command" >/dev/null || die "Perintah tidak tersedia: $command"
done
exec 9>/run/lock/pustakasetia-rebuild.lock
flock -n 9 || die 'Pembaruan lain sedang berjalan.'
[[ $SOURCE != "$APP" ]] || die 'Jalankan dari checkout Git sumber, bukan /opt/pustakasetia.'
[[ -d $SOURCE/.git ]] || die 'Checkout Git sumber tidak ditemukan.'
[[ -d $APP && -f $APP/prisma-postgresql/schema.prisma ]] || die 'Setup server belum lengkap.'
id pustakasetia-app >/dev/null 2>&1 || die 'User pustakasetia-app tidak ditemukan.'

# Git runs as the checkout owner so SSH identity and file ownership stay intact.
OWNER=$(stat -c '%U' "$SOURCE/.git")
source_git() { runuser -u "$OWNER" -- git -C "$SOURCE" "$@"; }
[[ -z $(source_git status --porcelain) ]] || die 'Checkout sumber memiliki perubahan lokal; selesaikan dahulu.'
[[ $(source_git branch --show-current) == main ]] || die 'Checkout sumber harus berada pada branch main.'
[[ $(source_git remote get-url origin) == git@github.com:Op-Shapeshite/Pustakasetia.git ||
   $(source_git remote get-url origin) == https://github.com/Op-Shapeshite/Pustakasetia.git ]] || die 'Remote origin tidak sesuai.'
source_git pull --ff-only origin main
[[ -f $SOURCE/src/app/uploads/\[...path\]/route.ts ]] || die 'Route uploads tidak ditemukan pada source terbaru.'

printf '%s\n' 'Menghentikan aplikasi selama sinkronisasi dan build; website sementara tidak tersedia.'
systemctl stop pustakasetia
trap 'printf "%s\n" "Pembaruan gagal. Service dibiarkan berhenti agar build tidak lengkap tidak dijalankan. Periksa error lalu jalankan ulang skrip." >&2' ERR
rsync -a --no-owner --no-group --exclude='.git' --exclude='node_modules' \
  --exclude='.next' --exclude='.env*' --exclude='*.db*' --exclude='/uploads/' \
  --exclude='logs' --exclude='auth.json' --exclude='prisma-postgresql' \
  --exclude='prisma-postgresql.config.ts' --exclude='server-command.sh' \
  --exclude='server-admin.cjs' "$SOURCE/" "$APP/"

# Match setup-server.sh permissions; only build artifacts and dependencies are writable.
chown -R root:pustakasetia-app "$APP/src" "$APP/prisma" "$APP/scripts"
chmod -R u=rwX,g=rX,o= "$APP/src" "$APP/prisma" "$APP/scripts"
install -d -o pustakasetia-app -g pustakasetia-app "$APP/node_modules" "$APP/.next"
chown -R pustakasetia-app:pustakasetia-app "$APP/node_modules" "$APP/.next"
cd "$APP"
app() { runuser -u pustakasetia-app -- "$@"; }
if [[ -f package-lock.json ]]; then
  app npm ci --include=dev --ignore-scripts
else
  die 'package-lock.json diperlukan untuk instalasi yang konsisten.'
fi
# Generate the existing PostgreSQL client only; never migrate or seed the database.
app env DATABASE_URL=postgresql://localhost:5432/generate_only node node_modules/prisma/build/index.js generate --schema prisma-postgresql/schema.prisma
app npm run build
node -e 'const m=require("./.next/server/app-paths-manifest.json"); if (!m["/uploads/[...path]/route"]) process.exit(1)'
systemctl start pustakasetia
for ((i=0; i<30; i++)); do
  # Unknown file must reach the uploads handler (empty 404), not the HTML 404 page.
  HEADERS=$(curl --silent --head --max-time 3 http://127.0.0.1:3000/uploads/covers/deploy-route-check.webp || true)
  if [[ $HEADERS == *'404 Not Found'* && $HEADERS != *'text/html'* ]]; then
    trap - ERR
    break
  fi
  sleep 2
done
if [[ $i == 30 ]]; then
  systemctl stop pustakasetia
  die 'Verifikasi route gagal; periksa journalctl -u pustakasetia.'
fi
SITE=$(app node --env-file=.env.production -e 'process.stdout.write(process.env.NEXT_PUBLIC_SITE_URL || "")')
[[ $SITE == https://* ]] || die 'NEXT_PUBLIC_SITE_URL harus berupa HTTPS.'
PUBLIC_HEADERS=$(curl --fail-with-body --silent --show-error --head --max-time 20 "$SITE/" )
[[ $PUBLIC_HEADERS == *'200'* ]] || die 'Website publik belum mengembalikan HTTP 200.'
PUBLIC_UPLOAD=$(curl --silent --show-error --head --max-time 20 "$SITE/uploads/covers/deploy-route-check.webp")
[[ $PUBLIC_UPLOAD == *'404'* && $PUBLIC_UPLOAD != *'text/html'* ]] || die 'Route uploads publik belum sesuai; periksa proxy/cache.'
printf 'Deploy selesai: %s dan route uploads publik terverifikasi.\n' "$SITE"
