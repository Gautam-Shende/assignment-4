

const AddRemoveServiceButton = document.querySelectorAll(".btn");
// const bookbtn = document.querySelector("book-btn")

const TotalServicePrice = document.getElementById("total-amount");

 const ServiceBookingMessage = document.getElementById("booking-msg");
const ServiceBookingButton = document.getElementById("book-btn");
// const ServiceBookingmsg = document.querySelectorAlL("book-msg")
const ServiceEmptyMessage = document.querySelector(".no-item-message");

function EmptyCart() {
  if (ServiceCartItems.length === 0) {
    InputName.disabled = true;
    InputEmail.disabled = true;
    // InputPhone.disabled = false
    InputPhone.disabled = true;
    ServiceBookingButton.disabled = true;
    // ServiceBookingButton.style.innerHTML = "flex"
    ServiceEmptyMessage.style.display = "block";
  } else {
    ServiceEmptyMessage.style.display = "none";
    // ServiceBookingButton.disabled =  "true"
    ServiceBookingButton.disabled = false;
    InputName.disabled = false;
    InputEmail.disabled = false;
    InputPhone.disabled = false;
    ServiceBookingButton.style.cursor = "pointer";
  }
}

// const cart = document.querySelectorAll(".cart-body")
const CartTableBody = document.getElementById("cart-body")

let ServiceCartItems = [];

function AddservicesToCart() {
  CartTableBody.innerHTML = "";
  let total = 0;

  ServiceCartItems.forEach((item, index) => {
    let row = document.createElement("tr");
    // row.innerHTML = `
    //   <td>no.1</td>
    //   <td>service name</td>
    //   <td>price</td>
    // `;
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>₹${item.price}.00</td>
    `;
    CartTableBody.appendChild(row);
    total = total + item.price;
  });
  //  TotalServicePrice.innerHTML = total
  TotalServicePrice.textContent = `₹${total}.00`;
  EmptyCart();
}

AddRemoveServiceButton.forEach((button) => {
  button.addEventListener("click", () => {
    // let serviceName = document.querySelectorAll(".service-name")
    // let price = document.querySelectorAll(".price")
    let serviceRow = button.closest(".service-row");
    let serviceName = serviceRow.querySelector(".service-name").textContent;
    let price = Number(serviceRow.querySelector(".price").textContent);

    let serviceExist = ServiceCartItems.find((item) => item.name === serviceName);

    if (!serviceExist) {
      ServiceCartItems.push({ name: serviceName, price: price });
      button.innerHTML = `Remove Item <i style="color:red;" class="fa-solid fa-circle-minus"></i>`;
      // button.style.backgroundColor = "gray"
      button.style.backgroundColor = "#FFEBEE";
      button.style.color = "red";
    } else {
      // let result = ServiceCartItems.map((item)=> item.name !== serviceName)
      // ServiceCartItems = result + ServiceCartItems;
      ServiceCartItems = ServiceCartItems.filter(
        (item) => item.name !== serviceName,
      );
      button.innerHTML = `Add Item <i style="color:black;" class="fa-solid fa-circle-plus"></i>`;
      button.style.backgroundColor = "#f3f4f6";
      button.style.color = "black";
    }

    AddservicesToCart();
  });
});

const InputName = document.getElementById("full-name");
const InputEmail = document.getElementById("email");
// const InputPhone = document.querySelector(".phone")
const InputPhone = document.getElementById("phone")

ServiceBookingButton.addEventListener("click", function () {
  // let name = InputName.target.value;
  // let email = InputEmail.target.value;
  // let phone = InputPhone.target.value;
  let name = InputName.value.trim();
  let email = InputEmail.value.trim();
  let phone = InputPhone.value.trim()

  if (!name || !email || !phone || ServiceCartItems.length === 0) {
    ServiceBookingMessage.style.display = "block";
    ServiceBookingMessage.innerHTML = `<i class="fa-solid fa-circle-info"></i> Please fill all fields first!`;
    ServiceBookingMessage.style.color = "red";
    return;
  }

  // const Services = ServiceCartItems.filter((item, index) => {
  //   return `${index}.${item.name}.${item.price}`
  // })
  let Services = ServiceCartItems.map((item, index) => {
    return `${index + 1}. ${item.name} - ₹${item.price}`;
  }).join("\n");

  let totalAmount = ServiceCartItems.reduce((sum, item) => sum + item.price, 0);

  let params = {
    name: name,
    email: email,
    phone: phone,
    services: Services,
    total_amount: `₹${totalAmount}`,
  };

  emailjs
    .send("service_dcbuome", "template_x20zj4l", params)
    .then(() => {
      // ServiceBookingMessage.style.display = "flex"
      ServiceBookingMessage.style.display = "block";
      ServiceBookingMessage.innerHTML = `<i class="fa-solid fa-circle-info"></i> Booking successful! Email sent.`;
      ServiceBookingMessage.style.color = "green";

      ServiceCartItems = []

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

document.addEventListener("DOMContentLoaded", checkEmptyCart);
