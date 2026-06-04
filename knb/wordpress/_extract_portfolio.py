#!/usr/bin/env python3
"""Extract WordPress portfolio items to Markdown files."""
import xml.etree.ElementTree as ET
import re
import os

XML_PATH = '/home/asad/Downloads/cassa.WordPress.2026-05-28.xml'
OUT_DIR = '/home/asad/Software/cassa/knb/wordpress/portfolio'

NS = {
    'wp': 'http://wordpress.org/export/1.2/',
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'excerpt': 'http://wordpress.org/export/1.2/excerpt/',
    'dc': 'http://purl.org/dc/elements/1.1/',
}


def strip_shortcodes_keep_inner(text):
    """Remove Enfold [av_...] shortcode wrappers but keep meaningful inner content."""
    if not text:
        return ''

    # Remove WP block comments
    text = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)

    # Convert av_heading -> Markdown heading
    def replace_av_heading(m):
        sc = m.group(0)
        h = re.search(r"\bheading='([^']*)'", sc)
        tag_m = re.search(r"\btag='([^']*)'", sc)
        if h and h.group(1).strip():
            tag = tag_m.group(1) if tag_m else 'h2'
            level = re.search(r'\d', tag)
            hashes = '#' * (int(level.group()) if level else 2)
            return f'\n{hashes} {h.group(1).strip()}\n'
        return ''

    text = re.sub(r'\[av_heading\b[^\]]*\].*?\[/av_heading\]', replace_av_heading, text, flags=re.DOTALL)

    # Extract inner content from text/code blocks
    def extract_inner(m):
        inner = m.group(1) if m.groups() else ''
        return '\n' + inner.strip() + '\n'

    for tag in ['av_textblock', 'av_codeblock']:
        text = re.sub(
            r'\[' + tag + r'\b[^\]]*\](.*?)\[/' + tag + r'\]',
            extract_inner, text, flags=re.DOTALL
        )

    # Extract slide captions (image credits)
    def extract_slide_caption(m):
        inner = (m.group(1) or '').strip()
        if inner:
            return f'\n*{inner}*\n'
        return ''

    text = re.sub(
        r'\[av_fullscreen_slide\b[^\]]*\](.*?)\[/av_fullscreen_slide\]',
        extract_slide_caption, text, flags=re.DOTALL
    )

    # Remove all remaining shortcode tags
    text = re.sub(r'\[/?av_[^\]]*\]', '', text)
    text = re.sub(r'\[/?[a-z_]+[^\]]*\]', '', text)

    return text


def html_to_markdown(html):
    """Convert HTML markup to clean Markdown."""
    if not html:
        return ''

    # Headings
    for level in range(1, 7):
        html = re.sub(
            r'<h' + str(level) + r'[^>]*>(.*?)</h' + str(level) + r'>',
            lambda m, l=level: '\n' + '#' * l + ' ' + re.sub(r'<[^>]+>', '', m.group(1)).strip() + '\n',
            html, flags=re.DOTALL | re.IGNORECASE
        )

    # Bold / italic
    html = re.sub(r'<strong[^>]*>(.*?)</strong>', r'**\1**', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<b[^>]*>(.*?)</b>', r'**\1**', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<em[^>]*>(.*?)</em>', r'*\1*', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<i[^>]*>(.*?)</i>', r'*\1*', html, flags=re.DOTALL | re.IGNORECASE)

    # Links
    html = re.sub(
        r'<a\s[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
        r'[\2](\1)', html, flags=re.DOTALL | re.IGNORECASE
    )

    # Images (reference, no download)
    html = re.sub(
        r'<img\s[^>]*src=["\']([^"\']+)["\'][^>]*/?>',
        lambda m: f'![image]({m.group(1)})', html, flags=re.IGNORECASE
    )

    # iframes -> links
    html = re.sub(
        r'<iframe\s[^>]*src=["\']([^"\']+)["\'][^>]*>.*?</iframe>',
        lambda m: f'[Embedded content]({m.group(1)})', html, flags=re.DOTALL | re.IGNORECASE
    )
    html = re.sub(
        r"<iframe\s[^>]*src='([^']+)'[^>]*>.*?</iframe>",
        lambda m: f'[Embedded content]({m.group(1)})', html, flags=re.DOTALL | re.IGNORECASE
    )

    # Block elements
    html = re.sub(r'<br\s*/?>', '\n', html, flags=re.IGNORECASE)
    html = re.sub(r'<p[^>]*>(.*?)</p>', r'\n\1\n', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<li[^>]*>(.*?)</li>', r'\n- \1', html, flags=re.DOTALL | re.IGNORECASE)

    # Tables: convert each row to pipe-separated line
    html = re.sub(
        r'<tr[^>]*>(.*?)</tr>',
        lambda m: '\n' + ' | '.join(
            re.sub(r'<[^>]+>', '', td).strip()
            for td in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', m.group(1), re.DOTALL | re.IGNORECASE)
        ),
        html, flags=re.DOTALL | re.IGNORECASE
    )

    # Strip remaining tags
    html = re.sub(r'<[^>]+>', '', html)

    # Decode common HTML entities
    entities = {
        '&amp;': '&', '&lt;': '<', '&gt;': '>', '&nbsp;': ' ',
        '&#8211;': '–', '&#8212;': '—', '&#8216;': '‘', '&#8217;': '’',
        '&#8220;': '“', '&#8221;': '”', '&#038;': '&', '&#8230;': '…',
        '&quot;': '"', '&#8243;': '″', '&#8242;': '′',
    }
    for ent, repl in entities.items():
        html = html.replace(ent, repl)

    # Collapse excessive blank lines
    html = re.sub(r'\n{3,}', '\n\n', html)
    return html.strip()


def process_content(raw):
    """Full pipeline: strip shortcodes then convert HTML to Markdown."""
    if not raw:
        return ''
    text = strip_shortcodes_keep_inner(raw)
    text = html_to_markdown(text)
    return text


def yaml_escape(s):
    """Escape a string for YAML frontmatter."""
    if s is None:
        return '""'
    s = str(s).strip()
    if any(c in s for c in ('"', "'", ':', '#', '{', '}', '[', ']', ',', '&', '*', '?', '|', '-', '<', '>', '=', '!', '%', '@', '`', '\n')):
        return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"'
    return f'"{s}"'


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    tree = ET.parse(XML_PATH)
    root = tree.getroot()

    portfolio_items = [
        item for item in root.iter('item')
        if (item.find('wp:post_type', NS) is not None and
            item.find('wp:post_type', NS).text == 'portfolio')
    ]
    print(f"Found {len(portfolio_items)} portfolio items")

    # Category groupings for _index.md
    cat_groups = {}  # nicename -> {name, items: [(slug, title)]}

    for item in portfolio_items:
        title = item.findtext('title') or ''
        link = item.findtext('link') or ''
        wp_id = item.findtext('wp:post_id', namespaces=NS) or ''
        slug = item.findtext('wp:post_name', namespaces=NS) or ''
        date = item.findtext('wp:post_date', namespaces=NS) or ''
        status = item.findtext('wp:status', namespaces=NS) or ''
        raw_content = item.findtext('{http://purl.org/rss/1.0/modules/content/}encoded') or ''

        # Portfolio categories (domain=portfolio_entries)
        categories = []
        for cat in item.findall('category'):
            domain = cat.get('domain', '')
            if domain == 'portfolio_entries':
                nicename = cat.get('nicename', '')
                name = cat.text or nicename
                categories.append({'nicename': nicename, 'name': name})
                if nicename not in cat_groups:
                    cat_groups[nicename] = {'name': name, 'items': []}
                cat_groups[nicename]['items'].append((slug, title))

        # Postmeta
        thumbnail_id = ''
        for pm in item.findall('wp:postmeta', NS):
            key = pm.findtext('wp:meta_key', namespaces=NS)
            val = pm.findtext('wp:meta_value', namespaces=NS)
            if key == '_thumbnail_id' and val:
                thumbnail_id = val

        # Build frontmatter
        cats_yaml = '\n'.join(
            f'  - nicename: {yaml_escape(c["nicename"])}\n    name: {yaml_escape(c["name"])}'
            for c in categories
        )
        cats_block = f'categories:\n{cats_yaml}' if categories else 'categories: []'

        frontmatter = f"""---
title: {yaml_escape(title)}
slug: {yaml_escape(slug)}
wp_id: {yaml_escape(wp_id)}
url: {yaml_escape(link)}
date: {yaml_escape(date)}
status: {yaml_escape(status)}
{cats_block}
thumbnail_id: {yaml_escape(thumbnail_id)}
---"""

        body = process_content(raw_content)
        md_content = frontmatter + '\n\n' + body + '\n'

        # Sanitize slug for filename
        safe_slug = re.sub(r'[^a-zA-Z0-9_\-]', '_', slug) if slug else f'wp_{wp_id}'
        out_path = os.path.join(OUT_DIR, f'{safe_slug}.md')
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(md_content)

    print(f"Wrote {len(portfolio_items)} files to {OUT_DIR}")

    # Build _index.md
    lines = ['# CASSA Portfolio: Category Index\n']
    lines.append('This index groups all 141 portfolio entries by their WordPress portfolio categories.\n')

    for nicename, data in sorted(cat_groups.items()):
        name = data['name']
        items = sorted(data['items'], key=lambda x: x[1])
        lines.append(f'\n## {name} ({len(items)} entries)\n')
        for slug, title in items:
            safe_slug = re.sub(r'[^a-zA-Z0-9_\-]', '_', slug) if slug else slug
            lines.append(f'- [{title}]({safe_slug}.md)')

    index_path = os.path.join(OUT_DIR, '_index.md')
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    print(f"Wrote {index_path}")

    # Print category summary
    print('\n=== Category Summary ===')
    for nicename, data in sorted(cat_groups.items(), key=lambda x: -len(x[1]['items'])):
        print(f"  {data['name']!r:45s} nicename={nicename!r}  count={len(data['items'])}")


if __name__ == '__main__':
    main()
