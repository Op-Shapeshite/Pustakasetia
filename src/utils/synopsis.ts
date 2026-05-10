export const normalizeSynopsisHtml = (html?: string | null) => {
  const raw = (html ?? '').trim();
  if (!raw) {
    return { html: '', text: '' };
  }

  const text = raw
    .replace(/<br\s*\/?>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) {
    return { html: '', text: '' };
  }

  return { html: raw, text };
};
