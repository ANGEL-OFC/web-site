// =======================
// SONIDO CLICK
// =======================
const clickSound = new Audio("click.mp3"); // coloca click.mp3 en la misma carpeta

// =======================
// EFECTO FLY TO CART
// =======================
function flyToCart(imgElement) {
  const cartSection = document.querySelector("#carrito h2"); // usamos el título del carrito
  if (!cartSection) return;

  const imgClone = imgElement.cloneNode(true);
  const rect = imgElement.getBoundingClientRect();

  imgClone.style.position = "fixed";
  imgClone.style.top = rect.top + "px";
  imgClone.style.left = rect.left + "px";
  imgClone.style.width = rect.width + "px";
  imgClone.style.height = rect.height + "px";
  imgClone.style.transition = "all 0.6s ease-in-out";
  imgClone.style.zIndex = 2000;

  document.body.appendChild(imgClone);

  const cartRect = cartSection.getBoundingClientRect();

  setTimeout(() => {
    imgClone.style.top = cartRect.top + "px";
    imgClone.style.left = cartRect.left + "px";
    imgClone.style.width = "30px";
    imgClone.style.height = "30px";
    imgClone.style.opacity = "0.5";
  }, 10);

  setTimeout(() => {
    imgClone.remove();
  }, 700);
}

// =======================
// CARRITO (usa tu lógica existente)
// =======================
let cart = [];

function addToCart(product, qty) {
  const item = cart.find(p => p.id === product.id);
  if (item) item.qty += qty;
  else cart.push({ ...product, qty });
}

function renderCart() {
  const itemsDiv = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("cart-subtotal");
  const countEl = document.getElementById("cart-count");

  itemsDiv.innerHTML = "";
  let subtotal = 0, count = 0;

  cart.forEach(p => {
    subtotal += p.price * p.qty;
    count += p.qty;
    itemsDiv.innerHTML += `<p>${p.title} x${p.qty} - S/ ${(p.price * p.qty).toFixed(2)}</p>`;
  });

  subtotalEl.textContent = "S/ " + subtotal.toFixed(2);
  countEl.textContent = count;
}

// =======================
// BOTONES "AGREGAR AL CARRITO"
// =======================
document.querySelectorAll(".product-card [data-action='add']").forEach(button => {
  button.addEventListener("click", function () {
    // sonido
    clickSound.currentTime = 0;
    clickSound.play();

    // animación
    const card = this.closest(".product-card");
    const img = card.querySelector("img");
    if (img) flyToCart(img);

    // lógica carrito
    const id = card.dataset.id;
    const title = card.dataset.title;
    const price = Number(card.dataset.price);
    const image = card.dataset.image;

    addToCart({ id, title, price, image }, 1);
    renderCart();
  });
});

// =======================
// BOTÓN VACIAR CARRITO
// =======================
document.getElementById("empty-cart").addEventListener("click", () => {
  cart = [];
  renderCart();
});
