// =+=+=+=+=+=+=+=+=+=+=  TRENDING THIS WEEK / ARRIVALS  =+=+=+=+=+=+=+=+=+=+= //
// ========== Slider ==========
document.addEventListener("DOMContentLoaded", () => {
  // Lặp qua tất cả các class slider trong trang
  document.querySelectorAll(".slider").forEach((slider) => {
    // Lấy ra 1 phần tử slide bên trong slider để đo kích thước
    const slide = slider.querySelector(".slide");
    // Tính chiều rộng của 1 slide bao gồm cả khoảng cách gap giữa các slide
    let slideWidth = slide ? slide.offsetWidth : 0;
    let gap = parseInt(getComputedStyle(slider).gap) || 0;

    // Biến kiểm soát thao tác kéo
    let isDragging = false;        // Đã bắt đầu kéo chuột hay chưa
    let startX;                    // Vị trí bắt đầu kéo chuột
    let startScrollLeft;          // Giá trị scrollLeft khi bắt đầu kéo
    let moved = false;            // Đã di chuyển xa hay chưa (dùng để ngăn click link khi đang kéo)

    // Cập nhật lại slideWidth và gap nếu thay đổi kích thước màn hình
    const updateSizes = () => {
      slideWidth = slide ? slide.offsetWidth : 0;
      gap = parseInt(getComputedStyle(slider).gap) || 0;
    };
    window.addEventListener("resize", updateSizes);

    // Ngăn không cho click vào thẻ <a> khi đang kéo slider
    slider.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", (e) => {
        if (moved) e.preventDefault(); // Nếu đã kéo thì ngăn click
      });
      a.addEventListener("dragstart", (e) => e.preventDefault()); // Ngăn kéo hình ảnh đi
    });

    // Sự kiện khi bắt đầu kéo chuột, cảm ứng
    const dragStart = (e) => {
      isDragging = true;
      moved = false;
      startX = e.pageX || e.touches[0].pageX; // Tọa độ ban đầu (chuột, cảm ứng)
      startScrollLeft = slider.scrollLeft;    // Giá trị scroll ban đầu
      slider.classList.add("dragging");       // Thêm class kéo (nếu muốn thêm style khi đang kéo)
    };

    // Sự kiện khi đang kéo chuột, cảm ứng
    const dragging = (e) => {
      if (!isDragging) return;
      moved = true;
      const x = e.pageX || e.touches[0].pageX;
      slider.scrollLeft = startScrollLeft - (x - startX); // Tính khoảng scroll dựa theo chênh lệch chuột
    };

    // Sự kiện khi dừng kéo chuột, kết thúc cảm ứng)
    const dragStop = () => {
      if (!isDragging) return;
      isDragging = false;
      slider.classList.remove("dragging");

      if (moved) {
        const threshold = 50; // Khoảng cách kéo tối thiểu để chuyển slide
        const cardWidthWithGap = slideWidth + gap;
        const scrollLeft = slider.scrollLeft;
        const distanceDragged = scrollLeft - startScrollLeft;

        let closestIndex = Math.round(startScrollLeft / cardWidthWithGap); // Index ban đầu

        // Nếu kéo đủ xa thì chuyển slide
        if (distanceDragged > threshold) {
          closestIndex += 1; // kéo sang phải thì qua slide tiếp theo
        } else if (distanceDragged < -threshold) {
          closestIndex -= 1; // kéo sang trái thì quay lại slide trước đó
        }

        const newScrollPosition = closestIndex * cardWidthWithGap;

        // Cuộn mượt đến vị trí slide mới
        slider.style.scrollBehavior = "smooth";
        slider.scrollTo({ left: newScrollPosition });

        // Sau 0.4s thì tắt cuộn mượt để kéo bằng tay mượt hơn
        setTimeout(() => {
          slider.style.scrollBehavior = "auto";
        }, 400);
      }
    };

    // Hàm xử lý khi bấm nút prev/next
    const scrollToItem = (direction) => {
      const scrollLeft = slider.scrollLeft;
      const cardWidthWithGap = slideWidth + gap;

      // Tính toán vị trí mới tùy theo hướng
      const newScrollPosition = direction === "prev"
        ? Math.max(0, Math.floor(scrollLeft / cardWidthWithGap) * cardWidthWithGap - cardWidthWithGap)
        : Math.min(slider.scrollWidth, Math.ceil(scrollLeft / cardWidthWithGap) * cardWidthWithGap + cardWidthWithGap);

      slider.style.scrollBehavior = "smooth";
      slider.scrollTo({ left: newScrollPosition });

      // Sau khi scroll xong thì tắt cuộn mượt
      setTimeout(() => {
        slider.style.scrollBehavior = "auto";
      }, 500);
    };

    // Tìm wrapper chứa nút prev/next tương ứng với slider hiện tại
    const wrapper = slider.closest(".wrapper");

    // Lấy đúng nút prev và next trong wrapper đó
    const prevBtn = wrapper.querySelector(".slider-prev");
    const nextBtn = wrapper.querySelector(".slider-next");

    // Gán sự kiện click cho nút prev
    if (prevBtn) {
      prevBtn.addEventListener("click", () => scrollToItem("prev"));
    }

    // Gán sự kiện click cho nút next
    if (nextBtn) {
      nextBtn.addEventListener("click", () => scrollToItem("next"));
    }

    // Gán các sự kiện kéo bằng chuột
    slider.addEventListener("mousedown", dragStart);
    slider.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
    slider.addEventListener("mouseleave", dragStop);

    // Gán các sự kiện cảm ứng cho điện thoại
    slider.addEventListener("touchstart", dragStart);
    slider.addEventListener("touchmove", dragging);
    slider.addEventListener("touchend", dragStop);
  });
});


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


// =+=+=+=+=+=+=+=+=+=+=  CUSTOMER SAY  =+=+=+=+=+=+=+=+=+=+= //
// ========== Slider ==========
document.addEventListener("DOMContentLoaded", () => {
  // Khởi tạo các biến và phần tử
  const slider = document.querySelector(".slider-fback"); // Thẻ bao toàn bộ slide
  const slide = slider.querySelector(".slide-fback"); // Danh sách các slide
  const btnFback = document.querySelectorAll(".fback-prev, .fback-next"); // Nút prev/next

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
      const threshold = 50; // khoảng kéo tối thiểu để chuyển slide
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
      if (btn.classList.contains("fback-prev")) {
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
        const threshold = 40; // Ngưỡng kéo tối thiểu để chuyển slide
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