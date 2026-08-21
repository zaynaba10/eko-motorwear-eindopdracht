/**
 * Minimalistische HTML -> blokken-parser voor Webflow Rich Text velden
 * (Post Body). Geen externe dependency nodig: we herkennen de gangbare
 * blok-tags (h1-h4, p, li, blockquote) en strippen de rest.
 *
 * Extra: in onze blogs staan de tussenkopjes als <strong> bovenaan een
 * alinea, gevolgd door een <br>. Die splitsen we hier in een kop + tekst,
 * zodat het artikel in de app dezelfde opbouw krijgt als op de website.
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

/** <p><strong>Kop</strong><br>tekst…</p> → los kopblok + tekstblok. */
function splitKop(inner: string): { kop?: string; rest: string } {
  const m = inner.match(/^\s*<(strong|b)>([\s\S]*?)<\/\1>\s*(?:<br\s*\/?>)?([\s\S]*)$/i);
  if (!m) return { rest: inner };
  const kop = decodeEntities(stripTags(m[2])).trim();
  const rest = m[3] ?? '';
  // Alleen splitsen als het echt een kopje is (kort) én er tekst op volgt.
  if (!kop || kop.length > 80 || !stripTags(rest).trim()) return { rest: inner };
  return { kop, rest };
}

export function parseRichText(html?: string): RichBlock[] {
  if (!html) return [];
  const blocks: RichBlock[] = [];
  const blockRe = /<(h1|h2|h3|h4|p|li|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;

  const voegToe = (type: RichBlock['type'], ruw: string) => {
    const text = decodeEntities(stripTags(ruw.replace(/<br\s*\/?>/gi, '\n'))).trim();
    if (text) blocks.push({ type, text });
  };

  while ((match = blockRe.exec(html))) {
    const tag = match[1].toLowerCase();
    const inner = match[2];

    if (tag === 'p') {
      const { kop, rest } = splitKop(inner);
      if (kop) {
        blocks.push({ type: 'h3', text: kop });
        voegToe('p', rest);
      } else {
        voegToe('p', inner);
      }
      continue;
    }

    let type: RichBlock['type'] = 'p';
    if (tag === 'h1' || tag === 'h2') type = 'h2';
    else if (tag === 'h3' || tag === 'h4') type = 'h3';
    else if (tag === 'li') type = 'li';
    else if (tag === 'blockquote') type = 'quote';

    voegToe(type, inner);
  }

  if (blocks.length === 0) {
    const text = decodeEntities(stripTags(html.replace(/<br\s*\/?>/gi, '\n'))).trim();
    text.split(/\n+/).forEach((line) => {
      if (line.trim()) blocks.push({ type: 'p', text: line.trim() });
    });
  }

  return blocks;
}

/**
 * Groepeert de blokken in secties: elk tussenkopje start een nieuwe sectie.
 * De artikelpagina zet die secties afwisselend op wit en op sectiegrijs.
 */
export type RichSectie = { kop?: string; blokken: RichBlock[] };

export function groepeerSecties(blokken: RichBlock[]): RichSectie[] {
  const secties: RichSectie[] = [];
  let huidig: RichSectie | null = null;

  blokken.forEach((blok) => {
    if (blok.type === 'h2' || blok.type === 'h3') {
      huidig = { kop: blok.text, blokken: [] };
      secties.push(huidig);
      return;
    }
    if (!huidig) {
      huidig = { blokken: [] };
      secties.push(huidig);
    }
    huidig.blokken.push(blok);
  });

  return secties.filter((s) => s.kop || s.blokken.length > 0);
}
