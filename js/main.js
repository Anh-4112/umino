// =+=+=+=+=+=+=+=+=+=+=  MENU MOBILE  =+=+=+=+=+=+=+=+=+=+= //
document.addEventListener("DOMContentLoaded", function () {
  const iconMenuMobile = document.getElementById("iconMenuMobile");
  const wrapperMenuMobile = document.getElementById("wrapperMenuMobile");
  const closeMenuMobile = document.getElementById("closeMenuMobile");
  const overlayMobile = document.getElementById("overlayMobile");

  iconMenuMobile.addEventListener("click", () => toggleMobile(true));

  window.toggleMobile = function (isOpen) {
    wrapperMenuMobile.classList.toggle("open", isOpen);
    overlayMobile.classList.toggle("show", isOpen);
    if (!isOpen) closeAllSubmenus();
  };

  const closeMobile = () => toggleMobile(false);
  closeMenuMobile?.addEventListener("click", closeMobile);
  overlayMobile?.addEventListener("click", closeMobile);

  // Mở submenu bất kỳ cấp nào
  document.querySelectorAll(".btn-sub-nav").forEach(btn => {
    btn.addEventListener("click", function () {
      const submenu = this.nextElementSibling;
      if (submenu && submenu.classList.contains("sub-nav-mobile")) {
        submenu.classList.add("open");
      }
    });
  });

  // Quay lại submenu cha
  document.querySelectorAll(".back-sub-nav").forEach(btn => {
    btn.addEventListener("click", function () {
      const currentSubmenu = this.closest(".sub-nav-mobile");
      currentSubmenu?.classList.remove("open");
    });
  });

  // Đóng toàn bộ submenu
  function closeAllSubmenus() {
    document.querySelectorAll(".sub-nav-mobile.open").forEach(el => {
      el.classList.remove("open");
    });
  }

  // Nút đóng toàn bộ menu
  document.querySelectorAll(".close-sub-nav").forEach(btn => {
    btn.addEventListener("click", closeMobile);
  });
});

// ========== Btn Language/Currency ==========
const btnLang = document.querySelectorAll('.btn-lang-mobile');
const btnCurr = document.querySelectorAll('.btn-curr-mobile');
// Language
btnLang.forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    btnLang.forEach(b => b.classList.remove('active')); // Xoá active khỏi tất cả
    btn.classList.add('active'); // Thêm active vào nút được click
  });
});
// Currency
btnCurr.forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    btnCurr.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});


// =+=+=+=+=+=+=+=+=+=+=  MINI CART  =+=+=+=+=+=+=+=+=+=+= //
document.addEventListener("DOMContentLoaded", function () {
  // Lấy các phần tử DOM cần sử dụng
  const cartIcon = document.querySelectorAll(".cart-icon");
  const cartBlock = document.getElementById("cartBlock");
  const closeCart = document.getElementById("closeCart");
  const overlayCart = document.getElementById("overlayCart");
  const cartItemsContainer = document.getElementById("cartItemList");
  const cartItemTemplate = document.getElementById("cartItem");
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const cartTotal = document.getElementById("cartTotal");
  const freeShippingThreshold = 120; // Ngưỡng miễn phí vận chuyển

  // Lấy giỏ hàng từ localStorage (nếu có) hoặc khởi tạo mảng trống
  let cart = JSON.parse(localStorage.getItem("mini-cart")) || [];

  // Sự kiện mở giỏ hàng
  cartIcon.forEach(icon => {
    icon.addEventListener("click", () => toggleCart(true));
    window.toggleCart = function (isOpen) {
        cartBlock.classList.toggle("open", isOpen);
        overlayCart.classList.toggle("show", isOpen);
    };
  })

  // Sự kiện đóng giỏ hàng
  const closeCartWithAnimation = () => toggleCart(false);
  closeCart.addEventListener("click", closeCartWithAnimation);
  overlayCart.addEventListener("click", closeCartWithAnimation);

  // Cập nhật tiến trình miễn phí vận chuyển
  function updateShippingProgress(total) {
      const progressFill = document.getElementById("progressFill");
      const progressIcon = document.getElementById("progressIcon");
      const shippingMessage = document.getElementById("shippingMessage");

      let progress = Math.min((total / freeShippingThreshold) * 100, 100);
      progressFill.style.width = `${progress}%`;
      progressIcon.style.left = `${progress}%`;

      shippingMessage.innerHTML = total >= freeShippingThreshold
          ? `<p class="fs-14 cl-green">Congratulations! You've got free shipping!</p>`
          : `Spend $${(freeShippingThreshold - total).toFixed(2)} more and get <span class="fs-14 fw-600 cl-orange-red">FREE SHIPPING!</span>`;
  }

  // ==== THÊM SẢN PHẨM VÀO GIỎ ====
  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Lấy phần tử chứa thông tin sản phẩm đang click
        const productBlock = button.closest(".wrapper");
        if (!productBlock) return;

        // Lấy thông tin hình ảnh, tên và giá từ các phần tử con
        const imageEl = productBlock.querySelector(".img");
        const nameEl = productBlock.querySelector(".item-name");
        const priceEl = productBlock.querySelector(".item-price");
        if (!imageEl || !nameEl || !priceEl) return;

        // Dữ liệu cụ thể
        const name = nameEl.textContent.trim(); // Tên sản phẩm
        const price = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')); // Giá số
        const image = imageEl.src; // Link ảnh
        const ImagePart = image.split('/').slice(-2).join('-'); // Chỉ lấy tên file chứa ảnh, tên ảnh và thay / thành -
        const id = button.dataset.id || `${name.replace(/\s+/g, "-").toLowerCase()}-${price}-${ImagePart}`; // Tạo id duy nhất

        // Thêm sản phẩm vào giỏ
        addToCart(id, name, price, image);
    });
  });

  // ==== HÀM THÊM VÀO GIỎ HÀNG ====
  function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1; // Nếu đã có sản phẩm thì tăng số lượng
    } else {
        cart.push({ id, name, price, image, quantity: 1 }); // Thêm mới sản phẩm
    }

    saveCart();     // Lưu vào localStorage
    renderCart();   // Cập nhật giao diện giỏ
    toggleCart(true); // Mở giỏ hàng
  }

  // ==== HIỂN THỊ GIỎ HÀNG ====
  function renderCart() {
    // Xóa các sản phẩm cũ khỏi DOM (giữ lại template)
    Array.from(cartItemsContainer.children).forEach(child => {
        if (child.tagName !== "TEMPLATE") {
            cartItemsContainer.removeChild(child);
        }
    });

    let total = 0;

    // Lặp qua từng sản phẩm trong giỏ và hiển thị chúng
    cart.forEach((item) => {
        total += item.price * item.quantity;

        const cartItem = cartItemTemplate.content.cloneNode(true); // Nhân bản template

        // Gán thông tin vào các phần tử trong item
        cartItem.querySelector(".cart-item-img").src = item.image;
        cartItem.querySelector(".cart-item-name").textContent = item.name;
        cartItem.querySelector(".cart-item-price").textContent = `$${(item.price * item.quantity).toFixed(2)}`;
        cartItem.querySelector(".cart-item-qty").textContent = item.quantity;

        // Các sự kiện tăng/giảm/xoá sản phẩm
        cartItem.querySelector(".cart-item-increase").addEventListener("click", () => updateQuantity(item.id, 1));
        cartItem.querySelector(".cart-item-decrease").addEventListener("click", () => updateQuantity(item.id, -1));
        cartItem.querySelector(".btn-cart-item-remove").addEventListener("click", () => removeFromCart(item.id));

        // Thêm sản phẩm này vào danh sách hiển thị
        cartItemsContainer.appendChild(cartItem);
    });

    // Cập nhật tổng tiền
    if (cartTotal) {
      cartTotal.textContent = "$" + total.toFixed(2);
    }

    updateCartCount(); // Cập nhật số lượng sản phẩm ở icon
    updateShippingProgress(total);
  }

  // ==== CẬP NHẬT SỐ LƯỢNG SP TRONG GIỎ ====
  function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(id); // Nếu số lượng <= 0 thì xoá
    } else {
        saveCart();
        renderCart(); // Cập nhật lại
    }
  }

  // ==== XOÁ SP KHỎI GIỎ ====
  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
  }

  // Lưu giỏ hàng vào localStorage
  let saveCartTimeout;
  function saveCart() {
      clearTimeout(saveCartTimeout);
      saveCartTimeout = setTimeout(() => {
          localStorage.setItem("mini-cart", JSON.stringify(cart));
          updateCartCount();
      }, 300);
  }

  // Cập nhật số lượng hiển thị trên icon giỏ hàng
  function updateCartCount() {
    // Kiểm tra nếu cart là một mảng, nếu không thì gán giá trị mặc định là []
    let totalQuantity = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
  
    // Cập nhật số lượng 
    const cartCountElements = document.querySelectorAll(".cart-count");
    cartCountElements.forEach(el => {
        el.innerText = totalQuantity;
        el.style.visibility = "visible"; // Luôn hiển thị
    });
  }
  
  // Hiển thị lại giỏ hàng khi trang tải lại
  renderCart();
  updateCartCount();
});


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
document.querySelectorAll(".slide-trending").forEach(slideTrending => {
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
    });
  });

  // Gán giá trị mặc định bằng click vào nút đầu tiên
  if (buttons.length > 0) {
    buttons[0].click();
  }
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


// =+=+=+=+=+=+=+=+=+=+=  ARRIVALS  =+=+=+=+=+=+=+=+=+=+= //
// ========== Slider ==========
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".slider-arrivals");
  const btnArrival = document.querySelectorAll(".btn-arrivals-prev, .btn-arrivals-next");
  const slide = slider.querySelector(".slide-arrival");
  
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
  btnArrival.forEach(btn => {
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

// ========== Btn-Change-Color-Trending ==========
document.querySelectorAll(".slide-arrival").forEach(slideArrival => {
  const buttons = slideArrival.querySelectorAll(".btn-color");

  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const imageChange = this.dataset.imgChange;
      const imageHover = this.dataset.imgHover;
      const newPrice = this.dataset.price;

      // Đổi ảnh
      const imgChange = slideArrival.querySelector(".img-change");
      if (imgChange) {
        imgChange.src = imageChange;
      }

      // Đổi ảnh hover
      const imgHover = slideArrival.querySelector(".img-hover");
      if (imgHover) { // && imageHover
        imgHover.src = imageHover;
      }

      // Đổi giá
      const priceElement = slideArrival.querySelector(".item-price");
      if (priceElement) {
        priceElement.textContent = newPrice;
      }
    });
  });

  // Gán giá trị mặc định bằng click vào nút đầu tiên
  if (buttons.length > 0) {
    buttons[0].click();
  }
});


// =+=+=+=+=+=+=+=+=+=+=  TOOLTIPTEXT COLOR  =+=+=+=+=+=+=+=+=+=+= //
document.addEventListener("DOMContentLoaded", function () {
  // Lấy phần tử tooltip từ DOM
  const tooltip = document.getElementById("tooltiptext-color");

  // Chọn tất cả các nút màu có class .btn-color
  document.querySelectorAll(".btn-color").forEach((btn) => {
      
      // Sự kiện khi di chuột vào nút màu
      btn.addEventListener("mouseenter", function (event) {
          const rect = event.target.getBoundingClientRect(); // Lấy vị trí và kích thước của nút màu
          tooltip.textContent = event.target.innerText; // Cập nhật nội dung tooltiptext từ thuộc tính btn-color

          // Tạm thời hiển thị tooltip để đo kích thước chính xác
          tooltip.style.visibility = "hidden"; // Ẩn tooltip trong lúc đo kích thước
          tooltip.style.display = "block"; // Hiển thị để có thể đo kích thước

          requestAnimationFrame(() => {
            const tooltipRect = tooltip.getBoundingClientRect(); // Lấy kích thước thực tế của tooltip

            // Tính toán vị trí để căn giữa tooltip với nút màu
            const top = (rect.top - tooltipRect.height - 8) / 10; // Cách nút 8px (tương đương 0.8rem vì 1rem = 10px)
            const left = (rect.left + rect.width / 2 - tooltipRect.width / 2) / 10; // Căn giữa tooltip với nút màu
            
            // Tạm tắt transition
            tooltip.style.transition = "none"; 

            // Cập nhật vị trí tooltip
            tooltip.style.top = `${top}rem`;
            tooltip.style.left = `${left}rem`;

            // Hiển thị tooltip với hiệu ứng mượt mà
            tooltip.style.visibility = "visible";
            tooltip.style.opacity = "1";
          });
      });

      // Sự kiện khi rời chuột khỏi nút màu
      btn.addEventListener("mouseleave", function () {
          // Ẩn tooltip khi không cần thiết để tối ưu hiệu suất
          tooltip.style.visibility = "hidden";
          tooltip.style.opacity = "0";
          tooltip.style.display = "none"; // Đảm bảo tooltip không chiếm không gian khi ẩn
      });
  });
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
      const threshold = 40; // khoảng kéo tối thiểu để chuyển slide
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

// =+=+=+=+=+=+=+=+=+=+=  ANIMATION BLOCK  =+=+=+=+=+=+=+=+=+=+= //
document.addEventListener('DOMContentLoaded', () => {
    const blocks = document.querySelectorAll('.anim-block');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Delay dựa theo thứ tự xuất hiện
          setTimeout(() => {
            entry.target.classList.add('show');
          }, index * 150); // mỗi block cách nhau 150ms
        }
      });
    }, {
      threshold: 0.1
    });

    blocks.forEach((block) => {
      observer.observe(block);
    });
});