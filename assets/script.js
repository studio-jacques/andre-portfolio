// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

async function loadGallery() {
  const gallery = document.getElementById('gallery');
  const loaded = [];
  let files = null;

  try {
    const res = await fetch('images.json');
    if (res.ok) {
      files = await res.json();
    }
  } catch (err) {
    console.warn('No images.json found, using fallback numbered files');
  }

  if (files) {
    // Use order from images.json
    files.forEach((file, i) => {
      addImage('images/' + file, i);
    });
  } else {
    // Fallback numbered loading: photo1.jpg, photo2.jpg, ...
    let index = 1;
    const MAX = 500;
    while (index <= MAX) {
      const src = 'images/photo' + index + '.jpg';
      const ok = await tryLoad(src);
      if (!ok) break;
      addImage(src, index - 1);
      index++;
    }
  }

  function addImage(src, i) {
    const fig = document.createElement('figure');
    const img = document.createElement('img');
    img.src = src;
    img.alt = src;
    img.loading = 'lazy';
    img.decoding = 'async';
    fig.appendChild(img);
    gallery.appendChild(fig);
    loaded.push(src);
    img.addEventListener('click', () => openLightbox(i));
  }

  function openLightbox(i) {
    current = i;
    lbImg.src = loaded[current];
    lightbox.classList.add('show');
  }

  function closeLightbox() {
    lightbox.classList.remove('show');
    lbImg.src = '';
  }

  function prev() {
    current = (current - 1 + loaded.length) % loaded.length;
    lbImg.src = loaded[current];
  }

  function next() {
    current = (current + 1) % loaded.length;
    lbImg.src = loaded[current];
  }

  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const btnPrev = document.querySelector('.lb-prev');
  const btnNext = document.querySelector('.lb-next');
  const btnClose = document.querySelector('.lb-close');
  let current = 0;

  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);
  btnClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
}

function tryLoad(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src + '?v=' + Date.now();
  });
}

loadGallery();
