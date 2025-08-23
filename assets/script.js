window.addEventListener('load', () => document.body.classList.remove('no-transition'));
(function() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.body.classList.add('dark');
  btn.style.background = getComputedStyle(document.body).getPropertyValue('--fg').trim();
  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    btn.style.background = getComputedStyle(document.body).getPropertyValue('--fg').trim();
  });
})();

(async function() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;
  let manifest;
  try {
    const res = await fetch('images.json', { cache: 'no-store' });
    if (res.ok) manifest = await res.json();
  } catch {}
  if (!manifest) return;

  function createTile(entry) {
    const cfg = typeof entry === 'string' ? { file: entry } : entry;
    const div = document.createElement('div');
    div.className = 'tile' + (cfg.size ? (' s-' + cfg.size) : '');
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = 'images/' + cfg.file;
    img.alt = cfg.alt || cfg.file;
    div.appendChild(img);
    return div;
  }

  function appendPass() { for (const item of manifest) gallery.appendChild(createTile(item)); }
  appendPass();
  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) appendPass();
  }, { passive: true });
})();
