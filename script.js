// =======================
// MENÚ HAMBURGUESA
// =======================
const hamburger = document.getElementById("hamburger-btn");
const nav = document.querySelector(".nav");

if (hamburger && nav) {
  hamburger.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  // Cerrar menú al dar click en un link
  const links = document.querySelectorAll(".nav a");
  links.forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
    });
  });
}

// =======================
// CARRITO
// =======================
let cart = [];
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
    
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Eliminar";
    removeBtn.classList.add("btn", "remove-from-cart");
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      renderCart();
    });

    li.appendChild(removeBtn);
    cartItems.appendChild(li);

    total += item.price;
  });

  cartTotal.textContent = total.toFixed(2);
}

// =======================
// SONIDO CLICK
// =======================
// 🔊 El archivo debe estar en: /sonido/click.mp3
const clickSound = new Audio("sonido/click.mp3");

// =======================
// EFECTO FLY TO CART
// =======================
function flyToCart(imgElement) {
  const cartIcon = document.querySelector(".cart"); 
  if (!cartIcon) return;

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

  const cartRect = cartIcon.getBoundingClientRect();

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
// BOTONES "AGREGAR AL CARRITO"
// =======================
document.querySelectorAll(".btn.add-to-cart").forEach(button => {
  button.addEventListener("click", function() {
    // Sonido
    clickSound.currentTime = 0; // reinicia en clics rápidos
    clickSound.play();

    // Imagen para animación
    const product = this.closest(".product");
    const img = product.querySelector("img");
    if (img) {
      flyToCart(img);
    }

    // Lógica de carrito
    const name = this.getAttribute("data-name");
    const price = parseFloat(this.getAttribute("data-price"));
    cart.push({ name, price });
    renderCart();
  });
});
