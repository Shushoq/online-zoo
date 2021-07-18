class Modal {
  constructor(state = null, trigger, modal, activeClass, close) {
    this.trigger = document.querySelectorAll(trigger);
    this.modal = document.querySelector(modal);
    this.modalClose = document.querySelector(close) || "";
    this.activeClass = activeClass;
    this.transition = "all 350ms ease-in-out";
    this.modals = document.querySelectorAll("[data-modal]");
    this.state = state;
  }

  open() {
    this.modal.classList.add(this.activeClass);
    this.modal.style.transition = this.transition;
    this.disableScroll();
  }

  close() {
    this.modal.classList.remove(this.activeClass);
    setTimeout(() => {
      this.enableScroll();
    }, Number(this.transition.match(/\d+/g)));
  }

  addPadding() {
    let paddingOffset = window.innerWidth - document.body.offsetWidth + "px";
    document.body.style.paddingRight = paddingOffset;
  }

  removePadding() {
    document.body.style.paddingRight = "0px";
  }

  disableScroll() {
    this.addPadding();
    document.body.classList.add("disable-scroll");
  }

  enableScroll() {
    this.removePadding();
    document.body.classList.remove("disable-scroll");
  }

  render() {
    this.trigger.forEach((item) => {
      item.addEventListener("click", () => {
        this.modals.forEach((modal) => {
          modal.classList = modal.classList[0];
          this.enableScroll();
        });
        this.open();
      });
    });
    try {
      this.modalClose.addEventListener("click", this.close.bind(this));
    } catch (e) {}

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });
  }
}

export default Modal;
