// DOM elements
const addButtons = document.querySelectorAll(".btn");
const cartTableBody = document.getElementById("cart-body");
const totalAmountEl = document.getElementById("total-amount");
const bookingMessage = document.getElementById("booking-msg");
const bookButton = document.getElementById("book-btn");
const noItemsMessage = document.querySelector(".no-item-message");
const nameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

let cartItems = [];

// Update cart display and total
function updateCartDisplay() {
  cartTableBody.innerHTML = "";
  let total = 0;
  
  cartItems.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>₹${item.price}</td>
    `;
    cartTableBody.appendChild(row);
    total += item.price;
  });

  totalAmountEl.textContent = `₹${total}`;
  toggleFormState();
}

// Toggle form inputs based on cart status
function toggleFormState() {
  if (cartItems.length === 0) {
    noItemsMessage.style.display = "flex";
    nameInput.disabled = true;
    emailInput.disabled = true;
    phoneInput.disabled = true;
    bookButton.disabled = true;
    [nameInput, emailInput, phoneInput, bookButton].forEach(el => {
      el.style.opacity = "0.3";
    });
    bookButton.style.cursor = "not-allowed";
  } else {
    noItemsMessage.style.display = "none";
    nameInput.disabled = false;
    emailInput.disabled = false;
    phoneInput.disabled = false;
    bookButton.disabled = false;
    [nameInput, emailInput, phoneInput, bookButton].forEach(el => {
      el.style.opacity = "1";
    });
    bookButton.style.cursor = "pointer";
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", toggleFormState);

// Add/Remove items from cart
addButtons.forEach(button => {
  button.addEventListener("click", () => {
    const serviceRow = button.closest(".service-row");
    const serviceName = serviceRow.querySelector(".service-name").textContent;
    const priceText = serviceRow.querySelector(".price").textContent;
    const price = parseInt(priceText.replace("₹", "").trim());

    const existingItem = cartItems.find(item => item.name === serviceName);

    if (!existingItem) {
      // Add item
      cartItems.push({ name: serviceName, price });
      button.innerHTML = `Remove Item <span style="font-size:16px" class="material-icons-outlined">remove_circle_outline</span>`;
      button.style.backgroundColor = "#fff1f1";
      button.style.color = "red";
    } else {
      // Remove item
      cartItems = cartItems.filter(item => item.name !== serviceName);
      button.innerHTML = `Add Item <span style="font-size:16px" class="material-icons-outlined">add_circle_outline</span>`;
      button.style.backgroundColor = "#f1f1f1";
      button.style.color = "#000";
    }

    updateCartDisplay();
  });
});

// Handle booking
bookButton.addEventListener("click", () => {
  const fullName = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  const errorIcon = `<span style="font-size:16px; color:red; margin-right:6px;" class="material-icons-outlined info-icon">info</span>`;
  const errorMsg = "All details are required";

  if (!fullName || !email || !phone || cartItems.length === 0) {
    bookingMessage.innerHTML = errorIcon + errorMsg;
    bookingMessage.style.display = "flex";
    bookingMessage.style.backgroundColor = "#FFE5E5";
    bookingMessage.style.color = "red";
    setTimeout(() => {
      bookingMessage.style.display = "none";
    }, 2000);
    return;
  }

  // Prepare service details
  const serviceList = cartItems.map((item, index) => 
    `${index + 1}. ${item.name} - ₹${item.price}`
  ).join("\n");
  
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  // Send confirmation email
  emailjs.send("service_dcbuome", "template_x20zj4l", {
    name: fullName,
    email: email,
    phone: phone,
    services: serviceList,
    total_amount: `₹${totalPrice}`
  })
  .then(() => {
    const successIcon = `<span style="font-size:16px; color:green; margin-right:6px;" class="material-icons-outlined info-icon">info</span>`;
    bookingMessage.innerHTML = successIcon + "Email sent successfully!";
    bookingMessage.style.backgroundColor = "#e9f9ef";
    bookingMessage.style.color = "green";
    bookingMessage.style.display = "flex";
    setTimeout(() => {
      bookingMessage.style.display = "none";
    }, 5000);
  })
  .catch(() => {
    const failIcon = `<span style="font-size:16px; color:red; margin-right:6px;" class="material-icons-outlined info-icon">info</span>`;
    bookingMessage.innerHTML = failIcon + "Failed to send email.";
    bookingMessage.style.backgroundColor = "#FFE5E5";
    bookingMessage.style.color = "red";
    bookingMessage.style.display = "flex";
    setTimeout(() => {
      bookingMessage.style.display = "none";
    }, 4000);
  });

  // Reset form and cart
  cartItems = [];
  updateCartDisplay();
  nameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";

  // Reset all buttons
  addButtons.forEach(btn => {
    btn.innerHTML = `Add Item <span style="font-size:16px" class="material-icons-outlined">add_circle_outline</span>`;
    btn.style.backgroundColor = "#f1f1f1";
    btn.style.color = "#000";
  });
});
