// Khi JavaScript hoạt động, thay .no-js thành .have-js trên <body>
document.body.classList.replace('no-js', 'have-js');
// Lấy tất cả phần tử cần áp dụng hiệu ứng khi xuất hiện
const animObserver = document.querySelectorAll('.anim-observer');
// Khởi tạo IntersectionObserver để theo dõi các phần tử khi chúng vào viewport của trang 
const animObserverShow = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    // Nếu phần tử đã đi vào màn hình
    if (entry.isIntersecting) {
      // Áp dụng hiệu ứng với độ trễ tùy theo vị trí trong trang
      setTimeout(() => {
        // Thêm class .show để kích hoạt hiệu ứng CSS
        entry.target.classList.add('show');
      }, index * 150); // Mỗi phần tử cách nhau 150ms
    }
  });
}, {
  threshold: 0.1 // Phần tử chỉ cần 10% hiển thị trong viewport kích hoạt hiệu ứng
});
// Đăng ký tất cả các phần tử với IntersectionObserver để theo dõi
animObserver.forEach((animation) => {
  animObserverShow.observe(animation);
});
