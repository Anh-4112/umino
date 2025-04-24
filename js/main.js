document.addEventListener("DOMContentLoaded", () => {
    const slideShow = document.querySelector(".slideshow");
    const cards = Array.from(slideShow.querySelectorAll(".slide"));
    const btnPrev = document.querySelector(".btn-slideshow-prev");
    const btnNext = document.querySelector(".btn-slideshow-next");
    const dotsContainer = document.querySelector(".slideshow-dots");
  
    slideShow.addEventListener("click", (e) => {
    if (isDraggingSlide) {
      e.preventDefault();
      e.stopPropagation();
    }
    }, true);
  
    if (!slideShow || cards.length === 0) return;
  
    let currentIndex = 0;
    let autoSlideInterval = null;
  
    let isDragging = false;
    let startX = 0;
    let deltaX = 0;
  
    let isDraggingSlide = false;
  
    const showSlide = (index) => {
      cards.forEach((card, i) => {
        card.classList.toggle("active", i === index);
      });
      updateDots();
    };
  
    const createDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = "";
      cards.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.classList.add("dot");
        if (i === currentIndex) dot.classList.add("active");
        dot.addEventListener("click", () => {
          currentIndex = i;
          showSlide(currentIndex);
          restartAutoSlide();
        });
        dotsContainer.appendChild(dot);
      });
    };
  
    const updateDots = () => {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll(".dot");
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    };
  
    const startAutoSlide = () => {
      if (autoSlideInterval) return;
      autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % cards.length;
        showSlide(currentIndex);
      }, 3000);
    };
  
    const stopAutoSlide = () => {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    };
  
    const restartAutoSlide = () => {
      stopAutoSlide();
      startAutoSlide();
    };
  
    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        showSlide(currentIndex);
        restartAutoSlide();
      });
    }
  
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % cards.length;
        showSlide(currentIndex);
        restartAutoSlide();
      });
    }
  
    const dragStart = (e) => {
      isDragging = true;
      startX = e.pageX || e.touches[0].clientX; // Dùng clientX thay vì pageX cho chuột
      deltaX = 0;
      stopAutoSlide();
  
      // Ngăn hành vi mặc định nếu kéo bắt đầu từ thẻ <a>
      if (e.target.closest("a")) {
        e.preventDefault();
      }
    };
  
    const dragMove = (e) => {
      if (!isDragging) return;
      const x = e.pageX || e.touches[0].clientX;
      deltaX = x - startX;
  
      if (Math.abs(deltaX) > 5) {
        isDraggingSlide = true;
      }
    };
  
    const dragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
  
      if (deltaX > 50) {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        showSlide(currentIndex);
      } else if (deltaX < -50) {
        currentIndex = (currentIndex + 1) % cards.length;
        showSlide(currentIndex);
      }
  
      // Reset sau 300ms
      setTimeout(() => {
        isDraggingSlide = false;
      }, 300);
  
      restartAutoSlide();
    };
  
    slideShow.addEventListener("mouseenter", stopAutoSlide);
    slideShow.addEventListener("mouseleave", startAutoSlide);
  
    slideShow.addEventListener("mousedown", dragStart);
    slideShow.addEventListener("touchstart", dragStart);
  
    window.addEventListener("mousemove", dragMove);
    window.addEventListener("touchmove", dragMove);
  
    window.addEventListener("mouseup", dragEnd);
    window.addEventListener("touchend", dragEnd);
  
    createDots();
    showSlide(currentIndex);
    startAutoSlide();
  });