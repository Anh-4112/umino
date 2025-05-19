document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".slider-banner");
  
  let isDragging = false, startX = 0, startScrollLeft = 0;
  let moved = false; // Kiểm tra có di chuyển chuột hay không

  // Ngăn kéo link
  document.querySelectorAll(".slider-banner a").forEach(a => {
      a.addEventListener("click", (e) => {
          if (moved) e.preventDefault(); // Nếu kéo thì chặn click
      });
      a.addEventListener("dragstart", (e) => e.preventDefault()); // Ngăn kéo link
  });

  const getPageX = (e) => {
    return e.type.includes("touch") ? e.touches[0].pageX : e.pageX;
  };

  // Khi bắt đầu kéo
  const dragStart = (e) => {
      isDragging = true;
      moved = false;
      startX = getPageX(e);
      startScrollLeft = slider.scrollLeft;
      slider.classList.add("dragging");
  };

  // Khi kéo chuột
  const dragging = (e) => {
      if (!isDragging) return;
      moved = true;
      const currentX = getPageX(e);
      slider.scrollLeft = startScrollLeft - (currentX - startX);
  };

  // Khi thả chuột
  const dragStop = () => {
      isDragging = false;
      slider.classList.remove("dragging");
  };

  // Gán sự kiện cho slider
  slider.addEventListener("mousedown", dragStart);
  slider.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", dragStop);
  slider.addEventListener("mouseleave", dragStop);

  // Gán sự kiện cảm ứng
  slider.addEventListener("touchstart", dragStart);
  slider.addEventListener("touchmove", dragging);
  slider.addEventListener("touchend", dragStop);
});