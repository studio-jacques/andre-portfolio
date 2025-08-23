// Theme toggle with persistence
(function() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') { document.body.classList.add('dark'); }
  btn.style.background = getComputedStyle(document.body).getPropertyValue('--fg').trim();
  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    btn.style.background = getComputedStyle(document.body).getPropertyValue('--fg').trim();
  });
})();

// Masonry gallery loader with infinite loop (repeats images when near bottom)
(async function() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  // Source image list from images.json (ordered/curated)
  let files = null;
  try {
    const res = await fetch('images.json', { cache: 'no-store' });
    if (res.ok) files = await res.json();
  } catch (e) {}

  // Fallback to numbered sequence if no JSON
  if (!files) {
    files = [];
    for (let i = 1; i <= 300; i++) files.push('photo' + i + '.jpg');
  }

  function appendBatch() {
    // Append one pass of all files
    for (const f of files) {
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = 'images/' + f;
      gallery.appendChild(img);
    }
  }

  appendBatch();

  // Infinite loop: when near bottom, append again
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (nearBottom) appendBatch();
      ticking = false;
    });
  }, { passive: true });
})();
