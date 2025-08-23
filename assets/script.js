document.getElementById('year').textContent = new Date().getFullYear();

const toggleBtn = document.getElementById("theme-toggle");
if (toggleBtn) {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleBtn.style.background = "white";
  } else {
    toggleBtn.style.background = "black";
  }
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      toggleBtn.style.background = "white";
    } else {
      localStorage.setItem("theme", "light");
      toggleBtn.style.background = "black";
    }
  });
}

async function loadGallery() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;
  let files = null;
  try {
    const res = await fetch('images.json');
    if (res.ok) files = await res.json();
  } catch {}
  if (files) {
    files.forEach(src => {
      const img = document.createElement('img');
      img.src = 'images/' + src;
      gallery.appendChild(img);
    });
  }
}
loadGallery();
