export default class Slider {
  constructor(wrapper, items, nextSlide, prevSlide, loop = false) {
    this.wrapper = document.querySelector(wrapper);
    this.items = document.querySelectorAll(items);
    this.nextSlide = document.querySelector(nextSlide);
    this.prevSlide = document.querySelector(prevSlide);
    this.loop = loop;
    this.interval = 15000;
    this.rows =
      window
        .getComputedStyle(this.wrapper)
        .getPropertyValue("grid-template-rows")
        .split(" ").length || 1;
    this.gap = parseInt(getComputedStyle(this.wrapper).columnGap);
    this.itemWidth = parseInt(getComputedStyle(this.items[0]).width);
    this.step = this.gap + this.itemWidth;
    this.isMoving = false;
    this.getItems = () => document.querySelectorAll(items);
    if (this.loop) {
      this.start = setInterval(this.onNextSlide.bind(this), this.interval);
    }
    this.timeout;
    this.stop;
    this.stopTimeout;
  }

  onPrevSlide() {
    if (!this.isMoving) {
      this.isMoving = true;
      const items = this.getItems();
      this.wrapper.style.transition = "none";
      console.log(this.rows);
      for (let i = 1; i <= this.rows; i++) {
        this.wrapper.prepend(items[items.length - i]);
      }
      this.wrapper.style.transform = `translateX(-${this.step}px)`;
      setTimeout(() => {
        this.wrapper.style.transition = "transform 0.5s";
      }, 0);
      setTimeout(() => {
        this.wrapper.style.transform = `translateX(0)`;
        setTimeout(() => (this.isMoving = false), 500);
      }, 1);
    }
  }

  onNextSlide() {
    if (!this.isMoving) {
      this.isMoving = true;
      const items = this.getItems();
      this.wrapper.style.transition = "transform 0.5s";
      this.wrapper.style.transform = `translateX(-${this.step}px)`;
      setTimeout(() => {
        this.wrapper.style.transition = "none";
        this.wrapper.style.transform = `translateX(0)`;
        for (let i = 0; i < this.rows; i++) {
          this.wrapper.append(items[i]);
        }
        this.isMoving = false;
      }, 500);
    }
  }

  init() {
    this.nextSlide.addEventListener("click", () => {
      this.onNextSlide();
    });
    this.prevSlide.addEventListener("click", () => {
      this.onPrevSlide();
    });
    this.stopAutoPlay();
  }

  pauseAutoPlay() {
    this.stop = clearInterval(this.start);
    this.stopTimeout = clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.start = setInterval(this.onNextSlide.bind(this), this.interval);
    }, 45000);
  }

  stopAutoPlay() {
    if (this.loop) {
      const items = this.getItems();
      items.forEach((item) => {
        item.addEventListener("click", () => {
          this.pauseAutoPlay();
        });
      });
      this.nextSlide.addEventListener("click", () => {
        this.pauseAutoPlay();
      });
      this.prevSlide.addEventListener("click", () => {
        this.pauseAutoPlay();
      });
    }
  }
}
