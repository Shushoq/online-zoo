const changeModalState = (state) => {
  const firstBtn = document.querySelectorAll(".modal__button");
  firstBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.amount = btn.dataset.value;
      console.log(state)
    });
  });
};

export default changeModalState;
