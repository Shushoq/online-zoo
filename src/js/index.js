import showMap from "./modules/showMap";
import "./modules/burger";
import "./modules/modal1";
import "./modules/tabs";
import "./modules/verticalSlider";

import Slider from "./modules/slider";

window.addEventListener("DOMContentLoaded", () => {
  try {
    const numberInput = document.querySelector(".form-donation__input");
    numberInput.addEventListener("input", () => {
      if (numberInput.value.length > 4) {
        numberInput.value = numberInput.value.slice(0, 4);
      }
    });
  } catch (e) {}

  try {
    const sidebarTrigger = document.querySelector(".sidebar__button");
    const sidebar = document.querySelector(".sidebar");
    sidebarTrigger.addEventListener("click", () => {
      sidebar.classList.toggle("sidebar_active");
    });
  } catch (e) {}

  try {
    const mapInner = document.querySelector(".map__inner");
    mapInner.insertAdjacentHTML("beforeend", showMap());
  } catch (e) {}

  try {
    const slider1 = new Slider(
      ".pets__grid",
      ".pets__item",
      ".pets__prev",
      ".pets__next"
    );
    slider1.init();
  } catch (e) {}

  try {
    const slider2 = new Slider(
      ".testimonial__grid",
      ".testimonial__item",
      ".testimonial__prev",
      ".testimonial__next",
      true
    );
    slider2.init();
  } catch (e) {}
});
