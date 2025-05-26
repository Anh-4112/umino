export function initTabToggle () {
    const btnTabToggle = document.querySelectorAll(".btn-txt-trending");
    if (btnTabToggle.length === 0) return;
    
    // Xử lý khi click vào nút
    btnTabToggle.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault(); // Ngăn chặn load lại trang nếu href=""
            btnTabToggle.forEach(btn => btn.classList.remove("active")); // Xóa class active khỏi tất cả các nút
            this.classList.add("active");// Thêm class active vào nút được nhấn
        });
    })
}