export function initSliderSnap() {
  // Lặp qua tất cả các class slider trong trang
  document.querySelectorAll(".slider").forEach((sliderSnap) => {
    
    const slideSnap = sliderSnap.querySelector(".slide"); // Lấy ra 1 phần tử slide bên trong slider để đo kích thước
    if (!slideSnap) return; // Bỏ qua nếu không có slide
  
    let slideSnapWidth = slideSnap ? slideSnap.offsetWidth : 0; // Tính chiều rộng của 1 slide bao gồm cả khoảng cách gap giữa các slide
    let gap = parseInt(getComputedStyle(sliderSnap).gap) || 10;
  
    // Biến kiểm soát thao tác kéo
    let isDragging = false;        // Đã bắt đầu kéo chuột hay chưa
    let startX;                    // Vị trí bắt đầu kéo chuột
    let startScrollLeft;          // Giá trị scrollLeft khi bắt đầu kéo
    let moved = false;            // Đã di chuyển xa hay chưa (dùng để ngăn click link khi đang kéo)
  
    // Cập nhật lại slideWidth và gap nếu thay đổi kích thước màn hình
    const updateSizes = () => {
      slideSnapWidth = slideSnap ? slideSnap.offsetWidth : 0;
      gap = parseInt(getComputedStyle(sliderSnap).gap) || 0;
    };
    window.addEventListener("resize", updateSizes);
  
    // Ngăn không cho click vào thẻ <a> khi đang kéo slider
    sliderSnap.querySelectorAll("a").forEach(a => {
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
      startScrollLeft = sliderSnap.scrollLeft;    // Giá trị scroll ban đầu
      sliderSnap.classList.add("dragging");       // Thêm class kéo (nếu muốn thêm style khi đang kéo)
    };
  
    // Sự kiện khi đang kéo chuột, cảm ứng
    const dragging = (e) => {
      if (!isDragging) return;
      moved = true;
      const x = e.pageX || e.touches[0].pageX;
      sliderSnap.scrollLeft = startScrollLeft - (x - startX); // Tính khoảng scroll dựa theo chênh lệch chuột
    };
  
    // Sự kiện khi dừng kéo chuột, kết thúc cảm ứng)
    const dragStop = () => {
      if (!isDragging) return;
      isDragging = false;
      sliderSnap.classList.remove("dragging");
  
      if (moved) {
        const threshold = 50; // Khoảng cách kéo tối thiểu để chuyển slide
        const cardWidthWithGap = slideSnapWidth + gap;
        const scrollLeft = sliderSnap.scrollLeft;
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
        sliderSnap.style.scrollBehavior = "smooth";
        sliderSnap.scrollTo({ left: newScrollPosition });
  
        // Sau 0.4s thì tắt cuộn mượt để kéo bằng tay mượt hơn
        setTimeout(() => {
          sliderSnap.style.scrollBehavior = "auto";
        }, 400);
      }
    };
  
    // Hàm xử lý khi bấm nút prev/next
    const scrollToItem = (direction) => {
      const cardWidthWithGap = slideSnapWidth + gap;
      const scrollLeft = sliderSnap.scrollLeft;
  
      // Lấy index gần nhất
      const currentIndex = Math.round(scrollLeft / cardWidthWithGap);
  
      // Cộng/trừ index theo hướng
      const maxIndex = Math.floor(sliderSnap.scrollWidth / cardWidthWithGap) - 1;
      const newIndex = direction === "prev" ? Math.max(0, currentIndex - 1) : Math.min(maxIndex, currentIndex + 1);
  
      const newScrollPosition = newIndex * cardWidthWithGap;
  
      sliderSnap.style.scrollBehavior = "smooth";
      sliderSnap.scrollTo({ left: newScrollPosition });
  
      setTimeout(() => {
        sliderSnap.style.scrollBehavior = "auto";
      }, 400);
    };
  
  
    // Tìm phần tử cha gần nhất có class "wrapper" để bao quanh slider (nếu có)
    const wrapper = sliderSnap.closest(".wrapper");
  
    // Nếu slider nằm trong wrapper, thì tìm các nút prev/next bên trong wrapper đó
    if (wrapper) {
      const prevBtn = wrapper.querySelector(".slider-prev");
      const nextBtn = wrapper.querySelector(".slider-next");
  
      // Gán sự kiện click cho các nút nếu có
      prevBtn?.addEventListener("click", () => scrollToItem("prev"));
      nextBtn?.addEventListener("click", () => scrollToItem("next"));
    }
  
    // Gán các sự kiện kéo bằng chuột
    sliderSnap.addEventListener("mousedown", dragStart);
    sliderSnap.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
    sliderSnap.addEventListener("mouseleave", dragStop);
  
    // Gán các sự kiện cảm ứng cho điện thoại
    sliderSnap.addEventListener("touchstart", dragStart);
    sliderSnap.addEventListener("touchmove", dragging);
    sliderSnap.addEventListener("touchend", dragStop);
  });
}