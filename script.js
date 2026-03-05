// Accessing the Value's and elements from HTML with the help of DOM
const AddRemoveServiceButton = document.querySelectorAll(".btn");
const CartTableBody = document.getElementById("cart-body");
const TotalServicePrice = document.getElementById("total-amount");
const ServiceBookingMessage = document.getElementById("booking-msg");
const ServiceBookingButton = document.getElementById("book-btn");
const ServiceEmptyMessage = document.querySelector(".no-item-message");

const InputName = document.getElementById("full-name");
const InputEmail = document.getElementById("email");
const InputPhone = document.getElementById("phone");

// let the emty cart first
let ServiceCartItems = [];

// Check the Cart is empty or not
function checkEmptyCart() {
  if (ServiceCartItems.length === 0) {
    InputName.disabled = true;
    InputEmail.disabled = true;
    InputPhone.disabled = true;
    ServiceBookingButton.disabled = true;
    ServiceEmptyMessage.style.display = "block";
  } else {
    ServiceEmptyMessage.style.display = "none";
    ServiceBookingButton.disabled = false;
    InputName.disabled = false;
    InputEmail.disabled = false;
    InputPhone.disabled = false;
    ServiceBookingButton.style.cursor = "pointer";
  }
}

// Update The Cart
function AddservicesToCart() {
  CartTableBody.innerHTML = "";
  let total = 0;

  ServiceCartItems.forEach((item, index) => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>₹${item.price}</td>
    `;
    CartTableBody.appendChild(row);
    total = total + item.price;
  });

  TotalServicePrice.textContent = `₹${total}`;
  checkEmptyCart();
}

// Add Service & Remove Service Buttons
AddRemoveServiceButton.forEach((button) => {
  button.addEventListener("click", () => {
    let serviceRow = button.closest(".service-row");
    let serviceName = serviceRow.querySelector(".service-name").textContent;
    let priceText = serviceRow.querySelector(".price").textContent;
    let price = Number(priceText.replace("₹", "").replace(".00", "").trim());

    let exists = ServiceCartItems.find((item) => item.name === serviceName);

    if (!exists) {
      ServiceCartItems.push({ name: serviceName, price: price });
      button.innerHTML = `Remove Item <i style="color:red;" class="fa-solid fa-circle-minus"></i>`;
      button.style.backgroundColor = "#FFEBEE";
      button.style.color = "red";
    } else {
      ServiceCartItems = ServiceCartItems.filter((item) => item.name !== serviceName);
      button.innerHTML = `Add Item <i style="color:black;" class="fa-solid fa-circle-plus"></i>`;
      button.style.backgroundColor = "#f3f4f6";
      button.style.color = "black";
    }

    AddservicesToCart();
  });
});

// Booking Form and Email.js confirmation message Sending
ServiceBookingButton.addEventListener("click", function () {
  let name = InputName.value.trim();
  let email = InputEmail.value.trim();
  let phone = InputPhone.value.trim();

  if (!name || !email || !phone || ServiceCartItems.length === 0) {
    ServiceBookingMessage.style.display = "block";
    ServiceBookingMessage.innerHTML = `<i class="fa-solid fa-circle-info"></i> Please fill all fields first!`;
    ServiceBookingMessage.style.color = "red";
    return;
  }

  let servicesList = ServiceCartItems
    .map((item, index) => {
      return `${index + 1}. ${item.name} - ₹${item.price}`;
    })
    .join("\n");

  let totalAmount = ServiceCartItems.reduce((sum, item) => sum + item.price, 0);

  let params = {
    name: name,
    email: email,
    phone: phone,
    services: servicesList,
    total_amount: `₹${totalAmount}`,
  };

  emailjs
    .send("service_dcbuome", "template_x20zj4l", params)
    .then(() => {
      ServiceBookingMessage.style.display = "block";
      ServiceBookingMessage.innerHTML = `<i class="fa-solid fa-circle-info"></i> Booking successful! Email sent.`;
      ServiceBookingMessage.style.color = "green";

      ServiceCartItems = [];
      AddservicesToCart();

      InputName.value = "";
      InputEmail.value = "";
      InputPhone.value = "";
    })
    .catch((error) => {
      console.log(error);
      ServiceBookingMessage.style.display = "block";
      ServiceBookingMessage.innerHTML = `<i class="fa-solid fa-circle-info"></i> Booking failed!`;
      ServiceBookingMessage.style.color = "red";
    });
  AddRemoveServiceButton.forEach((button) => {
    button.innerHTML = `Add Item <i style="color:black;" class="fa-solid fa-circle-plus"></i>`;
    button.style.backgroundColor = "#f3f4f6";
    button.style.color = "black";
  });
});

//  Load the broswer web page first
document.addEventListener("DOMContentLoaded", checkEmptyCart);
