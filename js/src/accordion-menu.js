export function initAccordionMenu() {
  // Gán sự kiện click cho .footer-title
  document.querySelectorAll(".footer-title").forEach(title => {
    title.addEventListener("click", () => {
      // Lấy .footer-list liền sau .footer-title
      const menu = title.nextElementSibling;
      // Gọi hàm mở/đóng menu khi tiêu đề được click
      toggleMenu(menu, title);
    });
  });
  // Lắng nghe sự kiện thay đổi kích thước cửa sổ
  window.addEventListener('resize', () => {
    // Với mỗi phần tử .footer-list (danh sách menu trong footer)
    document.querySelectorAll(".footer-list").forEach(menu => {
      // Tìm biểu tượng (+ hoặc −) trong tiêu đề liền trước danh sách
      const icon = menu.previousElementSibling.querySelector(".footer-icon");
      // Kiểm tra trạng thái đang mở hay đóng dựa trên biểu tượng
      const isOpen = icon.textContent.trim() === "−";
      if (window.innerWidth < 768) { // Nếu ở chế độ mobile (< 768px)
        if (isOpen) { // Nếu đang mở, đặt chiều cao tối đa tương ứng với nội dung
          requestAnimationFrame(() => {
            menu.style.maxHeight = menu.scrollHeight / 10 + "rem";
          });
        } else { // Nếu đang đóng, đặt max-height là 0 để ẩn
          menu.style.maxHeight = "0rem";
        }
      } else {  // Ở chế độ desktop, không giới hạn chiều cao
        menu.style.maxHeight = null;
      }
      // Ghi lại trạng thái mở/đóng vào thuộc tính data
      menu.dataset.open = isOpen;
    });
  });
  // Hàm mở/đóng menu
  function toggleMenu(menu, titleElement) {
    const icon = titleElement.querySelector(".footer-icon"); // Tìm biểu tượng trong phần tiêu đề
    const isOpen = menu.dataset.open === "true"; // Kiểm tra xem menu hiện đang mở hay đóng
    menu.style.maxHeight = isOpen ? "0rem" : menu.scrollHeight / 10 + "rem"; // Cập nhật chiều cao: nếu đang mở thì thu gọn lại, nếu đang đóng thì mở ra
    icon.textContent = isOpen ? "+" : "−"; // Đổi biểu tượng tương ứng
    menu.dataset.open = !isOpen; // Lưu lại trạng thái mới vào thuộc tính data
  }
}