const buttons = document.querySelectorAll(".btn-txt-trending");

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