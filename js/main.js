// =============== TAB TOGGLE ===============
// Lấy tất cả phần tử trong DOM có class là "btn-txt-trending"
const tabToggle = document.querySelectorAll(".btn-txt-trending");

// Kiểm tra nếu có ít nhất 1 phần tử với class trên mới thực hiện phần code bên trong
if (tabToggle.length > 0) {
    // Định nghĩa hàm loadTabs là một hàm bất đồng bộ.
    const loadTabs = async () => {
        const module = await import('./tabs-toggle.js'); // Click hoặc hover lần đầu thì mới tải file tabs-toggle.js
        module.initTabToggle(); // Module tải xong, gọi initTabToggle() bên trong module đó
        // Gỡ click, mouseenter khỏi các trigger, tránh gọi lại loadTabs nhiều lần
        tabToggle.forEach(trigger => {
            trigger.removeEventListener("click", loadTabs);
            trigger.removeEventListener("mouseenter", loadTabs);
        });
    };

    // Gán click, mouseenter lần đầu cho các trigger
    tabToggle.forEach(trigger => {
        // Đảm bảo mỗi trigger chỉ gọi loadTabs 1 lần duy nhất
        trigger.addEventListener("click", loadTabs, { once: true });
        trigger.addEventListener("mouseenter", loadTabs, { once: true });
    });
}