document.addEventListener("DOMContentLoaded", () => {
  // Lặp qua tất cả các class slider trong trang
  document.querySelectorAll(".slider").forEach((slider) => {
    
    const slide = slider.querySelector(".slide"); // Lấy ra 1 phần tử slide bên trong slider để đo kích thước
    if (!slide) return; // Bỏ qua nếu không có slide

    let slideWidth = slide ? slide.offsetWidth : 0; // Tính chiều rộng của 1 slide bao gồm cả khoảng cách gap giữa các slide
    let gap = parseInt(getComputedStyle(slider).gap) || 10;

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
      const cardWidthWithGap = slideWidth + gap;
      const scrollLeft = slider.scrollLeft;

      // Lấy index gần nhất
      const currentIndex = Math.round(scrollLeft / cardWidthWithGap);

      // Cộng/trừ index theo hướng
      const maxIndex = Math.floor(slider.scrollWidth / cardWidthWithGap) - 1;
      const newIndex = direction === "prev" ? Math.max(0, currentIndex - 1) : Math.min(maxIndex, currentIndex + 1);

      const newScrollPosition = newIndex * cardWidthWithGap;

      slider.style.scrollBehavior = "smooth";
      slider.scrollTo({ left: newScrollPosition });

      setTimeout(() => {
        slider.style.scrollBehavior = "auto";
      }, 400);
    };


    // Tìm phần tử cha gần nhất có class "wrapper" để bao quanh slider (nếu có)
    const wrapper = slider.closest(".wrapper");

    // Nếu slider nằm trong wrapper, thì tìm các nút prev/next bên trong wrapper đó
    if (wrapper) {
      const prevBtn = wrapper.querySelector(".slider-prev");
      const nextBtn = wrapper.querySelector(".slider-next");

      // Gán sự kiện click cho các nút nếu có
      prevBtn?.addEventListener("click", () => scrollToItem("prev"));
      nextBtn?.addEventListener("click", () => scrollToItem("next"));
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