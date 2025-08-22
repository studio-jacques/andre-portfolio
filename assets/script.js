// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Build gallery from numbered files: images/photo1.jpg, photo2.jpg, ...
const gallery = document.getElementById('gallery');
const loaded = [];
const MAX = 500; // safety cap
let index = 1;

function tryLoadImage(n) {
  return new Promise(resolve => {
    const src = `images/photo${n}.jpg`;
    const img = new Image();
    img.onload = () => resolve({ ok: true, src });
    img.onerror = () => resolve({ ok: false, src });
    img.src = src + '?v=' + Date.now(); // bust cache on first load
  });
}

async function loadImages() {
  while (index <= MAX) {
    const res = await tryLoadImage(index);
    if (!res.ok) break;
    const fig = document.createElement('figure');
    const img = document.createElement('img');
    img.src = res.src;
    img.alt = `Photo ${index}`;
    img.decoding = 'async';
    img.loading = 'lazy';
    fig.appendChild(img);
    gallery.appendChild(fig);

    loaded.push(res.src);
    img.addEventListener('click', () => openLightbox(loaded.length - 1));
    index++;
  }
}

loadImages();

// Lightbox controls
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const btnPrev = document.querySelector('.lb-prev');
const btnNext = document.querySelector('.lb-next');
const btnClose = document.querySelector('.lb-close');
let current = 0;

function openLightbox(i) {
  if (i < 0 || i >= loaded.length) return;
  current = i;
  lbImg.src = loaded[current];
  lightbox.classList.add('show');
}

function closeLightbox() {
  lightbox.classList.remove('show');
  lbImg.src = '';
}

function prev() {
  if (!loaded.length) return;
  current = (current - 1 + loaded.length) % loaded.length;
  lbImg.src = loaded[current];
}

function next() {
  if (!loaded.length) return;
  current = (current + 1) % loaded.length;
  lbImg.src = loaded[current];
}

btnPrev.addEventListener('click', prev);
btnNext.addEventListener('click', next);
btnClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
window.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('show')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prev();
  if (e.key === 'ArrowRight') next();
});
