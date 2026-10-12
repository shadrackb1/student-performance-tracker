document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('nav ul');
  if (menuBtn) menuBtn.addEventListener('click', () => nav.classList.toggle('hidden'));

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Counter animation on scroll
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      const counters = document.querySelectorAll('.stat .num');
      counters.forEach(c => {
        const target = parseInt(c.dataset.target);
        c.textContent = target;
      });
      observer.disconnect();
    }
  });
  if (counters.length > 0) observer.observe(counters[0]);
});
