// Lấy các phần tử DOM cần sử dụng
const cartIcon = document.querySelectorAll(".cart-icon");
const cartBlock = document.getElementById("cartBlock");
const closeCart = document.getElementById("closeCart");
const overlayCart = document.getElementById("overlayCart");
const listCartItem = document.getElementById("listCartItem");
const cartItemTemplate = document.getElementById("cartItem"); 
const addItem = document.querySelectorAll(".add-to-cart");
const cartTotal = document.getElementById("cartTotal");
const freeShip = 120; // Ngưỡng miễn phí vận chuyển

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

    let progress = Math.min((total / freeShip) * 100, 100);
    progressFill.style.width = `${progress}%`;
    progressIcon.style.left = `${progress}%`;

    shippingMessage.innerHTML = total >= freeShip
        ? `<p class="fs-14 cl-green">Congratulations! You've got free shipping!</p>`
        : `Spend $${(freeShip - total).toFixed(2)} more and get <span class="fs-14 fw-600 cl-orange-red">FREE SHIPPING!</span>`;
}

// ==== THÊM SẢN PHẨM VÀO GIỎ ====
addItem.forEach(button => {
  button.addEventListener("click", () => {
      // Lấy phần tử chứa thông tin sản phẩm đang click
      const productBlock = button.closest(".slide");
      if (!productBlock) return;

      // Lấy thông tin hình ảnh, tên và giá từ các phần tử con
      const imageEl = productBlock.querySelector(".img");
      const nameEl = productBlock.querySelector(".item-name");
      const colorEl = productBlock.querySelector(".btn-color.selected");
      const priceEl = productBlock.querySelector(".item-price");
      if (!imageEl || !nameEl || !colorEl || !priceEl) return;

      // Dữ liệu cụ thể
      const image = imageEl.src; // Link ảnh
      const imagePart = image.split('/').slice(-2).join('-'); // Chỉ lấy tên file chứa ảnh, tên ảnh và thay / thành -
      const name = nameEl.textContent.trim(); // Tên sản phẩm
      const color = colorEl?.textContent?.trim(); // Màu sắc
      const price = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')); // Giá số
      const id = button.dataset.id || `${name.replace(/\s+/g, "-").toLowerCase()}-${color}-${price}-${imagePart}`; // Tạo id duy nhất

      // Thêm sản phẩm vào giỏ
      addToCart(id, name, price, image, color);
  });
});

// ==== HÀM THÊM VÀO GIỎ HÀNG ====
function addToCart(id, name, price, image, color) {
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
      existingItem.quantity += 1; // Nếu đã có sản phẩm thì tăng số lượng
  } else {
      cart.push({ id, name, price, image, color, quantity: 1 }); // Thêm mới sản phẩm
  }

  saveCart();     // Lưu vào localStorage
  renderCart();   // Cập nhật giao diện giỏ
  toggleCart(true); // Mở giỏ hàng
}

// ==== HIỂN THỊ GIỎ HÀNG ====
function renderCart() {
  // Xóa các sản phẩm cũ khỏi DOM (giữ lại template)
  Array.from(listCartItem.children).forEach(child => {
      if (child.tagName !== "TEMPLATE") {
          listCartItem.removeChild(child);
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
      cartItem.querySelector(".cart-color").textContent = item.color;
      cartItem.querySelector(".cart-item-price").textContent = `$${(item.price * item.quantity).toFixed(2)}`;
      cartItem.querySelector(".cart-item-qty").textContent = item.quantity;
      // Các sự kiện tăng/giảm/xoá sản phẩm
      cartItem.querySelector(".cart-item-increase").addEventListener("click", () => updateQuantity(item.id, 1));
      cartItem.querySelector(".cart-item-decrease").addEventListener("click", () => updateQuantity(item.id, -1));
      cartItem.querySelector(".btn-cart-item-remove").addEventListener("click", () => removeFromCart(item.id));

      // Thêm sản phẩm này vào danh sách hiển thị
      listCartItem.appendChild(cartItem);
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
