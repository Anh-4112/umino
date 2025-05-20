const sliderScroll = document.querySelector(".slider-banner");

let isDraggingScroll = false, startScrollX = 0, startScrollLeft = 0;
let movedScroll = false; // Kiểm tra có di chuyển chuột hay không

// Ngăn kéo link
document.querySelectorAll(".slider-banner a").forEach(a => {
    a.addEventListener("click", (e) => {
        if (movedScroll) e.preventDefault(); // Nếu kéo thì chặn click
    });
    a.addEventListener("dragstart", (e) => e.preventDefault()); // Ngăn kéo link
});

const getPageX = (e) => {
  return e.type.includes("touch") ? e.touches[0].pageX : e.pageX;
};

// Khi bắt đầu kéo
const dragStart = (e) => {
    isDraggingScroll = true;
    movedScroll = false;
    startScrollX = getPageX(e);
    startScrollLeft = sliderScroll.scrollLeft;
    sliderScroll.classList.add("dragging");
};

// Khi kéo chuột
const dragging = (e) => {
    if (!isDraggingScroll) return;
    movedScroll = true;
    const currentX = getPageX(e);
    sliderScroll.scrollLeft = startScrollLeft - (currentX - startScrollX);
};

// Khi thả chuột
const dragStop = () => {
    isDraggingScroll = false;
    sliderScroll.classList.remove("dragging");
};

// Gán sự kiện cho slider scroll
sliderScroll.addEventListener("mousedown", dragStart);
sliderScroll.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
sliderScroll.addEventListener("mouseleave", dragStop);

// Gán sự kiện cảm ứng
sliderScroll.addEventListener("touchstart", dragStart);
sliderScroll.addEventListener("touchmove", dragging);
sliderScroll.addEventListener("touchend", dragStop);