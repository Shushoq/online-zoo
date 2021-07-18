const payModalButton = document.querySelector(".pay__button"),
  footerModalButton = document.querySelector(".footer__button"),
  formDonationButton = document.querySelector(".form-donation__button"),
  modal1Button = document.querySelectorAll(".modal__button"),
  modal2Button = document.querySelectorAll(".modal1__button"),
  modalbuttons = document.querySelector(".modal__buttons"),
  modal1buttons = document.querySelector(".modal1__buttons"),
  modal1Btn = document.querySelector(".modal1__btn"),
  modal2BackBtn = document.querySelector(".modal2__back"),
  modal3BackBtn = document.querySelector(".modal3__back"),
  modals = document.querySelectorAll("[data-modal]"),
  transition = "all 350ms ease-in-out",
  mainModal = document.querySelectorAll(".modal"),
  donateModal = document.querySelectorAll(".modal1"),
  billingModal = document.querySelectorAll(".modal2"),
  paymentModal = document.querySelectorAll(".modal3"),
  thanksModal = document.querySelectorAll(".modal5"),
  billingBtn = document.querySelector(".modal2__btn"),
  paymentBtn = document.querySelector(".modal3__btn"),
  closeModal = document.querySelectorAll(".modal__close"),
  donateNumber = document.getElementById("number"),
  selectAnimal = document.getElementById("select"),
  checkboxSubscribe = document.getElementById("checkbox"),
  cardNumber = document.getElementById("card"),
  cvvNumber = document.getElementById("cvv"),
  year = document.getElementById("year"),
  month = document.getElementById("month"),
  email = document.getElementById("youremail"),
  name = document.getElementById("yourname"),
  forms = document.querySelectorAll("form"),
  state = {};

function disableScroll() {
  let paddingOffset = window.innerWidth - document.body.offsetWidth + "px";
  document.body.style.paddingRight = paddingOffset;
  document.body.classList.add("disable-scroll");
}

function enableScroll() {
  document.body.style.paddingRight = "0px";
  document.body.classList.remove("disable-scroll");
}

function show(items, activeClass) {
  modals.forEach((modal) => {
    modal.classList = modal.classList[0];
    enableScroll();
  });

  disableScroll();

  items.forEach((item) => {
    item.classList.add(activeClass);
    item.style.transition = transition;
  });
}

function hide(modals, activeClass) {
  modals.forEach((modal) => {
    modal.classList.remove(activeClass);
  });
  setTimeout(() => {
    enableScroll();
  }, Number(transition.match(/\d+/g)));
}

selectAnimal.addEventListener("change", (event) => {
  const index = event.target.options.selectedIndex;
  const txt = event.target.options[index].text;
  state.animal = txt;
});

checkboxSubscribe.addEventListener("change", () => {
  if (checkboxSubscribe.checked) {
    state.subscribe = true;
  } else {
    state.subscribe = false;
  }
});

modalbuttons.addEventListener("click", (event) => {
  event.preventDefault();
  const target = event.target;
  state.amount = target.dataset.value;
  if (target.classList.contains("modal__button")) {
    show(donateModal, "modal__open");
  }
  modal2Button.forEach((el) => {
    el.classList.remove("modal1__button_active");
  });
  if (target.dataset.value === "") {
    setTimeout(() => {
      donateNumber.focus();
      donateNumber.previousElementSibling.style.opacity = "1";
      donateNumber.previousElementSibling.style.backgroundColor = "#05786e";
    }, 200);
  } else if (target.dataset.value === state.amount) {
    modal2Button.forEach((el) => {
      if (el.dataset.value === state.amount) {
        el.classList.add("modal1__button_active");
      } else {
        el.classList.remove("modal1__button_active");
        donateNumber.previousElementSibling.style.opacity = "";
        donateNumber.previousElementSibling.style.backgroundColor = "";
        donateNumber.value = "";
      }
    });
  }
});

donateNumber.addEventListener("focus", () => {
  donateNumber.previousElementSibling.style.opacity = "1";
  donateNumber.previousElementSibling.style.backgroundColor = "#05786e";
  modal2Button.forEach((el) => {
    el.classList.remove("modal1__button_active");
  });
});

donateNumber.addEventListener("change", () => {
  state.amount = donateNumber.value;
});

donateNumber.addEventListener("input", () => {
  if (donateNumber.value.length > 4) {
    donateNumber.value = donateNumber.value.slice(0, 4);
  }
});

function changeActiveClass(event) {
  event.preventDefault();
  const target = event.target;
  if (target.classList.contains("modal1__button")) {
    modal2Button.forEach((el) => {
      el.classList.remove("modal1__button_active");
      donateNumber.previousElementSibling.style.opacity = "";
      donateNumber.previousElementSibling.style.backgroundColor = "";
      donateNumber.value = "";
      if (el === target) {
        el.classList.add("modal1__button_active");
        state.amount = el.dataset.value;
      }
    });
  }
}

function validate(input) {
  if (input.validity.valid) {
    input.classList.remove("error");
  } else {
    input.classList.add("error");
  }
}

function createMask(input) {
  let matrix = "____ ____ ____ ____",
    i = 0,
    def = matrix.replace(/\D/g, ""),
    val = input.value.replace(/\D/g, "");

  if (def.length >= val.length) {
    val = def;
  }

  input.value = matrix.replace(/./g, function (a) {
    return /[_\d]/.test(a) && i < val.length
      ? val.charAt(i++)
      : i >= val.length
      ? ""
      : a;
  });
}

function checkAllInputs() {
  if (
    cardNumber.validity.valid &&
    cvvNumber.validity.valid &&
    month.validity.valid &&
    year.validity.valid
  ) {
    paymentBtn.disabled = false;
  } else {
    paymentBtn.disabled = true;
  }
}

cardNumber.addEventListener("input", () => {
  createMask(cardNumber);
  validate(cardNumber);
  checkAllInputs();
});

cvvNumber.addEventListener("input", () => {
  if (cvvNumber.value.length > 3) {
    cvvNumber.value = cvvNumber.value.slice(0, 3);
  }
  validate(cvvNumber);
  checkAllInputs();
});

year.addEventListener("input", () => {
  validate(year);
  checkAllInputs();
});

month.addEventListener("input", () => {
  validate(month);
  checkAllInputs();
});

paymentBtn.addEventListener("click", (event) => {
  event.preventDefault();
  let element = document.createElement("div");
  element.innerHTML = `
    <h2 class="modal5__title">Thank you!</h2>
    <p class="modal5__text">
      Dear <b>${
        state.name ? state.name : "Anonymous"
      }</b>, thank you for your donation.</p>
    <div class="modal5__footer">
      <div class="modal5__amount">$${state.amount ? state.amount : 0}</div>
      <div class="modal5__data">${new Date()
        .toJSON()
        .slice(0, 10)
        .replace(/-/g, ".")}</div>
    </div>
  `;
  document.querySelector(".modal5__bottom").appendChild(element);
  show(thanksModal, "modal__open");
  forms.forEach((form) => {
    form.reset();
  });
});

modal2BackBtn.addEventListener("click", (event) => {
  event.preventDefault();
  show(donateModal, "modal__open");
});

modal3BackBtn.addEventListener("click", (event) => {
  event.preventDefault();
  show(billingModal, "modal__open");
});

billingBtn.addEventListener("click", (event) => {
  event.preventDefault();
  state.name = name.value;
  state.email = email.value;
  show(paymentModal, "modal__open");
  checkAllInputs();
});

modal1buttons.addEventListener("click", (event) => {
  changeActiveClass(event);
});

closeModal.forEach((item) => {
  item.addEventListener("click", () => {
    hide(modals, "modal__open");
  });
});

modals.forEach((el) => {
  el.addEventListener("click", (event) => {
    if (event.target === el) {
      hide(modals, "modal__open");
    }
  });
  enableScroll();
});

footerModalButton.addEventListener("click", () => {
  show(mainModal, "modal__open");
});

try {
  payModalButton.addEventListener("click", () => {
    show(mainModal, "modal__open");
  });
} catch (e) {}

try{
  formDonationButton.addEventListener("click", (event) => {
    event.preventDefault();
    show(donateModal, "modal__open");
    const input = document.querySelector(".form-donation__input");
    const value = input.value;
    input.value = "";
    if (value) {
      setTimeout(() => {
        donateNumber.previousElementSibling.style.opacity = "1";
        donateNumber.previousElementSibling.style.backgroundColor = "#05786e";
        donateNumber.value = value;
        state.amount = value;
        modal2Button.forEach((el) => {
          el.classList.remove("modal1__button_active");
        });
      }, 200);
    } else {
      modal2Button.forEach((el) => {
        el.classList.remove("modal1__button_active");
      });
      modal2Button[0].classList.add("modal1__button_active");
      state.amount = modal2Button[0].value;
      donateNumber.previousElementSibling.style.opacity = "";
      donateNumber.previousElementSibling.style.backgroundColor = "";
      donateNumber.value = "";
    }
  });
} catch(e){}

modal1Btn.addEventListener("click", (e) => {
  e.preventDefault();
  show(billingModal, "modal__open");
});
