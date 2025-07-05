document.addEventListener("DOMContentLoaded", function () {
  // Slideshow functionality
  let slideIndex = 0;
  const slides = document.querySelectorAll(".hero-slide");

  // Update slideshow functionality for background
  function showSlides() {
    slides.forEach((slide) => {
      slide.classList.remove('active');
    });

    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add('active');

    setTimeout(showSlides, 4000); // Change slide every 4 seconds
  }

  showSlides(); // Start the slideshow
  
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
});