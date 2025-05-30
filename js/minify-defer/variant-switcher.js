document.querySelectorAll(".slide").forEach(slideTrending => {
  const buttons = slideTrending.querySelectorAll(".btn-color");

  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const imageChange = this.dataset.imgChange;
      const imageHover = this.dataset.imgHover;
      const newPrice = this.dataset.price;

      // Đổi ảnh
      const imgChange = slideTrending.querySelector(".img-change");
      if (imgChange) {
        imgChange.src = imageChange;
      }

      // Đổi ảnh hover
      const imgHover = slideTrending.querySelector(".img-hover");
      if (imgHover) { // && imageHover
        imgHover.src = imageHover;
      }

      // Đổi giá
      const priceElement = slideTrending.querySelector(".item-price");
      if (priceElement) {
        priceElement.textContent = newPrice;
      }

      // Gán .selected cho btn đang chọn
      buttons.forEach(btn => btn.classList.remove("selected"));
      this.classList.add("selected");
    });
  });

  // Gán giá trị mặc định bằng click vào nút đầu tiên
  if (buttons.length > 0) {
    buttons[0].click();
  }
});