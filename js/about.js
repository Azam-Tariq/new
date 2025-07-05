document.addEventListener("DOMContentLoaded", function () {
  // Animation on scroll
  const animatedElements = document.querySelectorAll('.animate-fade-in');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || '0s';
        entry.target.style.setProperty('--delay', delay);
        entry.target.classList.add('animate');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, {
    threshold: 0.1
  });
  
  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  // Counter animation for stats
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const countUp = (element, target) => {
    const increment = target / 100;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      if (target >= 1000) {
        element.textContent = Math.floor(current / 1000) + 'K+';
      } else {
        element.textContent = Math.floor(current) + '%';
      }
    }, 20);
  };
  
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const text = element.textContent;
        
        if (text.includes('95%')) {
          countUp(element, 95);
        } else if (text.includes('1000+')) {
          countUp(element, 1000);
        } else if (text.includes('50K+')) {
          countUp(element, 50000);
        } else if (text.includes('98%')) {
          countUp(element, 98);
        }
        
        statsObserver.unobserve(element);
      }
    });
  }, { threshold: 0.5 });
  
  statNumbers.forEach((stat) => {
    statsObserver.observe(stat);
  });
});