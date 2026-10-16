#!/usr/bin/env bash
# Offline metadata fixtures only: no user, filesystem, or database changes.
set -Eeuo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.."
eval "$(sed -n '/^validate_service_user() {$/,/^}$/p' scripts/setup-server.sh)"
die() { printf '%s\n' "$*" >&2; exit 1; }
getent() {
  case "$1" in
    passwd) printf 'pustakasetia:x:%s:991::%s:%s\n' "$FIX_UID" "$FIX_HOME" "$FIX_SHELL" ;;
    group) printf 'pustakasetia:x:%s:%s\n' "$FIX_GID" "$FIX_MEMBERS" ;;
    *) return 1 ;;
  esac
}
id() { [[ $1 == -G ]] && printf '%s\n' "$FIX_GROUPS"; }
check() {
  local expected=$1 label=$2 actual=0
  # A separate shell preserves real errexit semantics for the rejection paths.
  bash -c 'set -Eeuo pipefail; validate_service_user' >/dev/null 2>&1 || actual=$?
  if [[ $expected == pass && $actual != 0 || $expected == fail && $actual == 0 ]]; then
    printf 'FAIL: %s\n' "$label"; exit 1
  fi
  printf 'PASS: %s\n' "$label"
}
export -f validate_service_user die getent id
export FIX_UID=991 FIX_HOME=/var/lib/pustakasetia FIX_SHELL=/usr/sbin/nologin
export FIX_GID=991 FIX_MEMBERS='' FIX_GROUPS=991
check pass 'existing service account'
FIX_SHELL=/bin/false check pass 'disabled shell'
FIX_SHELL=/bin/bash check fail 'interactive account rejected'
FIX_UID=0 check fail 'root rejected'
FIX_HOME=/home/pustakasetia check fail 'unrelated home rejected'
FIX_GID=992 check fail 'mismatched primary group rejected'
FIX_MEMBERS=other check fail 'shared group rejected'
FIX_GROUPS='991 27' check fail 'supplementary privilege rejected'
