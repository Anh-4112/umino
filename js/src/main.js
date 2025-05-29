// =============== SLIDER SCROLL ===============
// Lấy tất cả các phần tử trong DOM có .slider-banner
const sliderScroll = document.querySelectorAll(".slider-banner");
// Chỉ thực hiện code nếu có ít nhất một .slider-banner tồn tại
if (sliderScroll.length > 0) {
    // Định nghĩa hàm loadSliderScroll là một hàm bất đồng bộ
    const loadSliderScroll = async () => {
        sliderScroll.forEach(slideScroll => {
            slideScroll.removeEventListener("mouseenter", loadSliderScroll);
            slideScroll.removeEventListener("click", loadSliderScroll);
        });
        const module = await import('./src/slider-scroll.js'); // Tương tác lần đầu thì mới tải file slider-scroll.js
        module.initSliderScroll(); // Module tải xong, gọi initSliderScroll() bên trong module đó
        // Gỡ click, mouseenter khỏi các slider - tránh gọi lại loadSliderScroll nhiều lần
    };
    // Gán click, mouseenter lần đầu cho các slider
    sliderScroll.forEach(slideScroll => {
        // Đảm bảo mỗi slideSnap chỉ gọi loadSliderScroll 1 lần duy nhất
        slideScroll.addEventListener("mouseenter", loadSliderScroll, { once: true });
        slideScroll.addEventListener("click", loadSliderScroll, { once: true });
    });
}

// =============== SLIDER SNAP ===============
// Lấy tất cả các phần tử trong DOM có .slider.
const sliderSnap = document.querySelectorAll(".slider");
// Chỉ thực hiện code nếu có ít nhất một .slider tồn tại
if (sliderSnap.length > 0) {
    // Định nghĩa hàm loadSliderSnap là một hàm bất đồng bộ
    const loadSliderSnap = async () => {
        sliderSnap.forEach(slideSnap => {
            slideSnap.removeEventListener("mouseenter", loadSliderSnap);
            slideSnap.removeEventListener("click", loadSliderSnap);
        });
        const module = await import('./slider-snap.js'); // Tương tác lần đầu thì mới tải file slider-snap.js
        module.initSliderSnap(); // Module tải xong, gọi initSliderSnap() bên trong module đó
        // Gỡ click, mouseenter khỏi các slider - tránh gọi lại loadSliderSnap nhiều lần
    };
    // Gán click, mouseenter lần đầu cho các slider
    sliderSnap.forEach(slideSnap => {
        // Đảm bảo mỗi slideSnap chỉ gọi loadSliderSnap 1 lần duy nhất
        slideSnap.addEventListener("mouseenter", loadSliderSnap, { once: true });
        slideSnap.addEventListener("click", loadSliderSnap, { once: true });
    });
}

// =============== TAB TOGGLE ===============
// Lấy tất cả phần tử .btn-txt-trending có trong DOM
const tabToggle = document.querySelectorAll(".btn-txt-trending");
// Kiểm tra nếu có ít nhất 1 phần tử với class trên mới thực hiện phần code bên trong
if (tabToggle.length > 0) {
    // Định nghĩa hàm loadTabs là một hàm bất đồng bộ
    const loadTabs = async () => {
        tabToggle.forEach(trigger => {
            trigger.removeEventListener("click", loadTabs);
            trigger.removeEventListener("mouseenter", loadTabs);
        });
        const module = await import('./tabs-toggle.js'); // Click hoặc hover lần đầu thì mới tải file tabs-toggle.js
        module.initTabToggle(); // Module tải xong, gọi initTabToggle() bên trong module đó
        // Gỡ click, mouseenter khỏi các trigger, tránh gọi lại loadTabs nhiều lần
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

// =============== ACCORDION MENU ===============
// Lấy tất cả các phần tử trong DOM có .footer-title
const accordionMenu = document.querySelectorAll(".footer-title");
// Chỉ thực hiện code nếu có ít nhất một .footer-title tồn tại
if (accordionMenu.length > 0) {
    // Định nghĩa hàm loadAccordionMenu là một hàm bất đồng bộ
    const loadAccordionMenu = async () => {
        accordionMenu.forEach(footerList => {
            footerList.removeEventListener("mouseenter", loadAccordionMenu);
            footerList.removeEventListener("click", loadAccordionMenu);
        });
        const module = await import('./accordion-menu.js'); // Tương tác lần đầu thì mới tải file accordion-menu.js
        module.initAccordionMenu(); // Module tải xong, gọi initAccordionMenu() bên trong module đó
        // Gỡ click, mouseenter khỏi các footerList - tránh gọi lại loadAccordionMenu nhiều lần
    };
    // Gán click, mouseenter lần đầu cho các footerList
    accordionMenu.forEach(footerList => {
        // Đảm bảo mỗi footerList chỉ gọi loadAccordionMenu 1 lần duy nhất
        footerList.addEventListener("mouseenter", loadAccordionMenu, { once: true });
        footerList.addEventListener("click", loadAccordionMenu, { once: true });
    });
}