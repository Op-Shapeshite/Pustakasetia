export const normalizeSynopsisHtml = (html?: string | null) => {
  const raw = (html ?? '').trim();
  if (!raw) {
    return { html: '', text: '' };
  }

  if (typeof window === 'undefined') {
    const text = raw
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!text) {
      return { html: '', text: '' };
    }

    return { html: raw, text };
  }

  const template = document.createElement('template');
  template.innerHTML = raw;

  const blockedTags = [
    'script',
    'style',
    'iframe',
    'object',
    'embed',
    'link',
    'form',
    'input',
    'base',
    'meta',
    'frame',
    'frameset',
    'applet',
    'video',
    'audio',
    'svg',
  ];
  blockedTags.forEach((tag) => {
    template.content.querySelectorAll(tag).forEach((node) => node.remove());
  });

  const urlAttributes = new Set(['href', 'src', 'action', 'formaction']);

  template.content.querySelectorAll('*').forEach((node) => {
    Array.from(node.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value;
      if (name.startsWith('on')) {
        node.removeAttribute(attr.name);
        return;
      }
      if (urlAttributes.has(name) && /^\s*(javascript|data|vbscript|file):/i.test(value)) {
        node.removeAttribute(attr.name);
      }
    });
  });

  const text = (template.content.textContent || '').replace(/\s+/g, ' ').trim();
  const container = document.createElement('div');
  container.appendChild(template.content.cloneNode(true));
  const sanitizedHtml = container.innerHTML.trim();

  if (!text) {
    return { html: '', text: '' };
  }

  return { html: sanitizedHtml, text };
};
