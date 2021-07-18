const button = document.querySelector(".sidebar__more");
const list = document.querySelectorAll(".sidebar__list-view");

try {
  button.addEventListener("click", () => {
    list.forEach((item) => {
      if (item.classList.contains("sidebar__list-view_hidden")) {
        item.classList.remove("sidebar__list-view_hidden");
        button.style.transform = "rotate(180deg)";
        button.style.transition = "all 100ms ease-in";
      } else {
        item.classList.add("sidebar__list-view_hidden");
        button.style.transform = "rotate(0deg)";
      }
    });
  });
} catch (e) {}
