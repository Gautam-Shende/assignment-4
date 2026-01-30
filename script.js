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
  btn.addEventListener("click", () => {
    const serviceRow = btn.parentElement;
    const name = serviceRow.querySelector(".service-name").textContent;
    const pricetext = serviceRow.querySelector(".price").textContent;
    const price = Number(pricetext.replace("₹", "").trim());
    const inCart = cart.find((item) => item.name === name);
    if (!inCart) {
      const removeItemIcon = `Remove Item <span style="font-size:16px" class="material-icons-outlined">remove_circle_outline</span>`;
      cart.push({ name, price });
      btn.innerHTML = removeItemIcon;
      btn.style.backgroundColor = " #fff1f1";
      btn.style.color = "red";
    } else {
      const addItemIcon = `<span style="font-size:16px" class="material-icons-outlined">add_circle_outline</span>`;
      cart = cart.filter((item) => item.name !== name);
      btn.innerHTML = "Add Item" + addItemIcon;
      btn.style.backgroundColor = "#f1f1f1";
      btn.style.color = "#000";
    }
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
    emailjs.send("service_dcbuome", "template_x20zj4l", {
        name: fullName,
        email: email,
        phone: phone,
      })
      .then(() => {
        bookMsg.innerText =
          "Thank you For Booking the Service We will get back to you soon!";
        bookMsg.style.display = "flex";
        bookMsg.style.backgroundColor = "#e9f9ef";
        bookMsg.style.color = "green";
        setTimeout(() => {
          bookMsg.style.display = "none";
        }, 5000);
      })
      .catch(() => {
        bookMsg.innerText = "Failed to send confirmation email.";
        bookMsg.style.display = "flex";
        bookMsg.style.color = "red";
        bookMsg.style.backgroundColor = "#FFE5E5";
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
    )
  );
});
