// =============================================================================
// ==============================    SLIDESHOW    ==============================
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
    const slideShow = document.querySelector(".slideshow");
    let cards = Array.from(slideShow.querySelectorAll(".slide"));
    const btnPrev = document.querySelector(".btn-slideshow-prev");
    const btnNext = document.querySelector(".btn-slideshow-next");
    const dotsContainer = document.querySelector(".slideshow-dots");

    if (!slideShow || cards.length === 0) return;

    // === Clone để tạo hiệu ứng vô hạn ===
    const cloneHead = cards.slice(0, 2).map(card => card.cloneNode(true));
    const cloneTail = cards.slice(-2).map(card => card.cloneNode(true));
    cloneHead.forEach(clone => slideShow.appendChild(clone));
    cloneTail.reverse().forEach(clone => slideShow.insertBefore(clone, cards[0]));
    cards = Array.from(slideShow.querySelectorAll(".slide"));

    const realStartIndex = 2;
    let currentIndex = realStartIndex;

    // === Thiết lập style ===
    slideShow.style.overflowX = "hidden";
    slideShow.style.scrollBehavior = "auto";
    slideShow.style.scrollSnapType = "none";
    cards.forEach(card => card.style.flexShrink = "0");

    // === Scroll đến index cụ thể ===
    const getScrollPositionForIndex = (index) => {
        return cards[index].offsetLeft - slideShow.offsetLeft;
    };

    const scrollToIndex = (index, smooth = true) => {
        slideShow.scrollTo({
            left: getScrollPositionForIndex(index),
            behavior: smooth ? "smooth" : "auto"
        });
        updateDots();
    };

    // === Dots ===
    const createDots = () => {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = "";
        for (let i = realStartIndex; i < cards.length - 2; i++) {
            const dot = document.createElement("button");
            dot.classList.add("dot");
            if (i === currentIndex) dot.classList.add("active");
            dot.addEventListener("click", () => {
                currentIndex = i;
                scrollToIndex(currentIndex);
            });
            dotsContainer.appendChild(dot);
        }
    };

    const updateDots = () => {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll(".dot");
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex - realStartIndex);
        });
    };

    createDots();

    // === Auto slide ===
    let autoSlideInterval = null;

    const startAutoSlide = () => {
        if (autoSlideInterval) return;
        autoSlideInterval = setInterval(() => {
            currentIndex++;
            scrollToIndex(currentIndex);

            if (currentIndex >= cards.length - 2) {
                setTimeout(() => {
                    currentIndex = realStartIndex;
                    scrollToIndex(currentIndex, false);
                }, 400);
            }
        }, 3000);
    };

    const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    };

    const restartAutoSlide = () => {
        stopAutoSlide();
        startAutoSlide();
    };

    // === Kéo tay bằng chuột/cảm ứng ===
    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;
    let moved = false;

    const dragStart = (e) => {
        isDragging = true;
        moved = false;
        startX = e.pageX || e.touches[0].pageX;
        scrollStart = slideShow.scrollLeft;
        stopAutoSlide();
    };

    const dragMove = (e) => {
        if (!isDragging) return;
        moved = true;
        const x = e.pageX || e.touches[0].pageX;
        slideShow.scrollLeft = scrollStart - (x - startX);
    };

    const dragEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;

        const currentX = e.pageX || (e.changedTouches ? e.changedTouches[0].pageX : 0);
        const deltaX = currentX - startX;

        const card = cards[currentIndex];
        const style = window.getComputedStyle(card);
        const cardWidth = card.offsetWidth + (parseInt(style.marginRight) || 0);

        if (deltaX > cardWidth * 0.1) {
            currentIndex--;
        } else if (deltaX < -cardWidth * 0.1) {
            currentIndex++;
        }

        scrollToIndex(currentIndex);

        // Về đúng slide thật nếu đang ở clone
        setTimeout(() => {
            if (currentIndex <= 1) {
                currentIndex = cards.length - 4;
                scrollToIndex(currentIndex, false);
            } else if (currentIndex >= cards.length - 2) {
                currentIndex = realStartIndex;
                scrollToIndex(currentIndex, false);
            }
        }, 400);

        restartAutoSlide();
    };

    slideShow.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", (e) => { if (moved) e.preventDefault(); });
        a.addEventListener("dragstart", (e) => e.preventDefault());
    });

    slideShow.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragEnd);
    slideShow.addEventListener("touchstart", dragStart);
    slideShow.addEventListener("touchmove", dragMove);
    slideShow.addEventListener("touchend", dragEnd);

    // === Resize ===
    window.addEventListener("resize", () => {
        scrollToIndex(currentIndex, false);
    });

    // === Hover để tạm dừng auto slide ===
    slideShow.addEventListener("mouseenter", stopAutoSlide);
    slideShow.addEventListener("mouseleave", restartAutoSlide);

    // === Nút điều hướng ===
    const checkAndResetIfClone = () => {
        setTimeout(() => {
            if (currentIndex <= 1) {
                currentIndex = cards.length - 4;
                scrollToIndex(currentIndex, false);
            } else if (currentIndex >= cards.length - 2) {
                currentIndex = realStartIndex;
                scrollToIndex(currentIndex, false);
            }
        }, 400);
    };
    
    if (btnPrev) btnPrev.addEventListener("click", () => {
        currentIndex--;
        scrollToIndex(currentIndex);
        checkAndResetIfClone();
        restartAutoSlide();
    });   

    if (btnNext) btnNext.addEventListener("click", () => {
        currentIndex++;
        scrollToIndex(currentIndex);
        checkAndResetIfClone();
        restartAutoSlide();
    });
    

    // === Khởi tạo ban đầu ===
    requestAnimationFrame(() => {
        slideShow.scrollLeft = getScrollPositionForIndex(realStartIndex);
        currentIndex = realStartIndex;
        updateDots();
        startAutoSlide();
    });
});