#!/usr/bin/env bash
# Parallel (10-way) cassa.site image downloader using the cf_clearance cookie.
# Reads knb/jobs.tsv: target<TAB>candidate1[<TAB>candidate2]
# Per memory: try stripped-original first, fall back to sized URL on 404;
# NEVER delete markdown refs on failure — failures are only logged here.
set -u
cd "$(dirname "$0")/.."
CK=$(cat knb/cf_cookie.txt)
UA=$(cat knb/cf_ua.txt)
export CK UA
FAILLOG=knb/dl_failed.txt
: > "$FAILLOG"

dl_one() {
  local line="$1" tgt cand code
  tgt="${line%%$'\t'}"; tgt="$(printf '%s' "$line" | cut -f1)"
  # already have it?
  if [ -s "$tgt" ]; then echo "SKIP $tgt"; return 0; fi
  mkdir -p "$(dirname "$tgt")"
  # iterate candidate URLs (fields 2..N)
  local n i cand
  n=$(printf '%s' "$line" | awk -F'\t' '{print NF}')
  for i in $(seq 2 "$n"); do
    cand=$(printf '%s' "$line" | cut -f"$i")
    code=$(curl -s -o "$tgt.part" -w "%{http_code}" \
      -A "$UA" -H "Cookie: $CK" -H "Referer: https://cassa.site/" \
      --max-time 60 --retry 2 --retry-delay 2 "$cand")
    if [ "$code" = "200" ] && [ -s "$tgt.part" ]; then
      # reject HTML challenge pages masquerading as images
      if head -c 15 "$tgt.part" | grep -qi "<!DOCTYPE\|<html"; then
        rm -f "$tgt.part"; continue
      fi
      mv "$tgt.part" "$tgt"; echo "OK   $tgt  ($code)"; return 0
    fi
    rm -f "$tgt.part"
  done
  echo "FAIL $tgt" | tee -a "$FAILLOG"
  return 0
}
export -f dl_one
export FAILLOG

# 10 parallel workers
cat knb/jobs.tsv | xargs -d '\n' -P 10 -I{} bash -c 'dl_one "$@"' _ {}

echo "=== summary ==="
echo "downloaded news : $(find src/assets/news -type f 2>/dev/null | wc -l)"
echo "downloaded events: $(find src/assets/events -type f 2>/dev/null | wc -l)"
echo "failures: $(grep -c . "$FAILLOG" 2>/dev/null || echo 0)"
