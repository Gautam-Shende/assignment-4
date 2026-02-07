// accesing the HTML elements with DOM
const toggleBtn = document.querySelectorAll(".btn");
const cartBody = document.getElementById("cart-body");
const totalamount = document.getElementById("total-amount");
const bookMsg = document.getElementById("booking-msg");
const bookBtn = document.getElementById("book-btn");
const noitemMsg = document.querySelector(".no-item-message");
const fullNameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

let cart = [];

//  creating and Adding the Item in Cart
const AddtoCart = () => {
  cartBody.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    // creating table row and table data
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>₹${item.price}</td>
        `;
    cartBody.appendChild(row);
    total = total + item.price;
  });

  totalamount.innerText = `₹${total}`;
  NoItemMsg();
};

// if cart lenght == 0 then show this message
const NoItemMsg = () => {
  if (cart.length === 0) {
    noitemMsg.style.display = "flex";
    fullNameInput.disabled = true;
    emailInput.disabled = true;
    phoneInput.disabled = true;
    bookBtn.disabled = true;
    fullNameInput.style.opacity = "0.3";
    emailInput.style.opacity = "0.3";
    phoneInput.style.opacity = "0.3";
    bookBtn.style.opacity = 0.3;
    bookBtn.style.cursor = "not-allowed";
  } else {
    noitemMsg.style.display = "none";
    fullNameInput.disabled = false;
    emailInput.disabled = false;
    phoneInput.disabled = false;
    bookBtn.disabled = false;
    fullNameInput.style.opacity = "1";
    emailInput.style.opacity = 1;
    phoneInput.style.opacity = 1;
    bookBtn.style.opacity = 1;
    bookBtn.style.cursor = "pointer";
  }
};

// page must ready when NoitemMsg() call
document.addEventListener("DOMContentLoaded", () => {
  NoItemMsg();
});

// toggle function for each buttons , Add, Remove item
toggleBtn.forEach((btn) => {
  // Add click event on every button
  btn.addEventListener("click", () => {
    // Getting the parent container of button
    // This helps to access service name and price from same row/card
    const serviceRow = btn.parentElement;
    // Getting service name text from HTML
    const name = serviceRow.querySelector(".service-name").textContent;
    // Getting price text (example: ₹200)
    const pricetext = serviceRow.querySelector(".price").textContent;
    // Removing ₹ symbol and converting price into number
    const price = Number(pricetext.replace("₹", "").trim());
    // Checking if this service already exists inside cart
    // If found → returns item, otherwise → undefined
    const inCart = cart.find((item) => item.name === name);
    // If item is NOT in cart → Add item
    if (!inCart) {
      // Button text + icon when item is added
      const removeItemIcon = `Remove Item <span style="font-size:16px" class="material-icons-outlined">remove_circle_outline</span>`;
      // Adding service object inside cart array
      cart.push({ name, price });
      // Updating button text and style so user knows item is added
      btn.innerHTML = removeItemIcon;
      btn.style.backgroundColor = "#fff1f1"; // Light red background
      btn.style.color = "red";
    } else {
      // Button text + icon when item is removed
      const addItemIcon = `Add Item <span style="font-size:16px" class="material-icons-outlined">add_circle_outline</span>`;
      // Removing service from cart using filter method
      // It keeps all items except the selected one
      cart = cart.filter((item) => item.name !== name);
      // Reset button text and style
      btn.innerHTML = addItemIcon;
      btn.style.backgroundColor = "#f1f1f1"; // Default background
      btn.style.color = "#000";
    }
    // Calling function to update cart table and total price
    AddtoCart();
  });
});


// service booking function with emailJS for varification message
bookBtn.addEventListener("click", function () {
  const fullName = document.getElementById("full-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  const IconforForm = `
  <span style="font-size:16px; color:red; margin-right:6px;" class="material-icons-outlined info-icon">info</span>
  all Details are required
`;

  // if cart is empty then shwo this messages
  if (!fullName || !email || !phone || cart.length === 0) {
    bookMsg.innerHTML = IconforForm;
    bookMsg.style.display = "flex";
    bookMsg.style.backgroundColor = "#FFE5E5";
    bookMsg.style.color = "red";
    setTimeout(() => {
      bookMsg.style.display = "none";
    }, 2000);
    return;
  } else {
    // prepare service details for email
    // caart service detaile from cart index , items name, and price
    const serviceDetails = cart
      .map((item, index) => `${index + 1}. ${item.name} - ₹${item.price}`)
      .join("\n");

    // total price for sending email response from added cart services
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    // email js model for send to user's booked services confirmation msg
    emailjs
      .send("service_dcbuome", "template_x20zj4l", {
        name: fullName,
        email: email,
        phone: phone,
        services: serviceDetails,
        total_amount: `₹${totalPrice}`,
      })
      .then(() => {
        const bookIcon = `<span style="font-size:16px; color:green; margin-right:6px;" class="material-icons-outlined info-icon">info</span>`;
        bookMsg.innerHTML = bookIcon + "Email Has been sent successfully";
        bookMsg.style.display = "flex";
        bookMsg.style.backgroundColor = "#e9f9ef";
        bookMsg.style.color = "green";
        setTimeout(() => {
          bookMsg.style.display = "none";
        }, 5000);
      })
      .catch(() => {
        const NotbookIcon = `<span style="font-size:16px; color:red; margin-right:6px;" class="material-icons-outlined info-icon">info</span>`;
        bookMsg.innerHTML = NotbookIcon + "Failed to send confirmation email.";
        bookMsg.style.display = "flex";
        bookMsg.style.color = "red";
        bookMsg.style.backgroundColor = "#FFE5E5";
        setTimeout(() => {
          bookMsg.style.display = "none";
        }, 4000);
      });
  }

  // make cart empty after booking , with call Addtocart()
  cart = [];
  AddtoCart();
  // make all input fields empty after booking
  document.getElementById("full-name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  toggleBtn.forEach(
    (btn) => (
      (btn.innerHTML = `Add item <span style="font-size:16px" class="material-icons-outlined">add_circle_outline</span>`),
      (btn.style.backgroundColor = "#f1f1f1"),
      (btn.style.color = "#000")
    ),
  );
});
