// ================= SLIDESHOW =================
let slideIndex = 0;
showSlides();

function showSlides() {
    let slides = document.getElementsByClassName("mySlides");

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slideIndex++;
    if (slideIndex > slides.length) slideIndex = 1;

    slides[slideIndex - 1].style.display = "block";

    setTimeout(showSlides, 4000); // 4 sekunde
}

// ================= MOBILE MENU =================
document.getElementById("menuBtn").addEventListener("click", function () {
    let nav = document.getElementById("navDemo");
    nav.classList.toggle("w3-show");
});

// ================= LOAD TOURS FROM JSON =================
fetch("assets/JSON/tours.json")
  .then(res => {
      if (!res.ok) throw new Error("Tours JSON not loaded");
      return res.json();
  })
  .then(data => generateTours(data))
  .catch(err => console.error(err));

function generateTours(data) {
    const container = document.getElementById("tourContainer");
    container.innerHTML = "";

    data.forEach(tour => {
        const div = document.createElement("div");
        div.className = "w3-third w3-margin-bottom";

        div.innerHTML = `
          <img src="assets/img/${tour.img}" style="width:100%">
          <div class="w3-container w3-white">
            <p><b>${tour.title}</b></p>
            <p>Price: $${tour.price}</p>
          </div>
        `;
        container.appendChild(div);
    });
}

// ================= LOAD COMMENTS FROM JSON =================
fetch("assets/JSON/comments.json")
  .then(res => {
      if (!res.ok) throw new Error("Comments JSON not loaded");
      return res.json();
  })
  .then(data => generateComments(data))
  .catch(err => console.error(err));

function generateComments(data) {
    const container = document.getElementById("commentsContainer");
    container.innerHTML = "";

    data.forEach(c => {
        const div = document.createElement("div");
        div.className = "w3-third w3-margin-bottom";

        div.innerHTML = `
          <div class="w3-card w3-padding">
            <p><b>${c.name}</b></p>
            <p class="w3-opacity">${c.date}</p>
            <p>${c.text}</p>
          </div>
        `;
        container.appendChild(div);
    });
}

// ================= FORM VALIDATION =================
const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

// REGEX
const nameRegex = /^[A-Za-zČĆŽŠĐčćžšđ\s]{3,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateInput(input, regex) {
    if (input.value.trim() === "") {
        input.style.border = "2px solid red";
        return false;
    }
    if (regex && !regex.test(input.value)) {
        input.style.border = "2px solid red";
        return false;
    }
    input.style.border = "2px solid green";
    return true;
}

// LIVE VALIDATION
nameInput.addEventListener("keyup", () => validateInput(nameInput, nameRegex));
emailInput.addEventListener("keyup", () => validateInput(emailInput, emailRegex));
messageInput.addEventListener("keyup", () => validateInput(messageInput));

form.addEventListener("submit", function(e) {
    e.preventDefault();

    let validName = validateInput(nameInput, nameRegex);
    let validEmail = validateInput(emailInput, emailRegex);
    let validMessage = validateInput(messageInput);

    const errorBox = document.getElementById("formErrors") || (() => {
        const div = document.createElement("div");
        div.id = "formErrors";
        div.style.color = "red";
        div.style.marginTop = "10px";
        form.appendChild(div);
        return div;
    })();

    if (!validName || !validEmail || !validMessage) {
        errorBox.innerHTML = "Please fix the highlighted fields!";
        return;
    }

    errorBox.innerHTML = "";

    const successBox = document.getElementById("formSuccess") || (() => {
        const div = document.createElement("div");
        div.id = "formSuccess";
        div.style.color = "green";
        div.style.marginTop = "10px";
        form.appendChild(div);
        return div;
    })();

    successBox.innerHTML = "Message successfully sent!";
    form.reset();
});

// ================= MODAL / PAY BUTTON =================
const modal = document.getElementById("ticketModal");
const buyButtons = document.getElementsByClassName("buyTicket");
const payBtn = document.getElementById("payBtn");
const ticketCount = document.getElementById("ticketCount");
const ticketEmail = document.getElementById("ticketEmail");
let payMessage = document.getElementById("payMessage");

if (!payMessage) {
    payMessage = document.createElement("div");
    payMessage.id = "payMessage";
    payMessage.style.marginTop = "10px";
    payMessage.style.fontWeight = "bold";
    payBtn.parentNode.insertBefore(payMessage, payBtn.nextSibling);
}

Array.from(buyButtons).forEach(btn => {
    btn.addEventListener("click", () => {
        modal.style.display = "block";
        ticketCount.value = "";
        ticketEmail.value = "";
        payMessage.textContent = "";
    });
});

payBtn.addEventListener("click", () => {
    const count = ticketCount.value.trim();
    const email = ticketEmail.value.trim();

    if(count !== "" && !isNaN(count) && Number(count) > 0 && emailRegex.test(email)) {
        payMessage.style.color = "green";
        payMessage.textContent = "You have successfully ordered ✅";
    } else {
        payMessage.style.color = "red";
        payMessage.textContent = "Please enter valid information ❌";
    }
});

document.querySelectorAll("#ticketModal .w3-button").forEach(btn => {
    if(btn.textContent.includes("×") || btn.textContent.includes("Close")) {
        btn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }
});

window.addEventListener("click", (e) => {
    if(e.target === modal){
        modal.style.display = "none";
    }
});