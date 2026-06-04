#!/usr/bin/env bash
#
# Deploy the built site (dist/) to Bluehost via rsync over SSH.
#
# Usage:
#   npm run deploy            # build + dry-run + confirm + sync
#   npm run deploy -- --yes   # skip the dry-run confirmation
#
# Connection details come from ~/.ssh/config (Host "bluehost").
#
set -euo pipefail

REMOTE="bluehost"                 # ~/.ssh/config alias
REMOTE_PATH="public_html/"        # webroot on the server
LOCAL_PATH="dist/"                # Astro build output

# Sibling sub-sites that live in the webroot but are NOT part of this build.
# rsync --delete will NOT touch anything matched here (they are protected).
# Edit this list if the server has other folders to preserve.
EXCLUDES=(
  "courses"        # /courses/ast100 sub-site
  "abekta"         # /abekta sub-site
  ".well-known"    # ACME / SSL validation
  "cgi-bin"        # cPanel default
  ".htaccess"      # server config (hand-edited, 7.8KB — redirects/SSL)
  ".user.ini"      # per-account PHP config
  ".ftpquota"      # cPanel FTP quota file
)

cd "$(dirname "$0")/.."

# 1. Build
echo "▶ Building site…"
npm run build

# 2. Assemble rsync args
RSYNC_ARGS=(-avz --delete --human-readable)
for e in "${EXCLUDES[@]}"; do
  RSYNC_ARGS+=(--exclude="$e")
done

# 3. Dry-run first unless --yes passed
if [[ "${1:-}" != "--yes" ]]; then
  echo
  echo "▶ DRY RUN — no files changed yet. Review what would happen:"
  rsync "${RSYNC_ARGS[@]}" --dry-run "$LOCAL_PATH" "$REMOTE:$REMOTE_PATH"
  echo
  read -r -p "Proceed with the real sync? [y/N] " ans
  [[ "$ans" == "y" || "$ans" == "Y" ]] || { echo "Aborted."; exit 1; }
fi

# 4. Real sync
echo
echo "▶ Deploying to $REMOTE:$REMOTE_PATH …"
rsync "${RSYNC_ARGS[@]}" "$LOCAL_PATH" "$REMOTE:$REMOTE_PATH"
echo
echo "✅ Done. Hard-refresh https://cassa.site to see changes."
