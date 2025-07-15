/* cart feature */
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to cart (increments if already exists)
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${name} has been added to your cart.`);
}

// DOM
const cartContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

function updateCartDisplay() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your shopping cart is empty</p>";
    cartTotalEl.textContent = "Total: $0.00";
    return;
  }
//Change quantity in cart checkout and calculate total
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div>
        <p><strong>${item.name}</strong></p>
        <p>Price: $${item.price.toFixed(2)}</p>
        <div>
          <button onclick="changeQuantity(${index}, -1)">−</button>
          <span style="margin: 0 10px">${item.quantity}</span>
          <button onclick="changeQuantity(${index}, 1)">+</button>
        </div>
      </div>
      <div style="text-align: right;">
        <p>$${itemTotal.toFixed(2)}</p>
        <button onclick="removeItem(${index})" class="remove-btn">✖</button>
      </div>
    `;
    cartContainer.appendChild(div);
  });

  cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
  updateCartCount();
  localStorage.setItem("cart", JSON.stringify(cart));
}

function changeQuantity(index, amount) {
  cart[index].quantity += amount;
  if (cart[index].quantity < 1) {
    cart[index].quantity = 1; // Prevent going below 1
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
  updateCartCount();
}

// Update cart icon count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalQuantity;
  }
}

// JS toggle menu
function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  menu.classList.toggle("open");
}

// DOM ready
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  if (document.getElementById("cart-items")) {
    updateCartDisplay();
  }
});