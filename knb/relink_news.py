#!/usr/bin/env python3
"""Relink news body images: cassa.site -> local downloaded files; drop non-cassa.
- ![alt](https://cassa.site/...name-1030x773.ext)  ->  ![alt](../../assets/news/<slug>/name.ext)
- [](https://argiub.space/...) / wikimedia / coalab / manasarovar  -> removed (caption text kept)
Never touches surrounding prose. Reports every change; flags any local miss.
"""
import os, re, sys

NEWS = "src/content/news"
ASSETS = "src/assets/news"
DEAD = ("argiub.space", "coalab.space", "manasarovar.space",
        "upload.wikimedia.org", "googleusercontent.com")

def strip_size(u): return re.sub(r"-\d{2,5}x\d{2,5}(\.[a-z]+)$", r"\1", u, flags=re.I)
def base(u): return u.split("/")[-1].split("?")[0]

# ![alt](url)  — capture alt and url
IMG = re.compile(r"!\[([^\]]*)\]\((https?://[^)\s]+?\.(?:jpg|jpeg|png|gif|webp))\)", re.I)
# [](url) or [text](url) link (NOT image) to a dead host
DEADLINK = re.compile(
    r"!?\[[^\]]*\]\((https?://(?:%s)/[^)\s]+?\.(?:jpg|jpeg|png|gif|webp))\)" % "|".join(re.escape(d) for d in DEAD),
    re.I)

relinked = dropped = missed = 0
changed_files = []
for fn in sorted(os.listdir(NEWS)):
    if not fn.endswith(".md"): continue
    slug = fn[:-3]
    path = os.path.join(NEWS, fn)
    src = open(path, encoding="utf-8").read()
    orig = src

    # 1) drop dead-host image/link tokens, keep any caption text after them
    def _drop(m):
        global dropped; dropped += 1; return ""
    src = DEADLINK.sub(_drop, src)

    # 2) relink cassa.site images -> local
    def _relink(m):
        global relinked, missed
        alt, url = m.group(1), m.group(2)
        if "cassa.site" not in url:
            return m.group(0)  # leave other hosts (shouldn't remain)
        fname = base(strip_size(url))
        local = f"../../assets/{'news'}/{slug}/{fname}"
        if not os.path.exists(os.path.join(ASSETS, slug, fname)):
            missed += 1
            print(f"  !! MISSING local file for {slug}: {fname} (left remote)", file=sys.stderr)
            return m.group(0)
        relinked += 1
        return f"![{alt}]({local})"
    src = IMG.sub(_relink, src)

    if src != orig:
        open(path, "w", encoding="utf-8").write(src)
        changed_files.append(slug)

print(f"relinked={relinked}  dropped(non-cassa)={dropped}  missing_local={missed}")
print(f"files changed: {len(changed_files)}")
# sanity: any remote image refs left?
left = os.popen(r"grep -rEoh '!\[[^]]*\]\(https?://[^)]+\)' src/content/news/*.md | wc -l").read().strip()
print(f"remote image refs still in news bodies: {left}")
