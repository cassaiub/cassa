#!/usr/bin/env python3
"""Map each news post / event (by slug) to its cassa.site images, from the WP XML.

Sources per item:
  - featured image: _thumbnail_id meta -> attachment post -> attachment_url
  - embedded images in content:encoded (src="...") on cassa.site
Only cassa.site URLs are kept (argiub.space / wikimedia / google etc. discarded).
"""
import os, re, json, sys
import xml.etree.ElementTree as ET

XML = os.path.join(os.path.dirname(__file__), "cassa.WordPress.2026-05-28.xml")
ROOT = os.path.dirname(os.path.dirname(__file__))
NS = {
    "wp": "http://wordpress.org/export/1.2/",
    "content": "http://purl.org/rss/1.0/modules/content/",
    "excerpt": "http://wordpress.org/export/1.2/excerpt/",
}

def norm(s):
    s = re.sub(r"\s+", " ", (s or "").strip().lower())
    s = s.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    return s

def content_items(d):
    """slug -> normalized title, read from frontmatter."""
    p = os.path.join(ROOT, "src/content", d)
    out = {}
    for f in os.listdir(p):
        if not f.endswith(".md"):
            continue
        slug = f[:-3]
        title = ""
        with open(os.path.join(p, f), encoding="utf-8") as fh:
            txt = fh.read()
        m = re.search(r'^title:\s*"?(.*?)"?\s*$', txt, re.M)
        if m:
            title = m.group(1)
        out[slug] = norm(title)
    return out

news_items = content_items("news")
event_items = content_items("events")
news_slugs = set(news_items)
event_slugs = set(event_items)
# reverse: normalized title -> content slug
news_by_title = {t: s for s, t in news_items.items() if t}
event_by_title = {t: s for s, t in event_items.items() if t}

tree = ET.parse(XML)
channel = tree.getroot().find("channel")

# Pass 1: index attachments by post id -> url
attach_url = {}
items = channel.findall("item")
for it in items:
    ptype = it.findtext("wp:post_type", default="", namespaces=NS)
    if ptype == "attachment":
        pid = it.findtext("wp:post_id", default="", namespaces=NS)
        url = it.findtext("wp:attachment_url", default="", namespaces=NS)
        if pid and url:
            attach_url[pid] = url

IMG_SRC = re.compile(r'<img[^>]+src=["\']([^"\']+)["\']', re.I)
ANY_URL = re.compile(r'https?://[^\s"\'<>)]+\.(?:jpg|jpeg|png|gif|webp)', re.I)

def is_cassa(u):
    return "cassa.site" in u

def collect(it):
    urls = []
    # featured image via _thumbnail_id
    for pm in it.findall("wp:postmeta", NS):
        if pm.findtext("wp:meta_key", default="", namespaces=NS) == "_thumbnail_id":
            tid = pm.findtext("wp:meta_value", default="", namespaces=NS)
            if tid in attach_url:
                urls.append(attach_url[tid])
    # embedded images in body
    body = it.findtext("content:encoded", default="", namespaces=NS) or ""
    for m in IMG_SRC.findall(body):
        urls.append(m)
    for m in ANY_URL.findall(body):
        urls.append(m)
    # dedupe preserve order, cassa-only
    seen, out = set(), []
    for u in urls:
        u = u.strip()
        if is_cassa(u) and u not in seen:
            seen.add(u); out.append(u)
    return out

result = {"news": {}, "events": {}}
matched = {"news": set(), "events": set()}
for it in items:
    ptype = it.findtext("wp:post_type", default="", namespaces=NS)
    slug = it.findtext("wp:post_name", default="", namespaces=NS)
    title = norm(it.findtext("title", default=""))
    if ptype == "post":
        cslug = slug if slug in news_slugs else news_by_title.get(title)
        if cslug:
            result["news"][cslug] = collect(it); matched["news"].add(cslug)
    elif ptype == "tribe_events":
        cslug = slug if slug in event_slugs else event_by_title.get(title)
        if cslug:
            result["events"][cslug] = collect(it); matched["events"].add(cslug)

# report
def summarize(kind, wanted):
    got = matched[kind]
    missing = wanted - got
    withimg = {s: u for s, u in result[kind].items() if u}
    total_imgs = sum(len(u) for u in result[kind].values())
    print(f"[{kind}] slugs in content={len(wanted)}  matched in XML={len(got)}  "
          f"unmatched={len(missing)}  with>=1 cassa img={len(withimg)}  total cassa img refs={total_imgs}")
    if missing:
        print(f"   UNMATCHED slugs (no XML item by that post_name): {sorted(missing)}")

summarize("news", news_slugs)
summarize("events", event_slugs)

allurls = sorted({u for k in result for u in sum(result[k].values(), [])})
print(f"\nUNIQUE cassa.site image URLs needed: {len(allurls)}")

with open(os.path.join(os.path.dirname(__file__), "images_map.json"), "w") as f:
    json.dump(result, f, indent=2)
with open(os.path.join(os.path.dirname(__file__), "images_urls.txt"), "w") as f:
    f.write("\n".join(allurls) + "\n")
print("wrote knb/images_map.json and knb/images_urls.txt")
