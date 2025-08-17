// Seleccionamos elementos
const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");

// Evento para abrir/cerrar el menú
hamburger.addEventListener("click", () => {
    nav.classList.toggle("active");
});