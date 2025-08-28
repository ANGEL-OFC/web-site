// =========================
// ✅ Menú Hamburguesa
// =========================
const hamburger = document.getElementById("hamburger-btn");
const nav = document.querySelector(".nav");

if (hamburger && nav) {
  hamburger.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  // Cierra menú al hacer clic en un link
  const links = document.querySelectorAll(".nav a");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
    });
  });
}

// =========================
// ✅ Carrito de Compras
// =========================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItemsEl = document.getElementById("cart-items");
const cartSubtotalEl = document.getElementById("cart-subtotal");
const cartTotalEl = document.getElementById("cart-total");
const cartCountEl = document.getElementById("cart-count");

// Función para formatear moneda
function currency(num) {
  return "S/ " + num.toFixed(2);
}

// Renderizar carrito
function renderCart() {
  if (!cartItemsEl) return;

  cartItemsEl.innerHTML = "";

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.qty} - ${currency(item.price * item.qty)}`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart();
    });

    li.appendChild(removeBtn);
    cartItemsEl.appendChild(li);
  });

  updateCartTotals();
}

// Actualizar totales
function updateCartTotals() {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  if (cartSubtotalEl) cartSubtotalEl.textContent = currency(subtotal);
  if (cartTotalEl) cartTotalEl.textContent = currency(subtotal);
  if (cartCountEl) cartCountEl.textContent = totalItems;
}

// Guardar carrito en localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Agregar producto
function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
}

// =========================
// ✅ Inicializar
// =========================
document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  // Botones agregar al carrito
  const addButtons = document.querySelectorAll(".add-to-cart");
  addButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
      };
      addToCart(product);
    });
  });
});
