const blocks = document.querySelectorAll('.anim-reveal');

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Delay dựa theo thứ tự xuất hiện
      setTimeout(() => {
        entry.target.classList.add('show');
      }, index * 150); // mỗi block cách nhau 150ms
    }
  });
}, {
  threshold: 0.1
});

blocks.forEach((block) => {
  animObserver.observe(block);
});