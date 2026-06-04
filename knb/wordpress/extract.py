#!/usr/bin/env python3
"""
Extract WordPress export XML into clean Markdown files for CASSA knowledgebase.
"""

import xml.etree.ElementTree as ET
import re
import os
import sys
from datetime import datetime
from collections import defaultdict

# ── Namespaces ───────────────────────────────────────────────────────────────
NS = {
    "wp":      "http://wordpress.org/export/1.2/",
    "content": "http://purl.org/rss/1.0/modules/content/",
    "excerpt": "http://wordpress.org/export/1.2/excerpt/",
    "dc":      "http://purl.org/dc/elements/1.1/",
}

XML_PATH = "/home/asad/Downloads/cassa.WordPress.2026-05-28.xml"
OUT_ROOT = "/home/asad/Software/cassa/knb/wordpress"
POSTS_DIR = os.path.join(OUT_ROOT, "posts")
EVENTS_DIR = os.path.join(OUT_ROOT, "events")

os.makedirs(POSTS_DIR, exist_ok=True)
os.makedirs(EVENTS_DIR, exist_ok=True)


# ── HTML → Markdown helpers ──────────────────────────────────────────────────

def strip_avada_shortcodes(text):
    """Remove [av_*] shortcode tags but keep their inner content/links/images."""
    # Remove self-closing shortcodes like [av_hr /] [av_spacer /]
    text = re.sub(r'\[av_[^\]]*?/\]', '', text)
    # Remove paired shortcodes keeping inner content
    # Keep doing passes until nothing changes (for nested)
    for _ in range(5):
        new_text = re.sub(r'\[av_[^\]]*?\](.*?)\[/av_[^\]]*?\]', r'\1', text, flags=re.DOTALL)
        if new_text == text:
            break
        text = new_text
    # Remove any remaining opening/closing av_ tags
    text = re.sub(r'\[/?av_[^\]]*?\]', '', text)
    return text


def strip_other_shortcodes(text):
    """Remove non-av shortcodes that produce no meaningful content."""
    # caption shortcode – keep inner image
    text = re.sub(r'\[caption[^\]]*?\](.*?)\[/caption\]', r'\1', text, flags=re.DOTALL)
    # Remove remaining unknown shortcodes (but keep their inner text if paired)
    for _ in range(3):
        new_text = re.sub(r'\[[a-z_]+[^\]]*?\](.*?)\[/[a-z_]+\]', r'\1', text, flags=re.DOTALL)
        if new_text == text:
            break
        text = new_text
    text = re.sub(r'\[[a-z_/][^\]]*?\]', '', text)
    return text


def html_to_markdown(html):
    """Convert basic HTML tags to Markdown; leave complex content as-is."""
    if not html:
        return ""

    # Strip shortcodes first
    html = strip_avada_shortcodes(html)
    html = strip_other_shortcodes(html)

    # Headings
    for n in range(6, 0, -1):
        html = re.sub(r'<h%d[^>]*>(.*?)</h%d>' % (n, n),
                      lambda m, n=n: '\n' + '#' * n + ' ' + clean_inline(m.group(1)) + '\n',
                      html, flags=re.DOTALL | re.IGNORECASE)

    # Bold / italic
    html = re.sub(r'<strong[^>]*>(.*?)</strong>', r'**\1**', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<b[^>]*>(.*?)</b>', r'**\1**', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<em[^>]*>(.*?)</em>', r'*\1*', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<i[^>]*>(.*?)</i>', r'*\1*', html, flags=re.DOTALL | re.IGNORECASE)

    # Links
    html = re.sub(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
                  lambda m: f'[{clean_inline(m.group(2))}]({m.group(1)})',
                  html, flags=re.DOTALL | re.IGNORECASE)

    # Images
    html = re.sub(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*(?:alt=["\']([^"\']*)["\'])?[^>]*/?>',
                  lambda m: f'![{m.group(2) or ""}]({m.group(1)})',
                  html, flags=re.IGNORECASE)
    # Also handle alt before src
    html = re.sub(r'<img[^>]+alt=["\']([^"\']*)["\'][^>]+src=["\']([^"\']+)["\'][^>]*/?>',
                  lambda m: f'![{m.group(1)}]({m.group(2)})',
                  html, flags=re.IGNORECASE)

    # Lists
    html = re.sub(r'<li[^>]*>(.*?)</li>', lambda m: '- ' + clean_inline(m.group(1)) + '\n',
                  html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<[ou]l[^>]*>', '\n', html, flags=re.IGNORECASE)
    html = re.sub(r'</[ou]l>', '\n', html, flags=re.IGNORECASE)

    # Blockquote
    html = re.sub(r'<blockquote[^>]*>(.*?)</blockquote>',
                  lambda m: '\n> ' + clean_inline(m.group(1)).replace('\n', '\n> ') + '\n',
                  html, flags=re.DOTALL | re.IGNORECASE)

    # Paragraphs / line breaks
    html = re.sub(r'<br\s*/?>',  '\n', html, flags=re.IGNORECASE)
    html = re.sub(r'<p[^>]*>(.*?)</p>',
                  lambda m: '\n' + clean_inline(m.group(1)) + '\n',
                  html, flags=re.DOTALL | re.IGNORECASE)

    # Divs → blank lines
    html = re.sub(r'<div[^>]*>', '\n', html, flags=re.IGNORECASE)
    html = re.sub(r'</div>', '\n', html, flags=re.IGNORECASE)

    # HR
    html = re.sub(r'<hr[^>]*/?>',  '\n---\n', html, flags=re.IGNORECASE)

    # Tables – minimal: keep them as-is wrapped in HTML fences (complex tables)
    # Strip remaining tags
    html = re.sub(r'<[^>]+>', '', html)

    # Decode HTML entities
    html = html.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>') \
               .replace('&nbsp;', ' ').replace('&quot;', '"').replace('&#8230;', '…') \
               .replace('&#8220;', '"').replace('&#8221;', '"').replace('&#8216;', "'") \
               .replace('&#8217;', "'").replace('&mdash;', '—').replace('&ndash;', '–') \
               .replace('&#8211;', '–').replace('&#8212;', '—').replace('&#160;', ' ')

    # Collapse excess blank lines
    html = re.sub(r'\n{3,}', '\n\n', html)
    return html.strip()


def clean_inline(text):
    """Strip all tags from inline text."""
    text = re.sub(r'<[^>]+>', '', text)
    return text.strip()


def yaml_escape(val):
    """Escape a string value for YAML frontmatter."""
    if val is None:
        return '""'
    val = str(val)
    if any(c in val for c in [':', '#', '[', ']', '{', '}', ',', '|', '>', '!', '%', '@', '`', '"', "'"]):
        val = val.replace('"', '\\"')
        return f'"{val}"'
    if '\n' in val:
        val = val.replace('"', '\\"')
        return f'"{val}"'
    return f'"{val}"'


def slug_safe(slug):
    """Make a filename-safe slug."""
    slug = re.sub(r'[^\w\-]', '-', slug)
    slug = re.sub(r'-+', '-', slug).strip('-')
    return slug or 'untitled'


# ── XML parsing ──────────────────────────────────────────────────────────────

def get_text(el, tag):
    child = el.find(tag, NS)
    return child.text if child is not None else None


def get_postmeta(item):
    meta = {}
    for pm in item.findall('wp:postmeta', NS):
        key = get_text(pm, 'wp:meta_key')
        val = get_text(pm, 'wp:meta_value')
        if key:
            meta[key] = val
    return meta


def get_categories(item, domain):
    cats = []
    for cat in item.findall('category'):
        if cat.get('domain') == domain:
            cats.append(cat.text.strip() if cat.text else '')
    return [c for c in cats if c]


def parse_items(xml_path):
    print(f"Parsing {xml_path} …", flush=True)
    tree = ET.parse(xml_path)
    root = tree.getroot()
    channel = root.find('channel')
    items = channel.findall('item')
    print(f"  Found {len(items)} items total", flush=True)
    return items


# ── Post type processors ─────────────────────────────────────────────────────

def process_posts(items):
    posts = [i for i in items if get_text(i, 'wp:post_type') == 'post']
    print(f"  Processing {len(posts)} posts …", flush=True)

    cat_counts = defaultdict(int)
    tag_counts = defaultdict(int)

    for item in posts:
        title   = get_text(item, 'title') or ''
        slug    = get_text(item, 'wp:post_name') or slug_safe(title)
        slug    = slug_safe(slug)
        wp_id   = get_text(item, 'wp:post_id') or ''
        link    = get_text(item, 'link') or ''
        date    = get_text(item, 'wp:post_date') or ''
        status  = get_text(item, 'wp:status') or ''
        author  = get_text(item, 'dc:creator') or ''

        cats = get_categories(item, 'category')
        tags = get_categories(item, 'post_tag')

        for c in cats:
            cat_counts[c] += 1
        for t in tags:
            tag_counts[t] += 1

        raw_body = item.find('content:encoded', NS)
        raw_body = raw_body.text if raw_body is not None and raw_body.text else ''
        body = html_to_markdown(raw_body)

        cats_yaml = '[' + ', '.join(yaml_escape(c) for c in cats) + ']'
        tags_yaml = '[' + ', '.join(yaml_escape(t) for t in tags) + ']'

        md = f"""---
title: {yaml_escape(title)}
slug: {yaml_escape(slug)}
wp_id: {wp_id}
url: {yaml_escape(link)}
date: {yaml_escape(date)}
status: {yaml_escape(status)}
author: {yaml_escape(author)}
categories: {cats_yaml}
tags: {tags_yaml}
---

{body}
"""
        outpath = os.path.join(POSTS_DIR, slug + '.md')
        # Handle slug collisions
        if os.path.exists(outpath):
            outpath = os.path.join(POSTS_DIR, slug + f'-{wp_id}.md')
        with open(outpath, 'w', encoding='utf-8') as f:
            f.write(md)

    return posts, cat_counts, tag_counts


def process_events(items):
    events = [i for i in items if get_text(i, 'wp:post_type') == 'tribe_events']
    print(f"  Processing {len(events)} events …", flush=True)

    cat_counts = defaultdict(int)
    dates = []

    for item in events:
        title   = get_text(item, 'title') or ''
        slug    = get_text(item, 'wp:post_name') or slug_safe(title)
        slug    = slug_safe(slug)
        wp_id   = get_text(item, 'wp:post_id') or ''
        link    = get_text(item, 'link') or ''
        status  = get_text(item, 'wp:status') or ''

        cats = get_categories(item, 'tribe_events_cat')
        for c in cats:
            cat_counts[c] += 1

        meta = get_postmeta(item)
        start       = meta.get('_EventStartDate', '')
        end         = meta.get('_EventEndDate', '')
        all_day     = meta.get('_EventAllDay', '')
        event_url   = meta.get('_EventURL', '')
        venue_id    = meta.get('_EventVenueID', '')
        organizer_id = meta.get('_EventOrganizerID', '')

        if start:
            dates.append(start)

        raw_body = item.find('content:encoded', NS)
        raw_body = raw_body.text if raw_body is not None and raw_body.text else ''
        body = html_to_markdown(raw_body)

        cats_yaml = '[' + ', '.join(yaml_escape(c) for c in cats) + ']'

        md = f"""---
title: {yaml_escape(title)}
slug: {yaml_escape(slug)}
wp_id: {wp_id}
url: {yaml_escape(link)}
status: {yaml_escape(status)}
start: {yaml_escape(start)}
end: {yaml_escape(end)}
all_day: {yaml_escape(all_day)}
event_url: {yaml_escape(event_url)}
venue_id: {yaml_escape(venue_id)}
organizer_id: {yaml_escape(organizer_id)}
categories: {cats_yaml}
---

{body}
"""
        outpath = os.path.join(EVENTS_DIR, slug + '.md')
        if os.path.exists(outpath):
            outpath = os.path.join(EVENTS_DIR, slug + f'-{wp_id}.md')
        with open(outpath, 'w', encoding='utf-8') as f:
            f.write(md)

    return events, cat_counts, sorted(dates)


def process_venues(items):
    venues = [i for i in items if get_text(i, 'wp:post_type') == 'tribe_venue']
    print(f"  Processing {len(venues)} venues …", flush=True)

    lines = ["# Venues\n"]
    for item in venues:
        wp_id = get_text(item, 'wp:post_id') or ''
        title = get_text(item, 'title') or ''
        meta  = get_postmeta(item)

        address = meta.get('_VenueAddress', '') or ''
        city    = meta.get('_VenueCity', '') or ''
        country = meta.get('_VenueCountry', '') or ''
        state   = meta.get('_VenueStateProvince', '') or ''

        lines.append(f"## {title}")
        lines.append(f"- **id**: {wp_id}")
        if address: lines.append(f"- **address**: {address}")
        if city:    lines.append(f"- **city**: {city}")
        if state:   lines.append(f"- **state**: {state}")
        if country: lines.append(f"- **country**: {country}")
        lines.append("")

    outpath = os.path.join(EVENTS_DIR, '_venues.md')
    with open(outpath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    return venues


def process_organizers(items):
    organizers = [i for i in items if get_text(i, 'wp:post_type') == 'tribe_organizer']
    print(f"  Processing {len(organizers)} organizers …", flush=True)

    lines = ["# Organizers\n"]
    for item in organizers:
        wp_id = get_text(item, 'wp:post_id') or ''
        title = get_text(item, 'title') or ''
        meta  = get_postmeta(item)

        email   = meta.get('_OrganizerEmail', '') or ''
        phone   = meta.get('_OrganizerPhone', '') or ''
        website = meta.get('_OrganizerWebsite', '') or ''

        lines.append(f"## {title}")
        lines.append(f"- **id**: {wp_id}")
        if email:   lines.append(f"- **email**: {email}")
        if phone:   lines.append(f"- **phone**: {phone}")
        if website: lines.append(f"- **website**: {website}")
        lines.append("")

    outpath = os.path.join(EVENTS_DIR, '_organizers.md')
    with open(outpath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    return organizers


def process_taxonomy(post_cat_counts, post_tag_counts, event_cat_counts):
    lines = ["# Taxonomy\n", "## Post Categories\n"]

    for cat, count in sorted(post_cat_counts.items(), key=lambda x: -x[1]):
        lines.append(f"- {cat}: {count}")
    lines.append("")

    lines.append("## Post Tags\n")
    for tag, count in sorted(post_tag_counts.items(), key=lambda x: -x[1]):
        lines.append(f"- {tag}: {count}")
    lines.append("")

    lines.append("## Event Categories\n")
    for cat, count in sorted(event_cat_counts.items(), key=lambda x: -x[1]):
        lines.append(f"- {cat}: {count}")
    lines.append("")

    outpath = os.path.join(OUT_ROOT, '_taxonomy.md')
    with open(outpath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))


# ── Summary stats ────────────────────────────────────────────────────────────

def print_summary(posts, post_cats, post_tags, events, event_cats, event_dates):
    print("\n=== SUMMARY ===")
    print(f"Posts written: {len(posts)}")
    print(f"Events written: {len(events)}")

    print("\nPost categories (count):")
    for cat, n in sorted(post_cats.items(), key=lambda x: -x[1])[:20]:
        print(f"  {cat}: {n}")

    print("\nEvent categories (count):")
    for cat, n in sorted(event_cats.items(), key=lambda x: -x[1]):
        print(f"  {cat}: {n}")

    if event_dates:
        print(f"\nEvent date range: {event_dates[0]} → {event_dates[-1]}")

    # Detect recurring series in event titles
    from collections import Counter
    # Load all event filenames and check titles
    series_keywords = ['colloquium', 'workshop', 'journal club', 'seminar', 'talk', 'lecture']
    series_counts = Counter()
    import glob
    for md_path in glob.glob(os.path.join(EVENTS_DIR, '*.md')):
        with open(md_path) as f:
            content = f.read(500)
        title_match = re.search(r'^title:\s*"?(.*?)"?\s*$', content, re.MULTILINE)
        if title_match:
            title_lower = title_match.group(1).lower()
            for kw in series_keywords:
                if kw in title_lower:
                    series_counts[kw] += 1

    print("\nRecurring event series (keyword hits in titles):")
    for kw, n in series_counts.most_common():
        print(f"  {kw}: {n}")


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    items = parse_items(XML_PATH)

    posts, post_cats, post_tags = process_posts(items)
    events, event_cats, event_dates = process_events(items)
    process_venues(items)
    process_organizers(items)
    process_taxonomy(post_cats, post_tags, event_cats)

    print_summary(posts, post_cats, post_tags, events, event_cats, event_dates)
    print("\nDone.")


if __name__ == '__main__':
    main()
