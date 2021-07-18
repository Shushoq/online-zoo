const mainIframe = document.querySelector(".cams__iframe"),
  parentItems = document.querySelector(".cams__grid"),
  camsItems = document.querySelectorAll(".cams__item"),
  smallIframe = document.querySelector(".cams__iframe-small"),
  playButton = document.querySelectorAll(".cams__play")[0];

try {
  parentItems.addEventListener("click", (event) => {
    const target = event.target;
    const currentItem = target.parentNode;
    let iframe = target.nextElementSibling;
    let temp = mainIframe.src;
    mainIframe.src = iframe.src;
    iframe.src = temp;
    camsItems.forEach((elem) => {
      elem.classList.remove("cams__item_active");
    });
    currentItem.classList.add("cams__item_active");
  });

  playButton.addEventListener("click", () => {
    playButton.parentNode.remove();
  });
} catch (e) {}
