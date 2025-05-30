// =============== MENU MOBILE ===============
// Lấy #iconMenuMobile trong DOM
const menuMobile = document.getElementById("iconMenuMobile");
// Kiểm tra phần tử này có tồn tại không
if (menuMobile) {
    // Định nghĩa hàm loadMenuMobile là một hàm bất đồng bộ
    const loadMenuMobile = async () => {
        // Gỡ bỏ sự kiện để tránh gọi lại loadMenuMobile nhiều lần
        menuMobile.removeEventListener("mouseenter", loadMenuMobile);
        menuMobile.removeEventListener("click", loadMenuMobile);
        // Tương tác lần đầu thì mới tải file menu-mobile.js
        const module = await import('./menu-mobile.js'); 
        // Gọi hàm khởi tạo menu từ module đã import
        module.initMenuMobile(); 
    };
    // Gán "mouseenter" và "click" vào biểu tượng menu và đảm bảo mỗi sự kiện chỉ xử lý một lần
    menuMobile.addEventListener("mouseenter", loadMenuMobile, { once: true });
    menuMobile.addEventListener("click", loadMenuMobile, { once: true });
}

// =============== MINI CART ===============
// Lấy tất cả .cart-icon trong DOM 
const miniCart = document.querySelectorAll(".cart-icon");
// Chỉ thực hiện code nếu có ít nhất một .cart-icon tồn tại
if (miniCart.length > 0) {
    // Định nghĩa hàm loadMiniCart là một hàm bất đồng bộ
    const loadMiniCart = async () => {
        miniCart.forEach(cart => {
            cart.removeEventListener("mouseenter", loadMiniCart);
            cart.removeEventListener("click", loadMiniCart);
        });
        const module = await import('./src/mini-cart.js'); // Tương tác lần đầu thì mới tải file mini-cart.js
        module.initMiniCart(); // Module tải xong, gọi initMiniCart() bên trong module đó
        // Gỡ click, mouseenter khỏi các cart-icon - tránh gọi lại loadMiniCart nhiều lần
    };
    // Gán click, mouseenter lần đầu cho các cart-icon
    miniCart.forEach(cart => {
        // Đảm bảo mỗi cart-icon chỉ gọi loadMiniCart 1 lần duy nhất
        cart.addEventListener("mouseenter", loadMiniCart, { once: true });
        cart.addEventListener("click", loadMiniCart, { once: true });
    });
}

// =============== SLIDER SCROLL ===============
// Lấy tất cả .slider-banner trong DOM 
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
// Lấy tất cả .slider trong DOM
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
// Lấy tất cả .btn-txt-trending trong DOM
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
// Lấy tất cả .tooltip-bot thuộc .slide trong DOM
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
// Lấy tất cả .footer-title trong DOM
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