document.getElementById("year").textContent = new Date().getFullYear();

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const closeBtn = document.querySelector(".lightbox .close");

document.querySelectorAll(".gallery a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    lightboxImg.src = link.getAttribute("href");
    lightbox.classList.add("show");
  });
});

closeBtn.addEventListener("click", () => {
  lightbox.classList.remove("show");
});

lightbox.addEventListener("click", e => {
  if (e.target === lightbox) lightbox.classList.remove("show");
});