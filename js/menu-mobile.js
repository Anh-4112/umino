const iconMenuMobile = document.getElementById("iconMenuMobile");
const wrapperMenuMobile = document.getElementById("wrapperMenuMobile");
const closeMenuMobile = document.getElementById("closeMenuMobile");
const overlayMobile = document.getElementById("overlayMobile");
const btnLang = document.querySelectorAll('.btn-lang-mobile');
const btnCurr = document.querySelectorAll('.btn-curr-mobile');

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
// document.addEventListener("DOMContentLoaded", function () {
// });