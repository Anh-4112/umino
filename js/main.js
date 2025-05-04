// =+=+=+=+=+=+=+=+=+=+=  SLIDESHOW  =+=+=+=+=+=+=+=+=+=+= //
// ========== Slideshow ==========
document.addEventListener("DOMContentLoaded", () => {
  // Khởi tạo các biến và phần tử
  const wrapper = document.querySelector(".wrapper-slideshow"); // Thẻ bao toàn bộ slideshow
  const slides = Array.from(wrapper.querySelectorAll(".slide")); // Danh sách các slide
  const btnPrev = document.querySelector(".btn-slideshow-prev"); // Nút chuyển slide về trước
  const btnNext = document.querySelector(".btn-slideshow-next"); // Nút chuyển slide kế tiếp
  const dotsContainer = document.querySelector(".slideshow-dots"); // Vùng chứa các chấm (dot)

  let currentIndex = 0; // Slide đang hiển thị
  let autoSlideInterval = null; // Biến lưu interval chạy tự động

  // Biến hỗ trợ kéo slide bằng tay
  let isDragging = false;
  let startX = 0; // Tọa độ X lúc bắt đầu kéo
  let deltaX = 0; // Khoảng cách kéo ngang
  let dragged = false; // Biến xác định có phải vừa drag không
  const dragThreshold = 30; // Ngưỡng để tính là đã kéo xong (đổi slide)

  // Cập nhật giao diện của slides và dot
  const updateSlides = () => {
    slides.forEach((slide, i) => {
      slide.classList.remove("active", "to-left", "to-right"); // Reset class
      if (i === currentIndex) slide.classList.add("active"); // Slide hiện tại
      else if (i < currentIndex) slide.classList.add("to-left"); // Slide nằm trước
      else slide.classList.add("to-right"); // Slide nằm sau
    });

    // Cập nhật dot tương ứng (nếu có)
    if (dotsContainer) {
      dotsContainer.querySelectorAll(".dot").forEach((dot, i) =>
        dot.classList.toggle("active", i === currentIndex)
      );
    }
  };

  // Chuyển đến slide có index cụ thể
  const goToSlide = (index) => {
    // Đảm bảo index luôn nằm trong khoảng hợp lệ (0 → slides.length - 1)
    currentIndex = (index + slides.length) % slides.length;
    updateSlides();
  };

  // Các hàm chuyển tiếp và lùi
  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  // Bắt đầu tự động chuyển slide mỗi 3 giây
  const startAutoSlide = () => {
    if (!autoSlideInterval) autoSlideInterval = setInterval(nextSlide, 3000);
  };

  // Dừng tự động chuyển slide
  const stopAutoSlide = () => {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  };

  // Khởi động lại auto slide
  const restartAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
  };

  // Tạo các chấm tròn (dot) dưới slideshow 
  const createDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = ""; // Xóa dot cũ (nếu có)

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.classList.add("dot");
      if (i === currentIndex) dot.classList.add("active");

      // Gán sự kiện click cho từng dot
      dot.addEventListener("click", () => {
        goToSlide(i);
        restartAutoSlide(); // Click dot cũng reset auto
      });

      dotsContainer.appendChild(dot);
    });
  };

  // Sự kiện click cho 2 nút prev/next
  const handleButtonClick = (direction) => {
    direction === 'prev' ? prevSlide() : nextSlide();
    if (wrapper.matches(':hover')) {
      stopAutoSlide();
    } else {
      restartAutoSlide();
    }
  };
  btnPrev?.addEventListener("click", () => handleButtonClick("prev"));
  btnNext?.addEventListener("click", () => handleButtonClick("next"));  
  
  // Dừng auto slide khi hover vào slideshow
  wrapper.addEventListener("mouseenter", stopAutoSlide);
  wrapper.addEventListener("mouseleave", startAutoSlide);

  // Drag slide bằng chuột hoặc cảm ứng (touch)
  // Hàm lấy tọa độ X (chuột hoặc cảm ứng)
  const getX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);
  const getY = (e) => (e.touches ? e.touches[0].clientY : e.clientY);

  // Khi bắt đầu drag
  const startDrag = (e) => {
    isDragging = true;
    dragged = false;
    startX = getX(e);
    stopAutoSlide(); // Dừng auto khi người dùng đang thao tác
  };

  // Khi đang drag
  const moveDrag = (e) => {
    if (!isDragging) return;

    deltaX = getX(e) - startX;

    // Nếu là cảm ứng, kiểm tra để ngăn scroll dọc khi kéo ngang
    const deltaY = getY(e) - e.touches?.[0]?.pageY || 0;
    if (e.touches && Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault(); // Ngăn cuộn màn hình
    }

    // Đánh dấu là đã kéo (dùng để chặn click)
    if (Math.abs(deltaX) > 5) {
      dragged = true;
    }
  };

  // Khi kết thúc drag
  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
  
    // Nếu kéo đủ ngưỡng thì chuyển slide
    if (Math.abs(deltaX) > dragThreshold) {
      deltaX > 0 ? prevSlide() : nextSlide();
    }  
    deltaX = 0; // Reset lại
  
    // Dừng lại nếu chuột vẫn hover vùng wrapper
    if (!wrapper.matches(':hover')) {
      startAutoSlide();
    }
  };
  
  // --- Gán sự kiện drag cho chuột ---
  wrapper.addEventListener("mousedown", (e) => {
    e.preventDefault(); // Ngăn mặc định (chọn text)
    startDrag(e);
  });

  wrapper.addEventListener("mousemove", moveDrag);
  wrapper.addEventListener("mouseup", endDrag);
  wrapper.addEventListener("mouseleave", () => {
    isDragging = false;
    deltaX = 0;
  });

  // --- Gán sự kiện drag cho cảm ứng ---
  wrapper.addEventListener("touchstart", startDrag, { passive: false });
  wrapper.addEventListener("touchmove", moveDrag, { passive: false });
  wrapper.addEventListener("touchend", endDrag);

  // --- Ngăn click nếu vừa mới drag xong (tránh nhấn nhầm) ---
  wrapper.addEventListener(
    "click",
    (e) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
        dragged = false;
      }
    },
    true // capture phase để ưu tiên chặn sớm
  );

  // --- Khởi động khi trang tải ---
  createDots(); // Tạo dot
  updateSlides(); // Cập nhật slide ban đầu
  startAutoSlide(); // Bắt đầu auto slide
});

// ========== Animation Text ==========
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
        }, index * 200);
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


// =+=+=+=+=+=+=+=+=+=+=  TRENDING THIS WEEK  =+=+=+=+=+=+=+=+=+=+= //
// ========== Btn-Text-Trending ==========
document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".btn-text-trending");

  // Đặt active cho nút đầu tiên khi tải trang
  buttons[0].classList.add("active");

  // Xử lý khi click vào nút
  buttons.forEach(button => {
      button.addEventListener("click", function (event) {
          event.preventDefault(); // Ngăn chặn load lại trang nếu href=""

          // Xóa class active khỏi tất cả các nút
          buttons.forEach(btn => btn.classList.remove("active"));

          // Thêm class active vào nút được nhấn
          this.classList.add("active");
      });
  });
});

// ========== Slider ==========
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".slider-trending");
  const btnTrending = document.querySelectorAll(".btn-trending-prev, .btn-trending-next");
  const slide = slider.querySelector(".slide-trending");
  
  let slideWidth = slide ? slide.offsetWidth : 0;
  let gap = parseInt(getComputedStyle(slider).gap) || 0;

  let isDragging = false, startX, startScrollLeft;
  let moved = false;

  // Cập nhật kích thước khi thay đổi màn hình
  const updateSizes = () => {
      slideWidth = slide ? slide.offsetWidth : 0;
      gap = parseInt(getComputedStyle(slider).gap) || 0;
  };
  window.addEventListener("resize", updateSizes);

  // Ngăn kéo link
  document.querySelectorAll(".slider-trending a").forEach(a => {
      a.addEventListener("click", (e) => {
          if (moved) e.preventDefault();
      });
      a.addEventListener("dragstart", (e) => e.preventDefault());
  });

  // Khi bắt đầu kéo
  const dragStart = (e) => {
      isDragging = true;
      moved = false;
      startX = e.pageX || e.touches[0].pageX;
      startScrollLeft = slider.scrollLeft;
      slider.classList.add("dragging");
  };

  // Khi kéo
  const dragging = (e) => {
      if (!isDragging) return;
      moved = true;
      const x = e.pageX || e.touches[0].pageX;
      slider.scrollLeft = startScrollLeft - (x - startX);
  };

  // Khi thả chuột
  const dragStop = (e) => {
    if (!isDragging) return;
    isDragging = false;
    slider.classList.remove("dragging");

    if (moved) {
        const threshold = 70; // Ngưỡng kéo tối thiểu để chuyển slide
        const cardWidthWithGap = slideWidth + gap;
        const scrollLeft = slider.scrollLeft;
        const distanceDragged = scrollLeft - startScrollLeft;

        let closestIndex = Math.round(startScrollLeft / cardWidthWithGap); // Giữ nguyên nếu chưa vượt ngưỡng

        if (distanceDragged > threshold) {
            // Kéo sang phải vượt ngưỡng → chuyển slide tiếp theo
            closestIndex += 1;
        } else if (distanceDragged < -threshold) {
            // Kéo sang trái vượt ngưỡng → lùi về slide trước
            closestIndex -= 1;
        }

        const newScrollPosition = closestIndex * cardWidthWithGap;

        slider.style.scrollBehavior = "smooth";
        slider.scrollTo({ left: newScrollPosition, behavior: "smooth" });

        setTimeout(() => {
            slider.style.scrollBehavior = "auto";
        }, 500);
    }
  };

  // Cuộn chính xác đến item, tính cả gap
  const scrollToItem = (direction) => {
      const scrollLeft = slider.scrollLeft;
      const cardWidthWithGap = slideWidth + gap; // Kích thước mỗi item kèm khoảng cách
      const newScrollPosition = direction === "prev"
          ? Math.max(0, Math.floor(scrollLeft / cardWidthWithGap) * cardWidthWithGap - cardWidthWithGap)
          : Math.min(slider.scrollWidth, Math.ceil(scrollLeft / cardWidthWithGap) * cardWidthWithGap + cardWidthWithGap);

      slider.style.scrollBehavior = "smooth";
      slider.scrollTo({ left: newScrollPosition, behavior: "smooth" });

      setTimeout(() => {
          slider.style.scrollBehavior = "auto";
      }, 500);
  };

  // Xử lý khi click nút prev/next
  btnTrending.forEach(btn => {
      btn.addEventListener("click", () => {
          if (btn.classList.contains("btn-trending-prev")) {
              scrollToItem("prev");
          } else {
              scrollToItem("next");
          }
      });
  });

  // Gán sự kiện kéo chuột
  slider.addEventListener("mousedown", dragStart);
  slider.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", dragStop);
  slider.addEventListener("mouseleave", dragStop);

  // Gán sự kiện cảm ứng
  slider.addEventListener("touchstart", dragStart);
  slider.addEventListener("touchmove", dragging);
  slider.addEventListener("touchend", dragStop);
});

// ========== Btn-Change-Color-Trending ==========
function changeImgTrending(element, imageSrc) {
  // Tìm phần tử tổ tiên gần nhất của element có class là slide-trending bằng closest
  let parentDiv = element.closest(".slide-trending");
  // Kiểm tra nếu tìm được phần tử cha có class slide-trending thì mới tiếp tục
  if (parentDiv) {
    // Tìm trong phần tử cha đó phần tử con có class là img-change
    let imgChange = parentDiv.querySelector(".img-change");
    // Nếu img-change cần thay đổi tồn tại thì tiến hành thay đổi ảnh 
    if (imgChange) {
      // Gán lại thuộc tính src của thẻ <img> thành đường dẫn ảnh mới được truyền vào.
      imgChange.src = imageSrc;
    }
  }
}


// =+=+=+=+=+=+=+=+=+=+=  BANNER  =+=+=+=+=+=+=+=+=+=+= //
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


// =+=+=+=+=+=+=+=+=+=+=  ARRIVALS  =+=+=+=+=+=+=+=+=+=+= //
// ========== Slider ==========
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".slider-arrivals");
  const btnArrivals = document.querySelectorAll(".btn-arrivals-prev, .btn-arrivals-next");
  const slide = slider.querySelector(".slide-arrivals");
  
  let slideWidth = slide ? slide.offsetWidth : 0;
  let gap = parseInt(getComputedStyle(slider).gap) || 0;

  let isDragging = false, startX, startScrollLeft;
  let moved = false;

  // Cập nhật kích thước khi thay đổi màn hình
  const updateSizes = () => {
      slideWidth = slide ? slide.offsetWidth : 0;
      gap = parseInt(getComputedStyle(slider).gap) || 0;
  };
  window.addEventListener("resize", updateSizes);

  // Ngăn kéo link
  document.querySelectorAll(".slider-arrivals a").forEach(a => {
      a.addEventListener("click", (e) => {
          if (moved) e.preventDefault();
      });
      a.addEventListener("dragstart", (e) => e.preventDefault());
  });

  // Khi bắt đầu kéo
  const dragStart = (e) => {
      isDragging = true;
      moved = false;
      startX = e.pageX || e.touches[0].pageX;
      startScrollLeft = slider.scrollLeft;
      slider.classList.add("dragging");
  };

  // Khi kéo
  const dragging = (e) => {
      if (!isDragging) return;
      moved = true;
      const x = e.pageX || e.touches[0].pageX;
      slider.scrollLeft = startScrollLeft - (x - startX);
  };

  // Khi thả chuột
  const dragStop = (e) => {
    if (!isDragging) return;
    isDragging = false;
    slider.classList.remove("dragging");

    if (moved) {
        const threshold = 70; // Ngưỡng kéo tối thiểu để chuyển slide
        const cardWidthWithGap = slideWidth + gap;
        const scrollLeft = slider.scrollLeft;
        const distanceDragged = scrollLeft - startScrollLeft;

        let closestIndex = Math.round(startScrollLeft / cardWidthWithGap); // Giữ nguyên nếu chưa vượt ngưỡng

        if (distanceDragged > threshold) {
            // Kéo sang phải vượt ngưỡng → chuyển slide tiếp theo
            closestIndex += 1;
        } else if (distanceDragged < -threshold) {
            // Kéo sang trái vượt ngưỡng → lùi về slide trước
            closestIndex -= 1;
        }

        const newScrollPosition = closestIndex * cardWidthWithGap;

        slider.style.scrollBehavior = "smooth";
        slider.scrollTo({ left: newScrollPosition, behavior: "smooth" });

        setTimeout(() => {
            slider.style.scrollBehavior = "auto";
        }, 500);
    }
  };

  // Cuộn chính xác đến item, tính cả gap
  const scrollToItem = (direction) => {
      const scrollLeft = slider.scrollLeft;
      const cardWidthWithGap = slideWidth + gap; // Kích thước mỗi item kèm khoảng cách
      const newScrollPosition = direction === "prev"
          ? Math.max(0, Math.floor(scrollLeft / cardWidthWithGap) * cardWidthWithGap - cardWidthWithGap)
          : Math.min(slider.scrollWidth, Math.ceil(scrollLeft / cardWidthWithGap) * cardWidthWithGap + cardWidthWithGap);

      slider.style.scrollBehavior = "smooth";
      slider.scrollTo({ left: newScrollPosition, behavior: "smooth" });

      setTimeout(() => {
          slider.style.scrollBehavior = "auto";
      }, 500);
  };

  // Xử lý khi click nút prev/next
  btnArrivals.forEach(btn => {
      btn.addEventListener("click", () => {
          if (btn.classList.contains("btn-arrivals-prev")) {
              scrollToItem("prev");
          } else {
              scrollToItem("next");
          }
      });
  });

  // Gán sự kiện kéo chuột
  slider.addEventListener("mousedown", dragStart);
  slider.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", dragStop);
  slider.addEventListener("mouseleave", dragStop);

  // Gán sự kiện cảm ứng
  slider.addEventListener("touchstart", dragStart);
  slider.addEventListener("touchmove", dragging);
  slider.addEventListener("touchend", dragStop);
});


// =+=+=+=+=+=+=+=+=+=+=  CUSTOMER SAY  =+=+=+=+=+=+=+=+=+=+= //
// ========== Slider ==========
document.addEventListener("DOMContentLoaded", () => {
  // Khởi tạo các biến và phần tử
  const slider = document.querySelector(".slider-fback"); // Thẻ bao toàn bộ slide
  const slide = slider.querySelector(".slide-fback"); // Danh sách các slide
  const btnFback = document.querySelectorAll(".btn-fback-prev, .btn-fback-next"); // Nút prev/next

  // Tính chiều rộng của slide và khoảng cách (gap) giữa các slide
  let slideWidth = slide ? slide.offsetWidth : 0;
  let gap = parseInt(getComputedStyle(slider).gap) || 0;

  // Biến thao tác kéo
  let isDragging = false, startX, startScrollLeft;
  let moved = false;

  // Cập nhật kích thước slide và gap khi thay đổi kích thước viewport
  const updateSizes = () => {
    slideWidth = slide ? slide.offsetWidth : 0;
    gap = parseInt(getComputedStyle(slider).gap) || 0;
  };
  window.addEventListener("resize", updateSizes);

  // Hàm cuộn mượt đến vị trí nhất định
  const smoothScrollTo = (target) => {
    const duration = 500; // thời gian animation 500ms
    const start = slider.scrollLeft; // vị trí bắt đầu cuộn
    const distance = target - start; // khoảng cách cần cuộn
    let startTime = null;

    // Hàm animation sử dụng requestAnimationFrame
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1); // tiến độ (0 -> 1)
      slider.scrollLeft = start + distance * easeInOutQuad(progress); // áp dụng easing

      if (timeElapsed < duration) {
        requestAnimationFrame(animate);
      }
    };

    // Hàm easing: giúp cuộn mượt theo kiểu ease-in-out
    const easeInOutQuad = (t) => (t < 0.5) ? 2*t*t : -1+(4-2*t)*t;
    requestAnimationFrame(animate); // bắt đầu animation
  };

  // Khi bắt đầu kéo slider
  const dragStart = (e) => {
    isDragging = true;
    moved = false;
    startX = e.pageX || e.touches[0].pageX; // vị trí chuột/touch bắt đầu
    startScrollLeft = slider.scrollLeft; // vị trí scroll ban đầu
    slider.classList.add("dragging"); // thêm class để styling (nếu có)
  };

  // Trong quá trình kéo slider
  const dragging = (e) => {
    if (!isDragging) return;
    moved = true;
    const x = e.pageX || e.touches[0].pageX; // vị trí hiện tại của chuột/touch
    slider.scrollLeft = startScrollLeft - (x - startX); // cập nhật scroll dựa vào khoảng di chuyển
  };

  // Khi kết thúc kéo slider
  const dragStop = () => {
    isDragging = false;
    slider.classList.remove("dragging");

    if (moved) {
      const threshold = 100; // khoảng kéo tối thiểu để chuyển slide
      const cardWidthWithGap = slideWidth + gap;
      const scrollLeft = slider.scrollLeft;
      const distanceDragged = scrollLeft - startScrollLeft;

      // Tính index gần nhất dựa trên vị trí bắt đầu
      let closestIndex = Math.round(startScrollLeft / cardWidthWithGap);

      // Nếu kéo đủ xa thì chuyển sang slide kế tiếp hoặc trước
      if (distanceDragged > threshold) {
        closestIndex += 1;
      } else if (distanceDragged < -threshold) {
        closestIndex -= 1;
      }

      // Cuộn mượt đến vị trí slide tính được
      const newScrollPosition = closestIndex * cardWidthWithGap;
      smoothScrollTo(newScrollPosition);
    }
  };

  // Xử lý khi click nút prev/next
  const scrollToItem = (direction) => {
    const scrollLeft = slider.scrollLeft;
    const cardWidthWithGap = slideWidth + gap;
  
    // Tính index hiện tại dựa trên vị trí scroll
    const currentIndex = Math.round(scrollLeft / cardWidthWithGap);
    let newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
  
    // Giới hạn index trong phạm vi hợp lệ
    const maxIndex = Math.floor((slider.scrollWidth - slider.clientWidth) / cardWidthWithGap);
    newIndex = Math.max(0, Math.min(newIndex, maxIndex));
  
    // Cuộn mượt tới slide mới
    const newScrollPosition = newIndex * cardWidthWithGap;
    smoothScrollTo(newScrollPosition);
  };
  
  // Lắng nghe sự kiện click nút prev/next
  btnFback.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("btn-fback-prev")) {
        scrollToItem("prev");
      } else {
        scrollToItem("next");
      }
    });
  });

  // Các sự kiện chuột cho kéo slide
  slider.addEventListener("mousedown", dragStart);
  slider.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", dragStop);
  slider.addEventListener("mouseleave", () => { // Khi chuột rời slider khi đang kéo thì cũng dừng lại
    if (isDragging && moved) dragStop();
  });

  // Các sự kiện cảm ứng cho thiết bị di động
  slider.addEventListener("touchstart", dragStart);
  slider.addEventListener("touchmove", dragging);
  slider.addEventListener("touchend", dragStop);
});


// =+=+=+=+=+=+=+=+=+=+=  SHOP BY GRAM  =+=+=+=+=+=+=+=+=+=+= //
// ========== Slider ==========
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".slider-ig");
  const slide = slider.querySelector(".slide-ig");
  
  let slideWidth = slide ? slide.offsetWidth : 0;
  let gap = parseInt(getComputedStyle(slider).gap) || 0;

  let isDragging = false, startX, startScrollLeft;
  let moved = false;

  // Cập nhật kích thước khi thay đổi màn hình
  const updateSizes = () => {
      slideWidth = slide ? slide.offsetWidth : 0;
      gap = parseInt(getComputedStyle(slider).gap) || 0;
  };
  window.addEventListener("resize", updateSizes);

  // Ngăn kéo link
    document.querySelectorAll(".slider-ig a").forEach(a => {
      a.addEventListener("click", (e) => {
          if (moved) e.preventDefault();
      });
      a.addEventListener("dragstart", (e) => e.preventDefault());
  });

  // Khi bắt đầu kéo
  const dragStart = (e) => {
      isDragging = true;
      moved = false;
      startX = e.pageX || e.touches[0].pageX;
      startScrollLeft = slider.scrollLeft;
      slider.classList.add("dragging");
  };

  // Khi kéo
  const dragging = (e) => {
      if (!isDragging) return;
      moved = true;
      const x = e.pageX || e.touches[0].pageX;
      slider.scrollLeft = startScrollLeft - (x - startX);
  };

  // Khi thả chuột
  const dragStop = () => {
    isDragging = false;
    slider.classList.remove("dragging");

    if (moved) {
        const threshold = 70; // Ngưỡng kéo tối thiểu để chuyển slide
        const cardWidthWithGap = slideWidth + gap;
        const scrollLeft = slider.scrollLeft;
        const distanceDragged = scrollLeft - startScrollLeft;

        let closestIndex = Math.round(startScrollLeft / cardWidthWithGap); // Giữ nguyên nếu chưa vượt ngưỡng

        if (distanceDragged > threshold) {
            // Kéo sang phải vượt ngưỡng → chuyển slide tiếp theo
            closestIndex += 1;
        } else if (distanceDragged < -threshold) {
            // Kéo sang trái vượt ngưỡng → lùi về slide trước
            closestIndex -= 1;
        }

        const newScrollPosition = closestIndex * cardWidthWithGap;

        slider.style.scrollBehavior = "smooth";
        slider.scrollTo({ left: newScrollPosition, behavior: "smooth" });

        setTimeout(() => {
            slider.style.scrollBehavior = "auto";
        }, 500);
    }
  };

  // Cuộn chính xác đến item, tính cả gap
  const scrollToItem = (direction) => {
      const scrollLeft = slider.scrollLeft;
      const cardWidthWithGap = slideWidth + gap; // Kích thước mỗi item kèm khoảng cách
      const newScrollPosition = direction === "prev"
          ? Math.max(0, Math.floor(scrollLeft / cardWidthWithGap) * cardWidthWithGap - cardWidthWithGap)
          : Math.min(slider.scrollWidth, Math.ceil(scrollLeft / cardWidthWithGap) * cardWidthWithGap + cardWidthWithGap);

      slider.style.scrollBehavior = "smooth";
      slider.scrollTo({ left: newScrollPosition, behavior: "smooth" });

      setTimeout(() => {
          slider.style.scrollBehavior = "auto";
      }, 500);
  };

  // Gán sự kiện kéo chuột
  slider.addEventListener("mousedown", dragStart);
  slider.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", dragStop);
  slider.addEventListener("mouseleave", dragStop);

  // Gán sự kiện cảm ứng
  slider.addEventListener("touchstart", dragStart);
  slider.addEventListener("touchmove", dragging);
  slider.addEventListener("touchend", dragStop);
});

// =+=+=+=+=+=+=+=+=+=+=  FOOTER LIST  =+=+=+=+=+=+=+=+=+=+= //
document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener('resize', () => {
    // Chọn tất cả phần tử có class "footer-list" (các menu con trong footer)
    document.querySelectorAll(".footer-list").forEach(menu => {
        // Lấy biểu tượng (+/-) từ phần tử liền trước menu
        let icon = menu.previousElementSibling.querySelector(".footer-icon");
        // Kiểm tra xem menu có mở sẵn hay không dựa vào biểu tượng (+/-)
        let isOpen = icon.textContent.trim() === "−";
  
        // Chỉ tác dụng cho viewport < 768px
        if (window.innerWidth < 768) {
          if (isOpen) {
              // Nếu biểu tượng là "-", mở sẵn menu với chiều cao thực tế
              requestAnimationFrame(() => {
                  menu.style.maxHeight = menu.scrollHeight / 10 + "rem";
              });
          } else {
              // Nếu biểu tượng là "+", giữ menu đóng với maxHeight = 0
              menu.style.maxHeight = "0rem";
          }
        } else {
            // Màn hình desktop: xóa maxHeight inline đi cho sạch
            menu.style.maxHeight = null;
        }
        // Lưu trạng thái mở/đóng của menu vào thuộc tính dataset
        menu.dataset.open = isOpen;
    });
  })
});

// Hàm xử lý khi người dùng nhấn vào menu để mở hoặc đóng
function toggleMenu(id) {
  // Lấy menu theo ID
  let menu = document.getElementById(id);
  // Lấy biểu tượng (+/-) từ phần tử liền trước menu
  let icon = menu.previousElementSibling.querySelector(".footer-icon");
  // Kiểm tra trạng thái hiện tại của menu
  let isOpen = menu.dataset.open === "true";

  // Nếu menu đang mở, thu gọn lại, nếu đang đóng, mở rộng ra
  menu.style.maxHeight = isOpen ? "0rem" : menu.scrollHeight / 10 + "rem";
  // Cập nhật biểu tượng tương ứng
  icon.textContent = isOpen ? "+" : "−";
  // Cập nhật trạng thái mới vào dataset
  menu.dataset.open = !isOpen;
}