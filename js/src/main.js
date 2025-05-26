// =============== TAB TOGGLE ===============
// Lấy tất cả phần tử .btn-txt-trending có trong DOM
const tabToggle = document.querySelectorAll(".btn-txt-trending");

// Kiểm tra nếu có ít nhất 1 phần tử với class trên mới thực hiện phần code bên trong
if (tabToggle.length > 0) {
    // Định nghĩa hàm loadTabs là một hàm bất đồng bộ
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

// =============== HOVER TOOLTIP ===============
// Lấy tất cả phần tử .tooltip-bot thuộc .slide có trong DOM
const hoverTooltip = document.querySelectorAll(".slide .tooltip-bot");
// Kiểm tra nếu có ít nhất 1 phần tử với class trên mới thực hiện phần code bên trong
if (hoverTooltip.length > 0) {
    // Định nghĩa hàm loadTooltip là một hàm bất đồng bộ
    const loadTooltip = async (e) => {
        const module = await import("./hover-tooltip.js"); // Click hoặc hover lần đầu thì mới tải file hover-tooltip.js
        module.initHoverTooltip(); // Module tải xong, gọi initHoverTooltip() bên trong module đó

        // Gỡ sự kiện tránh lặp lại tải
        hoverTooltip.forEach(t => {
        t.removeEventListener("mouseenter", loadTooltip);
        });

        // Giả lập lại sự kiện hover cho phần tử vừa hover
        if (e && e.target) {
        const evt = new Event("mouseenter");
        e.target.dispatchEvent(evt);
        }
    };

    // Gán lazy-load khi hover lần đầu
    hoverTooltip.forEach(t => {
        t.addEventListener("mouseenter", loadTooltip, { once: true });
    });
}
