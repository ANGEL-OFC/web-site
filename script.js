// Seleccionamos elementos
const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");

// Evento para abrir/cerrar el menú
hamburger.addEventListener("click", () => {
    nav.classList.toggle("active");
});

/* ===============================
   E-COMMERCE CORE (Cart + Modal + Checkout)
   =============================== */

// ------- Helpers -------
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const currency = (n) => `S/ ${Number(n).toFixed(2)}`;
const toNumber = (v) => Number(String(v).replace(/[^\d.]/g, "")) || 0;

// ------- Modal Producto -------
const modal = $("#product-modal");
const pmImg = $("#pm-image");
const pmTitle = $("#pm-title");
const pmDesc = $("#pm-desc");
const pmPrice = $("#pm-price");
const pmQty = $("#pm-qty");
const pmAdd = $("#pm-add");

let modalProduct = null;

function openModal(product) {
  modalProduct = product;
  pmImg.src = product.image;
  pmTitle.textContent = product.title;
  pmDesc.textContent = product.desc || "";
  pmPrice.textContent = currency(product.price);
  pmQty.value = 1;
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  modal.classList.remove("show");
  document.body.style.overflow = "";
}
$$("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
$$("#product-modal .qty__btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.qty;
    const v = Number(pmQty.value) || 1;
    pmQty.value = Math.max(1, v + (type === "plus" ? 1 : -1));
  });
});
pmQty.addEventListener("input", () => {
  if (pmQty.value === "" || Number(pmQty.value) < 1) pmQty.value = 1;
});

// ------- Carrito -------
const CART_KEY = "cart_items_v1";
let cart = loadCart();

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(item, qty = 1) {
  const i = cart.findIndex(p => p.id === item.id);
  if (i >= 0) {
    cart[i].qty += qty;
  } else {
    cart.push({ ...item, qty });
  }
  saveCart();
  renderCart();
}
function removeFromCart(id) {
  cart = cart.filter(p => p.id !== id);
  saveCart();
  renderCart();
}
function setQty(id, qty) {
  const p = cart.find(x => x.id === id);
  if (!p) return;
  p.qty = Math.max(1, qty);
  saveCart();
  renderCart();
}
function cartSubtotal() {
  return cart.reduce((acc, p) => acc + p.price * p.qty, 0);
}

// ------- UI Carrito -------
const cartEl = $("#cart");
const cartItemsEl = $("#cart-items");
const cartBackdrop = $("#cart-backdrop");
const fabCart = $("#fab-cart");
const fabCount = $("#fab-count");
const cartSubtotalEl = $("#cart-subtotal");

function openCart() {
  cartEl.classList.add("show");
  cartBackdrop.classList.add("show");
}
function closeCart() {
  cartEl.classList.remove("show");
  cartBackdrop.classList.remove("show");
}
$("[data-cart='close']")?.addEventListener("click", closeCart);
$("[data-cart='go-checkout']")?.addEventListener("click", closeCart);
cartBackdrop?.addEventListener("click", closeCart);
fabCart?.addEventListener("click", openCart);

function updateCartBadge() {
  const count = cart.reduce((acc, p) => acc + p.qty, 0);
  if (fabCount) fabCount.textContent = count;
}

function renderCart() {
  if (!cartItemsEl) return;
  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="muted">Tu carrito está vacío.</p>`;
  } else {
    cartItemsEl.innerHTML = cart.map(p => `
      <div class="cart__item">
        <img src="${p.image}" alt="${p.title}">
        <div>
          <strong>${p.title}</strong>
          <div class="muted">${currency(p.price)}</div>
          <div class="qty" style="margin-top:6px;">
            <button class="qty__btn" data-action="minus" data-id="${p.id}">−</button>
            <input type="number" min="1" value="${p.qty}" data-id="${p.id}" class="ci-qty">
            <button class="qty__btn" data-action="plus" data-id="${p.id}">+</button>
          </div>
        </div>
        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
          <button class="btn btn-ghost" data-action="remove" data-id="${p.id}">Quitar</button>
          <strong>${currency(p.price * p.qty)}</strong>
        </div>
      </div>
    `).join("");
  }
  cartSubtotalEl.textContent = currency(cartSubtotal());
}
cartItemsEl?.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;
  const item = cart.find(p => p.id === id);
  if (!item) return;
  if (action === "remove") removeFromCart(id);
  if (action === "minus") setQty(id, item.qty - 1);
  if (action === "plus") setQty(id, item.qty + 1);
});
cartItemsEl?.addEventListener("input", (e) => {
  const input = e.target.closest("input.ci-qty");
  if (!input) return;
  const id = input.dataset.id;
  setQty(id, Number(input.value) || 1);
});

$("[data-cart='empty']")?.addEventListener("click", () => {
  if (confirm("¿Vaciar carrito?")) {
    cart = [];
    saveCart();
    renderCart();
  }
});

updateCartBadge();
renderCart();

// ------- Capturar tarjetas existentes en el DOM -------
function collectProductsFromDOM() {
  const cards = $$(".product-card");
  cards.forEach(card => {
    const data = {
      id: card.dataset.id,
      title: card.dataset.title,
      price: toNumber(card.dataset.price),
      image: card.dataset.image,
      desc: card.dataset.desc || ""
    };

    // Botón Ver (abre modal)
    card.querySelector("[data-action='view']")?.addEventListener("click", () => openModal(data));
    // Botón Agregar
    card.querySelector("[data-action='add']")?.addEventListener("click", () => {
      addToCart(data, 1);
      openCart();
    });

    // También abrir modal al hacer click en la imagen/título (opcional)
    card.querySelector("img")?.addEventListener("click", () => openModal(data));
    card.querySelector("h4")?.addEventListener("click", () => openModal(data));
  });
}
collectProductsFromDOM();

// ------- Acciones del modal: Agregar al carrito -------
pmAdd?.addEventListener("click", () => {
  if (!modalProduct) return;
  addToCart(modalProduct, Number(pmQty.value) || 1);
  closeModal();
  openCart();
});

// ------- Checkout -------
const coSummary = $("#checkout-summary");
const coSubtotal = $("#co-subtotal");
const coShipping = $("#co-shipping");
const coTotal = $("#co-total");
const checkoutForm = $("#checkout-form");
const btnWhats = $("#btn-whatsapp");

// Define tu costo de envío si aplica
const SHIPPING = 0; // cambia a 10, 15, etc.

function renderCheckout() {
  if (!coSummary) return;
  if (cart.length === 0) {
    coSummary.innerHTML = `<p class="muted">No hay productos en el carrito.</p>`;
  } else {
    coSummary.innerHTML = cart.map(p => `
      <div class="row">
        <span>${p.title} × ${p.qty}</span>
        <strong>${currency(p.price * p.qty)}</strong>
      </div>
    `).join("");
  }
  const sub = cartSubtotal();
  coSubtotal.textContent = currency(sub);
  coShipping.textContent = currency(SHIPPING);
  coTotal.textContent = currency(sub + SHIPPING);
}
renderCheckout();

// Navegación hash para actualizar resumen cuando entras a #checkout
window.addEventListener("hashchange", () => {
  if (location.hash === "#checkout") renderCheckout();
});

// Envío del formulario de checkout
checkoutForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  const data = Object.fromEntries(new FormData(checkoutForm).entries());
  // Aquí podrías enviar a tu backend. Por ahora, mostramos confirmación.
  alert(`¡Gracias ${data.name}! Hemos recibido tu pedido.\nMétodo de pago: ${data.paymethod}`);
  // Limpia carrito si quieres:
  // cart = []; saveCart(); renderCart(); renderCheckout();
});

// -------- WhatsApp (envía el pedido) --------
// Reemplaza con tu número, formato internacional sin espacios ni signos, ej: "51999999999"
const WHATSAPP_NUMBER = "51999999999";

btnWhats?.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  const data = checkoutForm ? Object.fromEntries(new FormData(checkoutForm).entries()) : {};
  const lines = [
    `*Nuevo pedido*`,
    ``,
    `*Productos:*`,
    ...cart.map(p => `• ${p.title} x${p.qty} — ${currency(p.price * p.qty)}`),
    ``,
    `Subtotal: ${currency(cartSubtotal())}`,
    `Envío: ${currency(SHIPPING)}`,
    `Total: ${currency(cartSubtotal() + SHIPPING)}`,
    ``,
    `*Datos del cliente:*`,
    `Nombre: ${data.name || "-"}`,
    `Teléfono: ${data.phone || "-"}`,
    `Correo: ${data.email || "-"}`,
    `Dirección: ${data.address || "-"}`,
    `Notas: ${data.notes || "-"}`,
    ``,
    `*Método de pago:* ${data.paymethod || "-"}`
  ];
  const msg = encodeURIComponent(lines.join("\n"));
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  window.open(url, "_blank");
});

// -------- Ganchos de pago (demo) --------
const pmPaypal = $("#pm-paypal");
const pmMp = $("#pm-mp");
const paypalContainer = $("#paypal-button-container");
const mpContainer = $("#mp-button-container");

function togglePaymentHooks() {
  if (!paypalContainer || !mpContainer) return;
  const method = (new FormData(checkoutForm)).get("paymethod");
  paypalContainer.classList.toggle("hidden", method !== "paypal");
  mpContainer.classList.toggle("hidden", method !== "mercadopago");
}
checkoutForm?.addEventListener("change", togglePaymentHooks);
togglePaymentHooks();

// NOTA: Para activar pagos reales, inserta los SDKs oficiales y crea los botones aquí.
// PayPal: https://developer.paypal.com/docs/checkout/
// MercadoPago: https://www.mercadopago.com.pe/developers/es

let cart = [];

document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.getAttribute("data-name");
    const price = parseFloat(button.getAttribute("data-price"));
    cart.push({ name, price });
    renderCart();
  });
});

function renderCart() {
  const cartItemsContainer = document.querySelector("#cart-items");
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";

  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.qty;

    const li = document.createElement("li");
    li.className = "cart-item";

    li.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="cart-item-img">
      <div class="cart-item-info">
        <h4>${item.title}</h4>
        <p>S/ ${item.price.toFixed(2)} x ${item.qty}</p>
      </div>
      <button class="remove-item" data-id="${item.id}">❌</button>
    `;

    cartItemsContainer.appendChild(li);
  });

  // 🔹 Calcular cantidad total de productos
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  // 🔹 Actualizar Subtotal en soles
  const subtotalEl = document.querySelector("#cart-subtotal");
  if (subtotalEl) subtotalEl.textContent = `S/ ${subtotal.toFixed(2)}`;

  // 🔹 Actualizar número de productos
  const countEl = document.querySelector("#cart-count");
  if (countEl) countEl.textContent = totalItems;
}