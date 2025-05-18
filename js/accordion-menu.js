// Gán sự kiện click cho .footer-title
document.querySelectorAll(".footer-title").forEach(title => {
  title.addEventListener("click", () => {
    // Lấy .footer-list liền sau .footer-title
    const menu = title.nextElementSibling;
    toggleMenu(menu, title);
  });
});

window.addEventListener('resize', () => {
  document.querySelectorAll(".footer-list").forEach(menu => {
    const icon = menu.previousElementSibling.querySelector(".footer-icon");
    const isOpen = icon.textContent.trim() === "−";
    if (window.innerWidth < 768) {
      if (isOpen) {
        requestAnimationFrame(() => {
          menu.style.maxHeight = menu.scrollHeight / 10 + "rem";
        });
      } else {
        menu.style.maxHeight = "0rem";
      }
    } else {
      menu.style.maxHeight = null;
    }
    menu.dataset.open = isOpen;
  });
});

// Hàm mở/đóng menu
function toggleMenu(menu, titleElement) {
  const icon = titleElement.querySelector(".footer-icon");
  const isOpen = menu.dataset.open === "true";

  menu.style.maxHeight = isOpen ? "0rem" : menu.scrollHeight / 10 + "rem";
  icon.textContent = isOpen ? "+" : "−";
  menu.dataset.open = !isOpen;
}