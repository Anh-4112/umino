document.querySelectorAll(".countdown").forEach((countdownEl) => {
  // Lấy ra các phần tử con hiển thị ngày, giờ, phút, giây
  const dayEl = countdownEl.querySelector(".countdown-day");
  const hourEl = countdownEl.querySelector(".countdown-hour");
  const minsEl = countdownEl.querySelector(".countdown-mins");
  const secsEl = countdownEl.querySelector(".countdown-secs");

  // Đọc giá trị khởi đầu từ nội dung của các phần tử
  const days = parseInt(dayEl.textContent, 10);
  const hours = parseInt(hourEl.textContent, 10);
  const mins = parseInt(minsEl.textContent, 10);
  const secs = parseInt(secsEl.textContent, 10);

  // Tính tổng thời gian còn lại (miligiây)
  const totalMilliseconds =
    days * 24 * 60 * 60 * 1000 +   // ngày → mili giây
    hours * 60 * 60 * 1000 +      // giờ → mili giây
    mins * 60 * 1000 +            // phút → mili giây
    secs * 1000;                  // giây → mili giây

  // Xác định thời điểm kết thúc countdown dựa trên thời điểm hiện tại + tổng thời gian
  const countdownDate = Date.now() + totalMilliseconds;

  // Hàm cập nhật countdown mỗi giây
  const updateCountdown = () => {
    const now = Date.now();                   // Lấy thời gian hiện tại
    const distance = countdownDate - now;     // Thời gian còn lại

    if (distance <= 0) {
      // Nếu hết giờ: dừng đếm và hiển thị toàn 0
      clearInterval(timer);
      dayEl.textContent = "0";
      hourEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      return;
    }

    // Tính toán lại số ngày, giờ, phút, giây từ khoảng cách thời gian còn lại
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    // Cập nhật nội dung vào các phần tử HTML
    dayEl.textContent = d;
    hourEl.textContent = String(h).padStart(2, "0");
    minsEl.textContent = String(m).padStart(2, "0");
    secsEl.textContent = String(s).padStart(2, "0");
  };

  updateCountdown(); // Gọi ngay lần đầu để không phải chờ 1 giây
  const timer = setInterval(updateCountdown, 1000); // Gọi lại mỗi giây
});