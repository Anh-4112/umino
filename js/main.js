document.addEventListener("DOMContentLoaded", () => {
  const wrapperSlideshow = document.querySelector(".wrapper-slideshow");
  const slideshowInner = wrapperSlideshow.querySelector(".slideshow");
  const slides = Array.from(wrapperSlideshow.querySelectorAll(".slide"));
  const btnPrev = document.querySelector(".btn-slideshow-prev");
  const btnNext = document.querySelector(".btn-slideshow-next");
  const dotsContainer = document.querySelector(".slideshow-dots");

  let currentIndex = 0;
  let autoSlideInterval = null;

  let isDragging = false;
  let startX = 0;
  let deltaX = 0;
  let dragged = false;
  const dragThreshold = 50;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.remove("active", "to-left", "to-right");

      if (i === index) {
        slide.classList.add("active");
      } else if (i < index) {
        slide.classList.add("to-left");
      } else {
        slide.classList.add("to-right");
      }
    });

    updateDots();
  };

  const createDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
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
    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  };

  const startAutoSlide = () => {
    if (autoSlideInterval) return;
    autoSlideInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
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

  btnPrev?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
    restartAutoSlide();
  });

  btnNext?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
    restartAutoSlide();
  });

  wrapperSlideshow.addEventListener("mouseenter", stopAutoSlide);
  wrapperSlideshow.addEventListener("mouseleave", startAutoSlide);

  const getX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

  wrapperSlideshow.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDragging = true;
    startX = getX(e);
    stopAutoSlide();
  });

  wrapperSlideshow.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    deltaX = getX(e) - startX;
    if (Math.abs(deltaX) > 5) {
      dragged = true;
    }
  });

  wrapperSlideshow.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;

    if (Math.abs(deltaX) > dragThreshold) {
      currentIndex = deltaX > 0
        ? (currentIndex - 1 + slides.length) % slides.length
        : (currentIndex + 1) % slides.length;
    }

    showSlide(currentIndex);
    restartAutoSlide();
    deltaX = 0;
  });

  wrapperSlideshow.addEventListener("mouseleave", () => {
    if (isDragging) {
      isDragging = false;
      deltaX = 0;
    }
  });

  wrapperSlideshow.addEventListener("touchstart", (e) => {
    e.preventDefault();
    isDragging = true;
    startX = getX(e);
    stopAutoSlide();
  });

  wrapperSlideshow.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    deltaX = getX(e) - startX;
    if (Math.abs(deltaX) > 5) {
      dragged = true;
    }
  });

  wrapperSlideshow.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;

    if (Math.abs(deltaX) > dragThreshold) {
      currentIndex = deltaX > 0
        ? (currentIndex - 1 + slides.length) % slides.length
        : (currentIndex + 1) % slides.length;
    }

    showSlide(currentIndex);
    restartAutoSlide();
    deltaX = 0;
  });

  // ✅ Chặn click khi kéo slide
  wrapperSlideshow.addEventListener("click", (e) => {
    if (dragged) {
      e.preventDefault();
      e.stopPropagation();
      dragged = false;
    }
  }, true); // sử dụng capture phase

  createDots();
  showSlide(currentIndex);
  startAutoSlide();
});

// ============================
document.addEventListener('DOMContentLoaded', () => {
  const txts = document.querySelectorAll('.anim-txt-sshow');

  const directions = ['from-top', 'from-right', 'from-left'];

  txts.forEach(txt => {
    // Chọn random 1 hiệu ứng trong 3 hướng
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    txt.classList.add(randomDirection);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('show');
        }, index * 150);
      } else {
        entry.target.classList.remove('show');
      }
    });
  }, {
    threshold: 0.1
  });

  txts.forEach(txt => {
    observer.observe(txt);
  });
});