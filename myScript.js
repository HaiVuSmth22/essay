// Products list
const allProducts = [
  {
    name: "Shirt 1",
    price: "$450",
    img: "https://vn.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-short-sleeved-jacquard-silk-blend-shirt--HRS30WKSY702_PM2_Front%20view.jpg",
    page: "tops.html"
  },
  {
    name: "Shirt 2",
    price: "$750",
    img: "your-fallback-image.jpg",
    page: "tops.html"
  },
  {
    name: "Shirt 3",
    price: "$800",
    img: "images/shirts3.jpg",
    page: "tops.html"
  },
  {
    name: "Jacket 1",
    price: "$450",
    img: "images/jacket1.jpg",
    page: "outerwear.html"
  },
  {
    name: "Jacket 2",
    price: "$750",
    img: "images/shirts3.jpg",
    page: "outerwear.html"
  },
  {
    name: "Hoodie 3",
    price: "$800",
    img: "your-fallback-image.jpg",
    page: "outerwear.html"
  },
  {
    name: "Pant 1",
    price: "$450",
    img: "images/shirts3.jpg",
    page: "bottoms.html"
  },
  {
    name: "Pant 2",
    price: "$750",
    img: "images/jacket1.jpg",
    page: "bottoms.html"
  },
  {
    name: "Pant 3",
    price: "$800",
    img: "images/shirts3.jpg",
    page: "bottoms.html"
  },
];

/* cart feature */
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to cart (increments if already exists)
function addToCart(name, price) {
  price = typeof price === "string" ? parseFloat(price.replace(/[^0-9.]/g, "")) : price;

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showNotification();
}

// DOM
const cartContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

function updateCartDisplay() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cart-items");
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
// Search bar function
function search_products() {
  const input = document.getElementById("searchbar").value.trim().toLowerCase();
  const resultsContainer = document.getElementById("search-results");
  resultsContainer.innerHTML = "";

  if (!input) return;

  const matches = allProducts.filter(p => p.name.toLowerCase().includes(input));

  if (matches.length === 0) {
    resultsContainer.innerHTML = `<div class="search-result-item"><em>No results found.</em></div>`;
    return;
  }

  matches.forEach(product => {
    const item = document.createElement("div");
    item.className = "search-result-item";
    item.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <div class="search-result-text">
        <strong>${product.name}</strong>
        <span>${product.price}</span>
      </div>
    `;

    item.onclick = () => {
      window.location.href = product.page + `#${encodeURIComponent(product.name)}`;
    };

    resultsContainer.appendChild(item);
  });
}

function showNotification() {
  const overlay = document.getElementById('notification-overlay');
  overlay.classList.remove('hidden');

  // Auto-hide after 5 seconds
  setTimeout(() => {
    closeNotification();
  }, 4000);
}

function closeNotification() {
  const overlay = document.getElementById('notification-overlay');
  overlay.classList.add('hidden');
}

let isSubmitting = false;

function sendOrderEmail(event) {
  event.preventDefault(); // prevent form reload

  if (isSubmitting) {
    return; // Stop if already submitting
  }
  isSubmitting = true;

  const checkoutBtn = event.target.querySelector('input[type="submit"]');
  if (checkoutBtn) {
    checkoutBtn.disabled = true;
    checkoutBtn.value = "Đang xử lý...";
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Giỏ hàng của bạn đang trống!");
    isSubmitting = false;
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.value = "Đặt hàng";
    }
    return;
  }

  // Collect form data
  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const email = document.getElementById("customer-email").value.trim();
  const payment = document.getElementById("payment-method").value;
  const delivery = document.getElementById("delivery-method").value;

  if (!name || !phone || !email || !payment || !delivery) {
    alert("Vui lòng điền đầy đủ thông tin!");
    isSubmitting = false;
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.value = "Đặt hàng";
    }
    return;
  }

  // Generate Order ID (now a random 4-digit number)
  const orderId = `${Math.floor(1000 + Math.random() * 9000)}`;

  // Convert VND-style string to number (if needed)
  const getNumber = (text) => Number(text.replace(/[₫,]/g, '').trim()) || 0;

  // Calculate totals
  const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  // Format order list for template
  const orderList = cart.map(item => ({
    name: item.name,
    price: (parseFloat(item.price) * item.quantity).toLocaleString(),
    units: item.quantity,
    image_url: item.image || "https://via.placeholder.com/64"
  }));

  const cost = {
    total: total.toLocaleString()
  };

  // Data object to send to Google Sheets
  const formData = {
    orderId: orderId,
    name: name,
    phone: phone,
    email: email,
    payment: payment,
    delivery: delivery,
    total: total // Send the raw number
  };

  // Send data to Google Apps Script
  const fetchPromise = fetch("https://script.google.com/macros/s/AKfycbwfh0yyMp6HgyyMFHbzgU7pbnwXAJYlpEyXPbGyMSahdNeHoUTQfPHzJ0EAOu-0LZkepQ/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  // Send Email via EmailJS
  const emailJsPromise = emailjs.send("service_z3nr04b", "template_zzi658c", {
    order_id: orderId,
    name,
    phone,
    email,
    payment,
    delivery,
    orders: orderList,
    cost
  });

  Promise.all([fetchPromise, emailJsPromise])
    .then(() => {
      alert(`Đặt hàng thành công! Mã đơn hàng: ${orderId}`);
      localStorage.removeItem("cart");
      updateCartCount?.();
      updateCartDisplay?.();
      document.getElementById("checkout-form").reset();
    })
    .catch(err => {
      console.error("Error during order submission:", err);
      alert("Đặt hàng thất bại. Vui lòng thử lại.");
    })
    .finally(() => {
      isSubmitting = false;
      if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.value = "Đặt hàng";
      }
    });
}