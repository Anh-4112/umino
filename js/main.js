// =+=+=+=+=+=+=+=+=+=+=  SLIDESHOW  =+=+=+=+=+=+=+=+=+=+= //
document.addEventListener("DOMContentLoaded", () => {
  // --- Khởi tạo các biến và phần tử ---
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

  // --- Cập nhật giao diện của slides và dot ---
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

  // --- Tạo các chấm tròn (dot) dưới slideshow ---
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

  // --- Sự kiện click cho 2 nút prev/next ---
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
  
  // --- Dừng auto slide khi hover vào slideshow ---
  wrapper.addEventListener("mouseenter", stopAutoSlide);
  wrapper.addEventListener("mouseleave", startAutoSlide);

  // --- Drag slide bằng chuột hoặc cảm ứng (touch) ---
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

