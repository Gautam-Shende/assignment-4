// DOM Elements
const actionButtons = document.querySelectorAll(".btn");
const cartTableBody = document.getElementById("cart-body");
const totalPriceElement = document.getElementById("total-amount");
const bookingMessage = document.getElementById("booking-msg");
const bookingButton = document.getElementById("book-btn");
const emptyCartMessage = document.querySelector(".no-item-message");

const nameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

let selectedServices = [];

// Update Cart UI , main function
const updateCartUI = () => {
  cartTableBody.innerHTML = "";
  let totalAmount = 0;

  selectedServices.forEach((service, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${service.name}</td>
      <td>₹${service.price}</td>
    `;

    cartTableBody.appendChild(row);
    totalAmount += service.price;
  });

  totalPriceElement.innerText = `₹${totalAmount}`;
  handleEmptyCartState();
};

// Handle empty cart state
const handleEmptyCartState = () => {
  const isEmpty = selectedServices.length === 0;

  emptyCartMessage.style.display = isEmpty ? "flex" : "none";

  nameInput.disabled = isEmpty;
  emailInput.disabled = isEmpty;
  phoneInput.disabled = isEmpty;
  bookingButton.disabled = isEmpty;

  const opacityValue = isEmpty ? "0.3" : "1";

  nameInput.style.opacity = opacityValue;
  emailInput.style.opacity = opacityValue;
  phoneInput.style.opacity = opacityValue;
  bookingButton.style.opacity = opacityValue;
  bookingButton.style.cursor = isEmpty ? "not-allowed" : "pointer";
};

// Initialize page state
document.addEventListener("DOMContentLoaded", handleEmptyCartState);

// Add / Remove Service
actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const serviceCard = button.parentElement;

    const serviceName =
      serviceCard.querySelector(".service-name").textContent;

    const priceText =
      serviceCard.querySelector(".price").textContent;

    const servicePrice = Number(
      priceText.replace("₹", "").trim()
    );

    const alreadySelected = selectedServices.find(
      (service) => service.name === serviceName
    );

    if (!alreadySelected) {
      selectedServices.push({
        name: serviceName,
        price: servicePrice,
      });

      button.innerHTML =
        `Remove Item <span style="font-size:16px" class="material-icons-outlined">remove_circle_outline</span>`;
      button.style.backgroundColor = "#fff1f1";
      button.style.color = "red";
    } else {
      selectedServices = selectedServices.filter(
        (service) => service.name !== serviceName
      );

      button.innerHTML =
        `Add Item <span style="font-size:16px" class="material-icons-outlined">add_circle_outline</span>`;
      button.style.backgroundColor = "#f1f1f1";
      button.style.color = "#000";
    }

    updateCartUI();
  });
});

// Booking with EmailJS
bookingButton.addEventListener("click", () => {
  const fullName = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  const errorIcon = `
    <span style="font-size:16px; color:red; margin-right:6px;" 
    class="material-icons-outlined">info</span>
  `;

  if (!fullName || !email || !phone || selectedServices.length === 0) {
    bookingMessage.innerHTML = errorIcon + "All details are required";
    bookingMessage.style.display = "flex";
    bookingMessage.style.backgroundColor = "#FFE5E5";
    bookingMessage.style.color = "red";

    setTimeout(() => {
      bookingMessage.style.display = "none";
    }, 2000);

    return;
  }

  const serviceList = selectedServices
    .map((service, index) =>
      `${index + 1}. ${service.name} - ₹${service.price}`
    )
    .join("\n");

  const finalAmount = selectedServices.reduce(
    (sum, service) => sum + service.price,
    0
  );

  emailjs
    .send("service_dcbuome", "template_x20zj4l", {
      name: fullName,
      email: email,
      phone: phone,
      services: serviceList,
      total_amount: `₹${finalAmount}`,
    })
    .then(() => {
      const successIcon = `
        <span style="font-size:16px; color:green; margin-right:6px;" 
        class="material-icons-outlined">info</span>
      `;

      bookingMessage.innerHTML =
        successIcon + "Email has been sent successfully";
      bookingMessage.style.display = "flex";
      bookingMessage.style.backgroundColor = "#e9f9ef";
      bookingMessage.style.color = "green";

      setTimeout(() => {
        bookingMessage.style.display = "none";
      }, 5000);
    })
    .catch(() => {
      bookingMessage.innerHTML =
        errorIcon + "Failed to send confirmation email.";
      bookingMessage.style.display = "flex";
      bookingMessage.style.backgroundColor = "#FFE5E5";
      bookingMessage.style.color = "red";

      setTimeout(() => {
        bookingMessage.style.display = "none";
      }, 4000);
    });

  selectedServices = [];
  updateCartUI();

  nameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";

  actionButtons.forEach((button) => {
    button.innerHTML =
      `Add Item <span style="font-size:16px" class="material-icons-outlined">add_circle_outline</span>`;
    button.style.backgroundColor = "#f1f1f1";
    button.style.color = "#000";
  });
});