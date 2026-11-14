// Minimal, safe Markdown renderer for ASF reports. It builds DOM nodes with
// textContent only (never innerHTML), so model or source text cannot inject markup,
// scripts or links. Supported: headings, paragraphs, bullet and numbered lists,
// tables, block quotes, horizontal rules, fenced code, **bold**, _italic_/*italic*
// and `code`. Links are shown as text. Heading levels are shifted down so the
// report sits under the page's own headings.

const HEADING_OFFSET = 2;

function appendInline(parent, text) {
  // Italic markers must sit at word boundaries so identifiers like plant_notes_v2 stay intact.
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|(?<!\w)_[^_\s][^_]*_(?!\w)|(?<!\w)\*[^*\s][^*]*\*(?!\w)|\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > last) parent.append(document.createTextNode(text.slice(last, match.index)));
    const token = match[0];
    let node;
    if (token.startsWith('**')) {
      node = document.createElement('strong');
      node.textContent = token.slice(2, -2);
    } else if (token.startsWith('`')) {
      node = document.createElement('code');
      node.textContent = token.slice(1, -1);
    } else if (token.startsWith('[')) {
      const [, label, url] = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      node = document.createTextNode(label === url ? label : `${label} (${url})`);
    } else {
      node = document.createElement('em');
      node.textContent = token.slice(1, -1);
    }
    parent.append(node);
    last = match.index + token.length;
  }
  if (last < text.length) parent.append(document.createTextNode(text.slice(last)));
}

function isTableDivider(line) {
  return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line);
}

function splitRow(line) {
  let row = line.trim();
  if (row.startsWith('|')) row = row.slice(1);
  if (row.endsWith('|')) row = row.slice(0, -1);
  return row.split('|').map((cell) => cell.trim());
}

export function renderMarkdown(markdown) {
  const fragment = document.createDocumentFragment();
  const lines = String(markdown || '').replace(/^﻿/, '').split(/\r?\n/);
  let i = 0;
  let paragraph = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const p = document.createElement('p');
    appendInline(p, paragraph.join(' '));
    fragment.append(p);
    paragraph = [];
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) { flushParagraph(); i += 1; continue; }

    if (trimmed.startsWith('```')) {
      flushParagraph();
      const code = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) { code.push(lines[i]); i += 1; }
      i += 1;
      const pre = document.createElement('pre');
      pre.textContent = code.join('\n');
      fragment.append(pre);
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushParagraph();
      const level = Math.min(heading[1].length + HEADING_OFFSET, 6);
      const h = document.createElement(`h${level}`);
      appendInline(h, heading[2]);
      fragment.append(h);
      i += 1;
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushParagraph();
      fragment.append(document.createElement('hr'));
      i += 1;
      continue;
    }

    if (trimmed.startsWith('|') && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      flushParagraph();
      const wrap = document.createElement('div');
      wrap.className = 'asf-report__table';
      const table = document.createElement('table');
      const head = document.createElement('thead');
      const headRow = document.createElement('tr');
      splitRow(trimmed).forEach((cell) => {
        const th = document.createElement('th');
        th.scope = 'col';
        appendInline(th, cell);
        headRow.append(th);
      });
      head.append(headRow);
      table.append(head);
      const body = document.createElement('tbody');
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const tr = document.createElement('tr');
        splitRow(lines[i]).forEach((cell) => {
          const td = document.createElement('td');
          appendInline(td, cell);
          tr.append(td);
        });
        body.append(tr);
        i += 1;
      }
      table.append(body);
      wrap.append(table);
      fragment.append(wrap);
      continue;
    }

    const listMatch = trimmed.match(/^([-*+]|\d+[.)])\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      const ordered = /\d/.test(listMatch[1]);
      const list = document.createElement(ordered ? 'ol' : 'ul');
      while (i < lines.length) {
        const item = lines[i].trim().match(/^([-*+]|\d+[.)])\s+(.*)$/);
        if (!item || /\d/.test(item[1]) !== ordered) break;
        const li = document.createElement('li');
        const parts = [item[2]];
        i += 1;
        // Indented continuation lines belong to the same item.
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*+]|\d+[.)])\s+/.test(lines[i])) {
          parts.push(lines[i].trim());
          i += 1;
        }
        appendInline(li, parts.join(' '));
        list.append(li);
      }
      fragment.append(list);
      continue;
    }

    if (trimmed.startsWith('>')) {
      flushParagraph();
      const quote = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quote.push(lines[i].trim().replace(/^>\s?/, ''));
        i += 1;
      }
      const blockquote = document.createElement('blockquote');
      const p = document.createElement('p');
      appendInline(p, quote.join(' '));
      blockquote.append(p);
      fragment.append(blockquote);
      continue;
    }

    paragraph.push(trimmed);
    i += 1;
  }
  flushParagraph();
  return fragment;
}
