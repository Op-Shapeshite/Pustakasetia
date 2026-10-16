#!/usr/bin/env bash
# Fresh Ubuntu 22.04 only. Run from an uploaded, trusted project checkout.
set -Eeuo pipefail
set +x
umask 077
trap 'printf "Setup berhenti pada baris %s. Periksa kondisi server sebelum melanjutkan; jangan hapus database.\n" "$LINENO" >&2' ERR

die() { printf '%s\n' "$*" >&2; exit 1; }
validate_service_user() {
  local account name password_field uid gid gecos home login_shell group_record group_name group_password group_gid members groups
  account=$(getent passwd pustakasetia-app) || die 'Gagal membaca metadata user pustakasetia-app.'
  IFS=: read -r name password_field uid gid gecos home login_shell <<< "$account"
  [[ $uid =~ ^[0-9]+$ && $uid != 0 && $home == /var/lib/pustakasetia-app ]] \
    || die 'User pustakasetia-app bukan akun layanan yang sesuai (UID/home). Akun tidak diubah.'
  [[ $login_shell == /usr/sbin/nologin || $login_shell == /sbin/nologin || $login_shell == /bin/false ]] \
    || die 'User pustakasetia-app memiliki shell login. Akun tidak diubah.'
  group_record=$(getent group pustakasetia-app) || die 'Group pustakasetia-app tidak ditemukan.'
  IFS=: read -r group_name group_password group_gid members <<< "$group_record"
  [[ $group_gid == "$gid" && ( -z $members || $members == pustakasetia-app ) ]] \
    || die 'Group pustakasetia-app bukan group layanan eksklusif. Akun tidak diubah.'
  groups=$(id -G pustakasetia-app) || die 'Gagal memeriksa group user pustakasetia-app.'
  [[ $groups == "$gid" ]] || die 'User pustakasetia-app memiliki group tambahan. Akun tidak diubah.'
}
if [[ ${1:-} == --help ]]; then
  printf '%s\n' 'sudo bash scripts/setup-server.sh' \
    'Interaktif: domain, email SSL, port SSH, username dan password admin.' \
    'Khusus instalasi baru Ubuntu 22.04; DNS A/AAAA harus menuju server.'
  exit 0
fi
[[ $EUID == 0 ]] || die 'Jalankan dengan sudo bash scripts/setup-server.sh'
source /etc/os-release
[[ $ID == ubuntu && $VERSION_ID == 22.04 ]] || die 'Skrip khusus Ubuntu 22.04 LTS.'
[[ -d /run/systemd/system ]] || die 'Server harus menjalankan systemd.'
SOURCE=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)
APP=/opt/pustakasetia
[[ -f $SOURCE/package.json && -f $SOURCE/prisma/schema.prisma ]] || die 'Source proyek tidak lengkap.'
for target in "$APP" /etc/systemd/system/pustakasetia.service /etc/nginx/sites-available/pustakasetia; do
  [[ ! -e $target && ! -L $target ]] || die "Target sudah ada: $target. Skrip hanya untuk instalasi baru."
done
if id pustakasetia-app &>/dev/null; then
  validate_service_user
  printf '%s\n' 'Memakai akun layanan pustakasetia-app yang sudah ada; konfigurasi akun dipertahankan.'
fi
read -r -p 'Domain utama (contoh pustakasetia.id, tanpa https://): ' DOMAIN
DOMAIN=${DOMAIN,,}
[[ ${#DOMAIN} -le 253 && $DOMAIN == *.* && $DOMAIN =~ ^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$ ]] || die 'Domain tidak valid.'
IFS=. read -ra labels <<< "$DOMAIN"
for label in "${labels[@]}"; do
  [[ ${#label} -le 63 && $label =~ ^[a-z0-9]([a-z0-9-]*[a-z0-9])?$ ]] || die 'Label domain tidak valid.'
done
read -r -p 'Email untuk sertifikat SSL: ' EMAIL
[[ $EMAIL =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]] || die 'Email tidak valid.'
SSH_DEFAULT=22
if [[ -n ${SSH_CONNECTION:-} ]]; then SSH_DEFAULT=${SSH_CONNECTION##* }; fi
read -r -p "Port SSH aktif [$SSH_DEFAULT]: " SSH_PORT
SSH_PORT=${SSH_PORT:-$SSH_DEFAULT}
[[ $SSH_PORT =~ ^[0-9]{1,5}$ ]] && ((10#$SSH_PORT >= 1 && 10#$SSH_PORT <= 65535)) || die 'Port SSH tidak valid.'
SSH_PORT=$((10#$SSH_PORT))
if [[ -n ${SSH_CONNECTION:-} ]]; then
  [[ ${SSH_CONNECTION##* } == "$SSH_PORT" ]] || die 'Port berbeda dari sesi SSH aktif.'
fi
/usr/sbin/sshd -t
SSHD_CONFIG=$(/usr/sbin/sshd -T)
SSH_LISTENERS=$(ss -H -lnt "sport = :$SSH_PORT")
[[ -n $SSH_LISTENERS ]] || die "SSH belum mendengarkan pada port $SSH_PORT."
if ! grep -qx "port $SSH_PORT" <<< "$SSHD_CONFIG"; then
  printf '%s\n' "Port $SSH_PORT aktif tetapi berbeda dari konfigurasi sshd; mungkin memakai socket activation. Port aktif tetap dibuka di firewall."
fi
unset SSHD_CONFIG SSH_LISTENERS
read -r -p 'Username admin [admin]: ' ADMIN_USER
ADMIN_USER=${ADMIN_USER:-admin}
[[ $ADMIN_USER =~ ^[a-zA-Z0-9_-]{3,32}$ ]] || die 'Username harus 3-32 huruf, angka, _ atau -.'
read -r -s -p 'Password admin web (minimal 8 karakter, maksimal 72 byte): ' ADMIN_PASSWORD
printf '\n'
[[ ${#ADMIN_PASSWORD} -ge 8 && $(printf %s "$ADMIN_PASSWORD" | wc -c) -le 72 ]] || die 'Password admin web harus minimal 8 karakter dan maksimal 72 byte.'
read -r -s -p 'Ulangi password admin: ' CONFIRM
printf '\n'
[[ $ADMIN_PASSWORD == "$CONFIRM" ]] || die 'Password tidak sama.'
unset CONFIRM

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl gnupg rsync build-essential nginx \
  postgresql postgresql-contrib ufw fail2ban unattended-upgrades \
  certbot python3-certbot-nginx openssl dnsutils

# Fail before creating application state if DNS has not been configured.
getent ahosts "$DOMAIN" >/dev/null || die 'Domain belum resolve. Atur DNS dahulu.'
printf 'DNS publik domain; pastikan semua A/AAAA mengarah ke server ini:\n'
dig +short A "$DOMAIN"
dig +short AAAA "$DOMAIN"
read -r -p 'DNS benar dan port 80/443 terbuka di firewall provider? Ketik YA: ' DNS_READY
[[ $DNS_READY == YA ]] || die 'Atur DNS dan firewall provider, lalu jalankan ulang.'

install -d -m 0755 /etc/apt/keyrings
curl --fail --silent --show-error --location https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
  | gpg --dearmor --batch --yes -o /etc/apt/keyrings/nodesource.gpg
chmod 0644 /etc/apt/keyrings/nodesource.gpg
printf '%s\n' 'deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main' \
  > /etc/apt/sources.list.d/pustakasetia-node.list
chmod 0644 /etc/apt/sources.list.d/pustakasetia-node.list
apt-get update
apt-get install -y nodejs
[[ $(node -p 'process.versions.node.split(".")[0]') == 22 ]] || die 'Node.js 22 diperlukan.'

systemctl enable --now postgresql
# Abort if the dedicated role/database already exists; never adopt unknown data.
[[ $(runuser -u postgres -- psql -XAtqc "SELECT count(*) FROM pg_roles WHERE rolname='pustakasetia'") == 0 ]] || die 'Role database sudah ada.'
[[ $(runuser -u postgres -- psql -XAtqc "SELECT count(*) FROM pg_database WHERE datname='pustakasetia'") == 0 ]] || die 'Database sudah ada.'
runuser -u postgres -- psql -X -v ON_ERROR_STOP=1 -c "ALTER SYSTEM SET listen_addresses = '127.0.0.1';"
systemctl restart postgresql
DB_PASSWORD=$(openssl rand -hex 32)
JWT_SECRET=$(openssl rand -hex 48)
# Random hex is safe in the SQL literal and connection URI; no password in argv.
runuser -u postgres -- psql -X -v ON_ERROR_STOP=1 <<SQL
SET log_statement = 'none';
SET log_min_duration_statement = -1;
CREATE ROLE pustakasetia LOGIN PASSWORD '$DB_PASSWORD' NOSUPERUSER NOCREATEDB NOCREATEROLE;
CREATE DATABASE pustakasetia OWNER pustakasetia;
REVOKE ALL ON DATABASE pustakasetia FROM PUBLIC;
SQL
if id pustakasetia-app &>/dev/null; then
  validate_service_user
else
  useradd --system --user-group --create-home --home-dir /var/lib/pustakasetia-app --shell /usr/sbin/nologin pustakasetia-app
fi
install -d -o pustakasetia-app -g pustakasetia-app -m 0750 "$APP"
rsync -a --no-owner --no-group --exclude='.git' --exclude='node_modules' \
  --exclude='.next' --exclude='.env*' --exclude='*.db*' --exclude='uploads' \
  --exclude='logs' --exclude='auth.json' "$SOURCE/" "$APP/"
install -d -o pustakasetia-app -g pustakasetia-app -m 0750 "$APP/uploads" "$APP/logs"
cat > "$APP/.env.production" <<ENV
DATABASE_URL=postgresql://pustakasetia:$DB_PASSWORD@127.0.0.1:5432/pustakasetia?schema=public
JWT_SECRET=$JWT_SECRET
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
NEXT_PUBLIC_SITE_NAME="Pustaka Setia"
UPLOADS_DIR=$APP/uploads
NEXT_TELEMETRY_DISABLED=1
ENV
unset DB_PASSWORD JWT_SECRET

# Separate PostgreSQL history: SQLite migration SQL must never run on PostgreSQL.
install -d "$APP/prisma-postgresql/migrations/0001_init"
sed 's/provider = "sqlite"/provider = "postgresql"/' "$APP/prisma/schema.prisma" \
  > "$APP/prisma-postgresql/schema.prisma"
grep -q 'provider = "postgresql"' "$APP/prisma-postgresql/schema.prisma" || die 'Konversi schema gagal.'
printf 'provider = "postgresql"\n' > "$APP/prisma-postgresql/migrations/migration_lock.toml"
cat > "$APP/prisma-postgresql.config.ts" <<'CONFIG'
import { defineConfig, env } from 'prisma/config';
export default defineConfig({
  schema: 'prisma-postgresql/schema.prisma',
  migrations: { path: 'prisma-postgresql/migrations' },
  datasource: { url: env('DATABASE_URL') },
});
CONFIG
cat > "$APP/scripts/server-command.sh" <<'COMMAND'
#!/usr/bin/env bash
set -Eeuo pipefail
cd /opt/pustakasetia
set -a
source .env.production
set +a
exec "$@"
COMMAND
chown -R pustakasetia-app:pustakasetia-app "$APP"
chmod 0600 "$APP/.env.production"
app() { runuser -u pustakasetia-app -- bash "$APP/scripts/server-command.sh" "$@"; }
cd "$APP"
if [[ -f package-lock.json ]]; then app npm ci --include=dev; else app npm install --include=dev; fi
app node node_modules/prisma/build/index.js validate --config prisma-postgresql.config.ts
app node node_modules/prisma/build/index.js migrate diff --from-empty \
  --to-schema-datamodel prisma-postgresql/schema.prisma --script \
  --config prisma-postgresql.config.ts > prisma-postgresql/migrations/0001_init/migration.sql
chown pustakasetia-app:pustakasetia-app prisma-postgresql/migrations/0001_init/migration.sql
app node node_modules/prisma/build/index.js migrate deploy --config prisma-postgresql.config.ts
app node node_modules/prisma/build/index.js generate --config prisma-postgresql.config.ts

# Create only the administrative identity; never execute the demo seed.
cat > scripts/server-admin.cjs <<'ADMIN'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('node:fs');
const prisma = new PrismaClient();
async function main() {
  const password = fs.readFileSync(0, 'utf8');
  const hash = await bcrypt.hash(password, 12);
  await prisma.$transaction(async (tx) => {
    const role = await tx.role.create({ data: { name: 'Admin', description: 'Administrator' } });
    await tx.user.create({ data: {
      username: process.argv[2], fullName: 'Administrator', password: hash,
      roleId: role.id, status: 'active',
    } });
  });
}
main().catch(() => { console.error('Pembuatan admin gagal.'); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
ADMIN
chown pustakasetia-app:pustakasetia-app scripts/server-admin.cjs
printf %s "$ADMIN_PASSWORD" | app node scripts/server-admin.cjs "$ADMIN_USER"
unset ADMIN_PASSWORD
app npm run build
chmod -R u=rwX,g=rX,o= "$APP"
chown -R root:pustakasetia-app "$APP"
chmod 0640 "$APP/.env.production"
chown -R pustakasetia-app:pustakasetia-app "$APP/.next" "$APP/uploads" "$APP/logs"

cat > /etc/systemd/system/pustakasetia.service <<'SERVICE'
[Unit]
Description=Pustaka Setia Next.js
After=network.target postgresql.service
Requires=postgresql.service
[Service]
Type=simple
User=pustakasetia-app
Group=pustakasetia-app
WorkingDirectory=/opt/pustakasetia
Environment=NODE_ENV=production
EnvironmentFile=/opt/pustakasetia/.env.production
ExecStart=/usr/bin/node node_modules/next/dist/bin/next start -H 127.0.0.1 -p 3000
Restart=on-failure
RestartSec=5
UMask=0077
NoNewPrivileges=true
PrivateTmp=true
ProtectHome=true
ProtectSystem=strict
ReadWritePaths=/opt/pustakasetia/.next /opt/pustakasetia/uploads /opt/pustakasetia/logs
RestrictSUIDSGID=true
[Install]
WantedBy=multi-user.target
SERVICE
systemctl daemon-reload
systemctl enable --now pustakasetia
READY=0
for ((i=0; i<60; i++)); do
  if curl --fail --silent --output /dev/null http://127.0.0.1:3000/api/books; then READY=1; break; fi
  sleep 2
done
[[ $READY == 1 ]] || die 'Aplikasi belum sehat. Periksa journalctl -u pustakasetia.'

cat > /etc/nginx/sites-available/pustakasetia <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;
    server_tokens off;
    client_max_body_size 6m;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$remote_addr;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
    }
}
NGINX
chmod 0644 /etc/nginx/sites-available/pustakasetia
ln -s /etc/nginx/sites-available/pustakasetia /etc/nginx/sites-enabled/pustakasetia
nginx -t
systemctl enable --now nginx
systemctl reload nginx

ufw allow "$SSH_PORT/tcp" comment 'SSH aktif'
ufw allow 80/tcp
ufw allow 443/tcp
ufw default deny incoming
ufw default allow outgoing
ufw --force enable
cat > /etc/fail2ban/jail.d/pustakasetia.local <<JAIL
[sshd]
enabled = true
backend = systemd
port = $SSH_PORT
maxretry = 5
findtime = 10m
bantime = 1h
JAIL
systemctl enable --now fail2ban
systemctl restart fail2ban
cat > /etc/apt/apt.conf.d/20auto-upgrades <<'UPDATES'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
UPDATES
systemctl enable --now unattended-upgrades
certbot --nginx --non-interactive --agree-tos --email "$EMAIL" -d "$DOMAIN" --redirect
systemctl enable --now certbot.timer
nginx -t
curl --fail --silent --show-error --output /dev/null "https://$DOMAIN/api/books"
printf '\nSelesai: https://%s\nAdmin: %s (password yang Anda masukkan).\n' "$DOMAIN" "$ADMIN_USER"
printf '%s\n' 'Log: sudo journalctl -u pustakasetia -n 100 --no-pager' \
  'Status: sudo systemctl status pustakasetia nginx postgresql fail2ban' \
  'Uji renewal: sudo certbot renew --dry-run' \
  'Jadwalkan backup database dan uploads ke penyimpanan terpisah sebelum dipakai operasional.'
