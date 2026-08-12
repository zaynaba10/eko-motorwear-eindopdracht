/**
 * Minimalistische HTML -> blokken-parser voor Webflow Rich Text velden
 * (Post Body). Geen externe dependency nodig: we herkennen de gangbare
 * blok-tags (h1-h4, p, li, blockquote) en strippen de rest.
 */
export type RichBlock = { type: 'h2' | 'h3' | 'p' | 'li' | 'quote'; text: string };

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, '');
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export function parseRichText(html?: string): RichBlock[] {
  if (!html) return [];
  const blocks: RichBlock[] = [];
  const blockRe = /<(h1|h2|h3|h4|p|li|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = blockRe.exec(html))) {
    const tag = match[1].toLowerCase();
    const inner = match[2].replace(/<br\s*\/?>/gi, '\n');
    const text = decodeEntities(stripTags(inner)).trim();
    if (!text) continue;

    let type: RichBlock['type'] = 'p';
    if (tag === 'h1' || tag === 'h2') type = 'h2';
    else if (tag === 'h3' || tag === 'h4') type = 'h3';
    else if (tag === 'li') type = 'li';
    else if (tag === 'blockquote') type = 'quote';

    blocks.push({ type, text });
  }

  if (blocks.length === 0) {
    const text = decodeEntities(stripTags(html.replace(/<br\s*\/?>/gi, '\n'))).trim();
    text.split(/\n+/).forEach((line) => {
      if (line.trim()) blocks.push({ type: 'p', text: line.trim() });
    });
  }

  return blocks;
}
