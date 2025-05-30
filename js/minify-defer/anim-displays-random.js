const txts = document.querySelectorAll('.anim-txt-sshow');
const directions = ['from-top', 'from-right', 'from-left'];
txts.forEach(txt => {
  // Chọn random 1 hiệu ứng trong 3 hướng
  const randomDirection = directions[Math.floor(Math.random() * directions.length)];
  txt.classList.add(randomDirection);
});
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('show');
      }, index * 200);
    } else {
      entry.target.classList.remove('show');
    }
  });
}, {
  threshold: 0.1
});
txts.forEach(txt => {
  observer.observe(txt);
});