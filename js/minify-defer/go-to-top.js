const goTo = document.querySelector(".go-top");
function toggleGoTop() {
    if (window.scrollY > 150) {
        goTo.classList.add("show");
    } else {
        goTo.classList.remove("show");
    }
}

toggleGoTop(); // Kiểm tra khi trang load
window.addEventListener("scroll", toggleGoTop); // Lắng nghe sự kiện cuộn
// Cuộn lên đầu khi click
goTo.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});