const burger = document.querySelector(".burger");
const menu = document.querySelector(".nav");

burger.addEventListener("click", () => {
  burger.classList.toggle("burger_active");
  menu.classList.toggle("nav_active");
});
