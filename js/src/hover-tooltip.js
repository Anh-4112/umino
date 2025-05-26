export function initHoverTooltip() {
    // Lấy phần tử tooltip từ DOM
    const tooltip = document.getElementById("tooltiptext-color");
    
    // Chọn tất cả các nút màu có class .btn-color
    document.querySelectorAll(".slide .tooltip-bot").forEach((btn) => {
        
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
              const top = (rect.bottom + 10) / 10; // Cách nút 8px (tương đương 0.8rem vì 1rem = 10px)
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
}