// Filter projects by category
document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // Animated counters for metrics
  const metricNumbers = document.querySelectorAll('.metric-number');
  let metricsAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !metricsAnimated) {
        metricsAnimated = true;
        // Animation feedback trigger
        metricNumbers.forEach(num => {
          num.style.transform = 'scale(1.05)';
          setTimeout(() => {
            num.style.transform = 'scale(1)';
          }, 300);
        });
      }
    });
  }, { threshold: 0.5 });

  const metricsSection = document.querySelector('.metrics');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
});
