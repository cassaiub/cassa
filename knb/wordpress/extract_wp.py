#!/usr/bin/env python3
"""
WordPress WXR extractor for CASSA website migration.
Extracts pages, navigation menus, and generates a sitemap.
"""

import xml.etree.ElementTree as ET
import re
import os
import sys
from html.parser import HTMLParser
import html

# Output directory
OUT_DIR = "/home/asad/Software/cassa/knb/wordpress"

# WXR namespaces
NS = {
    'wp':      'http://wordpress.org/export/1.2/',
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'excerpt': 'http://wordpress.org/export/1.2/excerpt/',
    'dc':      'http://purl.org/dc/elements/1.1/',
}

# ─── HTML → Markdown converter ─────────────────────────────────────────────

class HTML2Markdown(HTMLParser):
    """Minimal HTML-to-Markdown converter."""

    BLOCK_ELEMENTS = {
        'p', 'div', 'section', 'article', 'header', 'footer',
        'aside', 'main', 'blockquote', 'pre', 'ul', 'ol', 'li',
        'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'br', 'figure',
        'figcaption',
    }

    def __init__(self):
        super().__init__()
        self.result = []
        self._stack = []        # (tag, attrs_dict)
        self._skip_depth = 0    # depth of tags we're skipping entirely
        self._list_stack = []   # 'ul' or 'ol', plus counters
        self._in_pre = False
        self._in_code = False
        self._href = None
        self._img_alt = None

    # ── helpers ─────────────────────────────────────────────────────────────

    def _attrs(self, attrs):
        return dict(attrs)

    def _append(self, text):
        self.result.append(text)

    def _current_list_indent(self):
        return "  " * (len(self._list_stack) - 1)

    # ── tags ─────────────────────────────────────────────────────────────────

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        ad = self._attrs(attrs)

        if self._skip_depth > 0:
            self._skip_depth += 1
            return

        # Tags to skip entirely (including children)
        if tag in ('script', 'style', 'noscript'):
            self._skip_depth = 1
            return

        self._stack.append(tag)

        if tag in ('h1','h2','h3','h4','h5','h6'):
            level = int(tag[1])
            self._append('\n' + '#' * level + ' ')
        elif tag == 'p':
            self._append('\n\n')
        elif tag == 'br':
            self._append('  \n')
        elif tag == 'hr':
            self._append('\n\n---\n\n')
        elif tag in ('ul', 'ol'):
            self._list_stack.append({'type': tag, 'count': 0})
            self._append('\n')
        elif tag == 'li':
            if self._list_stack:
                lst = self._list_stack[-1]
                indent = "  " * (len(self._list_stack) - 1)
                if lst['type'] == 'ol':
                    lst['count'] += 1
                    self._append(f"\n{indent}{lst['count']}. ")
                else:
                    self._append(f"\n{indent}- ")
        elif tag == 'blockquote':
            self._append('\n\n> ')
        elif tag == 'pre':
            self._in_pre = True
            self._append('\n\n```\n')
        elif tag == 'code':
            self._in_code = True
            if not self._in_pre:
                self._append('`')
        elif tag == 'strong' or tag == 'b':
            self._append('**')
        elif tag == 'em' or tag == 'i':
            self._append('_')
        elif tag == 'a':
            href = ad.get('href', '')
            self._href = href
            self._append('[')
        elif tag == 'img':
            src = ad.get('src', '')
            alt = ad.get('alt', '')
            self._append(f'![{alt}]({src})')
        elif tag == 'figure':
            self._append('\n\n')
        elif tag == 'figcaption':
            self._append('\n*')
        elif tag in ('table',):
            self._append('\n\n')
        elif tag == 'tr':
            self._append('\n|')
        elif tag in ('th', 'td'):
            self._append(' ')
        elif tag == 'div':
            self._append('\n')

    def handle_endtag(self, tag):
        tag = tag.lower()

        if self._skip_depth > 0:
            self._skip_depth -= 1
            return

        if self._stack and self._stack[-1] == tag:
            self._stack.pop()

        if tag in ('h1','h2','h3','h4','h5','h6'):
            self._append('\n')
        elif tag == 'p':
            self._append('\n')
        elif tag in ('ul', 'ol'):
            if self._list_stack:
                self._list_stack.pop()
            self._append('\n')
        elif tag == 'pre':
            self._in_pre = False
            self._append('\n```\n')
        elif tag == 'code':
            self._in_code = False
            if not self._in_pre:
                self._append('`')
        elif tag == 'strong' or tag == 'b':
            self._append('**')
        elif tag == 'em' or tag == 'i':
            self._append('_')
        elif tag == 'a':
            href = self._href or ''
            self._append(f']({href})')
            self._href = None
        elif tag == 'figcaption':
            self._append('*\n')
        elif tag in ('th', 'td'):
            self._append(' |')
        elif tag == 'blockquote':
            self._append('\n\n')

    def handle_data(self, data):
        if self._skip_depth > 0:
            return
        if self._in_pre:
            self._append(data)
        else:
            self._append(data)

    def handle_entityref(self, name):
        self._append(html.unescape(f'&{name};'))

    def handle_charref(self, name):
        self._append(html.unescape(f'&#{name};'))

    def get_markdown(self):
        return ''.join(self.result)


def html_to_markdown(html_text):
    """Convert HTML string to Markdown."""
    if not html_text:
        return ''
    p = HTML2Markdown()
    p.feed(html_text)
    return p.get_markdown()


# ─── Enfold/Avia shortcode-aware extractor ───────────────────────────────
#
# Enfold stores content in two places:
#   1. av_textblock / av_text bodies  (HTML between open and close tags)
#   2. Shortcode *attributes* for av_heading (heading=, tag=),
#      av_button (label=, link=), av_image (src=, alt=),
#      av_slide / av_fullscreen_slide (title=, content=), etc.
#
# Strategy:
#   - Walk the raw source and extract semantic pieces in document order.
#   - Emit Markdown fragments per piece, then join and clean.

def _attr(attrs_str, key):
    """Extract value of a shortcode attribute (handles single-quoted values)."""
    m = re.search(rf"{key}='([^']*?)'", attrs_str)
    return m.group(1) if m else ''


def extract_enfold_content(raw):
    """
    Parse Enfold/Avia page builder shortcodes from raw WP page content
    and return clean Markdown.
    """
    if not raw:
        return ''

    pieces = []
    pos = 0
    length = len(raw)

    # Pattern to find ANY shortcode tag (open, self-closing, or close)
    # We'll match opening [av_xxx ...] or [av_xxx .../] and [/av_xxx]
    TAG_RE = re.compile(
        r'\[(/?)av_([a-z_]+)([^\]]*?)(/?)?\]',
        re.DOTALL | re.IGNORECASE
    )

    # Tags that carry human-readable attributes we want to extract
    ATTR_TAGS = {
        'av_heading':  [('heading', 'h'), ('tag', 'level')],  # special handling
        'av_button':   [('label', 'button'), ('link', 'url')],
        'av_slide':    [('title', 'h3'), ('content', 'p')],
        'av_fullscreen_slide': [('title', 'h3'), ('content', 'p')],
        'av_image':    [('src', 'img'), ('alt', 'alt')],
        'av_icon_box': [('title', 'h4'), ('content', 'p')],
        'av_feature_box': [('title', 'h4'), ('content', 'p')],
        'av_tab':      [('title', 'h4')],
        'av_toggle':   [('title', 'h4')],
        'av_section':  [],
        'av_hr':       [],
        'av_separator':[],
    }

    # Tags whose body text (between open and close) is HTML content
    BODY_TAGS = {'av_textblock', 'av_text', 'av_content_slider', 'av_notification'}

    # Track open tags to find body text
    open_stack = []   # list of (tag_name, start_of_body_pos)

    for m in TAG_RE.finditer(raw):
        slash_open = m.group(1)   # '/' if closing tag
        tag = m.group(2).lower()
        attrs_str = m.group(3)
        self_close = (m.group(4) == '/')

        full_tag = m.group(0)
        tag_start = m.start()
        tag_end   = m.end()

        if slash_open:
            # Closing tag
            full_tag_name = f'av_{tag}'
            if open_stack and open_stack[-1][0] == full_tag_name:
                body_start = open_stack.pop()[1]
                body_html = raw[body_start:tag_start]
                if full_tag_name in BODY_TAGS and body_html.strip():
                    md = html_to_markdown(body_html)
                    pieces.append(md.strip())
            continue

        full_tag_name = f'av_{tag}'

        # Opening or self-closing tag
        if full_tag_name in ATTR_TAGS:
            specs = ATTR_TAGS[full_tag_name]
            if full_tag_name == 'av_heading':
                # Extract heading text and level
                heading_text = _attr(attrs_str, 'heading')
                tag_level = _attr(attrs_str, 'tag') or 'h3'
                if heading_text:
                    level_map = {'h1':1,'h2':2,'h3':3,'h4':4,'h5':5,'h6':6}
                    lvl = level_map.get(tag_level.lower(), 3)
                    pieces.append(f"{'#'*lvl} {heading_text}")
            elif full_tag_name == 'av_button':
                label = _attr(attrs_str, 'label')
                link_raw = _attr(attrs_str, 'link')
                # link format: "manually,URL" or just "URL"
                if ',' in link_raw:
                    link_url = link_raw.split(',', 1)[1]
                else:
                    link_url = link_raw
                if label and link_url:
                    pieces.append(f"[{label}]({link_url})")
                elif label:
                    pieces.append(label)
            elif full_tag_name == 'av_image':
                src  = _attr(attrs_str, 'src')
                alt  = _attr(attrs_str, 'alt') or _attr(attrs_str, 'title')
                if src:
                    pieces.append(f"![{alt}]({src})")
            elif full_tag_name in ('av_slide', 'av_fullscreen_slide'):
                title   = _attr(attrs_str, 'title')
                content = _attr(attrs_str, 'content')
                if title:
                    pieces.append(f"### {title}")
                if content:
                    pieces.append(html_to_markdown(content).strip())
            elif full_tag_name in ('av_icon_box', 'av_feature_box'):
                title   = _attr(attrs_str, 'title')
                content = _attr(attrs_str, 'content')
                if title:
                    pieces.append(f"#### {title}")
                if content:
                    pieces.append(html_to_markdown(content).strip())
            elif full_tag_name in ('av_tab', 'av_toggle'):
                title = _attr(attrs_str, 'title')
                if title:
                    pieces.append(f"#### {title}")

        if full_tag_name in BODY_TAGS and not self_close:
            # Remember position to extract body later
            open_stack.append((full_tag_name, tag_end))

    # Also handle any stray HTML not inside any shortcode
    # (some pages mix plain HTML blocks with shortcodes)
    # BUT: only use plain HTML fallback if we found NO shortcode content at all,
    # to avoid duplicating the Enfold "classic block" mirror copy.
    if not pieces:
        stripped = re.sub(r'\[/?av_[a-z_]+[^\]]*?\]', '', raw, flags=re.DOTALL | re.IGNORECASE)
        stripped = re.sub(r'\[/?[a-z_]+[^\]]*?\]', '', stripped, flags=re.DOTALL | re.IGNORECASE)
        stripped = re.sub(r'<!--.*?-->', '', stripped, flags=re.DOTALL)
        plain_html = stripped.strip()
        if plain_html:
            plain_md = html_to_markdown(plain_html).strip()
            if plain_md:
                pieces.append(plain_md)

    return '\n\n'.join(p for p in pieces if p.strip())


def clean_markdown(md):
    """Post-process Markdown: collapse excessive blank lines, strip leading/trailing whitespace."""
    # Normalise line endings
    md = md.replace('\r\n', '\n').replace('\r', '\n')
    # Collapse 3+ consecutive blank lines to 2
    md = re.sub(r'\n{3,}', '\n\n', md)
    # Strip leading/trailing whitespace
    md = md.strip()
    return md


def process_content(raw_html):
    """Full pipeline: Enfold-aware extraction → clean Markdown."""
    if not raw_html:
        return ''
    md = extract_enfold_content(raw_html)
    md = clean_markdown(md)
    return md


# ─── Slugify ──────────────────────────────────────────────────────────────

def slugify(title):
    """Create a URL slug from a title."""
    s = title.lower()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    s = re.sub(r'-+', '-', s)
    s = s.strip('-')
    return s or 'untitled'


# ─── YAML helpers ─────────────────────────────────────────────────────────

def yaml_str(val):
    """Quote a string for YAML frontmatter."""
    if val is None:
        return 'null'
    val = str(val).replace('"', '\\"')
    return f'"{val}"'


def frontmatter(**kwargs):
    lines = ['---']
    for k, v in kwargs.items():
        if v is None or v == '':
            lines.append(f'{k}: null')
        elif isinstance(v, (int, float)):
            lines.append(f'{k}: {v}')
        elif isinstance(v, bool):
            lines.append(f'{k}: {"true" if v else "false"}')
        else:
            lines.append(f'{k}: {yaml_str(v)}')
    lines.append('---')
    return '\n'.join(lines)


# ─── Main parser ──────────────────────────────────────────────────────────

def parse_wxr(xml_path):
    print(f"Parsing {xml_path} …")
    tree = ET.parse(xml_path)
    root = tree.getroot()

    pages = []
    nav_menu_items = []
    wp_navigation = []
    all_items_by_id = {}   # wp_id -> item dict (for link resolution)

    channel = root.find('channel')
    items = channel.findall('item')
    print(f"Total <item> elements: {len(items)}")

    for item in items:
        def t(tag, ns=None):
            """Get text of a direct child tag."""
            if ns:
                el = item.find(f'{{{NS[ns]}}}{tag}')
            else:
                el = item.find(tag)
            return el.text if el is not None else None

        post_type = t('post_type', 'wp')
        if post_type not in ('page', 'nav_menu_item', 'wp_navigation'):
            continue

        wp_id = int(t('post_id', 'wp') or 0)
        title = t('title') or ''
        link  = t('link') or ''
        post_name = t('post_name', 'wp') or ''
        status = t('status', 'wp') or ''
        parent_id = int(t('post_parent', 'wp') or 0)
        menu_order = int(t('menu_order', 'wp') or 0)
        pub_date = t('pubDate') or ''
        template_el = item.find(f'{{{NS["wp"]}}}page_template')
        template = template_el.text if template_el is not None else ''
        content_encoded = item.find(f'{{{NS["content"]}}}encoded')
        body_html = content_encoded.text if content_encoded is not None else ''

        # Gather postmeta
        postmeta = {}
        for pm in item.findall(f'{{{NS["wp"]}}}postmeta'):
            key_el = pm.find(f'{{{NS["wp"]}}}meta_key')
            val_el = pm.find(f'{{{NS["wp"]}}}meta_value')
            if key_el is not None and val_el is not None:
                postmeta[key_el.text or ''] = val_el.text or ''

        record = {
            'wp_id': wp_id,
            'title': title,
            'link': link,
            'post_name': post_name,
            'status': status,
            'parent_id': parent_id,
            'menu_order': menu_order,
            'pub_date': pub_date,
            'template': template,
            'body_html': body_html,
            'postmeta': postmeta,
        }

        all_items_by_id[wp_id] = record

        if post_type == 'page':
            pages.append(record)
        elif post_type == 'nav_menu_item':
            nav_menu_items.append(record)
        elif post_type == 'wp_navigation':
            wp_navigation.append(record)

    print(f"Pages: {len(pages)}, Nav menu items: {len(nav_menu_items)}, WP Navigation: {len(wp_navigation)}")

    # Also collect term→menu name mapping from <wp:term> elements
    menu_names = {}  # term_id -> name
    # Gather categories associated with nav_menu_items
    for item in items:
        post_type = item.find(f'{{{NS["wp"]}}}post_type')
        if post_type is None or post_type.text != 'nav_menu_item':
            continue
        wp_id = int(item.find(f'{{{NS["wp"]}}}post_id').text or 0)
        # categories with domain="nav_menu" give us the menu name
        for cat in item.findall('category'):
            domain = cat.get('domain', '')
            if domain == 'nav_menu':
                nicename = cat.get('nicename', '')
                cat_text = cat.text or ''
                menu_names[nicename] = cat_text

    # Collect term data from channel's <wp:term> elements (covers tribe_events_cat etc.)
    terms = {}
    for term in channel.findall(f'{{{NS["wp"]}}}term'):
        term_id_el = term.find(f'{{{NS["wp"]}}}term_id')
        term_slug_el = term.find(f'{{{NS["wp"]}}}term_slug')
        term_name_el = term.find(f'{{{NS["wp"]}}}term_name')
        tax_el = term.find(f'{{{NS["wp"]}}}term_taxonomy')
        if term_id_el is not None:
            tid = int(term_id_el.text or 0)
            terms[tid] = {
                'slug': term_slug_el.text if term_slug_el is not None else '',
                'name': term_name_el.text if term_name_el is not None else '',
                'taxonomy': tax_el.text if tax_el is not None else '',
            }

    # Collect category terms from channel's <wp:category> elements
    category_terms = {}
    for cat in channel.findall(f'{{{NS["wp"]}}}category'):
        cid_el  = cat.find(f'{{{NS["wp"]}}}term_id')
        cslug_el = cat.find(f'{{{NS["wp"]}}}category_nicename')
        cname_el = cat.find(f'{{{NS["wp"]}}}cat_name')
        cpar_el  = cat.find(f'{{{NS["wp"]}}}category_parent')
        if cid_el is not None:
            cid = int(cid_el.text or 0)
            category_terms[cid] = {
                'slug':   cslug_el.text if cslug_el is not None else '',
                'name':   cname_el.text if cname_el is not None else '',
                'parent': cpar_el.text  if cpar_el  is not None else '',
            }

    return pages, nav_menu_items, wp_navigation, all_items_by_id, menu_names, terms, category_terms


# ─── Extract nav_menu assignments for each nav_menu_item ─────────────────

def get_nav_menu_assignments(xml_path):
    """
    For each nav_menu_item, find which nav_menu term slugs it belongs to
    by reading <category domain="nav_menu"> children.
    Returns dict: wp_id -> list of menu nicenames.
    """
    tree = ET.parse(xml_path)
    root = tree.getroot()
    channel = root.find('channel')
    assignments = {}

    for item in channel.findall('item'):
        post_type = item.find(f'{{{NS["wp"]}}}post_type')
        if post_type is None or post_type.text != 'nav_menu_item':
            continue
        wp_id_el = item.find(f'{{{NS["wp"]}}}post_id')
        if wp_id_el is None:
            continue
        wp_id = int(wp_id_el.text or 0)
        menus = []
        for cat in item.findall('category'):
            if cat.get('domain') == 'nav_menu':
                menus.append(cat.get('nicename', ''))
        assignments[wp_id] = menus

    return assignments


# ─── Write pages ──────────────────────────────────────────────────────────

def write_pages(pages):
    pages_dir = os.path.join(OUT_DIR, 'pages')
    os.makedirs(pages_dir, exist_ok=True)

    written = []
    slug_counts = {}

    for p in sorted(pages, key=lambda x: x['menu_order']):
        title = p['title']
        post_name = p['post_name']

        # Derive slug
        if post_name:
            slug = post_name
        else:
            slug = slugify(title)

        # Ensure unique slug
        base_slug = slug
        if slug in slug_counts:
            slug_counts[slug] += 1
            slug = f"{slug}-{slug_counts[base_slug]}"
        else:
            slug_counts[slug] = 0

        # Process body
        body_md = process_content(p['body_html'])

        fm = frontmatter(
            title=title,
            slug=slug,
            wp_id=p['wp_id'],
            url=p['link'],
            parent_id=p['parent_id'] if p['parent_id'] else None,
            menu_order=p['menu_order'],
            status=p['status'],
            template=p['template'] or None,
            date=p['pub_date'],
        )

        filename = f"{slug}.md"
        filepath = os.path.join(pages_dir, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fm)
            f.write('\n\n')
            if body_md:
                f.write(body_md)
                f.write('\n')

        written.append({'slug': slug, 'title': title, 'wp_id': p['wp_id'], 'parent_id': p['parent_id']})
        print(f"  [page] {slug}.md  ({title!r})")

    return written


# ─── Write navigation ──────────────────────────────────────────────────────

def write_nav(nav_menu_items, all_items_by_id, menu_names, menu_assignments, terms=None, category_terms=None):
    """Reconstruct navigation menus and write _nav.md."""

    # Build lookup: wp_id -> nav_menu_item record
    nav_by_id = {item['wp_id']: item for item in nav_menu_items}

    # Build page title lookup: object_id -> title (for page/post links)
    page_titles = {v['wp_id']: v['title'] for v in all_items_by_id.values()}

    # Merged taxonomy lookup: term_id -> name (covers wp:term and wp:category)
    tax_labels = {}  # term_id -> name
    if terms:
        for tid, t in terms.items():
            tax_labels[tid] = t['name']
    if category_terms:
        for tid, t in category_terms.items():
            tax_labels[tid] = t['name']

    # Group nav items by menu nicename
    menu_groups = {}  # nicename -> list of nav_menu_item wp_ids
    for wp_id, menus in menu_assignments.items():
        for m in menus:
            menu_groups.setdefault(m, []).append(wp_id)

    def resolve_label(item):
        pm = item['postmeta']
        nav_type = pm.get('_menu_item_type', '')
        nav_title = item['title']
        obj_id = int(pm.get('_menu_item_object_id', 0) or 0)
        url = pm.get('_menu_item_url', '')
        if nav_title:
            return nav_title, url
        if nav_type in ('post_type', 'page') and obj_id and obj_id in page_titles:
            return page_titles[obj_id], url
        if nav_type == 'taxonomy' and obj_id and obj_id in tax_labels:
            return tax_labels[obj_id], url
        return f'[id:{item["wp_id"]}]', url

    def build_tree(item_ids):
        """Build nested tree from a flat list of nav item wp_ids."""
        nodes = {}
        for wid in item_ids:
            if wid not in nav_by_id:
                continue
            item = nav_by_id[wid]
            parent_nav_id = int(item['postmeta'].get('_menu_item_menu_item_parent', 0) or 0)
            nodes[wid] = {
                'item': item,
                'parent_nav_id': parent_nav_id,
                'children': [],
            }
        # Attach children
        roots = []
        for wid, node in nodes.items():
            pid = node['parent_nav_id']
            if pid and pid in nodes:
                nodes[pid]['children'].append(node)
            else:
                roots.append(node)
        # Sort by menu_order
        def sort_key(n):
            return n['item']['menu_order']
        roots.sort(key=sort_key)
        for node in nodes.values():
            node['children'].sort(key=sort_key)
        return roots

    def render_tree(nodes, indent=0):
        lines = []
        prefix = '  ' * indent
        for node in nodes:
            item = node['item']
            label, url = resolve_label(item)
            obj_type = item['postmeta'].get('_menu_item_type', '')
            obj_id = item['postmeta'].get('_menu_item_object_id', '')
            if url and url != '#':
                lines.append(f"{prefix}- [{label}]({url})")
            else:
                lines.append(f"{prefix}- {label}")
            if node['children']:
                lines.extend(render_tree(node['children'], indent + 1))
        return lines

    lines = ['# Navigation Menus', '']

    for nicename, item_ids in sorted(menu_groups.items()):
        menu_label = menu_names.get(nicename, nicename)
        lines.append(f'## {menu_label}')
        lines.append('')
        roots = build_tree(item_ids)
        lines.extend(render_tree(roots))
        lines.append('')

    nav_path = os.path.join(OUT_DIR, '_nav.md')
    with open(nav_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f"  [nav] _nav.md written ({len(nav_menu_items)} items, {len(menu_groups)} menus)")
    return menu_groups


# ─── Write sitemap ──────────────────────────────────────────────────────────

def write_sitemap(pages):
    """Write a hierarchical sitemap nested by parent_id."""
    # Build children map
    by_parent = {}
    for p in pages:
        pid = p['parent_id'] or 0
        by_parent.setdefault(pid, []).append(p)

    # Sort each level by menu_order
    for pid in by_parent:
        by_parent[pid].sort(key=lambda x: x['menu_order'])

    lines = ['# CASSA Site Map', '']

    def render(parent_id, indent=0):
        prefix = '  ' * indent
        for p in by_parent.get(parent_id, []):
            title = p['title']
            url = p['link']
            slug = p['post_name'] or slugify(title)
            lines.append(f"{prefix}- **{title}** — {url} (`{slug}`)")
            render(p['wp_id'], indent + 1)

    render(0)

    sitemap_path = os.path.join(OUT_DIR, '_sitemap.md')
    with open(sitemap_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f"  [sitemap] _sitemap.md written")


# ─── Write WP Navigation block (block-based nav) ──────────────────────────

def write_wp_navigation(wp_navigation):
    if not wp_navigation:
        return
    lines = ['# WP Navigation Block(s)', '']
    for nav in wp_navigation:
        lines.append(f"## {nav['title'] or '[Untitled]'} (wp_id: {nav['wp_id']})")
        lines.append('')
        body_md = process_content(nav['body_html'])
        if body_md:
            lines.append(body_md)
        lines.append('')

    wp_nav_path = os.path.join(OUT_DIR, '_wp_navigation.md')
    with open(wp_nav_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f"  [wp_nav] _wp_navigation.md written")


# ─── Summary ──────────────────────────────────────────────────────────────

def print_summary(written_pages, menu_groups, nav_by_menu_names):
    print()
    print("=" * 60)
    print("PAGES EXTRACTED")
    print("=" * 60)
    for p in sorted(written_pages, key=lambda x: x['slug']):
        parent = f" (parent: {p['parent_id']})" if p['parent_id'] else ''
        print(f"  {p['slug']}.md  — {p['title']}{parent}")

    print()
    print("=" * 60)
    print("MENUS")
    print("=" * 60)
    for nicename, item_ids in sorted(menu_groups.items()):
        label = nav_by_menu_names.get(nicename, nicename)
        print(f"  {label!r} ({nicename}): {len(item_ids)} items")


# ─── Entry point ──────────────────────────────────────────────────────────

def main():
    xml_path = '/home/asad/Downloads/cassa.WordPress.2026-05-28.xml'
    pages, nav_menu_items, wp_navigation, all_items_by_id, menu_names, terms, category_terms = parse_wxr(xml_path)
    menu_assignments = get_nav_menu_assignments(xml_path)

    written_pages = write_pages(pages)
    menu_groups = write_nav(nav_menu_items, all_items_by_id, menu_names, menu_assignments,
                            terms=terms, category_terms=category_terms)
    write_sitemap([{**p, 'post_name': p['post_name'] or slugify(p['title'])} for p in pages])
    write_wp_navigation(wp_navigation)
    print_summary(written_pages, menu_groups, menu_names)


if __name__ == '__main__':
    main()
